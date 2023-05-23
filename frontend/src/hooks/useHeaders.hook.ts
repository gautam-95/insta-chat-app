import { ChatState } from "../context/ChatProvider";

export const useHeaders = () => {
  const { user } = ChatState();
  return {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };
};
