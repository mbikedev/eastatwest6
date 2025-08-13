import type { Blog } from "@/types/blog";

function iso(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const SAMPLE_BLOGS: Blog[] = [
  {
    id: "00000000-0000-0000-0000-00000000b001",
    title: "Discover Vegetarian Lebanese Mezze",
    slug: "mezze-vegetarian-guide",
    excerpt: "A quick guide to our favorite vegetarian mezze.",
    content: "Content about vegetarian mezze...",
    author_name: "East @ West Team",
    cover_image_url: "/images/gallery/falafel.webp",
    tags: ["vegetarian", "mezze"],
    published: true,
    featured: true,
    meta_title: null,
    meta_description: null,
    reading_time: 4,
    published_at: iso(1),
    created_at: iso(1),
    updated_at: iso(1),
  },
  {
    id: "00000000-0000-0000-0000-00000000b002",
    title: "Guide des Mezze Végétariens",
    slug: "mezze-vegetarien-bruxelles",
    excerpt: "Découvrez nos mezze végétariens préférés.",
    content: "Contenu sur les mezze végétariens...",
    author_name: "Equipe East @ West",
    cover_image_url: "/images/gallery/mezze-selection.webp",
    tags: ["vegetarien", "mezze"],
    published: true,
    featured: false,
    meta_title: null,
    meta_description: null,
    reading_time: 3,
    published_at: iso(3),
    created_at: iso(3),
    updated_at: iso(3),
  },
  {
    id: "00000000-0000-0000-0000-00000000b003",
    title: "Vegetarische Mezze Gids",
    slug: "mezze-vegetarisch-brussel",
    excerpt: "Ontdek onze favoriete vegetarische mezze.",
    content: "Inhoud over vegetarische mezze...",
    author_name: "East @ West Team",
    cover_image_url: "/images/gallery2/mezze-libanais-restaurant-libanais.webp",
    tags: ["vegetarisch", "mezze"],
    published: true,
    featured: false,
    meta_title: null,
    meta_description: null,
    reading_time: 5,
    published_at: iso(5),
    created_at: iso(5),
    updated_at: iso(5),
  },
];


