import dynamic from "next/dynamic";
import { useRouter } from "next/router";
// --- Chakra-UI ---
import { Center } from "@chakra-ui/react";

// --- Components ---
const SearchComponent = dynamic(() => import("./Search"));

// --- Motion Components ---
import MotionContainer from "./MotionContainer";

// -- Animations --
import { slide } from "../animations";

export default function MainSection() {
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
        </Center>
      </MotionContainer>
    </>
  );
}
