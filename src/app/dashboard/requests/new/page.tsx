"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useSmartBack } from "@/lib/use-smart-back";

type RequestPhoto = {
  id: string;
  url: string;
  uploading?: boolean;
};

type RequestItem = {
  localId: string;
  title: string;
  description: string;
  photos: RequestPhoto[];
};

function createEmptyItem(): RequestItem {
  return {
    localId: crypto.randomUUID(),
    title: "",
    description: "",
    photos: [],
  };
}

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function useAutoResize(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);
  return ref;
}

function ItemDescriptionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useAutoResize(value);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Extra details (optioneel)"
      rows={1}
      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none overflow-hidden min-h-[40px]"
    />
  );
}

export default function NewRequestStep1Page() {
  const router = useRouter();
  const goBack = useSmartBack("/dashboard");

  const [items, setItems] = useState<RequestItem[]>([createEmptyItem()]);
  const [saving, setSaving] = useState(false);

  function updateItem(localId: string, updates: Partial<RequestItem>) {
    setItems((prev) =>
      prev.map((item) => (item.localId === localId ? { ...item, ...updates } : item))
    );
  }

  function handleAddItem() {
    setItems((prev) => [...prev, createEmptyItem()]);
  }

  function handleDeleteItem(localId: string) {
    setItems((prev) => prev.filter((item) => item.localId !== localId));
  }

  async function uploadSinglePhoto(localId: string, file: File, tempId: string) {
    const supabase = createClient();
    const userId = await getCurrentUserId();
    if (!userId) return;

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("request-photos").upload(path, file);

    if (error) {
      // Upload mislukt — verwijder de placeholder zodat er geen vastgelopen spinner blijft staan
      setItems((prev) =>
        prev.map((item) =>
          item.localId === localId
            ? { ...item, photos: item.photos.filter((p) => p.id !== tempId) }
            : item
        )
      );
      return;
    }

    const { data: signedData } = await supabase.storage
      .from("request-photos")
      .createSignedUrl(path, 3600);

    setItems((prev) =>
      prev.map((item) => {
        if (item.localId !== localId) return item;
        return {
          ...item,
          photos: item.photos.map((p) =>
            p.id === tempId
              ? { id: path, url: signedData?.signedUrl ?? p.url, uploading: false }
              : p
          ),
        };
      })
    );
  }

  function handlePhotoUpload(localId: string, files: FileList) {
    const fileArray = Array.from(files);
    const tempPhotos: RequestPhoto[] = fileArray.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      uploading: true,
    }));

    setItems((prev) =>
      prev.map((item) =>
        item.localId === localId
          ? { ...item, photos: [...item.photos, ...tempPhotos] }
          : item
      )
    );

    // Elke foto onafhankelijk uploaden — geen gedeelde for-loop state die elkaar kan overschrijven
    fileArray.forEach((file, i) => {
      uploadSinglePhoto(localId, file, tempPhotos[i].id);
    });
  }

  async function handleRemovePhoto(localId: string, photoId: string, uploading?: boolean) {
    // Verwijder lokaal direct uit state
    setItems((prev) =>
      prev.map((item) =>
        item.localId === localId
          ? { ...item, photos: item.photos.filter((p) => p.id !== photoId) }
          : item
      )
    );

    // Als de foto al geüpload is (photoId is dan de storage path), ook uit storage verwijderen
    if (!uploading) {
      const supabase = createClient();
      await supabase.storage.from("request-photos").remove([photoId]);
    }
  }

  async function handleContinue() {
    setSaving(true);

    const userId = await getCurrentUserId();
    if (!userId) { setSaving(false); return; }

    const validItems = items.filter((item) => item.title.trim().length > 0);

    if (validItems.length === 0) {
      setSaving(false);
      return;
    }

    const res = await fetch("/api/requests/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        items: validItems.map((item) => ({
          title: item.title,
          description: item.description,
          photos: item.photos.map((p) => p.id),
        })),
      }),
    });

    if (res.ok) {
      const { request } = await res.json();
      router.push(`/dashboard/requests/new/${request.id}/client`);
    }

    setSaving(false);
  }

  const hasValidItem = items.some((item) => item.title.trim().length > 0);
  const hasUploadingPhoto = items.some((item) => item.photos.some((p) => p.uploading));

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-6 p-6 mx-auto w-full max-w-2xl pb-40">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Terug"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-1/2 bg-primary transition-all" />
              </div>
            </div>
            <span className="ml-4 text-sm text-muted-foreground">1/2</span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold">Nieuwe aanvraag</h1>
          <p className="text-sm text-muted-foreground">
            Beschrijf het probleem. Klantgegevens komen in de volgende stap.
          </p>
        </div>

        {/* Request items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.localId} className="rounded-2xl bg-card p-4 space-y-4">

              {/* Title + delete */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(item.localId, { title: e.target.value })}
                  placeholder="Bijv. Lekkende kraan keuken"
                  className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {items.length > 1 && (
                  <button
                    onClick={() => handleDeleteItem(item.localId)}
                    aria-label="Verwijder dit punt"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Description — auto-resizing textarea */}
              <ItemDescriptionInput
                value={item.description}
                onChange={(v) => updateItem(item.localId, { description: v })}
              />

              {/* Photos */}
              <div className="flex flex-wrap gap-2">
                {item.photos.map((photo) => (
                  <div key={photo.id} className="relative h-20 w-20 flex-shrink-0">
                    <img
                      src={photo.url}
                      alt="Foto van situatie"
                      className={`h-full w-full rounded-lg object-cover ${photo.uploading ? "opacity-50" : ""}`}
                    />
                    {photo.uploading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
                      </div>
                    )}
                    <button
                      onClick={() => handleRemovePhoto(item.localId, photo.id, photo.uploading)}
                      aria-label="Foto verwijderen"
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border shadow-sm hover:bg-red-50"
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
                <label className="flex h-20 w-20 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border hover:bg-muted/40 transition-colors">
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/heic,image/heif"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handlePhotoUpload(item.localId, e.target.files);
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddItem}
            aria-label="Nog een punt toevoegen"
            className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-border p-4 text-left transition-colors hover:bg-muted/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Nog een punt toevoegen</p>
              <p className="text-sm text-muted-foreground">Zoals een ander probleem of een andere ruimte</p>
            </div>
          </button>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto w-full max-w-2xl px-6 py-4">
          <Button className="w-full" onClick={handleContinue} disabled={saving || !hasValidItem || hasUploadingPhoto}>
            {saving ? "Bezig..." : hasUploadingPhoto ? "Foto's worden geupload..." : "Volgende"}
          </Button>
        </div>
      </div>
    </div>
  );
}