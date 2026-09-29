"use client";

import { Camera, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";
import { Avatar } from "@/components/shared/avatar";
import { sendProfileRequest } from "./field";

/** Output size of the uploaded photo. Avatars never render above ~64px, so 256px covers 4x. */
const PHOTO_SIZE = 256;
/** Largest file accepted from the picker, before it's downsized in the browser. */
const MAX_SOURCE_BYTES = 10 * 1024 * 1024;

/**
 * The profile-photo picker. The chosen image is centre-cropped to a square and re-encoded as a
 * 256px JPEG in the browser before upload, so any phone photo becomes a ~20-40 KB file and nothing
 * but pixels (no EXIF location data) is sent to the server.
 */
export function ProfilePhoto({ fullName, avatarUrl }: { fullName: string; avatarUrl: string | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"uploading" | "removing" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // let the same file be picked again after an error
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file (JPEG, PNG, WebP...).");
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError("That image is over 10 MB. Choose a smaller one.");
      return;
    }

    setBusy("uploading");
    try {
      const data = await toSquareJpegBase64(file);
      const failure = await sendProfileRequest(
        "/api/profile/avatar",
        "PUT",
        { contentType: "image/jpeg", data },
        "Could not update your photo.",
      );
      if (failure) setError(failure);
      else router.refresh();
    } catch {
      setError("That image couldn't be read. Try a different file.");
    } finally {
      setBusy(null);
    }
  }

  async function handleRemove() {
    setError(null);
    setBusy("removing");
    const failure = await sendProfileRequest("/api/profile/avatar", "DELETE", undefined, "Could not remove your photo.");
    setBusy(null);
    if (failure) setError(failure);
    else router.refresh();
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative">
        <Avatar name={fullName} src={avatarUrl} fallback="icon" size={112} className="ring-4 ring-surface" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy !== null}
          aria-label="Upload a new photo"
          className="absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full border-2 border-card bg-accent text-on-accent hover:opacity-90 disabled:opacity-60"
        >
          <Camera className="size-4" />
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy !== null}
          className="rounded-control bg-accent px-4 py-2 text-sm font-semibold text-on-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "uploading" ? "Uploading..." : avatarUrl ? "Change photo" : "Upload photo"}
        </button>
        {avatarUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={busy !== null}
            className="flex items-center gap-1.5 rounded-control border border-line px-4 py-2 text-sm font-semibold text-destructive hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="size-4" />
            {busy === "removing" ? "Removing..." : "Remove"}
          </button>
        )}
      </div>

      <p className="text-xs text-ink-muted">JPEG, PNG or WebP, up to 10 MB. It&apos;s cropped to a square.</p>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Centre-crops the image to a square, scales it to PHOTO_SIZE and returns JPEG base64 (no prefix). */
async function toSquareJpegBase64(file: File): Promise<string> {
  // `imageOrientation: "from-image"` applies EXIF rotation, so phone photos aren't sideways.
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = PHOTO_SIZE;
  canvas.height = PHOTO_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");

  context.fillStyle = "#ffffff"; // JPEG has no transparency; flatten onto white
  context.fillRect(0, 0, PHOTO_SIZE, PHOTO_SIZE);
  context.imageSmoothingQuality = "high";
  context.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    PHOTO_SIZE,
    PHOTO_SIZE,
  );
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
  return dataUrl.slice(dataUrl.indexOf(",") + 1);
}
