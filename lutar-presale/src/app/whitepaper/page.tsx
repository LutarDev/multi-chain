export default function WhitepaperPage() {
  return (
    <main className="prose prose-invert max-w-3xl">
      <h1>LUTAR Whitepaper</h1>
      <p>Download the LUTAR whitepaper.</p>
      <a
        className="inline-block mt-2 px-4 py-2 rounded bg-white/10 hover:bg-white/20"
        href="/whitepaper.pdf"
        download
      >
        Download PDF
      </a>
    </main>
  );
}

