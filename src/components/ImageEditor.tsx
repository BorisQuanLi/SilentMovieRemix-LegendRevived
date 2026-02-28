import React, { useState, useRef } from "react";
import { editImage } from "../services/gemini";
import { Upload, Wand2, Loader2, Image as ImageIcon } from "lucide-react";

export default function ImageEditor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadPlaceholder = async () => {
    try {
      // Load a placeholder image and convert to base64
      const response = await fetch("https://picsum.photos/seed/chaplin/800/600?grayscale");
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to load placeholder", error);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt) return;

    setIsEditing(true);
    try {
      // Extract base64 data and mime type
      const match = originalImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (!match) throw new Error("Invalid image format");

      const mimeType = match[1];
      const base64Data = match[2];

      const result = await editImage(base64Data, mimeType, prompt);
      if (result) {
        setEditedImage(result);
      }
    } catch (error) {
      console.error("Edit failed", error);
      alert("Failed to edit image. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
        <h2 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-indigo-400" />
          Nano Banana Editor
        </h2>
        <div className="flex gap-2">
          <button
            onClick={loadPlaceholder}
            className="px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors flex items-center gap-2"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Load Preset
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Frame
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {!originalImage ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500">
            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
            <p>Upload a silent film frame or load a preset</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Original</span>
              </div>
              <img
                src={originalImage}
                alt="Original"
                className="w-full rounded-lg border border-zinc-800 object-contain max-h-[40vh] bg-zinc-900"
                referrerPolicy="no-referrer"
              />
            </div>

            {editedImage && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Edited</span>
                </div>
                <img
                  src={editedImage}
                  alt="Edited"
                  className="w-full rounded-lg border border-indigo-500/30 object-contain max-h-[40vh] bg-zinc-900"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add a retro filter, or make it colorful..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            disabled={!originalImage || isEditing}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
            }}
          />
          <button
            onClick={handleEdit}
            disabled={!originalImage || !prompt || isEditing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
