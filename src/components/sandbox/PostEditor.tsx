"use client";

import { useState, useRef } from "react";
import { Upload, X, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PostEditorProps {
  contentText: string;
  setContentText: (text: string) => void;
  mediaUrls: string[];
  setMediaUrls: (urls: string[]) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function PostEditor({
  contentText,
  setContentText,
  mediaUrls,
  setMediaUrls,
  onSave,
  isSaving
}: PostEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls = [...mediaUrls];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("post-media")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        continue;
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from("post-media")
          .getPublicUrl(filePath);
        
        if (publicUrlData) {
          newUrls.push(publicUrlData.publicUrl);
        }
      }
    }

    setMediaUrls(newUrls);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeMedia = (indexToRemove: number) => {
    setMediaUrls(mediaUrls.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b]">
      <div className="flex-1 p-6 overflow-y-auto">
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Post Content
        </label>
        <textarea
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          placeholder="What's happening?"
          className="w-full h-40 px-4 py-3 bg-[#111113] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow mb-6"
        />

        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Media
        </label>
        
        {/* Media Grid */}
        {mediaUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {mediaUrls.map((url, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-video bg-zinc-900">
                <img src={url} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeMedia(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-xl text-zinc-400 hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#111113]"
        >
          <Upload size={20} />
          <span>{isUploading ? "Uploading..." : "Click or drag to upload media"}</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,video/*"
          multiple
          className="hidden"
        />
      </div>

      <div className="p-6 border-t border-white/5 bg-[#111113]">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Save Draft"}
        </button>
      </div>
    </div>
  );
}
