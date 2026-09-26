import Link from "next/link";

export default function ServiceCtaBand({
  message,
}: {
  message: string;
}) {
  return (
    <section className="section-pad pb-20">
      <div className="flex flex-col items-center justify-between gap-5 rounded-3xl border border-line bg-white p-8 shadow-card sm:flex-row sm:p-10">
        <div>
          <h3 className="text-xl font-extrabold sm:text-2xl">{message}</h3>
          <p className="mt-1.5 text-sm text-muted">
            Average response time: under 2 business hours.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="#cta" className="btn-primary">Get a Quote</a>
          <Link href="/drivers" className="btn-secondary">Drive with us</Link>
        </div>
      </div>
    </section>
  );
}
