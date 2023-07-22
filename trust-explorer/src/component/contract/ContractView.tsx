import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Stack,
  Flex,
  Icon,
  Text,
  useColorMode,
  LightMode,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  Link,
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
import NumberAnimation from "../../animations/number";

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
  const [activeStars, setActiveStars] = React.useState(0);

  const [numberOfTransactions, setNumberOfTransactions] = React.useState<
    number | null
  >(null);

  useEffect(() => {
    const randomRating = Math.floor(Math.random() * 10);
    setRating(randomRating);
  }, []);

  useEffect(() => {
    const randomReview = Math.floor(Math.random() * 10000);
    setReviews(randomReview);
  }, []);

  useEffect(() => {
    const randomTransactions = Math.floor(Math.random() * 1000);
    setNumberOfTransactions(randomTransactions);
  }, []);

  const { colorMode } = useColorMode();
  const { state } = useMetaMask();

  useEffect(() => {
    // Set a timeout for each star to activate with a delay
    const timeout = setTimeout(() => {
      setActiveStars((prev) => prev + 1);
    }, 100);

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timeout);
  }, [activeStars]); // Run the effect whenever activeStars changes

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

  const message =
    rating === null ? (
      <Alert status="info" rounded="xl">
        <AlertIcon />
        <AlertTitle>No Rating</AlertTitle>
      </Alert>
    ) : rating <= 5 ? (
      <Alert status="error" rounded="xl">
        <AlertIcon />
        <AlertTitle>Looks suspicious! Don't trust it.</AlertTitle>
      </Alert>
    ) : (
      <Alert status="success" rounded="xl">
        <AlertIcon />
        <AlertTitle>Looks Good!</AlertTitle>
      </Alert>
    );

  return (
    <Flex alignItems="center" justifyContent="center" h="100vh">
      <Box
        w="1200px"
        mx="auto"
        borderRadius="xl"
        alignContent="center"
        bg={useColorModeValue("blue.500", "blue.700")}
        p={8}
      >
        <Heading
          fontSize="2xl"
          textAlign="center"
          pb={20}
          color={useColorModeValue("gray.100", "gray.100")}
        >
          <p>You're exploring contract </p>
          <Link
            href={`https://etherscan.io/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            color="blue.100"
            textUnderlineOffset={2}
          >
            {contractAddress}
          </Link>
        </Heading>

        <Box
          display="flex"
          flexDir={{ base: "column", md: "row" }} // Make it a column on small screens, row on medium screens and above
          justifyContent="space-between" // Spacing between left and right columns
        >
          <Box flex="1" mr={{ base: 0, md: 8 }}>
            <Flex direction="column" alignItems="center" mt={8} gap={3}>
              {/* Star Rating */}
              <Stack direction="row" spacing={2} align="center">
                <Text color="white" fontSize="xl" fontWeight="semibold">
                  {rating === null ? "No Rating" : `${rating}/10`}
                </Text>
                {Array.from({ length: 10 }, (_, index) => (
                  <Icon
                    key={index}
                    className={`star-icon ${
                      index < activeStars ? "filled" : ""
                    }`}
                    as={FiStar}
                    color={index < (rating ?? 0) ? "blue.200" : "gray.300"}
                    fill={index < (rating ?? 0) ? "blue.200" : "transparent"}
                    boxSize={6}
                    cursor="pointer"
                    onClick={() => handleRating(index + 1)}
                  />
                ))}
              </Stack>
              <NumberAnimation targetValue={reviews} animationDuration={1500} />{" "}
              {rating !== null && (
                <Box mt={2} fontWeight="bold" fontSize="2xl">
                  {message}
                </Box>
              )}
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
                    bg={"blue.100"}
                    isLoading={isLoading}
                    color={"purple.700"}
                    loadingText="Submitting review"
                    onClick={async () => {
                      open();
                      await handleClick();
                    }}
                  >
                    I want to add a review
                  </Button>
                )}
              </IDKitWidget>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
