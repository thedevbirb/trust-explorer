import { Box, Container, Heading } from "@chakra-ui/react";
import Header from "../Header";

interface Props {
  address: string;
}

export default function ContractView(props: Props) {
  const { address } = props;
  return (
    <Box overflow="hidden">
      <Header />
      <Container maxW={"6xl"} centerContent paddingTop={80} bg="brand.900">
        <Heading
          padding="4"
          maxW="5xl"
          size={"lg"}
          color={"white"}
          textAlign={"center"}
        >
          Your viewing contract {address}
        </Heading>
      </Container>
    </Box>
  );
}
