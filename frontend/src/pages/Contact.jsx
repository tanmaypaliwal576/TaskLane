import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { contact } from "../utils/api";
import toast from "react-hot-toast";
const Contact = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });


  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     await contact(form);

      setForm({
        name: "",
        email: "",
        message: "",
      });
        toast.success("Message sent successfully");
    } catch (err) {
     toast.error("Failed to send message");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-[#0A0F1E] border border-white/10 rounded-2xl p-8">
        
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-white/50 mt-1">
            Have a question or feedback? We’d love to hear from you.
          </p>
        </div>

       

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-white/60">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full bg-[#0F162B] border border-white/10 rounded-xl px-4 py-3 outline-none"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm text-white/60">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full bg-[#0F162B] border border-white/10 rounded-xl px-4 py-3 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-white/60">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="mt-1 w-full bg-[#0F162B] border border-white/10 rounded-xl px-4 py-3 outline-none resize-none"
              placeholder="Write your message..."
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 disabled:opacity-60"
            >
        Submit
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-white/15 text-white/70 hover:bg-white/5"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
