"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { wordPairs } from "../data/wordPairs";

// Create separate arrays for English and French words
const englishWords = wordPairs.map((pair) => pair.english);
const frenchWords = wordPairs.map((pair) => pair.french);

export default function Page() {
  const searchParams = useSearchParams();
  const correct = searchParams.get("correct");
  const total = searchParams.get("total");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            Word Matching Game
          </h1>
          <div className="flex justify-center mb-6 gap-4">
            <Button className="bg-green-600 hover:bg-green-700">
              <Link href="/game"> GO!</Link>
            </Button>
          </div>

          {correct && total && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Your Score</h2>
              <p className="text-lg mb-4">
                {correct} / {total} (
                {Math.round((Number(correct) / Number(total)) * 100)}%)
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-center gap-8">
            <Card
              className="w-full md:w-64 overflow-hidden p-0 gap-0"
              role="region"
              aria-label="English Words"
            >
              <div className="bg-blue-500 text-white p-4 text-center font-bold text-xl">
                English Word
              </div>
              <ul className="divide-y">
                {englishWords.map((word, index) => (
                  <li
                    key={`english-${index}`}
                    className="p-4 text-center hover:bg-blue-100 transition-colors"
                  >
                    {word}
                  </li>
                ))}
              </ul>
            </Card>

            <Card
              className="w-full md:w-64 overflow-hidden p-0 gap-0"
              role="region"
              aria-label="French Words"
            >
              <div className="bg-green-500 text-white p-4 text-center font-bold text-xl">
                French Word
              </div>
              <ul className="divide-y">
                {frenchWords.map((word, index) => (
                  <li
                    key={`french-${index}`}
                    className="p-4 text-center hover:bg-green-50 transition-colors"
                  >
                    {word}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
