import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import { Chat, ChatMessage, User, UserContext } from "../utils/types";

export const ChatContext = createContext<{}>({});

const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [notifications, setNotifications] = useState<ChatMessage[]>([]);

  const history = useHistory();

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    const userInfo = user && JSON.parse(user);
    setUser(userInfo);

    if (!userInfo) {
      history?.push("/");
    }
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext) as UserContext;
};

export default ChatProvider;
