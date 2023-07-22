import Homepage from "../component/Homepage";
import MainSection from "../component/MainSection";
import Hero from "../component/Hero";
import { Container } from "@chakra-ui/react";

export default function Home() {
  return (
    <Container maxW={"6xl"}>
      <Homepage>
        <div>
          <Hero />
          <MainSection />
        </div>
      </Homepage>
    </Container>
  );
}
