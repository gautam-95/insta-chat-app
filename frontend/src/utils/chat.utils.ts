import { ChatMessage, User } from "./types";

const currentDate = new Date();
const shortTime = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
});
const longTime = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "2-digit",
});

export const getSenderFull = (users: User[], loggedUser?: User) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

export const isSameSenderMargin = (
  messages: ChatMessage[],
  m: ChatMessage,
  i: number,
  userId: string
) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (
  messages: ChatMessage[],
  m: ChatMessage,
  i: number,
  userId: string
) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (
  messages: ChatMessage[],
  i: number,
  userId: string
) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (
  messages: ChatMessage[],
  m: ChatMessage,
  i: number
) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getFormattedTimeStamp = (timestamp?: string) => {
  if(!timestamp) {
    return;
  }
  const inputDate = new Date(timestamp);
  if (currentDate.getDate() === inputDate.getDate()) {
    return shortTime.format(inputDate);
  } else {
    return longTime.format(inputDate);
  }
};
