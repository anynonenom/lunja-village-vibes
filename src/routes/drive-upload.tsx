import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import lunjaLogo from "@/assets/lunja-logo.png";
import { listDriveMedia, uploadDriveMedia, type DriveMedia } from "@/lib/drive-media";
import { folders } from "@/lib/drive-folders";

export const Route = createFileRoute("/drive-upload")({
  head: () => ({
    meta: [
      { title: "Lunja Drive · Déposer des médias" },
      { name: "description", content: "Ajoutez des photos et vidéos à la médiathèque Lunja Drive." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DriveUploadPage,
});

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-10 place-items-center overflow-hidden rounded-full border-2 border-ink bg-[#FFE600] sm:size-12">
        <img src={lunjaLogo} alt="" className="size-full object-cover" />
      </span>
      <span className="font-display text-2xl font-black uppercase leading-none sm:text-3xl">
        Lunja <span className="inline-block -rotate-1 bg-[#FFE600] px-1.5">Village</span>
      </span>
    </span>
  );
}

function FolderPanel({ folderSlug, folderName }: { folderSlug: string; folderName: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<DriveMedia[] | null>(null);

  const refresh = useCallback(() => {
    listDriveMedia({ data: folderSlug })
      .then(setItems)
      .catch((error) => {
        console.error(error);
        setItems([]);
      });
  }, [folderSlug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setBusy(true);
      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.set("folder", folderSlug);
          formData.set("file", file);
          await uploadDriveMedia({ data: formData });
        }
        refresh();
      } catch (error) {
        console.error(error);
        window.alert("L'envoi a échoué. Veuillez réessayer.");
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [folderSlug, refresh],
  );

  return (
    <div className="border-2 border-ink bg-white p-5 shadow-hard sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-2xl leading-none">{folderName}</h3>
        <span className="font-display text-xs font-bold uppercase text-ink/50">
          {items === null ? "…" : `${items.length} média${items.length > 1 ? "s" : ""}`}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="mt-4 flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-ink/30 py-10 text-center transition-colors hover:border-ink hover:bg-[#FFE600]/10 disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
        <span className="font-display text-sm font-black uppercase">{busy ? "Envoi…" : "Déposer des fichiers"}</span>
        <span className="text-xs text-ink/50">Images et vidéos, plusieurs fichiers possibles</span>
      </button>

      {items && items.length > 0 && (
        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {items.slice(0, 12).map((item) => (
            <div key={item.path} className="relative aspect-square overflow-hidden border border-ink/15 bg-ink/5">
              {item.type === "video" ? (
                <video src={item.url} className="size-full object-cover" muted playsInline preload="metadata" />
              ) : (
                <img src={item.url} alt={item.name} className="size-full object-cover" loading="lazy" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DriveUploadPage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="border-b-2 border-ink bg-white">
        <div className="mx-auto flex h-[4.5rem] max-w-4xl items-center justify-between px-4 sm:px-6">
          <Brand />
          <Link to="/lunja-drive" className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase text-ink/60 hover:text-[#c9971a]">
            <ArrowLeft className="size-4" /> Voir la médiathèque
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <span className="inline-block -rotate-2 bg-[#FFE600] px-2 py-0.5 font-script text-2xl text-neutral-900">espace équipe</span>
        <h1 className="mt-2 text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.85]">Déposer des médias</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
          Choisissez une catégorie et déposez vos photos ou vidéos. Elles apparaîtront immédiatement dans la médiathèque publique.
        </p>

        <div className="mt-10 flex items-center gap-2 border-2 border-ink bg-[#C8E420]/30 px-4 py-3 font-display text-xs font-bold uppercase">
          <CheckCircle2 className="size-4 shrink-0" /> Page interne — non listée publiquement
        </div>

        <div className="mt-8 grid gap-6">
          {folders.map((folder) => (
            <FolderPanel key={folder.slug} folderSlug={folder.slug} folderName={folder.name} />
          ))}
        </div>

        <a
          href="/lunja-drive"
          className="mt-10 inline-flex items-center gap-2 font-display text-sm font-black uppercase text-ink hover:text-[#c9971a]"
        >
          Retour à Lunja Drive <ArrowUpRight className="size-4" />
        </a>
      </main>
    </div>
  );
}
