import { createFileRoute, Link } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowUpRight, Check, CheckCircle2, Loader2, Lock, LogOut, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import lunjaLogo from "@/assets/lunja-logo.png";
import magnifyingGlass from "@/assets/stickers/magnifying-glass.png";
import { deleteDriveMedia, listDriveMedia, uploadDriveMedia, type DriveMedia } from "@/lib/drive-media";
import { createFolder, deleteFolder, listFolders, renameFolder, type FolderDef } from "@/lib/drive-folders";
import { checkDriveSession, driveLogin, driveLogout } from "@/lib/drive-auth";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
};

const ConfirmContext = createContext<((options: ConfirmOptions) => Promise<boolean>) | null>(null);

function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error("useConfirm must be used within ConfirmProvider");
  return confirm;
}

function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<(ConfirmOptions & { resolve: (value: boolean) => void }) | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ ...options, resolve });
    });
  }, []);

  const close = useCallback(
    (value: boolean) => {
      state?.resolve(value);
      setState(null);
    },
    [state],
  );

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => event.target === event.currentTarget && close(false)}
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="text-xl leading-tight">{state.title}</h3>
                <p className="mt-1 text-sm text-ink/60">{state.message}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-full border border-black/10 px-4 py-2 font-display text-xs font-black uppercase text-ink/70 hover:bg-ink/5"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className="rounded-full bg-red-600 px-4 py-2 font-display text-xs font-black uppercase text-white hover:bg-red-700"
              >
                {state.confirmLabel ?? "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

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
    <span className="flex items-center gap-2 sm:gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-black/10 bg-[#FFE600] sm:size-10 md:size-12">
        <img src={lunjaLogo} alt="" className="size-full object-cover" />
      </span>
      <span className="whitespace-nowrap font-display text-base font-black uppercase leading-none sm:text-2xl md:text-3xl">
        Lunja <span className="inline-block -rotate-1 bg-[#FFE600] px-1.5 text-neutral-900">Village</span>
      </span>
    </span>
  );
}

function FolderNameEditor({ folder, onRenamed }: { folder: FolderDef; onRenamed: (name: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(folder.name);
  const [busy, setBusy] = useState(false);

  const save = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === folder.name) {
      setEditing(false);
      setValue(folder.name);
      return;
    }
    setBusy(true);
    try {
      await renameFolder({ data: { slug: folder.slug, name: trimmed } });
      onRenamed(trimmed);
      setEditing(false);
    } catch (error) {
      console.error(error);
      window.alert("Le renommage a échoué.");
    } finally {
      setBusy(false);
    }
  }, [value, folder.name, folder.slug, onRenamed]);

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") save();
            if (event.key === "Escape") {
              setValue(folder.name);
              setEditing(false);
            }
          }}
          disabled={busy}
          className="rounded-lg border border-black/15 px-2 py-1 text-2xl leading-none outline-none focus:border-ink"
        />
        <button type="button" onClick={save} disabled={busy} aria-label="Enregistrer" className="grid size-8 place-items-center rounded-full bg-[#FFE600] text-neutral-900 hover:bg-ink hover:text-[#FFE600]">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(folder.name);
            setEditing(false);
          }}
          aria-label="Annuler"
          className="grid size-8 place-items-center rounded-full border border-black/10 text-ink/60 hover:bg-ink/5"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setEditing(true)} className="group flex items-center gap-2 text-left">
      <h3 className="text-2xl leading-none">{folder.name}</h3>
      <Pencil className="size-3.5 text-ink/30 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

function MediaThumb({ item, onDeleted }: { item: DriveMedia; onDeleted: () => void }) {
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);

  const handleDelete = useCallback(async () => {
    const confirmed = await confirm({
      title: "Supprimer ce média ?",
      message: "Le fichier sera définitivement supprimé de la médiathèque.",
    });
    if (!confirmed) return;
    setBusy(true);
    try {
      await deleteDriveMedia({ data: item.path });
      onDeleted();
    } catch (error) {
      console.error(error);
      window.alert("La suppression a échoué.");
      setBusy(false);
    }
  }, [confirm, item.path, onDeleted]);

  return (
    <div className="group relative aspect-square overflow-hidden rounded-md border-2 border-white bg-ink/5 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.3)]">
      {item.type === "video" ? (
        <video src={item.url} className="size-full object-cover" muted playsInline preload="metadata" />
      ) : (
        <img src={item.url} alt={item.name} className="size-full object-cover" loading="lazy" />
      )}
      <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/30" />
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        aria-label="Supprimer ce média"
        className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-white/90 text-red-600 opacity-0 shadow transition-opacity group-hover:opacity-100 disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
      </button>
    </div>
  );
}

