import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { mockCampaigns } from "@/lib/mockData";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { TextReveal, CharReveal } from "@/components/ui/text-reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { Spotlight } from "@/components/ui/spotlight";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { 
  ArrowRight, 
  Shield, 
  Milestone, 
  Users, 
  TrendingUp,
  Rocket,
  Zap,
  Lock,
  RefreshCcw,
  Sparkles,
  ChevronRight,
  Star,
  Globe,
  Layers
} from "lucide-react";

const stats = [
  { label: "Total Raised", value: 287500, suffix: " STX", icon: TrendingUp },
  { label: "Active Campaigns", value: 42, suffix: "", icon: Rocket },
  { label: "Total Donors", value: 3847, suffix: "", icon: Users },
  { label: "Success Rate", value: 78, suffix: "%", icon: Shield },
];

const features = [
  {
    icon: Milestone,
    title: "Milestone-Based Releases",
    description: "Funds released as creators hit goals. Full accountability built in.",
    gradient: "from-primary to-[hsl(200_100%_50%)]",
  },
  {
    icon: Users,
    title: "Multi-Beneficiary",
    description: "Split funds between multiple recipients with custom allocations.",
    gradient: "from-[hsl(200_100%_50%)] to-accent",
  },
  {
    icon: RefreshCcw,
    title: "Auto Refunds",
    description: "Missed goal? Automatic refunds. Zero questions, zero hassle.",
    gradient: "from-accent to-[hsl(330_90%_60%)]",
  },
  {
    icon: Lock,
    title: "Emergency Pause",
    description: "Issues arise? Pause instantly. Protecting everyone involved.",
    gradient: "from-[hsl(330_90%_60%)] to-primary",
  },
];

const bentoItems = [
  {
    title: "Transparent",
    description: "Every transaction on-chain. Every milestone verifiable. Trust through transparency.",
    icon: Globe,
    className: "bento-item-lg",
    gradient: "from-primary/20 to-transparent",
  },
  {
    title: "Secure",
    description: "Secured by Bitcoin.",
    icon: Shield,
    className: "",
    gradient: "from-accent/20 to-transparent",
  },
  {
    title: "Fast",
    description: "Instant donations.",
    icon: Zap,
    className: "",
    gradient: "from-[hsl(200_100%_50%/0.2)] to-transparent",
  },
  {
    title: "Decentralized",
    description: "No middlemen. Direct creator-to-supporter connections.",
    icon: Layers,
    className: "bento-item-wide",
    gradient: "from-primary/10 via-accent/10 to-transparent",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Create",
    description: "Set goals, define milestones, add beneficiaries. Go live instantly.",
  },
  {
    step: "02",
    title: "Fund",
    description: "Supporters donate STX directly. Every transaction is transparent.",
  },
  {
    step: "03",
    title: "Achieve",
    description: "Hit milestones, unlock funds. Build trust with your community.",
  },
  {
    step: "04",
    title: "Withdraw",
    description: "Campaign succeeds? Withdraw to your wallet seamlessly.",
  },
];

