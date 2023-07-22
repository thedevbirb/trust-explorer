import Homepage from "../component/Homepage";
import MainSection from "../component/MainSection";
import Hero from "../component/Hero";
import { Container } from "@chakra-ui/react";
import { useSnap } from "../hooks/useSnap";
import { useAsyncMemo } from "use-async-memo";
export const defaultSnapOrigin =
  process.env.SNAP_ORIGIN ?? `local:http://localhost:8080`;

export default function Home() {
  const { detectSnap } = useSnap();

  const aaa = useAsyncMemo(async () => {
    await detectSnap();

    const snapId = {};
    await window.ethereum.request({
      method: "wallet_requestSnaps",
      params: {
        [defaultSnapOrigin]: {},
      },
    });
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
