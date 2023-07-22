import { Box, Button, Container, Heading, Stack } from "@chakra-ui/react";
import Header from "../Header";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { useAsyncMemo } from "use-async-memo";
import { useGraph } from "../../hooks/useGraph";
import { useMetaMask } from "../../hooks/useMetamask";
interface Props {
  contractAddress: string;
}

export default function ContractView(props: Props) {
  const { contractAddress } = props;
  const {
    state: { wallet },
  } = useMetaMask();

  const { queryAttestation } = useGraph();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
  };

  return (
    <Box overflow="hidden">
      <Header />
      <Container
        maxW={"6xl"}
        centerContent
        marginTop={32}
        bg="brand.900"
        borderRadius={"2xl"}
      >
        <Heading
          padding="4"
          maxW="5xl"
          size={"lg"}
          color={"white"}
          textAlign={"center"}
        >
          Your viewing contract {contractAddress}
        </Heading>
        <Stack direction="row" spacing={4}>
          <Button
            leftIcon={<FiEdit2 />}
            isLoading={isLoading}
            loadingText="Submitting review"
            onClick={handleClick}
            color="white"
            bg="brand.700"
          >
            Review
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
