import dynamic from "next/dynamic";

// --- Chakra-UI ---
import { Box } from "@chakra-ui/react";
import Header from "./Header";

// --- Component Props Interface ---
interface IMainContentProps {
  children: React.ReactNode;
}

export default function Homepage({ children }: IMainContentProps): JSX.Element {
  return <Box overflow="hidden">{children}</Box>;
}
