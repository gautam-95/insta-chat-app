import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  ModalOverlay,
  useDisclosure,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { ReactNode, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useHeaders } from "../../hooks/useHeaders.hook";
import { useSearch } from "../../hooks/useSearch.hook";
import { User } from "../../utils/types";
import { useMyToast } from "../../hooks/useMyToast.hook";
import UserBadgeItem from "../UserBadgeItem/UserBadgeItem";
import UserListItem from "../UserListItem/UserListItem";
import "./GroupChatModal.css";

const GroupChatModal: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { chats, setChats, selectedChat } = ChatState();
  console.log("selecte",selectedChat);

  const myToast = useMyToast();
  const {fetchSearchResults, searchResults, loading} = useSearch();
  const headers = useHeaders();

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      myToast("Please fill all the fields", null, "warning", "top");
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user?._id)),
        },
        headers
      );
      setChats([data, ...chats]);
      onClose();
      myToast("New Group Chat Created!", null, "success");
    } catch (error) {
      myToast("Failed to Create the Chat!", null, "error");
    }
  };
  const handleGroup = (userToAdd: User) => {
    if (selectedUsers.includes(userToAdd)) {
      myToast("User already added", null, "warning", "top");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelete: User) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user?._id !== userToDelete?._id)
    );
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="modalHeader">Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="modalBody">
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Jane"
                mb={1}
                onChange={(e) => fetchSearchResults(e.target.value)}
              />
            </FormControl>
            <Box className="userBadges">
              {selectedUsers?.map((user) => (
                <UserBadgeItem
                  key={user?._id}
                  user={user}
                  handleDelete={() => handleDelete(user)}
                  admin={selectedChat.groupAdmin}
                />
              ))}
            </Box>

            {loading ? (
              <div>Loading</div>
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((user: User) => (
                  <UserListItem
                    key={user?._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
