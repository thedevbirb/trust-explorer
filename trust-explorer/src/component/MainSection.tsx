import dynamic from "next/dynamic";
import { useRouter } from "next/router";
// --- Chakra-UI ---
import { Box, Center, useColorMode } from "@chakra-ui/react";

// --- Components ---
const SearchComponent = dynamic(() => import("./Search"));

// --- Motion Components ---
import MotionContainer from "./MotionContainer";

// -- Animations --
import { slide } from "../animations";
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { generateAttestation, generateSignal } from "../utils/helpers";
import { useMetaMask } from "../hooks/useMetamask";

export default function MainSection() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { state } = useMetaMask();
  const contractAddress = "0x1a5650D0EcbCa349DD84bAFa85790E3e6955eb84"; // CONTRACT ADDRESS

  const handleSearchAddress = (address?: string) => {
    router.push(address);
  };

  return (
    <>
      <MotionContainer
        w="full"
        h="40vh"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={slide}
      >
        <Center w="full" h="full">
          <SearchComponent handleSearchAddress={handleSearchAddress} />
          <Box w="300px" h="300px" color="red">
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
              {({ open }) => (
                <button onClick={open}>Verify with World ID</button>
              )}
            </IDKitWidget>
          </Box>
        </Center>
      </MotionContainer>
    </>
  );
}