function FolderPanel({ folder, onRenamed, onDeleted }: { folder: FolderDef; onRenamed: (name: string) => void; onDeleted: () => void }) {
  const confirm = useConfirm();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [items, setItems] = useState<DriveMedia[] | null>(null);

  const refresh = useCallback(() => {
    listDriveMedia({ data: folder.slug })
      .then(setItems)
      .catch((error) => {
        console.error(error);
        setItems([]);
      });
  }, [folder.slug]);

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
          formData.set("folder", folder.slug);
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
    [folder.slug, refresh],
  );

  const handleDelete = useCallback(async () => {
    const count = items?.length ?? 0;
    const confirmed = await confirm({
      title: `Supprimer « ${folder.name} » ?`,
      message:
        count > 0
          ? `Cette catégorie et ${count} média${count > 1 ? "s" : ""} associé${count > 1 ? "s" : ""} seront définitivement supprimés.`
          : "Cette catégorie sera définitivement supprimée.",
    });
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteFolder({ data: folder.slug });
      onDeleted();
    } catch (error) {
      console.error(error);
      window.alert("La suppression a échoué.");
      setDeleting(false);
    }
  }, [confirm, folder.name, folder.slug, items, onDeleted]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_16px_36px_-20px_rgba(0,0,0,0.35)]">
      <div className={`h-2.5 w-full ${folder.tint}`} />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="font-script text-lg text-[#c9971a]">dossier</span>
            <FolderNameEditor folder={folder} onRenamed={onRenamed} />
          </div>
          <div className="flex items-center gap-2">
            <span className={`-rotate-2 rounded-full border border-black/10 px-2.5 py-1 font-display text-[11px] font-bold uppercase ${folder.tint}`}>
              {items === null ? "…" : `${items.length} média${items.length > 1 ? "s" : ""}`}
            </span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Supprimer la catégorie"
              className="grid size-8 place-items-center rounded-full text-ink/40 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            </button>
          </div>
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
          className="mt-4 flex w-full items-center gap-3 rounded-full border border-dashed border-ink/25 bg-neutral-50 px-5 py-3.5 text-left transition-colors hover:border-ink hover:bg-[#FFE600]/10 disabled:opacity-60"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          </span>
          <span>
            <span className="block font-display text-sm font-black uppercase">{busy ? "Envoi…" : "Déposer des fichiers"}</span>
            <span className="block text-xs text-ink/50">Images et vidéos, plusieurs à la fois</span>
          </span>
        </button>

        {items && items.length > 0 && (
          <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {items.map((item) => (
              <MediaThumb key={item.path} item={item} onDeleted={refresh} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NewFolderForm({ onCreated }: { onCreated: (folder: FolderDef) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      const formData = new FormData();
      formData.set("name", trimmed);
      if (coverFile) formData.set("cover", coverFile);
      const folder = await createFolder({ data: formData });
      onCreated(folder);
      setName("");
      setCoverFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setOpen(false);
    } catch (error) {
      console.error(error);
      window.alert("La création a échoué.");
    } finally {
      setBusy(false);
    }
  }, [name, coverFile, onCreated]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 rounded-3xl border border-dashed border-ink/25 py-8 font-display text-sm font-black uppercase text-ink/60 transition-colors hover:border-ink hover:bg-[#FFE600]/10 hover:text-ink"
      >
        <Plus className="size-5" /> Ajouter une catégorie
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_36px_-20px_rgba(0,0,0,0.35)]">
      <div className="h-2.5 w-full bg-[#FFE600]" />
      <div className="p-5 sm:p-6">
      <span className="font-script text-lg text-[#c9971a]">nouveau</span>
      <h3 className="text-xl leading-none">Nouvelle catégorie</h3>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nom de la catégorie"
          className="flex-1 rounded-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-ink"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-dashed border-black/20 px-4 py-2.5 font-display text-xs font-bold uppercase text-ink/60 hover:border-ink hover:text-ink"
        >
          <Upload className="size-4" />
          {coverFile ? coverFile.name : "Choisir une couverture (optionnel)"}
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={busy || !name.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-[#FFE600] px-5 py-2.5 font-display text-xs font-black uppercase text-neutral-900 hover:bg-ink hover:text-[#FFE600] disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Créer
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setName("");
            setCoverFile(null);
          }}
          className="rounded-full border border-black/10 px-5 py-2.5 font-display text-xs font-black uppercase text-ink/60 hover:bg-ink/5"
        >
          Annuler
        </button>
      </div>
      </div>
    </div>
  );
}

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async () => {
    if (!password) return;
    setBusy(true);
    setError(null);
    try {
      await driveLogin({ data: password });
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Mot de passe incorrect.");
    } finally {
      setBusy(false);
    }
  }, [password, onSuccess]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 text-ink">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center"><Brand /></div>
        <div className="rounded-2xl bg-white p-6 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.35)]">
          <div className="flex justify-center">
            <span className="grid size-12 place-items-center rounded-full bg-[#FFE600] text-neutral-900">
              <Lock className="size-5" />
            </span>
          </div>
          <h1 className="mt-4 text-center text-2xl leading-none">Accès équipe</h1>
          <p className="mt-2 text-center text-sm text-ink/60">Cette page contient des fichiers sensibles. Entrez le mot de passe pour continuer.</p>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submit()}
            placeholder="Mot de passe"
            className="mt-5 w-full rounded-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-ink"
          />
          {error && <p className="mt-2 text-center text-xs font-bold text-red-600">{error}</p>}
          <button
            type="button"
            onClick={submit}
            disabled={busy || !password}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#FFE600] px-5 py-2.5 font-display text-xs font-black uppercase text-neutral-900 hover:bg-ink hover:text-[#FFE600] disabled:opacity-50"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            Entrer
          </button>
        </div>
        <Link to="/lunja-drive" className="mt-6 flex items-center justify-center gap-2 font-display text-xs font-bold uppercase text-ink/50 hover:text-[#c9971a]">
          <ArrowLeft className="size-3.5" /> Retour à la médiathèque
        </Link>
      </div>
    </div>
  );
}

function DriveUploadPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [folders, setFolders] = useState<FolderDef[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    checkDriveSession()
      .then((result) => setAuthenticated(result.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    listFolders()
      .then(setFolders)
      .catch((error) => {
        console.error(error);
        setFolders([]);
      });
  }, [authenticated]);

  const handleLogout = useCallback(async () => {
    await driveLogout();
    setAuthenticated(false);
    setFolders(null);
  }, []);

  const handleRenamed = useCallback((slug: string, name: string) => {
    setFolders((prev) => prev?.map((f) => (f.slug === slug ? { ...f, name } : f)) ?? prev);
  }, []);

  const handleDeleted = useCallback((slug: string) => {
    setFolders((prev) => prev?.filter((f) => f.slug !== slug) ?? prev);
  }, []);

  const handleCreated = useCallback((folder: FolderDef) => {
    setFolders((prev) => [...(prev ?? []), folder]);
  }, []);

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-ink">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginGate onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <ConfirmProvider>
      <div className="min-h-screen bg-white text-ink">
        <header className="bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-6">
            <Brand />
            <div className="flex shrink-0 items-center gap-3 sm:gap-4">
              <Link to="/lunja-drive" className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase text-ink/60 hover:text-[#c9971a]">
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Voir la médiathèque</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Se déconnecter"
                className="grid size-9 place-items-center rounded-full text-ink/40 hover:bg-ink/5 hover:text-ink"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <span className="inline-block -rotate-2 bg-[#FFE600] px-2 py-0.5 font-script text-2xl text-neutral-900">espace équipe</span>
          <h1 className="mt-2 text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.85]">Déposer des médias</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
            Ajoutez, renommez ou supprimez des catégories, et déposez vos photos ou vidéos. Elles apparaissent immédiatement dans la médiathèque publique.
          </p>

          <div className="relative mt-10 inline-flex -rotate-1 items-center gap-2 bg-[#C8E420] px-4 py-2.5 font-display text-xs font-bold uppercase text-neutral-900 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.4)]">
            <CheckCircle2 className="size-4 shrink-0" /> Page interne — non listée publiquement
          </div>

          {folders === null ? (
            <div className="mt-10 flex items-center gap-3 text-ink/60"><Loader2 className="size-5 animate-spin" /> Chargement…</div>
          ) : (
            <>
              {folders.length > 1 && (
                <div className="relative mt-8 max-w-sm">
                  <img src={magnifyingGlass} alt="" className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Rechercher une catégorie…"
                    className="w-full rounded-full border border-black/15 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-ink"
                  />
                </div>
              )}

              <div className="mt-8 grid gap-6">
                {folders
                  .filter((folder) => folder.name.toLowerCase().includes(query.trim().toLowerCase()))
                  .map((folder) => (
                    <FolderPanel
                      key={folder.slug}
                      folder={folder}
                      onRenamed={(name) => handleRenamed(folder.slug, name)}
                      onDeleted={() => handleDeleted(folder.slug)}
                    />
                  ))}
                <NewFolderForm onCreated={handleCreated} />
              </div>
            </>
          )}

          <a
            href="/lunja-drive"
            className="mt-10 inline-flex items-center gap-2 font-display text-sm font-black uppercase text-ink hover:text-[#c9971a]"
          >
            Retour à Lunja Drive <ArrowUpRight className="size-4" />
          </a>
        </main>
      </div>
    </ConfirmProvider>
  );
}
