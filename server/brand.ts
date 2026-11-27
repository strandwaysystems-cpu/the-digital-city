/**
 * Facts about the business, in one place, for everything machine-readable:
 * JSON-LD, llms.txt, Markdown pages, the MCP server and the About/Contact pages.
 */

import { SOCIALS } from "../shared/socials";

export const SITE_URL = (process.env.SITE_URL || "https://buildyourdigitalcity.com").replace(/\/$/, "");

export const BRAND = {
  name: "The Digital City",
  legalOperator: "Strandway Systems",
  tagline: "How the internet economy really works.",
  description:
    "The Digital City publishes plain-English guides, frameworks and digital products on how online businesses actually make money: affiliate marketing, semi-passive business ideas, digital products, and the tools and platforms worth using.",
  email: "support@buildyourdigitalcity.com",
  privacyEmail: "privacy@buildyourdigitalcity.com",
  logo: `${SITE_URL}/logo.jpg`,
  store: "https://buildyourdigitalcity.gumroad.com",
  socials: SOCIALS,
};

/** Profiles that identify the same entity (schema.org sameAs). */
export const SAME_AS = [...SOCIALS.map(s => s.url), BRAND.store];

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND.name,
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: BRAND.logo },
    image: BRAND.logo,
    description: BRAND.description,
    slogan: BRAND.tagline,
    email: BRAND.email,
    sameAs: SAME_AS,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: BRAND.email,
        url: `${SITE_URL}/contact`,
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "privacy",
        email: BRAND.privacyEmail,
        availableLanguage: ["English"],
      },
    ],
    parentOrganization: { "@type": "Organization", name: BRAND.legalOperator },
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: BRAND.name,
    description: BRAND.description,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

export function webPageNode(path: string, name: string, description: string, type = "WebPage") {
  return {
    "@type": type,
    "@id": `${SITE_URL}${path}#webpage`,
    url: `${SITE_URL}${path}`,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/** A complete JSON-LD document: Organization + WebSite + this page + any extra nodes. */
export function siteGraph(extra: object[] = []) {
  return { "@context": "https://schema.org", "@graph": [organizationNode(), websiteNode(), ...extra] };
}

export function jsonLdScript(data: object): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}
