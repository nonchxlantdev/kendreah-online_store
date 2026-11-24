import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Delivery & Returns",
  description:
    "Shipping to Belize and the United States from Ken' Dreah Online Store. Final rates, timelines, returns and warranty details will be confirmed before launch.",
};

const PLACEHOLDER =
  "[To be confirmed — final details before launch]";

export default function DeliveryReturnsPage() {
  return (
    <main>
      <section className="border-b border-border bg-warm-grey">
        <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4 sm:py-14 lg:px-8 lg:py-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted sm:text-xs">
            Help
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl text-ink sm:mt-4 sm:text-4xl md:text-5xl">
            Delivery &amp; returns
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted sm:mt-5 sm:text-base">
            Ken&apos; Dreah Online Store ships to Belize and the United States.
            The sections below outline how delivery and returns will work.
            Specific rates, timelines and policy wording remain placeholders
            until they are finalized for launch.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4 sm:py-14 lg:px-8 lg:py-16">
        <div className="mb-6 max-w-2xl sm:mb-10">
          <h2 className="font-display text-2xl text-ink sm:text-3xl md:text-4xl">
            Shipping destinations
          </h2>
          <p className="mt-3 text-muted">
            We serve two markets from our US-based, online-only storefront.
            Orders are priced and paid in USD.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <article className="border border-border bg-soft-white p-6 md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-pink">
              Destination
            </p>
            <h3 className="mt-3 font-display text-2xl text-ink">Belize</h3>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-ink">Shipping rates</dt>
                <dd className="mt-1 text-muted">{PLACEHOLDER}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Estimated timelines</dt>
                <dd className="mt-1 text-muted">{PLACEHOLDER}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Customs &amp; duties</dt>
                <dd className="mt-1 text-muted">{PLACEHOLDER}</dd>
              </div>
            </dl>
          </article>

          <article className="border border-border bg-soft-white p-6 md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-pink">
              Destination
            </p>
            <h3 className="mt-3 font-display text-2xl text-ink">
              United States
            </h3>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-ink">Shipping rates</dt>
                <dd className="mt-1 text-muted">{PLACEHOLDER}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Estimated timelines</dt>
                <dd className="mt-1 text-muted">{PLACEHOLDER}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Fulfillment notes</dt>
                <dd className="mt-1 text-muted">{PLACEHOLDER}</dd>
              </div>
            </dl>
          </article>
        </div>

        <p className="mt-6 border border-dashed border-border bg-warm-grey px-4 py-3 text-sm text-muted">
          Demo checkout rates shown elsewhere on this site are illustrative only
          and are not final shipping pricing.
        </p>
      </section>

      <section className="bg-warm-grey">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-16 lg:grid-cols-2 lg:px-8">
          <article className="bg-soft-white p-6 md:p-8">
            <h2 className="font-display text-2xl text-ink">Returns</h2>
            <p className="mt-4 text-sm text-muted">
              Our returns policy — including eligibility, windows, condition
              requirements and how to start a return — will be published here
              before launch.
            </p>
            <p className="mt-4 text-sm font-medium text-ink">{PLACEHOLDER}</p>
          </article>

          <article className="bg-soft-white p-6 md:p-8">
            <h2 className="font-display text-2xl text-ink">Warranty</h2>
            <p className="mt-4 text-sm text-muted">
              Product warranty coverage, if any, will vary by category and will
              be confirmed with final product and supplier details.
            </p>
            <p className="mt-4 text-sm font-medium text-ink">{PLACEHOLDER}</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-8 border border-border bg-soft-white p-6 md:grid-cols-12 md:p-10">
          <div className="md:col-span-8">
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Questions about an order?
            </h2>
            <p className="mt-3 text-muted">
              Until final delivery and returns details are published, reach out
              through our contact page. We will confirm the latest information
              as it becomes available ahead of the 2027 launch.
            </p>
          </div>
          <div className="flex items-end md:col-span-4 md:justify-end">
            <Button asChild variant="default">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
