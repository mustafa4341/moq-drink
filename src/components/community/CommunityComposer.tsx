"use client";

/* ═══════════════════════════════════════════════════════════════
   CommunityComposer — the "leave a memory" box
   ───────────────────────────────────────────────────────────────
   Per the UX spec:
     • Calm white card, floating labels that lift on focus/value
     • Username (inline), Beach (native select), Message (textarea)
     • Live char counter (45 / 220), red when near limit
     • Submit button disabled until valid; soft glow when active
     • Submit lifecycle: idle → "Gönderiliyor..." → "✔ Paylaşıldı",
       then the form quietly clears (only the button reflects success)
   Inputs (BeachSelector / UsernameInput / MessageInput) are kept
   inline here per the agreed Hybrid structure — they're too small to
   warrant separate files until they grow.
   ═══════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Check, Loader2 } from "lucide-react";
import {
  type Beach,
  type NewPostInput,
  BEACHES,
  VALIDATION,
} from "@/types/community";
import {
  validateUsername,
  validateMessage,
} from "@/lib/community";
import type { AddPostResult } from "@/hooks/useCommunityFeed";

type SubmitState = "idle" | "submitting" | "success";

interface Props {
  addPost: (input: NewPostInput) => Promise<AddPostResult>;
  canPost: boolean;
  rateRemaining: number;
}

export default function CommunityComposer({ addPost, canPost, rateRemaining }: Props) {
  const [username, setUsername] = useState("");
  const [beach, setBeach] = useState<Beach>("Başiskele");
  const [text, setText] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const usernameErr = username.length > 0 ? validateUsername(username) : null;
  const messageErr = text.length > 0 ? validateMessage(text) : null;

  const isFormValid =
    !validateUsername(username) &&
    !validateMessage(text) &&
    BEACHES.includes(beach);

  const canSubmit = isFormValid && canPost && submitState !== "submitting";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setFormError(null);
    setSubmitState("submitting");
    const result = await addPost({ username, text, beach });
    if (!result.ok) {
      setFormError(result.error);
      setSubmitState("idle");
      return;
    }
    // Success: button briefly shows "Paylaşıldı", then reset quietly.
    setSubmitState("success");
    setText("");
    setTimeout(() => setSubmitState("idle"), 1500);
  }

  const charCount = text.length;
  const overLimit = charCount > VALIDATION.message.maxLength;

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white/85 backdrop-blur-sm
        border border-black/[0.06]
        rounded-[1.5rem] md:rounded-[1.75rem]
        shadow-[0_6px_30px_rgba(26,37,60,0.05)]
        p-5 md:p-7
        flex flex-col gap-4
      "
    >
      {/* Row 1: username (full-width) */}
      <div className="w-full">
        <FloatingField
          label="Kullanıcı adın"
          value={username}
          error={usernameErr}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={VALIDATION.username.maxLength}
            autoComplete="off"
            spellCheck={false}
            placeholder=" "
            className="peer w-full bg-transparent border-b-2 border-black/10 focus:border-brand-blue-text rounded-none pt-5 pb-1.5 text-sm text-brand-navy font-semibold focus:outline-none transition-colors"
          />
        </FloatingField>
      </div>

      {/* Message textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          maxLength={VALIDATION.message.maxLength + 20 /* let counter catch it */}
          placeholder="Bugün sahilde neler oldu? Belki güzel bir gün batımı, belki çok soğuk bir deniz, belki sadece güzel bir an..."
          className="
            w-full bg-brand-blue-bg/30 border border-black/[0.06] focus:border-brand-blue-text
            rounded-xl px-4 py-3 text-sm text-brand-navy font-medium leading-relaxed
            placeholder:text-brand-slate/50 placeholder:font-normal
            focus:outline-none focus:ring-2 focus:ring-brand-blue-text/15 transition-all resize-none
          "
        />
        {/* Char counter, bottom-right */}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[11px] text-brand-slate">
            {messageErr ? <span className="text-brand-red-text font-semibold">{messageErr}</span> : "Küçük bir anı bırak."}
          </span>
          <span
            className={[
              "text-[11px] font-bold tabular-nums",
              overLimit
                ? "text-brand-red-text"
                : charCount > VALIDATION.message.maxLength - 20
                ? "text-brand-orange-text"
                : "text-brand-slate",
            ].join(" ")}
          >
            {charCount} / {VALIDATION.message.maxLength}
          </span>
        </div>
      </div>

      {/* Submit + inline error / rate-limit notice */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className={[
            "inline-flex items-center justify-center gap-2",
            "px-6 py-3 rounded-full",
            "text-xs font-black tracking-widest uppercase cursor-pointer",
            "transition-all duration-[var(--duration-hover)] ease-moq",
            "w-full sm:w-auto",
            canSubmit
              ? "bg-brand-blue-text text-white hover:scale-[1.02] shadow-[0_0_24px_rgba(56,139,230,0.25)]"
              : "bg-brand-slate/20 text-brand-slate/50 cursor-not-allowed",
          ].join(" ")}
        >
          <SubmitContent state={submitState} />
        </button>

        <div className="min-h-[1.25rem] text-xs">
          <AnimatePresence mode="wait">
            {formError && (
              <motion.span
                key="err"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-brand-red-text font-semibold"
              >
                {formError}
              </motion.span>
            )}
            {!formError && !canPost && submitState === "idle" && (
              <motion.span
                key="rate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-brand-slate"
              >
                {rateRemaining > 0
                  ? `${rateRemaining} saniye sonra tekrar paylaşabilirsin.`
                  : ""}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}

/* ─── Submit button content by state ──────────────────────────── */

function SubmitContent({ state }: { state: SubmitState }) {
  if (state === "submitting")
    return (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        Gönderiliyor...
      </>
    );
  if (state === "success")
    return (
      <>
        <Check className="w-4 h-4" strokeWidth={3} />
        Paylaşıldı
      </>
    );
  return (
    <>
      Paylaş
      <Send className="w-4 h-4" />
    </>
  );
}

/* ─── Floating-label wrapper for the username input ──────────── */

function FloatingField({
  label,
  value,
  error,
  children,
}: {
  label: string;
  value: string;
  error: string | null;
  children: React.ReactNode;
}) {
  const lifted = value.length > 0;
  return (
    <div className="relative">
      <label
        className={[
          "absolute left-0 transition-all duration-200 origin-left pointer-events-none font-bold",
          lifted
            ? "top-0 text-[10px] text-brand-blue-text"
            : "top-5 text-xs text-brand-slate/70",
        ].join(" ")}
      >
        {label}
      </label>
      {children}
      {error && (
        <span className="block mt-1 text-[11px] text-brand-red-text font-semibold">
          {error}
        </span>
      )}
    </div>
  );
}
