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
  LightMode,
  useColorModeValue,
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
import NumberAnimation from "../../animations/number";
import { SubmitReview } from "../SubmitReview";
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

  const handleClick = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    // Increment the number of reviews and update the average rating
    setReviews((prevReviews) => prevReviews + 1);
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
          <p>You're viewing contract </p>
          <a
            href={`https://etherscan.io/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            color="blue.300"
          >
            {contractAddress}
          </a>
        </Heading>

        <Box
          display="flex"
          flexDir={{ base: "column", md: "row" }} // Make it a column on small screens, row on medium screens and above
          justifyContent="space-between" // Spacing between left and right columns
        >
          <Box flex="1" mr={{ base: 0, md: 8 }}>
            <Flex direction="column" alignItems="center" mt={8} gap={3}>
              <NumberAnimation targetValue={reviews} animationDuration={1500} />{" "}
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
                  />
                ))}
              </Stack>
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
                  await handleClick();
                }}
                credential_types={[CredentialType.Orb, CredentialType.Phone]}
                enableTelemetry
              >
                {({ open }) => <SubmitReview />}
              </IDKitWidget>
            </Flex>
          </Box>
        </Box>

        <Stack spacing={4}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={useColorModeValue("gray.100", "gray.100")}
          >
            {numberOfTransactions} Transactions
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
}
