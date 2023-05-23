import {
  ToastPosition,
  useToast,
} from "@chakra-ui/react";

export const useMyToast = () => {
  const toast = useToast();
  const myToast = (
    title: string,
    description?: string | null,
    status: "error" | "info" | "warning" | "success" | "loading" | undefined = "error",
    position: ToastPosition = "bottom"
  ) =>
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position,
    });

  return myToast;
};
