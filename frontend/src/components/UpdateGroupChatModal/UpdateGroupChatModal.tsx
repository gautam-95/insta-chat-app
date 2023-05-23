import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useHeaders } from "../../hooks/useHeaders.hook";
import { useSearch } from "../../hooks/useSearch.hook";
import { User } from "../../utils/types";
import { useMyToast } from "../../hooks/useMyToast.hook";
import UserBadgeItem from "../UserBadgeItem/UserBadgeItem";
import UserListItem from "../UserListItem/UserListItem";

const UpdateGroupChatModal: React.FC<{
  fetchAgain: boolean;
  setFetchAgain: (flag: boolean) => void;
  fetchMessages: Function;
}> = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);

  const myToast = useMyToast();
  const {
    fetchSearchResults,
    loading: searchResultLoading,
    searchResults,
  } = useSearch();
  const { selectedChat, setSelectedChat, user } = ChatState();
  const headers = useHeaders();

  const handleRename = async (user: User) => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameloading(true);
      const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        headers
      );
      setFetchAgain(!fetchAgain);
      setSelectedChat(data);
      setRenameloading(false);
    } catch (err) {
      myToast("Error Occured!", "Failed to rename chat", "error", "bottom");
      setRenameloading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1: User) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      myToast("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      myToast("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        headers
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      myToast("Error Occured!", "Error while adding user");
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleDelete = async (user1: User) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      myToast("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        headers
      );

      user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      myToast("Error Occured!", "Error while removing user");
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton
        aria-label="ViewIcon"
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleDelete={() => handleDelete(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={() => handleRename(user)}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => fetchSearchResults(e.target.value)}
              />
            </FormControl>
            {loading || searchResultLoading ? (
              <Spinner size="lg" />
            ) : (
              searchResults?.map((user) => (
                <UserListItem
                  key={user?._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleDelete(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
