import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input
        className="text-white w-[50rem] bg-black border-blue-600 border-2"
        placeholder="Paste a contract address here"
      ></input>
    </main>
  );
}
