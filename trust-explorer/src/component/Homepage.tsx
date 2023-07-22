import dynamic from "next/dynamic";

// --- Chakra-UI ---
import { Box } from "@chakra-ui/react";
import Header from "./Header";

// --- Component Props Interface ---

export default function Homepage({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <Box overflow="hidden">{children}</Box>;
}
