import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Menu, X, Rocket, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/create", label: "Create Campaign" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleConnect = () => {
    if (!isConnected) {
      toast.success("Wallet connected successfully!");
    } else {
      toast.info("Wallet disconnected");
    }
    setIsConnected(!isConnected);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "border-b border-border/50 bg-background/90 backdrop-blur-xl shadow-lg shadow-background/20" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/50 transition-all duration-300" />
              <Rocket className="relative h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-heading text-xl font-bold">
              Chain<span className="text-primary">Raise</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || 
                              (link.href !== "/" && location.pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-secondary/80"
              asChild
            >
              <Link to="/explore">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button
              variant={isConnected ? "glass" : "gradient"}
              onClick={handleConnect}
              className={cn(
                "gap-2 transition-all duration-300",
                isConnected && "border border-primary/30"
              )}
            >
              <Wallet className="h-4 w-4" />
              {isConnected ? (
                <span className="flex items-center gap-1">
                  ST1P...ZGZM
                  <ChevronDown className="h-3 w-3" />
                </span>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative w-5 h-5">
              <span className={cn(
                "absolute left-0 w-5 h-0.5 bg-current transition-all duration-300",
                isMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1"
              )} />
              <span className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-current transition-all duration-300",
                isMenuOpen && "opacity-0"
              )} />
              <span className={cn(
                "absolute left-0 w-5 h-0.5 bg-current transition-all duration-300",
                isMenuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-1"
              )} />
            </div>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}>
          <nav className="flex flex-col gap-2 py-4 border-t border-border/50">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Button
              variant={isConnected ? "glass" : "gradient"}
              onClick={() => {
                handleConnect();
                setIsMenuOpen(false);
              }}
              className="mt-2 gap-2"
            >
              <Wallet className="h-4 w-4" />
              {isConnected ? "ST1P...ZGZM" : "Connect Wallet"}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
