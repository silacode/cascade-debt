import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full h-screen bg-white">
      <div className="w-full h-full flex flex-col justify-center items-center text-center gap-6 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Word Matching Game
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-md">
          You can click on an English word and click on a French word to connect
          it using an arrow.
        </p>
        <Link href="/home">
          <Button className="bg-green-500 hover:bg-green-600 text-white text-lg py-3 px-6 rounded-lg">
            Start
          </Button>
        </Link>
      </div>
    </main>
  );
}
