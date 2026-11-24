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

type GatePhase = "checking" | "gate" | "welcome" | "clearing" | "done";

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
    const ms = reduce ? 700 : 1600;
    const id = window.setTimeout(() => setPhase("clearing"), ms);
    return () => window.clearTimeout(id);
  }, [phase, reduce]);

  useEffect(() => {
    if (phase !== "clearing") return;
    const ms = reduce ? 250 : 900;
    const id = window.setTimeout(() => setPhase("done"), ms);
    return () => window.clearTimeout(id);
  }, [phase, reduce]);

  useEffect(() => {
    if (phase !== "gate" && phase !== "welcome" && phase !== "clearing") return;

    const { body, documentElement } = document;
    const scrollY = window.scrollY;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
      touchAction: body.style.touchAction,
    };
    const scrollbarGap = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.touchAction = "none";
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.paddingRight = previous.paddingRight;
      body.style.touchAction = previous.touchAction;
      window.scrollTo(0, scrollY);
    };
  }, [phase]);

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

  if (phase === "checking" || phase === "done") return null;

  const showOverlay =
    phase === "gate" || phase === "welcome" || phase === "clearing";

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          key="overlay-shell"
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4 md:p-6"
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingTop: "env(safe-area-inset-top)",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "clearing" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduce ? 0.2 : phase === "clearing" ? 0.85 : 0.4,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute inset-0 bg-ink backdrop-blur-[2px]"
            initial={false}
            animate={{
              opacity: phase === "clearing" ? 0 : 0.78,
            }}
            transition={{
              duration: reduce ? 0.2 : phase === "clearing" ? 0.85 : 0.35,
              ease: "easeInOut",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <AnimatePresence mode="wait">
            {phase === "gate" && (
              <motion.div
                key="dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="demo-gate-title"
                className="relative z-10 flex max-h-[min(100dvh,100svh)] w-full max-w-lg flex-col overflow-hidden border-border bg-white shadow-2xl max-sm:rounded-t-2xl max-sm:border-t sm:max-h-[min(90dvh,720px)] sm:border md:max-w-xl"
                initial={
                  reduce
                    ? false
                    : { opacity: 0, y: 28, scale: 0.99 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -12,
                  scale: 0.98,
                  transition: {
                    duration: reduce ? 0.15 : 0.4,
                    ease: "easeInOut",
                  },
                }}
                transition={{ duration: 0.35 }}
              >
                <div className="shrink-0 border-b border-border bg-pink px-4 py-3.5 text-white sm:px-5 sm:py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 sm:text-[11px] sm:tracking-[0.18em]">
                    Confidential preview
                  </p>
                  <h2
                    id="demo-gate-title"
                    className="mt-1 font-display text-lg font-extrabold uppercase leading-tight tracking-tight sm:text-xl md:text-2xl"
                  >
                    Demo only — not a finished product
                  </h2>
                </div>

                <div className="min-h-0 flex-1 space-y-3.5 overflow-y-auto overscroll-contain px-4 py-4 text-[13px] leading-relaxed text-ink sm:space-y-4 sm:px-5 sm:py-5 sm:text-sm [-webkit-overflow-scrolling:touch]">
                  <p>
                    This Ken&apos; Dreah Online Store website is a{" "}
                    <strong>demonstration / concept preview</strong> prepared
                    for evaluation purposes. It is{" "}
                    <strong>not a finished commercial product</strong>, not a
                    live store, and not an offer to sell goods.
                  </p>
                  <ul className="list-disc space-y-1.5 pl-5 text-muted">
                    <li>
                      Products, prices, and stock are illustrative sample data.
                    </li>
                    <li>
                      Payments are simulated — no real charges are processed.
                    </li>
                    <li>
                      Policies, shipping, and timelines are placeholders.
                    </li>
                    <li>
                      Design, code, and content remain confidential proprietary
                      materials.
                    </li>
                  </ul>
                  <p className="text-muted">
                    By selecting <strong>I Accept</strong>, you acknowledge the
                    demo status above and agree to the{" "}
                    <button
                      type="button"
                      className="min-h-11 font-semibold text-pink underline-offset-2 hover:underline sm:min-h-0"
                      onClick={() => setShowNda((v) => !v)}
                    >
                      Non-Disclosure Agreement
                    </button>
                    , including obligations against unauthorised copying,
                    plagiarism, and misuse of these materials.
                  </p>

                  {showNda && (
                    <div className="max-h-[28vh] space-y-3 overflow-y-auto overscroll-contain border border-border bg-off-white p-3 text-[11px] leading-relaxed text-muted sm:max-h-48 sm:text-xs md:max-h-56">
                      <p className="font-display text-[11px] font-bold uppercase tracking-wider text-ink">
                        {NDA_TITLE}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider">
                        {NDA_EFFECTIVE_LABEL}
                      </p>
                      <p>{NDA_INTRO}</p>
                      {NDA_SECTIONS.map((section) => (
                        <div key={section.heading}>
                          <p className="font-semibold text-ink">
                            {section.heading}
                          </p>
                          <p className="mt-1">{section.body}</p>
                        </div>
                      ))}
                      <p>
                        Full text also available at{" "}
                        <Link
                          href="/nda"
                          className="inline-flex min-h-10 items-center text-pink hover:underline"
                        >
                          /nda
                        </Link>
                        .
                      </p>
                    </div>
                  )}

                  <label className="flex cursor-pointer items-start gap-3 border border-border p-3.5 sm:p-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-5 w-5 shrink-0 accent-pink sm:h-4 sm:w-4"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <span className="text-[13px] leading-snug sm:text-sm">
                      I understand this is a demo only, and I agree to the NDA
                      (confidentiality, IP ownership, and anti-plagiarism
                      terms).
                    </span>
                  </label>
                </div>

                <div className="shrink-0 border-t border-border bg-off-white px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 w-full sm:h-11 sm:w-auto"
                      onClick={decline}
                    >
                      Decline
                    </Button>
                    <Button
                      type="button"
                      variant="pink"
                      disabled={!acceptedTerms}
                      className={cn(
                        "h-12 w-full sm:h-11 sm:w-auto",
                        !acceptedTerms && "opacity-50"
                      )}
                      onClick={accept}
                    >
                      I Accept
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {(phase === "welcome" || phase === "clearing") && (
              <motion.p
                key="welcome"
                className="pointer-events-none relative z-10 px-4 text-center font-display text-[clamp(1.75rem,8vw,3.75rem)] font-extrabold uppercase tracking-tight text-white"
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity: phase === "clearing" ? 0 : 1,
                  y: phase === "clearing" ? -10 : 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  transition: { duration: reduce ? 0.12 : 0.4 },
                }}
                transition={{ duration: reduce ? 0.15 : 0.45 }}
              >
                Welcome
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
