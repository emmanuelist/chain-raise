import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  noindex?: boolean;
}

const DEFAULT_TITLE = "ChainRaise - Decentralized Crowdfunding on Stacks";
const DEFAULT_DESCRIPTION = "Transparent, milestone-based crowdfunding on Bitcoin L2. Create campaigns, support causes, and track fund releases with full on-chain transparency.";
const DEFAULT_IMAGE = "https://lovable.dev/opengraph-image-p98pqg.png";
const SITE_URL = "https://chainraise.io";

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  keywords = ["crowdfunding", "blockchain", "Stacks", "Bitcoin", "decentralized", "Web3"],
  noindex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ChainRaise` : DEFAULT_TITLE;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      {author && <meta name="author" content={author} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="ChainRaise" />
      
      {/* Article-specific OG tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@ChainRaise" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "Article" : "WebSite",
          name: fullTitle,
          description: description,
          url: fullUrl,
          image: image,
          ...(type === "article" && {
            datePublished: publishedTime,
            dateModified: modifiedTime,
            author: author ? { "@type": "Person", name: author } : undefined,
          }),
          publisher: {
            "@type": "Organization",
            name: "ChainRaise",
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/favicon.ico`,
            },
          },
        })}
      </script>
    </Helmet>
  );
}

// Pre-configured SEO for common pages
export function ExploreSEO() {
  return (
    <SEO
      title="Explore Campaigns"
      description="Discover and support innovative crowdfunding campaigns on ChainRaise. Browse technology, environment, education, health, art, and community projects building on Stacks."
      url="/explore"
      keywords={["explore campaigns", "crowdfunding projects", "blockchain fundraising", "Stacks projects"]}
    />
  );
}

export function DashboardSEO() {
  return (
    <SEO
      title="Dashboard"
      description="Manage your campaigns, track donations, and monitor your crowdfunding progress on ChainRaise."
      url="/dashboard"
      noindex
    />
  );
}

export function CreateCampaignSEO() {
  return (
    <SEO
      title="Create Campaign"
      description="Launch your transparent, milestone-based crowdfunding campaign on ChainRaise. Set goals, define milestones, and start raising funds on Stacks."
      url="/create"
      keywords={["create campaign", "start fundraising", "launch crowdfunding", "blockchain campaign"]}
    />
  );
}

export function CampaignDetailSEO({ campaign }: { campaign: { title: string; description: string; imageUrl: string; id: string; creator: string } }) {
  return (
    <SEO
      title={campaign.title}
      description={campaign.description.slice(0, 160)}
      image={campaign.imageUrl}
      url={`/campaign/${campaign.id}`}
      type="article"
      author={campaign.creator}
      keywords={["crowdfunding campaign", campaign.title, "blockchain fundraising"]}
    />
  );
}
