import { Skeleton, Stack } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack>
      {Array(15)
        .fill(0)
        .map(() => (
          <Skeleton height="45px" />
        ))}
    </Stack>
  );
};

export default ChatLoading;
