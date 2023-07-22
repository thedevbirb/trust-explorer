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
  const handleSearchAddress = (address?: string) => {
    console.log("hello");
  };

  const { colorMode } = useColorMode();
  const router = useRouter();
  const contractAddress = useMemo(
    () => router.query.contractAddress,
    [router.query.contractAddress]
  );

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
              app_id="app_staging_c14ad286ca4a387753b137a0d357085f"
              action="attest"
              signal={generateSignal()}
              theme={colorMode}
              onSuccess={async (proof: ISuccessResult) => {
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
