import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import { FiEdit2, FiStar } from "react-icons/fi";

interface Props {
  address: string;
}

export default function ContractView(props: Props) {
  const { address } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const [rating, setRating] = React.useState<number | null>(Math.floor(null)); // Add state to store the user's rating
  const [reviews, setReviews] = React.useState<number>(null);

  useEffect(() => {
    const randomRating = Math.floor(Math.random() * 10);
    setRating(randomRating);
  }, []);

  useEffect(() => {
    const randomReview = Math.floor(Math.random() * 1000);
    setReviews(randomReview);
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    // Increment the number of reviews and update the average rating
    setReviews((prevReviews) => prevReviews + 1);
  };

  // Function to handle user rating
  const handleRating = (value: number) => {
    setRating(value);
  };

  const messageData = {
    nullRating: {
      message: "No Rating",
      messageColor: "gray.400",
    },
    scamRating: {
      message: "Looks Scam",
      messageColor: "red.500",
    },
    likeRating: {
      message: "It's fine",
      messageColor: "yellow.500",
    },
    goodRating: {
      message: "Looks Good!",
      messageColor: "blue.500",
    },
  };

  let { message, messageColor } =
    rating === null
      ? messageData.nullRating
      : rating <= 5
      ? messageData.scamRating
      : rating <= 7
      ? messageData.likeRating
      : messageData.goodRating;

  return (
    <Box overflow="hidden">
      {/* <Header /> // Assuming this is a custom header */}
      <Container
        maxW={"6xl"}
        centerContent
        marginTop={32}
        bg="brand.900"
        borderRadius={"2xl"}
        py={8}
      >
        <Heading
          padding="4"
          maxW="5xl"
          size={"lg"}
          color={"white"}
          textAlign={"center"}
        >
          Your viewing contract {address}
        </Heading>
        <Flex direction="column" alignItems="center" mt={8}>
          <Text color="white" fontSize="xl" fontWeight="bold">
            {reviews} Reviews
          </Text>

          {/* Star Rating */}
          <Stack direction="row" spacing={2} align="center">
            <Text color="white" fontSize="xl" fontWeight="semibold">
              {rating === null ? "No Rating" : `${rating}/10`}
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
          </Stack>

          {rating !== null && (
            <Text
              mt={2}
              color={messageColor}
              fontWeight="bold"
              fontSize={"2xl"}
            >
              {message}
            </Text>
          )}

          <Button
            leftIcon={<FiEdit2 />}
            isLoading={isLoading}
            loadingText="Submitting review"
            onClick={handleClick}
            color="white"
            bg="brand.700"
            mt={4}
          >
            Review
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
