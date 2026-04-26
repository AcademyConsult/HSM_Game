"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

type UnsubscribeState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; name: string; alreadyUnsubscribed: boolean }
  | { status: "error"; message: string };

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const token = searchParams.get("token");
  const [state, setState] = useState<UnsubscribeState>({ status: "idle" });

  const missingParams = !id || !token;

  async function handleUnsubscribe() {
    if (missingParams) return;

    setState({ status: "submitting" });

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, token }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.error || "Bitte versuche es später erneut.";
        setState({ status: "error", message });
        return;
      }

      const data = await response.json();
      setState({
        status: "success",
        name: data.name || "Benutzer",
        alreadyUnsubscribed: Boolean(data.alreadyUnsubscribed),
      });
    } catch {
      setState({
        status: "error",
        message: "Netzwerkfehler. Bitte versuche es später erneut.",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-24 text-white text-center">
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://spreadly.app/storage/view/-/984a834393716c80e787b227b43cfbe2/avatars/28/TiugXb12LRXMJmTEvyHSDxOH09U0rK0wv3D1OEPB.png"
          alt="Academy Consult Logo"
          className="h-32 md:h-48 w-auto mb-6"
        />
      </div>

      <h1 className="text-4xl md:text-6xl font-bold">
        Newsletter abbestellen
      </h1>

      <div className="mt-6">
        {missingParams && (
          <div className="bg-red-600 text-white p-6 rounded shadow-lg max-w-md mx-auto mt-8 text-center">
            <p className="text-xl font-semibold">
              Ungültiger Abmeldelink
            </p>
            <p className="mt-3 text-lg">
              Der Link ist unvollständig. Bitte verwende den Link aus deiner E-Mail.
            </p>
          </div>
        )}

        {!missingParams && (state.status === "idle" || state.status === "submitting") && (
          <div className="bg-white/10 backdrop-blur-sm text-white p-6 rounded shadow-lg max-w-md mx-auto mt-8 text-center">
            <p className="text-lg">
              Möchtest du dich wirklich vom Newsletter abmelden?
              <br />
              Du erhältst dann keine weiteren E-Mails von uns.
            </p>
            <button
              type="button"
              onClick={handleUnsubscribe}
              disabled={state.status === "submitting"}
              className="mt-6 inline-flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              {state.status === "submitting" ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-3" />
                  Wird abgemeldet...
                </>
              ) : (
                "Newsletter abbestellen"
              )}
            </button>
          </div>
        )}

        {state.status === "success" && (
          <div className="bg-green-600 text-white p-6 rounded shadow-lg max-w-md mx-auto mt-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-xl font-semibold">
                {state.alreadyUnsubscribed
                  ? "Bereits abgemeldet"
                  : "Erfolgreich abgemeldet"}
              </p>
            </div>
            <p className="mt-3 text-lg">
              Hey {state.name},<br />
              {state.alreadyUnsubscribed
                ? "du bist bereits vom Newsletter abgemeldet."
                : "du wurdest erfolgreich vom Newsletter abgemeldet."}
            </p>
          </div>
        )}

        {state.status === "error" && (
          <div className="bg-red-600 text-white p-6 rounded shadow-lg max-w-md mx-auto mt-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p className="text-xl font-semibold">Fehler bei der Abmeldung</p>
            </div>
            <p className="mt-3 text-lg">{state.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <main className="min-h-screen">
      <section
        className="h-screen relative flex items-center"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-24 text-white text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white" />
              </div>
            </div>
          }
        >
          <UnsubscribeContent />
        </Suspense>
      </section>
    </main>
  );
}
