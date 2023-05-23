import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { getSenderFull } from "../../utils/chat.utils";
import { ChatState } from "../../context/ChatProvider";
import { useHeaders } from "../../hooks/useHeaders.hook";
import { useSearch } from "../../hooks/useSearch.hook";
import { Chat, ChatMessage } from "../../utils/types";
import { useMyToast } from "../../hooks/useMyToast.hook";
import ChatLoading from "../ChatLoading/ChatLoading";
import ProfileModal from "../ProfileModal/ProfileModal";
import UserListItem from "../UserListItem/UserListItem";
import "./SideDrawer.css";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const myToast = useMyToast();
  const { fetchSearchResults, loading, searchResults } = useSearch();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const headers = useHeaders();

  const logoutHanlder = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const accessChat = async (userId: string) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post("/api/chat", { userId }, headers);

      if (!chats.find((c: Chat) => c._id === data.id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      myToast("Error fetching the chat", null, "error", "bottom-left");
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}
            backgroundColor="#38b2ac"
            color="#ffffff"
            _hover={{ background: "#38B2AC", color: "#ffffff" }}
          >
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          InstaChat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="3xl" m={1} />
              {notifications?.length > 0 && (
                <span className="notifBadge">{notifications.length}</span>
              )}
            </MenuButton>
            <MenuList pl={2}>
              {!notifications.length && "No new messages"}
              {notifications.map((notif: ChatMessage) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotifications(notifications.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${
                        getSenderFull(notif.chat.users, user)?.name
                      }`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              backgroundColor="#38b2ac"
              color="#ffffff"
              _hover={{ background: "#38B2AC", color: "#ffffff" }}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem _hover={{ background: "#38B2AC", color: "#ffffff" }}>
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                _hover={{ background: "#38B2AC", color: "#ffffff" }}
                onClick={logoutHanlder}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={() => fetchSearchResults(search)}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((user) => (
                <UserListItem
                  key={user?._id}
                  user={user}
                  handleFunction={() => accessChat(user?._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
