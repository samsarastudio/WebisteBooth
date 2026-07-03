import Link from "next/link";
import { Camera, Image as ImageIcon, Download } from "lucide-react";

const galleryItems = [
  { title: "Sarah & David's Wedding", category: "Wedding", color: "#f3e8df", emoji: "💒" },
  { title: "TechCorp Annual Gala", category: "Corporate", color: "#dbeafe", emoji: "🏢" },
  { title: "Emma's Sweet 16", category: "Birthday", color: "#fce7f3", emoji: "🎂" },
  { title: "Johnson Family Reunion", category: "Family", color: "#d1fae5", emoji: "👨‍👩‍👧‍👦" },
  { title: "Mia's Baptism Party", category: "Birthday", color: "#fef3c7", emoji: "✨" },
  { title: "Maple Leaf Gala 2025", category: "Corporate", color: "#e0e7ff", emoji: "🍁" },
  { title: "Carlos & Ana's Reception", category: "Wedding", color: "#fee2e2", emoji: "💐" },
  { title: "Graduation Bash - Class of '25", category: "Graduation", color: "#e0f2fe", emoji: "🎓" },
  { title: "Baby Noah's First Birthday", category: "Birthday", color: "#fef9c3", emoji: "🧸" },
  { title: "Riverdale High Reunion", category: "Corporate", color: "#ede9fe", emoji: "🎉" },
  { title: "Priya & Arjun's Sangeet", category: "Wedding", color: "#ffedd5", emoji: "🪔" },
  { title: "Charity Fundraiser Night", category: "Corporate", color: "#ccfbf1", emoji: "❤️" },
];

export default function Gallery() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-bg-secondary/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 tracking-wide uppercase">Gallery</span>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-semibold leading-tight mb-6">
            Real Frames, Real Events
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Every frame tells a story. Here are some of our favorites from events across Ontario.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-bg-primary border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
          {["All", "Wedding", "Corporate", "Birthday", "Graduation"].map((filter) => (
            <button key={filter} className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border ${filter === "All" ? "bg-accent text-white border-accent" : "border-border hover:border-accent hover:text-accent"}`}>
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="section bg-bg-primary">
        <div className="max-w-6xl mx-auto px-6 gallery-masonry">
          {galleryItems.map((item, i) => (
            <div key={i} className={`gallery-item card p-0 overflow-hidden transition hover:scale-[1.02] cursor-pointer`} style={{ animationDelay: `${i * 50}ms` }}>
              <div
                className="aspect-[3/4] flex flex-col items-center justify-center"
                style={{ backgroundColor: item.color }}
              >
                <span className="text-6xl mb-4">{item.emoji}</span>
                <h3 className="font-serif font-semibold text-lg text-center px-4">{item.title}</h3>
                <span className="text-xs text-text-secondary mt-2 uppercase tracking-wider">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-bg-primary to-accent-light" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-serif font-semibold mb-4 leading-tight">
            Want Your Event Featured?
          </h2>
          <p className="text-text-secondary text-lg mb-8">Book with FrameFlix and become part of our gallery.</p>
          <Link href="/contact" className="btn-primary !text-lg !px-10 inline-flex">
            Book Your Event
            <Camera size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
