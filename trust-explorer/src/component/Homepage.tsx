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

// --- Components ---
const SearchHistoryComponent = dynamic(() => import("./SearchHistory"));
const ThemeButtonComponent = dynamic(() => import("./ThemeButton"));

// --- Component Props Interface ---
interface IMainContentProps {
  children: React.ReactNode;
}

export default function Homepage({ children }: IMainContentProps): JSX.Element {
  const { colorMode } = useColorMode();

  const bgColor = useColorModeValue("gray.50", "gray.900");

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
    <Box bgColor={bgColor} overflow="hidden">
      <Flex
        gap={4}
        height=""
        position="absolute"
        top={[4, 10]}
        right={[4, 10]}
        zIndex="overlay"
      >
        <SearchHistoryComponent styleProps={buttonStyleProps} />

        <ThemeButtonComponent styleProps={buttonStyleProps} />
      </Flex>

      {children}
    </Box>
  );
}
