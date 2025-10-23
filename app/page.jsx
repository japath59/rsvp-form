"use client";

import { useState } from "react";
import "./globals.css"; // make sure this is imported if not already

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    attending: true,
    guests: 0,
    message: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus("RSVP submitted! Thank you.");
        setForm({ name: "", email: "", attending: true, guests: 0, message: "" });
      } else {
        const data = await res.json();
        setStatus("Error: " + data.error);
      }
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="rsvp-container">
      <div className="rsvp-box">
        <h1 className="rsvp-title">RSVP</h1>
        <form onSubmit={handleSubmit} className="rsvp-form">
          <label>
            Name:
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Email:
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label className="checkbox">
            <input name="attending" type="checkbox" checked={form.attending} onChange={handleChange} />
            Attending
          </label>

          <label>
            Number of Guests:
            <input name="guests" type="number" min="0" value={form.guests} onChange={handleChange} />
          </label>

          <label>
            Message:
            <textarea name="message" value={form.message} onChange={handleChange} />
          </label>

          <button type="submit">Submit RSVP</button>
        </form>
        <p className="rsvp-status">{status}</p>
      </div>
    </div>
  );
}
