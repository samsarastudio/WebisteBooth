"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Sparkles, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-bg-secondary/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 tracking-wide uppercase">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-semibold leading-tight mb-6">
            Let's Plan Your Event
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Fill out the form below and we'll get back to you within 24 hours with a custom proposal.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section bg-bg-primary">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12">
          {/* Form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="card p-10 text-center animate-fade-in">
                <CheckCircle2 size={48} className="text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-semibold mb-3">Proposal Sent!</h3>
                <p className="text-text-secondary mb-6">Thanks for reaching out. We'll review your event details and send a custom proposal within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", eventType: "", eventDate: "", guestCount: "", message: "" }); }} className="btn-secondary">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-text-secondary">Full Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-text-secondary">Email *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-text-secondary">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition" placeholder="(123) 456-7890" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-text-secondary">Event Type *</label>
                    <select name="eventType" required value={formData.eventType} onChange={handleChange} className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition">
                      <option value="">Select type...</option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="graduation">Graduation</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-text-secondary">Event Date *</label>
                    <input type="date" name="eventDate" required value={formData.eventDate} onChange={handleChange} className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-text-secondary">Guest Count</label>
                    <input type="number" name="guestCount" value={formData.guestCount} onChange={handleChange} className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition" placeholder="Approximate count" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text-secondary">Message</label>
                  <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition resize-none" placeholder="Tell us about your event — theme, venue, any special requests..."></textarea>
                </div>
                <button type="submit" className="btn-primary !w-full justify-center">
                  Get Your Proposal
                  <Sparkles size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-serif font-semibold mb-4">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-text-secondary">Email us anytime</p>
                    <a href="mailto:hello@frameflixstudio.com" className="text-accent hover:underline font-medium">hello@frameflixstudio.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-text-secondary">Call or text</p>
                    <a href="tel:+14165551234" className="text-accent hover:underline font-medium">(416) 555-1234</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-text-secondary">Based in</p>
                    <p className="font-medium">Toronto, ON — Serving GTA &amp; beyond</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-serif font-semibold mb-4">Response Time</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-accent" />
                  <span className="text-sm text-text-secondary">Proposals within <strong className="text-text-primary">24 hours</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-accent" />
                  <span className="text-sm text-text-secondary">Weekday replies within <strong className="text-text-primary">2 hours</strong></span>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-accent/5 border-accent/20">
              <h3 className="text-lg font-serif font-semibold mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Book 2-3 months ahead for weddings and peak season. We love last-minute requests too — just give us a call!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
