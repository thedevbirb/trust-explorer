import React, { useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Stack,
  Flex,
  Icon,
  Text,
  useColorMode,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { FiEdit2, FiStar } from "react-icons/fi";

import { useGraph } from "../../hooks/useGraph";
import {
  CredentialType,
  IDKitWidget,
  ISuccessResult,
  solidityEncode,
} from "@worldcoin/idkit";
import { generateAttestation, generateSignal } from "../../utils/helpers";
import { useMetaMask } from "../../hooks/useMetamask";
interface Props {
  contractAddress: string;
}

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

  // let { message, messageColor } =
  //   rating === null
  //     ? messageData.nullRating
  //     : rating <= 5
  //     ? messageData.scamRating
  //     : rating <= 7
  //     ? messageData.likeRating
  //     : messageData.goodRating;
  const message =
    rating === null ? (
      <Alert status="info" rounded="xl">
        <AlertIcon />
        <AlertTitle>No Rating</AlertTitle>
      </Alert>
    ) : rating <= 5 ? (
      <Alert status="error" rounded="xl">
        <AlertIcon />
        <AlertTitle>Looks Scam</AlertTitle>
      </Alert>
    ) : rating <= 7 ? (
      <Alert status="warning" rounded="xl">
        <AlertIcon />
        <AlertTitle>It's fine</AlertTitle>
      </Alert>
    ) : (
      <Alert status="success" rounded="xl">
        <AlertIcon />
        <AlertTitle>Looks Good!</AlertTitle>
      </Alert>
    );

  return (
    <Flex alignItems="center">
      <Box
        w="1200px" // Set the width to 100vw to take up the entire viewport width
        mx={"auto"}
        alignSelf={"center"}
        marginTop={32}
        borderRadius={"xl"}
        alignContent={"center"}
        bg="brand.900"
      >
        <Heading
          padding="4"
          fontSize={"2xl"}
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

          <Stack w="fit-content" mt="2">
            {message}
          </Stack>

          <IDKitWidget
            app_id="app_eb57bcd2529a2b84af1704d76ab9210c"
            action={solidityEncode(["uint256"], ["attest"])}
            signal={generateSignal(state.wallet, contractAddress, 7)}
            theme={colorMode}
            onSuccess={async (proof: ISuccessResult) => {
              await generateAttestation(
                proof.merkle_root,
                proof.proof,
                proof.nullifier_hash,
                7,
                contractAddress
              );
            }}
            credential_types={[CredentialType.Orb, CredentialType.Phone]}
            enableTelemetry
          >
            {({ open }) => (
              <Button
                leftIcon={<FiEdit2 />}
                isLoading={isLoading}
                loadingText="Submitting review"
                onClick={async () => {
                  open();
                  await handleClick();
                }}
                color="white"
                bg="brand.700"
                mt={4}
                mb={4}
              >
                Review
              </Button>
            )}
          </IDKitWidget>
        </Flex>
      </Box>
    </Flex>
  );
}
