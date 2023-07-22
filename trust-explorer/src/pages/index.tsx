import Homepage from "../component/Homepage";
import MainSection from "../component/MainSection";
import Hero from "../component/Hero";
import { Container } from "@chakra-ui/react";
import { useSnap } from "../hooks/useSnap";
import { useAsyncMemo } from "use-async-memo";
import { useXmtp } from "../hooks/useXmtp";

export default function Home() {
  const { handleConnect } = useXmtp();

  const detect = useAsyncMemo(async () => {
    await handleConnect();
  }, []);

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
