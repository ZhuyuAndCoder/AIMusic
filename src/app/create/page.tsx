"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { PlayerBar } from "@/components/layout/PlayerBar";
import { AICreator } from "@/components/music/AICreator";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <AICreator />
      </main>

      <PlayerBar />
    </div>
  );
}
