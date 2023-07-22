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
  const { colorMode } = useColorMode();
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
          Your viewing contract {contractAddress}
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
            {({ open }) => <button onClick={open}>Verify with World ID</button>}
          </IDKitWidget>
        </Box>
      </Container>
    </Box>
  );
}
