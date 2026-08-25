import Link from "next/link";

export default function ModuleNotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-foreground">
        No such module
      </h1>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
        That module does not exist - or has not shipped yet. The full list of
        live modules is one click away.
      </p>
      <Link
        href="/curriculum"
        className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
      >
        Browse the curriculum
      </Link>
    </div>
  );
}
