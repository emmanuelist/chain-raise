import { Link } from "react-router-dom";
import { Rocket, Twitter, Github, MessageCircle } from "lucide-react";

const footerLinks = [
  { label: "Explore Campaigns", href: "/explore" },
  { label: "Create Campaign", href: "/create" },
  { label: "Dashboard", href: "/dashboard" },
];

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: MessageCircle, href: "https://discord.com", label: "Discord" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-card/20 backdrop-blur-xl">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg sm:text-xl font-bold tracking-tight">
                Chain<span className="gradient-text">Raise</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xs text-center lg:text-left leading-relaxed">
              Decentralized crowdfunding on Stacks, secured by Bitcoin.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-xs sm:text-sm text-foreground/70 hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex gap-2 sm:gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/social p-2 sm:p-3 rounded-lg sm:rounded-xl bg-secondary/50 hover:bg-primary/10 border border-transparent hover:border-primary/30 text-muted-foreground hover:text-primary transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4 sm:h-5 sm:w-5 group-hover/social:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} ChainRaise. Built on Stacks, secured by Bitcoin.
          </p>
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-success/10 border border-success/20">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_hsl(var(--success))]" />
            <span className="text-xs sm:text-sm text-success font-medium">Testnet Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
