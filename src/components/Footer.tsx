import Link from "next/link";


export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary/50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-serif font-semibold mb-3">FrameFlix Studio</h3>
            <p className="text-text-secondary text-sm max-w-xs leading-relaxed">
              Custom photobooth souvenirs that last forever. 3D-printed frames with dye-sublimation prints for your most memorable moments.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="https://instagram.com/frameflix.studio" target="_blank" rel="noopener" className="text-text-secondary hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-text-secondary">Pages</h4>
            <div className="flex flex-col gap-2">
              {["Home", "About", "Packages", "Gallery", "FAQ", "Contact"].map((p) => (
                <Link key={p} href={p === "Home" ? "/" : `/${p.toLowerCase()}`} className="text-sm text-text-secondary hover:text-accent transition-colors">
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-text-secondary">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
              <span>hello@frameflixstudio.com</span>
              <span>Serving GTA & surroundings</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
          <span>© 2026 FrameFlix Studio. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/faq" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
