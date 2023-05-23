import { Box } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import SingleChat from "../SingleChat/SingleChat";
import './ChatBox.css';

const ChatBox: React.FC<{
  fetchAgain: boolean;
  setFetchAgain: (flag: boolean) => void;
}> = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      w={{ base: "100%", md: "68%" }}
      className="chatSection"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
