import { Container, Heading, Stack, Text, Button } from "@chakra-ui/react";

export default function Hero() {
  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        pb={{ base: 1, md: 2 }}
        pt={{ base: 2, md: 10 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
          lineHeight={"110%"}
        >
          Trusting a contract{" "}
          <Text as={"span"} color={"blue.400"}>
            has never been easier.
          </Text>
        </Heading>
        <Text color={"gray.400"} maxW={"4xl"}>
          Review contracts with <b>Ethereum Attestations at TrustlessPilot</b>.
          Ensure trust and security in blockchain. Sybil protection thwarts
          bots. Join now to shape the decentralized future!
        </Text>
      </Stack>
    </Container>
  );
}
