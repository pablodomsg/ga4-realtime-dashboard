import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-slate-500">GA4 Realtime Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
          Dashboard online para Google Analytics 4
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          Visualiza actividad realtime y datos historicos desde Google Analytics
          Data API, sin CSVs ni edicion manual de graficas.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Abrir dashboard
        </Link>
      </section>
    </main>
  );
}
