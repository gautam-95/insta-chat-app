import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getFormattedTimeStamp, getSenderFull } from "../../utils/chat.utils";
import { ChatState } from "../../context/ChatProvider";
import { useHeaders } from "../../hooks/useHeaders.hook";
import { Chat, User } from "../../utils/types";
import { useMyToast } from "../../hooks/useMyToast.hook";
import ChatLoading from "../ChatLoading/ChatLoading";
import GroupChatModal from "../GroupChatModal/GroupChatModal";
import "./MyChats.css";

const MyChats: React.FC<{ fetchAgain: boolean }> = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState<User>();
  const myToast = useMyToast();
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const headers = useHeaders();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat", headers);
      setChats(data);
      console.log(data);
      setSelectedChat(data[0]);
    } catch (err) {
      myToast("Error occurred", "Failed to load chats", "error", "bottom-left");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo") as string));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      w={{ base: "100%", md: "31%" }}
      className="sideBar"
    >
      <Box className="sideBarHeader">
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box className="userChats">
        {chats ? (
          <Stack overflowY="scroll">
            {chats?.map((chat: Chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                className="chatTile"
                key={chat?._id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text>
                    {!chat.isGroupChat
                      ? getSenderFull(chat.users, loggedUser)?.name
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </div>
                <div style={{fontSize:"12px"}}>
                  {getFormattedTimeStamp(chat.latestMessage?.updatedAt)}
                </div>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
