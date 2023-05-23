import { Avatar, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  getFormattedTimeStamp,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../utils/chat.utils";
import { ChatState } from "../../context/ChatProvider";
import { ChatMessage } from "../../utils/types";

const ScrollableChat: React.FC<{ messages: ChatMessage[] }> = ({
  messages,
}) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((msg: ChatMessage, index: number) => {
          const isLastMessageFromSameSender =
            isSameSender(messages, msg, index, user._id) ||
            isLastMessage(messages, index, user._id);

          return (
            <div
              key={msg._id}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex" }}>
                {isLastMessageFromSameSender && (
                  <Tooltip
                    label={msg.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={msg.sender.name}
                      src={msg.sender.pic}
                    />
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    marginLeft: isSameSenderMargin(
                      messages,
                      msg,
                      index,
                      user._id
                    ),
                    marginTop: isSameUser(messages, msg, index) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                  }}
                >
                  {msg.content}
                </span>
              </div>
              <div style={{display: "flex", alignItems: "center"}}>
                {isLastMessageFromSameSender ? (
                  <span
                    style={{
                      fontSize: "10px",
                      color: " #201b1b",
                      fontStyle: "italic",
                      marginLeft: "45px",
                    }}
                  >
                    {getFormattedTimeStamp(msg?.updatedAt)}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
