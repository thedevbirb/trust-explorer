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
  useColorMode,
} from "@chakra-ui/react";
import { FiEdit2, FiStar } from "react-icons/fi";

import Header from "../Header";

import { useAsyncMemo } from "use-async-memo";
import { useGraph } from "../../hooks/useGraph";
import { useMetaMask } from "../../hooks/useMetamask";
interface Props {
  contractAddress: string;
}
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { generateAttestation, generateSignal } from "../../utils/helpers";
import { useRouter } from "next/router";

export default function ContractView(props: Props) {
  const { contractAddress } = props;
  const {
    state: { wallet },
  } = useMetaMask();

  const { queryAttestation } = useGraph();
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
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { state } = useMetaMask();

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
          Your viewing contract {contractAddress}
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

        <Box w="300px" h="50px" bgColor="blue.500" color="white" rounded={"md"}>
          <IDKitWidget
            app_id="app_eb57bcd2529a2b84af1704d76ab9210c"
            action="attest"
            signal={generateSignal(
              state.wallet || "0xc2e9A90a9B957c4687c5944491f86E29C10Cb439",
              contractAddress,
              7
            )}
            theme={colorMode}
            onSuccess={async (proof: ISuccessResult) => {
              console.log("hello!");
              await generateAttestation(
                proof.merkle_root,
                proof.proof,
                proof.nullifier_hash
              );
            }}
            credential_types={[CredentialType.Orb, CredentialType.Phone]}
            enableTelemetry
          >
            {({ open }) => <button onClick={open}>Verify with World ID</button>}
          </IDKitWidget>
        </Box>
      </Container>
    </Box>
  );
}
