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
        </Center>
      </MotionContainer>
    </>
  );
}
