import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import Header from "../Header";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
interface Props {
  address: string;
}
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { generateAttestation, generateSignal } from "../../utils/helpers";
import { useRouter } from "next/router";
import { useMetaMask } from "../../hooks/useMetamask";

export default function ContractView(props: Props) {
  const { address } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { state } = useMetaMask();

  const handleClick = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
  };

  return (
    <Box overflow="hidden">
      <Header />
      <Container
        maxW={"6xl"}
        centerContent
        marginTop={32}
        bg="brand.900"
        borderRadius={"2xl"}
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
        <Stack direction="row" spacing={4}>
          <Button
            leftIcon={<FiEdit2 />}
            isLoading={isLoading}
            loadingText="Submitting review"
            onClick={handleClick}
            color="white"
            bg="brand.700"
          >
            Review
          </Button>
        </Stack>

        <Box w="300px" h="50px" bgColor="blue.500" color="white" rounded={"md"}>
          <IDKitWidget
            app_id="app_eb57bcd2529a2b84af1704d76ab9210c"
            action="attest"
            signal={generateSignal(
              state.wallet || "0xc2e9A90a9B957c4687c5944491f86E29C10Cb439",
              address,
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
