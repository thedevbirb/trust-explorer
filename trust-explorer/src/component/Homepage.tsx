import dynamic from "next/dynamic";

// --- Chakra-UI ---
import {
  Box,
  ComponentDefaultProps,
  ComponentWithAs,
  Flex,
  IconButtonProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import Image from "next/image";
import Header from "./Header";

// --- Components ---
const SearchHistoryComponent = dynamic(() => import("./SearchHistory"));
const ThemeButtonComponent = dynamic(() => import("./ThemeButton"));

// --- Component Props Interface ---
interface IMainContentProps {
  children: React.ReactNode;
}

export default function Homepage({ children }: IMainContentProps): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <Box overflow="hidden">
      <Header />
      {children}
    </Box>
  );
}
