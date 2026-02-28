import React from "react";
import ImageEditor from "./components/ImageEditor";
import Chatbot from "./components/Chatbot";
import { Film } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Film className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
                Chaplin AI Studio
              </h1>
              <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">
                Silent Film Modernizer
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://ai.google.dev/gemini-api/docs"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-zinc-400 hover:text-indigo-400 transition-colors"
            >
              Powered by Gemini
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <section className="h-full flex flex-col min-h-[500px]">
            <ImageEditor />
          </section>
          <section className="h-full flex flex-col min-h-[500px]">
            <Chatbot />
          </section>
        </div>
      </main>
    </div>
  );
}
