"use client";

import { useRef, useState } from "react";
import { Save, Upload, X } from "lucide-react";
import Image from "next/image";
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
  isSaving,
}: PostEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    const newUrls = [...mediaUrls];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("post-media")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        setUploadError(`Failed to upload ${file.name}`);
        continue;
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from("post-media")
          .getPublicUrl(fileName);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  const removeMedia = (indexToRemove: number) => {
    setMediaUrls(mediaUrls.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Post content
          </label>
          <textarea
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="Write the caption..."
            className="h-44 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
            <span>Draft text</span>
            <span className="font-mono">{contentText.length} chars</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Media
          </label>

          {mediaUrls.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-3">
              {mediaUrls.map((url, idx) => (
                <div
                  key={url}
                  className="group relative aspect-video overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
                >
                  <Image
                    src={url}
                    alt={`Media ${idx + 1}`}
                    width={360}
                    height={203}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeMedia(idx)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-neutral-600 opacity-0 shadow-sm backdrop-blur hover:bg-neutral-900 hover:text-white group-hover:opacity-100"
                    type="button"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            disabled={isUploading}
            className={`flex min-h-36 w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-8 text-center text-neutral-400 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 ${
              isDragging
                ? "border-neutral-900 bg-neutral-50 text-neutral-700"
                : "border-neutral-300 bg-white"
            }`}
            type="button"
          >
            <Upload size={20} />
            <span className="text-sm font-medium">
              {isUploading ? "Uploading..." : "Drop files or click to upload"}
            </span>
            <span className="text-xs text-neutral-400">
              Images and video files are supported
            </span>
          </button>

          {uploadError && (
            <p className="mt-2 text-xs text-red-600">{uploadError}</p>
          )}

          <input
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            multiple
            type="file"
            className="hidden"
          />
        </div>
      </div>

      <div className="border-t border-neutral-200 bg-white p-5">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
        >
          <Save size={17} />
          {isSaving ? "Saving..." : "Save draft"}
        </button>
      </div>
    </div>
  );
}
