"use client";
import { useState } from "react";

export default function RSVPForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    attending: true,
    guests: 1,
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setSubmitted(true);
  };

  if (submitted) return <p>🎉 Thank you for RSVPing!</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-2 max-w-md mx-auto">
      <input placeholder="Name" required onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" type="email" required onChange={e => setForm({ ...form, email: e.target.value })} />
      <label>
        Attending?
        <input type="checkbox" checked={form.attending} onChange={e => setForm({ ...form, attending: e.target.checked })} />
      </label>
      <input type="number" min="1" placeholder="Number of guests" onChange={e => setForm({ ...form, guests: e.target.value })} />
      <textarea placeholder="Message" onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
      <button type="submit" className="bg-pink-500 text-white p-2 rounded">Submit RSVP</button>
    </form>
  );
}
