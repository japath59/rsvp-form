"use client"; // client-side component

import { useState } from "react";

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
    <div style={{ maxWidth: "500px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Wedding RSVP</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:<br />
          <input name="name" value={form.name} onChange={handleChange} required />
        </label><br /><br />
        <label>
          Email:<br />
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label><br /><br />
        <label>
          Attending:<br />
          <input name="attending" type="checkbox" checked={form.attending} onChange={handleChange} />
        </label><br /><br />
        <label>
          Number of Guests:<br />
          <input name="guests" type="number" min="0" value={form.guests} onChange={handleChange} />
        </label><br /><br />
        <label>
          Message:<br />
          <textarea name="message" value={form.message} onChange={handleChange} />
        </label><br /><br />
        <button type="submit">Submit RSVP</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
