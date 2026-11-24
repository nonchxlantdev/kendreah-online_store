const REASONS = [
  {
    title: "Affordable by design",
    text: "Trendy style and practical home products priced for real everyday budgets.",
  },
  {
    title: "Quality you can feel good about",
    text: "Clothes, footwear and appliances chosen for look, usefulness and value.",
  },
  {
    title: "Shop from anywhere",
    text: "An online-only storefront — browse, save favourites and check out in USD.",
  },
  {
    title: "Belize & United States",
    text: "One brand serving customers in both markets with clear destination shipping.",
  },
];

export function WhyShop() {
  return (
    <section className="bg-warm-grey">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl">
            Why shop with Ken&apos; Dreah
          </h2>
          <p className="mt-3 text-muted">
            Accessible fashion, practical household products and international
            shipping — without the complicated retail experience.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className={`min-h-[160px] p-6 ${
                i % 2 === 0 ? "bg-soft-white" : "bg-pink-blush"
              }`}
            >
              <h3 className="font-serif text-xl">{r.title}</h3>
              <p className="mt-3 text-sm text-muted">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
