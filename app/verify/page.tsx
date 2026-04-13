"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

type VerifyState =
  | { status: "loading" }
  | { status: "success"; name: string }
  | { status: "error"; message: string };

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      setState({
        status: "error",
        message: "Kein Verifizierungstoken in der URL gefunden.",
      });
      return;
    }

    async function verify() {
      try {
        const response = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          const message =
            data?.error || "Bitte versuche es später erneut.";
          setState({ status: "error", message });
          return;
        }

        const data = await response.json();
        setState({ status: "success", name: data.name || "Benutzer" });
      } catch {
        setState({
          status: "error",
          message: "Netzwerkfehler. Bitte versuche es später erneut.",
        });
      }
    }

    verify();
  }, [token]);

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
        Academy Consult Challenge
      </h1>

      <div className="mt-6">
        {state.status === "loading" && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white" />
            <span className="ml-4 text-xl">
              Verifiziere deine Email...
            </span>
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
                Email erfolgreich verifiziert
              </p>
            </div>
            <p className="mt-3 text-lg">
              Hey {state.name},<br />
              wir wünschen dir viel Erfolg beim Gewinnspiel!
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
              <p className="text-xl font-semibold">
                {token
                  ? "Fehler bei der Verifizierung"
                  : state.message}
              </p>
            </div>
            {token && (
              <p className="mt-3 text-lg">{state.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
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
          <VerifyContent />
        </Suspense>
      </section>
    </main>
  );
}
