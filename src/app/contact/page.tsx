import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand/logo";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Ken' Dreah Online Store. Send a message about orders, shipping or products. WhatsApp, phone, email and social channels to be confirmed before launch.",
};

const CHANNELS = [
  { label: "WhatsApp", value: "[To be confirmed]" },
  { label: "Phone", value: "[To be confirmed]" },
  { label: "Email", value: "[To be confirmed]" },
  { label: "Social", value: "[To be confirmed]" },
];

export default function ContactPage() {
  return (
    <main>
      <section className="border-b border-border bg-warm-grey">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
            Get in touch
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
            Contact
          </h1>
          <p className="mt-5 max-w-2xl text-muted">
            Questions about products, shipping destinations or the planned 2027
            launch? Send a message below. Direct channels will be confirmed
            before we go live.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Send a message
            </h2>
            <p className="mt-2 text-sm text-muted">
              Demo form only — submissions are not delivered or stored.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-3 lg:col-span-5">
            <div className="flex justify-center bg-ink p-8">
              <BrandLogo href={null} size="md" inverted showTagline />
            </div>

            <div className="bg-soft-white p-6 ring-1 ring-border">
              <h2 className="font-display text-xl text-ink">Direct channels</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {CHANNELS.map((channel) => (
                  <li
                    key={channel.label}
                    className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-ink">{channel.label}</span>
                    <span className="text-muted">{channel.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-pink-blush p-6">
              <h2 className="font-display text-xl text-ink">Business hours</h2>
              <p className="mt-3 text-sm text-muted">
                [To be confirmed]
              </p>
              <p className="mt-4 text-xs text-muted">
                Based in the United States · Shipping to Belize &amp; USA ·
                Currency USD
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
