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

  async function handlePhotoUpload(localId: string, files: FileList) {
    const tempPhotos: RequestPhoto[] = Array.from(files).map((file) => ({
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

    const supabase = createClient();
    const userId = await getCurrentUserId();
    if (!userId) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempPhoto = tempPhotos[i];
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("request-photos")
        .upload(path, file);

      if (!error) {
        const { data: signedData } = await supabase.storage
          .from("request-photos")
          .createSignedUrl(path, 3600);

        setItems((prev) =>
          prev.map((item) =>
            item.localId === localId
              ? {
                  ...item,
                  photos: item.photos.map((p) =>
                    p.id === tempPhoto.id
                      ? { id: path, url: signedData?.signedUrl ?? p.url, uploading: false }
                      : p
                  ),
                }
              : item
          )
        );
      }
    }
  }

  function handleRemovePhoto(localId: string, photoId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.localId === localId
          ? { ...item, photos: item.photos.filter((p) => p.id !== photoId) }
          : item
      )
    );
  }

  async function handleContinue() {
    setSaving(true);

    const userId = await getCurrentUserId();
    if (!userId) { setSaving(false); return; }

    // Filter lege items eruit (geen titel ingevuld)
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
          <h1 className="font-display text-2xl font-bold">Wat is het probleem?</h1>
          <p className="text-sm text-muted-foreground">
            Noteer wat je ziet, voeg foto&apos;s toe. Klantgegevens komen in de volgende stap.
          </p>
        </div>

        {/* Request items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.localId} className="rounded-2xl border border-border bg-card p-4 space-y-4">

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

              {/* Description */}
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(item.localId, { description: e.target.value })}
                placeholder="Extra details (optioneel)"
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    {!photo.uploading && (
                      <button
                        onClick={() => handleRemovePhoto(item.localId, photo.id)}
                        aria-label="Foto verwijderen"
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border shadow-sm hover:bg-red-50"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    )}
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
          <Button className="w-full" onClick={handleContinue} disabled={saving || !hasValidItem}>
            {saving ? "Bezig..." : "Volgende"}
          </Button>
        </div>
      </div>
    </div>
  );
}