export default function Index() {
  const featuredCampaigns = mockCampaigns.slice(0, 3);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Spotlight />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center pt-16 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 hero-grid" />
          <div className="absolute inset-0 mesh-gradient" />
          
          {/* Animated liquid blobs - responsive sizes */}
          <motion.div 
            className="absolute top-[10%] left-[5%] w-[150px] sm:w-[300px] lg:w-[450px] h-[150px] sm:h-[300px] lg:h-[450px] bg-primary/20 liquid-blob blur-[50px] sm:blur-[80px] lg:blur-[100px]"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-[10%] right-[5%] w-[120px] sm:w-[250px] lg:w-[400px] h-[120px] sm:h-[250px] lg:h-[400px] bg-accent/15 liquid-blob blur-[40px] sm:blur-[70px] lg:blur-[90px]"
            animate={{ 
              scale: [1.1, 1, 1.1],
              rotate: [5, 0, 5]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[400px] lg:w-[600px] h-[200px] sm:h-[400px] lg:h-[600px] bg-[hsl(200_100%_50%/0.08)] morph-shape blur-[60px] sm:blur-[100px] lg:blur-[120px]"
            style={{ y, opacity }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-xl"
              >
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-bounce-subtle" />
                <span>Built on Stacks • Secured by Bitcoin</span>
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </motion.div>
              
              {/* Main Heading */}
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-[0.95] tracking-tighter">
                <motion.span 
                  className="block"
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  The Future of
                </motion.span>
                <motion.span 
                  className="gradient-text text-glow block"
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  Funding
                </motion.span>
              </h1>
              
              {/* Subheading */}
              <motion.p 
                className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <TextReveal delay={5}>
                  Transparent crowdfunding with milestone-based releases, automatic refunds, and multi-beneficiary support.
                </TextReveal>
              </motion.p>
              
              {/* CTAs */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <MagneticButton strength={0.2}>
                  <Button asChild size="lg" variant="glow" className="w-full sm:w-auto sm:min-w-[160px] lg:min-w-[180px] text-sm sm:text-base h-11 sm:h-12 lg:h-14 rounded-xl">
                    <Link to="/create">
                      <span>Start Campaign</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </MagneticButton>
                <MagneticButton strength={0.2}>
                  <Button asChild size="lg" variant="glass" className="w-full sm:w-auto sm:min-w-[160px] lg:min-w-[180px] text-sm sm:text-base h-11 sm:h-12 lg:h-14 rounded-xl">
                    <Link to="/explore">
                      Explore Projects
                    </Link>
                  </Button>
                </MagneticButton>
              </motion.div>
            </div>

            {/* Stats with 3D Tilt */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16 lg:mt-20">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard rotationIntensity={10} className="h-full">
                    <div className="stat-card h-full group card-shine">
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-20 group-hover:opacity-50 transition-opacity duration-500">
                        <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
                      </div>
                      <div className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wide uppercase">{stat.label}</div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
            >
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-12 sm:py-16 lg:py-20 xl:py-24 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-30" />
          <div className="container mx-auto px-4 relative">
            <ScrollReveal>
              <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                <motion.span 
                  className="inline-block text-primary font-medium text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Why ChainRaise
                </motion.span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">
                  <CharReveal>Built Different</CharReveal>
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto text-xs sm:text-sm lg:text-base px-4">
                  Web3-native crowdfunding with features that matter.
                </p>
              </div>
            </ScrollReveal>

            <div className="bento-grid max-w-5xl mx-auto">
              {bentoItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  className={`bento-item ${item.className}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl`} />
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Campaigns */}
        <section className="py-12 sm:py-16 lg:py-20 xl:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 lg:mb-12">
                <div>
                  <span className="text-primary font-medium text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3 block">Discover</span>
                  <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
                    Featured
                  </h2>
                  <p className="text-muted-foreground max-w-lg text-xs sm:text-sm lg:text-base">
                    Projects making real impact. Support causes you believe in.
                  </p>
                </div>
                <MagneticButton strength={0.15} className="mt-4 md:mt-0">
                  <Button asChild variant="outline" size="sm" className="group rounded-lg text-sm">
                    <Link to="/explore">
                      View All
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </MagneticButton>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {featuredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard rotationIntensity={8}>
                    <CampaignCard campaign={campaign} />
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 sm:py-16 lg:py-20 xl:py-24 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-40" />
          <div className="container mx-auto px-4 relative">
            <ScrollReveal>
              <div className="text-center mb-8 sm:mb-12 lg:mb-14">
                <span className="text-primary font-medium text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3 block">Features</span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                  Powerful Tools
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto text-xs sm:text-sm lg:text-base px-4">
                  Everything you need for successful crowdfunding.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative glass-card-hover p-4 sm:p-5 lg:p-6 h-full group overflow-hidden">
                    {/* Static left border accent */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b ${feature.gradient}`} />
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300`}>
                      <div className="w-full h-full bg-card rounded-[7px] sm:rounded-[10px] flex items-center justify-center">
                        <feature.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-heading font-semibold text-sm sm:text-base lg:text-lg mb-1.5 sm:mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 xl:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-card/20 via-transparent to-card/20" />
          <div className="container mx-auto px-4 relative">
            <ScrollReveal>
              <div className="text-center mb-8 sm:mb-12 lg:mb-14">
                <span className="text-primary font-medium text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3 block">Process</span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                  How It Works
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto text-xs sm:text-sm lg:text-base px-4">
                  Launch in minutes. Full transparency, zero fees.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 max-w-5xl mx-auto">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Connector */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-[2px]">
                      <div className="h-full bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
                    </div>
                  )}
                  
                  <AnimatedGradientBorder className="p-3 sm:p-4 lg:p-6 h-full text-center">
                    <motion.div 
                      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary via-[hsl(200_100%_50%)] to-accent flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4 font-heading text-sm sm:text-base lg:text-xl font-bold text-primary-foreground"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {step.step}
                    </motion.div>
                    <h3 className="font-heading font-bold text-sm sm:text-base lg:text-xl mb-1 sm:mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-[10px] sm:text-xs leading-relaxed hidden sm:block">{step.description}</p>
                  </AnimatedGradientBorder>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 xl:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnimatedGradientBorder className="p-5 sm:p-8 md:p-10 lg:p-12 xl:p-16 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 mesh-gradient opacity-50" />
                <motion.div 
                  className="absolute top-0 right-0 w-[150px] sm:w-[200px] lg:w-[350px] h-[150px] sm:h-[200px] lg:h-[350px] bg-primary/15 rounded-full blur-[50px] sm:blur-[60px] lg:blur-[100px]"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute bottom-0 left-0 w-[120px] sm:w-[180px] lg:w-[300px] h-[120px] sm:h-[180px] lg:h-[300px] bg-accent/15 rounded-full blur-[40px] sm:blur-[50px] lg:blur-[80px]"
                  animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                  <motion.div
                    className="inline-flex items-center gap-1 sm:gap-1.5 mb-3 sm:mb-4 lg:mb-6"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary fill-primary" />
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary fill-primary" />
                    <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary fill-primary" />
                  </motion.div>
                  
                  <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
                    Ready to
                    <span className="gradient-text block">Launch?</span>
                  </h2>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg max-w-lg mx-auto mb-5 sm:mb-6 lg:mb-8 leading-relaxed px-4">
                    Join thousands raising millions through transparent, milestone-based crowdfunding.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <MagneticButton strength={0.2}>
                      <Button asChild size="lg" variant="glow" className="w-full sm:w-auto sm:min-w-[150px] lg:min-w-[170px] text-sm h-10 sm:h-11 lg:h-12 rounded-lg sm:rounded-xl">
                        <Link to="/create">
                          <span>Create Campaign</span>
                          <Rocket className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                        </Link>
                      </Button>
                    </MagneticButton>
                    <MagneticButton strength={0.2}>
                      <Button asChild size="lg" variant="glass" className="w-full sm:w-auto sm:min-w-[150px] lg:min-w-[170px] text-sm h-10 sm:h-11 lg:h-12 rounded-lg sm:rounded-xl">
                        <Link to="/explore">
                          Browse Projects
                        </Link>
                      </Button>
                    </MagneticButton>
                  </div>
                </div>
              </AnimatedGradientBorder>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
