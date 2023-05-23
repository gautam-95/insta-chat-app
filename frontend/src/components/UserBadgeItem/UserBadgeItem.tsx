import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";
import { User } from "../../utils/types";

const UserBadgeItem: React.FC<{user: User, handleDelete: () =>  void, admin: User}> = ({user, handleDelete, admin}) => {
    return (
        <Badge
          px={2}
          py={1}
          borderRadius="lg"
          m={1}
          mb={2}
          variant="solid"
          fontSize={12}
          colorScheme="purple"
          cursor="pointer"
          onClick={handleDelete}
        >
          {user.name}
          {admin?._id === user._id && <span> (Admin)</span>}
          <CloseIcon pl={1} />
        </Badge>
      );
};

export default UserBadgeItem;