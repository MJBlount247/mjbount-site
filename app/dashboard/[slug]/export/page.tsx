import Link from "next/link";
import { notFound } from "next/navigation";
import { getClient } from "@/lib/getClient";

export default async function ExportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let client;
  try {
    client = getClient(slug);
  } catch {
    notFound();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        fontFamily: "sans-serif",
      }}
    >
      <p style={{ fontSize: 13, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        Report builder
      </p>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>{client.client}</h1>
      <p style={{ opacity: 0.5, margin: 0 }}>
        PDF export coming soon — install{" "}
        <code style={{ background: "#222", padding: "2px 6px", borderRadius: 4 }}>
          @react-pdf/renderer
        </code>{" "}
        to build this out.
      </p>
      <Link
        href={`/dashboard/${slug}`}
        style={{ marginTop: 8, color: "#f59e0b", fontSize: 14 }}
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}
