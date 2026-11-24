"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSuccess(true);
    setEmail("");
  };

  return (
    <section className="bg-pink-blush">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl md:text-4xl">
            Get on the list.
          </h2>
          <p className="mt-3 text-[13px] text-muted sm:text-sm md:text-base">
            Be the first to discover new arrivals, exclusive offers and
            everything Ken&apos; Dreah. Demo subscription — no emails are sent.
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="mx-auto mt-6 flex max-w-xl flex-col gap-2 sm:mt-8 sm:flex-row"
          noValidate
        >
          <div className="flex-1">
            <Label htmlFor="newsletter-email" className="sr-only">
              Email
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="h-12 border-border bg-white text-base"
              style={{ fontSize: "16px" }}
              aria-invalid={Boolean(error)}
            />
          </div>
          <Button type="submit" variant="pink" className="h-12 w-full px-8 sm:w-auto">
            Subscribe
          </Button>
        </form>
        {error && (
          <p className="mt-3 text-center text-sm text-danger">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-center text-sm text-ink">
            You&apos;re on the demo list. No actual email was sent.
          </p>
        )}
      </div>
    </section>
  );
}
