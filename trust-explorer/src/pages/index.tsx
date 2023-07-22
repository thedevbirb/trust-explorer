import { useState } from "react";
import Homepage from "../component/Homepage";
import MainSection from "../component/MainSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Homepage>
        <MainSection />
      </Homepage>
    </main>
  );
}
