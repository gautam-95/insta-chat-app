import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../SideDrawer/SideDrawer";
import { UserContext } from "../../utils/types";
import MyChats from "../MyChats/MyChats";
import ChatBox from "../ChatBox/ChatBox";
import "./Chat.css";

const Chat = () => {
  const { user } = ChatState() as UserContext;
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div className="chat">
      {user && <SideDrawer />}
      <Box className="chatBox">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;
