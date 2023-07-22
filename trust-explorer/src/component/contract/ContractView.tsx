import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Heading,
  Stack,
  Flex,
  Icon,
  Text,
  useColorMode,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  Link,
  Image,
  Center,
} from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";

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
import { useAsyncMemo } from "use-async-memo";
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
  const [rating, setRating] = React.useState<number | null>(null);
  const [reviewsCount, setReviewsCount] = React.useState<number | null>(null);
  const [selectedRating, setSelectedRating] = React.useState<number | null>(
    null
  );
  const [reviews, setReviews] = React.useState<number>(null);
  const [activeStars, setActiveStars] = React.useState(0);

  const [numberOfTransactions, setNumberOfTransactions] = React.useState<
    number | null
  >(null);

  const signal = useMemo(() => {
    if (!wallet || !contractAddress || !selectedRating) return;
    return generateSignal(wallet, contractAddress, selectedRating);
  }, [wallet, contractAddress]);

  useAsyncMemo(async () => {
    if (!contractAddress) return;
    const res = await queryAttestation(contractAddress);
    setReviewsCount(res[0].attestationsCount);
    setRating(Number(res[0].scoreAvg));
  }, [contractAddress]);

  useEffect(() => {
    const randomTransactions = Math.floor(Math.random() * 100);
    setNumberOfTransactions(randomTransactions);
  }, []);

  const { colorMode } = useColorMode();

  useEffect(() => {
    // Set a timeout for each star to activate with a delay
    const timeout = setTimeout(() => {
      setActiveStars((prev) => prev + 1);
    }, 100);

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timeout);
  }, [activeStars]); // Run the effect whenever activeStars changes

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
          pb={10}
          color={useColorModeValue("gray.100", "gray.100")}
        >
          <p>You're viewing contract </p>
          <Link
            href={`https://goerli-optimism.etherscan.io/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            color="blue.100"
            textUnderlineOffset={2}
          >
            <Center>
              <Flex>
                {contractAddress?.toLowerCase() ===
                "0x1a5650d0ecbca349dd84bafa85790e3e6955eb84" ? (
                  <Image
                    src={"/eas.png"}
                    width={14}
                    height={14}
                    margin={"auto"}
                  />
                ) : (
                  <></>
                )}
                <Text marginY={"auto"}>{contractAddress}</Text>
              </Flex>
            </Center>
          </Link>
        </Heading>

        <Box
          display="flex"
          flexDir={{ base: "column", md: "row" }} // Make it a column on small screens, row on medium screens and above
          justifyContent="space-between" // Spacing between left and right columns
        >
          <Box flex="1" mr={{ base: 0, md: 8 }}>
            <Flex direction="column" alignItems="center" mt={8} gap={3}>
              <NumberAnimation
                Box={Box}
                targetValue={reviewsCount}
                animationDuration={1500}
              />{" "}
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
                action={"attest"}
                signal={signal}
                theme={colorMode}
                onSuccess={async (proof: ISuccessResult) => {
                  await generateAttestation(
                    proof.merkle_root,
                    proof.proof,
                    proof.nullifier_hash,
                    selectedRating,
                    contractAddress
                  );
                }}
                credential_types={[CredentialType.Orb, CredentialType.Phone]}
                enableTelemetry
              >
                {({ open }) => (
                  <SubmitReview
                    open={open}
                    selectedRating={selectedRating}
                    setSelectedRating={setSelectedRating}
                  />
                )}
              </IDKitWidget>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
