"use client";
import { useState, type FormEvent } from "react";

type Fields = { name: string; email: string; question: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(v: Fields): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email address.";
  if (v.question.trim().length < 10) e.question = "Tell us a bit more (at least 10 characters).";
  return e;
}

export function ContactForm() {
  const [values, setValues] = useState<Fields>({ name: "", email: "", question: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof Fields) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 700)); // mock request: no backend required
    setStatus("sent");
    setValues({ name: "", email: "", question: "" });
  }

  const input =
    "mt-2 w-full rounded-md border border-black/5 bg-cream px-4 py-3 text-sm placeholder:text-ink/40 aria-[invalid=true]:border-red-500";
  const field = (id: keyof Fields, label: string, ph: string, type = "text") => (
    <div className="mt-5 first:mt-0">
      <label htmlFor={id} className="text-xs font-bold">
        {label}
      </label>
      {id === "question" ? (
        <textarea
          id={id}
          rows={4}
          value={values[id]}
          onChange={set(id)}
          placeholder={ph}
          aria-invalid={!!errors[id]}
          aria-describedby={errors[id] ? `${id}-err` : undefined}
          className={`${input} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          autoComplete={id === "name" ? "name" : "email"}
          value={values[id]}
          onChange={set(id)}
          placeholder={ph}
          aria-invalid={!!errors[id]}
          aria-describedby={errors[id] ? `${id}-err` : undefined}
          className={input}
        />
      )}
      {errors[id] && (
        <p id={`${id}-err`} className="mt-1 text-xs text-red-600">
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
      <h3 className="text-base font-bold">Contact us</h3>
      <p className="mb-6 mt-1 text-xs text-ink/60">Fill out the fields and we will get in touch.</p>
      {field("name", "Full name", "Your name")}
      {field("email", "Email", "youremail@example.com", "email")}
      {field("question", "Your question", "Tell us how we can help...")}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-md bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2340d8] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-xs text-emerald-700">
        {status === "sent" && "Thanks! We’ll reply within 24 hours on business days."}
      </p>
    </form>
  );
}
