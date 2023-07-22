import {
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiEdit2, FiStar } from "react-icons/fi";

export const SubmitReview = () => {
  const router = useRouter();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [rating, setRating] = useState<number | null>(null);

  const handleRating = (rating: number) => {
    setRating(rating);
  };
  return (
    <Popover isLazy onClose={onClose} returnFocusOnClose={false}>
      <PopoverTrigger>
        <Button>
          Review <Icon marginLeft={2} as={FiEdit2} />
        </Button>
      </PopoverTrigger>
      <PopoverContent width={500}>
        <PopoverHeader fontWeight="semibold">Vote the contract</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Stack direction="row" spacing={2} align="center">
            <Text
              color="white"
              fontSize="xl"
              fontWeight="semibold"
              minWidth={50}
            >
              {rating === null ? "0/10" : `${rating}/10`}
            </Text>
            {Array.from({ length: 10 }, (_, index) => (
              <Icon
                key={index}
                as={FiStar}
                color={index < (rating ?? 0) ? "blue.200" : "gray.300"}
                fill={index < (rating ?? 0) ? "blue.200" : "transparent"}
                boxSize={6}
                cursor="pointer"
                onClick={() => handleRating(index + 1)}
              />
            ))}
            <Button
              marginLeft={2}
              onClick={() => {
                router.reload();
              }}
            >
              Submit
            </Button>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
