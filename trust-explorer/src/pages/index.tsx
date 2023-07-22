import { useState } from "react";
import Homepage from "../../components/Homepage";
import MainSection from "../../components/MainSection";

export default function Home() {
  const [address, setAddress] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Homepage>
        <MainSection />
      </Homepage>
      <div className="flex flex-row gap-3">
        <input
          className="text-white rounded-md w-[50rem] px-2 bg-black border-blue-600 border-2"
          placeholder="Paste a contract address here"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="bg-black border-2 border-blue-600 rounded-md w-[10rem]">
          Find
        </button>
      </div>
    </main>
  );
}
