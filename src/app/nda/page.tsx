import type { Metadata } from "next";
import Link from "next/link";
import {
  NDA_EFFECTIVE_LABEL,
  NDA_INTRO,
  NDA_SECTIONS,
  NDA_TITLE,
} from "@/data/demo-nda";

export const metadata: Metadata = {
  title: "Demo NDA",
  description:
    "Confidential Demonstration Non-Disclosure Agreement for the Ken' Dreah Online Store preview.",
};

export default function NdaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8 lg:py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pink">
        Legal · Demonstration
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-ink md:text-4xl">
        {NDA_TITLE}
      </h1>
      <p className="mt-2 text-xs uppercase tracking-wider text-muted">
        {NDA_EFFECTIVE_LABEL}
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink">
        <p className="rounded border border-border bg-pink-blush/60 p-4 text-muted">
          This page publishes the same Non-Disclosure Agreement presented at
          demo access. It is a draft for presentation and evaluation. Have
          qualified counsel review before relying on it as a production legal
          instrument.
        </p>
        <p>{NDA_INTRO}</p>
        {NDA_SECTIONS.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider">
              {section.heading}
            </h2>
            <p className="mt-2 text-muted">{section.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm">
        <Link href="/" className="font-semibold text-pink hover:underline">
          ← Back to storefront
        </Link>
      </p>
    </div>
  );
}
