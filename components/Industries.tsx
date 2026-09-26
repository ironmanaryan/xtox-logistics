const industries = [
  "🏭 Manufacturing",
  "🛒 Retail & FMCG",
  "🌾 Agri & Spices",
  "🧱 Building Materials",
  "💊 Pharma",
  "🧵 Textiles",
  "⚙️ Auto Components",
  "📱 Electronics",
  "🪑 Furniture",
  "📦 E-commerce",
];

export default function Industries() {
  const row = [...industries, ...industries];
  return (
    <section id="industries" className="overflow-hidden border-y border-line py-10">
      <p className="eyebrow section-pad mb-6">Industries we serve</p>
      <div className="relative">
        <div className="flex w-max animate-marquee gap-4">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap rounded-full border border-line bg-white px-6 py-2.5 text-sm font-semibold shadow-card"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
