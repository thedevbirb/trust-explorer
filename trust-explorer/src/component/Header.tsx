import dynamic from "next/dynamic";

// --- Chakra-UI ---
import {
  Box,
  ComponentDefaultProps,
  ComponentWithAs,
  Flex,
  IconButtonProps,
  useColorMode,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

import Image from "next/image";
import Wallet from "./wallet";
import { Router, useRouter } from "next/router";

// --- Components ---
const SearchHistoryComponent = dynamic(() => import("./SearchHistory"));
const ThemeButtonComponent = dynamic(() => import("./ThemeButton"));
export default function Header() {
  const router = useRouter();
  const buttonStyleProps:
    | ComponentDefaultProps
    | ComponentWithAs<"button", IconButtonProps> = {
    color: useColorModeValue("gray.50", "gray.600"),
    bgColor: useColorModeValue("gray.600", "gray.50"),
    borderRadius: "xl",
    boxShadow: "xl",
    _hover: { backgroundColor: useColorModeValue("gray.700", "gray.200") },
  };

  return (
    <Flex
      bgGradient="linear(to-r,blue.200,blue.800)"
      borderBottom={"3px"}
      width={"100%"}
      height={"fit-content"}
      borderColor="black"
    >
      <Box
        _dark={{ display: "none" }}
        _light={{ display: "flex" }}
        gap={4}
        height=""
        position="absolute"
        top={[1, 5]}
        left={[4, 10]}
        zIndex="overlay"
      >
        <Image
          src={"/logo.png"}
          alt={"Logo"}
          width={220}
          height={0}
          onClick={() => router.push("/")}
        />
      </Box>
      <Box
        _dark={{ display: "flex" }}
        _light={{ display: "none" }}
        gap={4}
        height=""
        position="absolute"
        top={[1, 5]}
        left={[4, 10]}
        zIndex="overlay"
      >
        <Image
          src={"/darkest-logo.png"}
          alt={"Logo"}
          width={220}
          height={0}
          onClick={() => router.push("/")}
        />
      </Box>
      <Flex
        gap={4}
        height=""
        position="absolute"
        top={[4, 10]}
        right={[4, 10]}
        zIndex="overlay"
      >
        <Wallet />
        <SearchHistoryComponent styleProps={buttonStyleProps} />

        <ThemeButtonComponent styleProps={buttonStyleProps} />
      </Flex>
    </Flex>
  );
}
