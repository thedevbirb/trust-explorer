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
import { useMemo } from "react";
import { generateAttestation, generateSignal } from "../utils/helpers";

export default function MainSection() {
  const { colorMode } = useColorMode();
  const router = useRouter();

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
              signal={generateSignal()}
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
