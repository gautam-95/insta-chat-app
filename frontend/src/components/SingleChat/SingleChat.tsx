import io from "socket.io-client";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState, KeyboardEvent, ChangeEvent } from "react";
import { getSenderFull } from "../../utils/chat.utils";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "../ProfileModal/ProfileModal";
import ScrollableChat from "../ScollableChat/ScrollableChat";
import UpdateGroupChatModal from "../UpdateGroupChatModal/UpdateGroupChatModal";
import "./SingleChat.css";
import { Socket } from "socket.io-client";
import { Chat, ChatMessage } from "../../utils/types";
import "./SingleChat.css";
import { useMyToast } from "../../hooks/useMyToast.hook";
import { useHeaders } from "../../hooks/useHeaders.hook";

const ENDPOINT = "https://insta-chat-app.onrender.com";
let socket: Socket;
let selectedChatCompare: Chat;

const SingleChat: React.FC<{
  fetchAgain: boolean;
  setFetchAgain: (flag: boolean) => void;
}> = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  const myToast = useMyToast();
  const headers = useHeaders();

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        headers
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      myToast("Error Occured!", "Failed to load messages");
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived: ChatMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setNewMessage("");
        const { data } = await axios.post(
          `/api/message`,
          { content: newMessage, chatId: selectedChat._id },
          headers
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        myToast("Error Occured!", "Failed send message");
        setLoading(false);
      }
    }
  };

  const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text className="chatHeader">
            <IconButton
              aria-label="BackIcon"
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSenderFull(selectedChat.users, user)?.name}
                <ProfileModal user={getSenderFull(selectedChat.users, user)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}{" "}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                ></UpdateGroupChatModal>
              </>
            )}
          </Text>
          <Box className="chatContent">
            {loading ? (
              <Spinner size="xl" className="spinner" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <div>Typing...</div> : null}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box className="placeHolderText">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
