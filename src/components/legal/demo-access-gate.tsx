"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  NDA_EFFECTIVE_LABEL,
  NDA_INTRO,
  NDA_SECTIONS,
  NDA_TITLE,
} from "@/data/demo-nda";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kendreah-demo-nda-accepted";

type GatePhase = "checking" | "gate" | "welcome" | "done";

export function DemoAccessGate() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<GatePhase>("checking");
  const [showNda, setShowNda] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      setPhase(saved === "1" ? "done" : "gate");
    } catch {
      setPhase("gate");
    }
  }, []);

  useEffect(() => {
    if (phase !== "welcome") return;
    const ms = reduce ? 500 : 1800;
    const id = window.setTimeout(() => setPhase("done"), ms);
    return () => window.clearTimeout(id);
  }, [phase, reduce]);

  const accept = () => {
    if (!acceptedTerms) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* demo continues even if storage is blocked */
    }
    setPhase("welcome");
  };

  const decline = () => {
    window.location.href =
      "https://github.com/nonchxlantdev/kendreah-online_store";
  };

  if (phase === "checking") return null;

  return (
    <AnimatePresence mode="wait">
      {phase === "gate" && (
        <motion.div
          key="gate"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: reduce ? 0.15 : 0.55, ease: "easeInOut" },
          }}
        >
          <div className="absolute inset-0 bg-ink/75 backdrop-blur-[2px]" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-gate-title"
            className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-lg flex-col overflow-hidden border border-border bg-white shadow-2xl"
            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <div className="border-b border-border bg-pink px-5 py-4 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                Confidential preview
              </p>
              <h2
                id="demo-gate-title"
                className="mt-1 font-display text-xl font-extrabold uppercase tracking-tight"
              >
                Demo only — not a finished product
              </h2>
            </div>

            <div className="space-y-4 overflow-y-auto px-5 py-5 text-sm text-ink">
              <p>
                This Ken&apos; Dreah Online Store website is a{" "}
                <strong>demonstration / concept preview</strong> prepared for
                evaluation purposes. It is{" "}
                <strong>not a finished commercial product</strong>, not a live
                store, and not an offer to sell goods.
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-muted">
                <li>Products, prices, and stock are illustrative sample data.</li>
                <li>Payments are simulated — no real charges are processed.</li>
                <li>Policies, shipping, and timelines are placeholders.</li>
                <li>
                  Design, code, and content remain confidential proprietary
                  materials.
                </li>
              </ul>
              <p className="text-muted">
                By selecting <strong>I Accept</strong>, you acknowledge the demo
                status above and agree to the{" "}
                <button
                  type="button"
                  className="font-semibold text-pink underline-offset-2 hover:underline"
                  onClick={() => setShowNda((v) => !v)}
                >
                  Non-Disclosure Agreement
                </button>
                , including obligations against unauthorised copying, plagiarism,
                and misuse of these materials.
              </p>

              {showNda && (
                <div className="max-h-48 space-y-3 overflow-y-auto border border-border bg-off-white p-3 text-xs leading-relaxed text-muted">
                  <p className="font-display text-[11px] font-bold uppercase tracking-wider text-ink">
                    {NDA_TITLE}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider">
                    {NDA_EFFECTIVE_LABEL}
                  </p>
                  <p>{NDA_INTRO}</p>
                  {NDA_SECTIONS.map((section) => (
                    <div key={section.heading}>
                      <p className="font-semibold text-ink">{section.heading}</p>
                      <p className="mt-1">{section.body}</p>
                    </div>
                  ))}
                  <p>
                    Full text also available at{" "}
                    <Link href="/nda" className="text-pink hover:underline">
                      /nda
                    </Link>
                    .
                  </p>
                </div>
              )}

              <label className="flex cursor-pointer items-start gap-3 border border-border p-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-pink"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="text-sm leading-snug">
                  I understand this is a demo only, and I agree to the NDA
                  (confidentiality, IP ownership, and anti-plagiarism terms).
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-2 border-t border-border bg-off-white px-5 py-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={decline}>
                Decline
              </Button>
              <Button
                type="button"
                variant="pink"
                disabled={!acceptedTerms}
                className={cn(!acceptedTerms && "opacity-50")}
                onClick={accept}
              >
                I Accept
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {phase === "welcome" && (
        <motion.div
          key="welcome"
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-ink/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: reduce ? 0.15 : 0.5, ease: "easeOut" },
          }}
          transition={{ duration: reduce ? 0.15 : 0.4 }}
        >
          <motion.p
            className="font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0.15 : 0.45, delay: reduce ? 0 : 0.1 }}
          >
            Welcome
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
