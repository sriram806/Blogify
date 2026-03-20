/**
 * Seed script — inserts 10 realistic dummy blogs into the blogs table.
 * Run with: npx ts-node src/utils/seed.ts
 * (or ts-node-esm if the project is ESM)
 */
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const sql = neon(process.env.DB_URL as string);

const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const blogs = [
    {
        title: "Getting Started with Next.js 14 App Router",
        description:
            "A comprehensive guide to building modern React applications using the Next.js 14 App Router, server components, and streaming.",
        blog_content: `# Getting Started with Next.js 14 App Router

Next.js 14 introduced a ground-breaking App Router that changes how we think about React applications.

## What is the App Router?

The App Router uses React Server Components by default, enabling you to fetch data on the server and send only the necessary HTML to the client.

## Key Features

- **Server Components** — render on the server for better performance
- **Streaming** — progressive HTML rendering for faster perceived load times
- **Layouts** — shared UI that doesn't re-render between routes
- **Loading UI** — instant loading states with Suspense

## Getting Started

\`\`\`bash
npx create-next-app@latest my-app --typescript
\`\`\`

Navigate to your app and run \`npm run dev\`. The new \`app/\` directory is where all your routes live.

Tags: nextjs, react, webdev, typescript`,
        category: "Technology",
        image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    },
    {
        title: "Mastering TypeScript Generics: A Practical Guide",
        description:
            "Deep dive into TypeScript generics with real-world examples, constraints, conditional types, and utility types.",
        blog_content: `# Mastering TypeScript Generics

Generics are one of the most powerful features of TypeScript, yet many developers avoid them.

## Why Generics?

They allow you to write reusable, type-safe code without sacrificing flexibility.

## Basic Generic Function

\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}
\`\`\`

## Generic Constraints

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}
\`\`\`

## Conditional Types

\`\`\`typescript
type IsString<T> = T extends string ? "yes" : "no";
\`\`\`

Tags: typescript, javascript, programming, webdev`,
        category: "Technology",
        image_url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800",
    },
    {
        title: "The Art of Minimalist Living: Less is Truly More",
        description:
            "Discover how reducing clutter in your home and mind can lead to a richer, more intentional life.",
        blog_content: `# The Art of Minimalist Living

Minimalism isn't about owning as few things as possible. It's about owning only things that add value to your life.

## Where to Begin

Start with one drawer. Remove everything. Put back only what you've used in the last 6 months. Donate the rest.

## The Mental Benefits

Studies show that a cluttered environment leads to higher cortisol levels. A clean space = a clear mind.

## Digital Minimalism

Your phone deserves the same treatment. Delete apps you haven't opened in 30 days. Turn off push notifications.

## Practical Tips

1. One-in, one-out rule
2. Digitize documents and photos
3. Buy quality over quantity
4. Experience over possessions

Tags: lifestyle, minimalism, mindfulness, productivity`,
        category: "Lifestyle",
        image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    },
    {
        title: "PostgreSQL Performance Tuning: Indexes That Actually Help",
        description:
            "Learn which PostgreSQL indexes to create, when to use partial indexes, and how to measure their impact with EXPLAIN ANALYZE.",
        blog_content: `# PostgreSQL Performance Tuning

Slow queries are the silent killers of web applications. Let's fix them.

## EXPLAIN ANALYZE is Your Best Friend

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM blogs WHERE category = 'Tech';
\`\`\`

Look for sequential scans (Seq Scan) on large tables — these are candidates for indexes.

## B-Tree vs GIN vs GiST

- **B-Tree** — default, great for equality and range queries
- **GIN** — full-text search, array contains, JSONB
- **GiST** — geometric data, trigram search with pg_trgm

## Partial Indexes

\`\`\`sql
CREATE INDEX idx_active_blogs ON blogs (created_at DESC)
WHERE status = 'published';
\`\`\`

Only indexes rows that match the WHERE clause — much smaller and faster.

Tags: postgresql, database, performance, backend`,
        category: "Technology",
        image_url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
    },
    {
        title: "Building Healthy Morning Routines That Stick",
        description:
            "Science-backed strategies for designing a morning routine that improves focus, energy, and mental clarity throughout the day.",
        blog_content: `# Building Healthy Morning Routines That Stick

Most morning routines fail because they're designed for someone else's life. Here's how to build yours.

## The Science of Habits

Habits form through a three-part loop: cue → routine → reward. Your morning routine is a chain of habits.

## The Non-Negotiables

1. **Hydrate first** — drink 500ml of water before coffee
2. **Move your body** — even 10 minutes of stretching counts
3. **No phone for 30 minutes** — protect your attention

## Time Boxing

Don't plan a 2-hour routine. Start with 20 minutes and expand gradually.

## Tracking Progress

A simple habit tracker (even a paper one) increases follow-through by 42%.

Tags: health, productivity, habits, wellness`,
        category: "Health",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    },
    {
        title: "Redis Caching Strategies for Node.js APIs",
        description:
            "Explore cache-aside, write-through, and cache invalidation patterns to dramatically speed up your Node.js REST APIs.",
        blog_content: `# Redis Caching Strategies for Node.js APIs

Caching is the single highest-leverage optimization you can make to a slow API.

## Cache-Aside Pattern

The application checks the cache first. On a miss, it fetches from the DB and writes to cache.

\`\`\`typescript
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);

const data = await db.query(...);
await redis.set(key, JSON.stringify(data), { EX: 60 });
return data;
\`\`\`

## When to Invalidate

- On write operations that affect cached data
- Use TTL as a safety net, not the primary strategy
- Tag-based invalidation for complex dependencies

## Cache Stampede Prevention

Use a lock or probabilistic early expiration to prevent multiple simultaneous DB fetches.

Tags: redis, nodejs, backend, performance, caching`,
        category: "Technology",
        image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    },
    {
        title: "Travel on a Budget: How to Explore Europe for Under $50/Day",
        description:
            "Practical tips for experiencing Europe's best destinations without emptying your savings account.",
        blog_content: `# Travel on a Budget: Europe for Under $50/Day

Europe has a reputation for being expensive. But with the right strategy, it's surprisingly affordable.

## Accommodation Hacks

- **Hostels** — dorms average $15–25/night in most cities
- **Couchsurfing** — free and you meet locals
- **Overnight trains** — save on a night's accommodation while traveling

## Food Strategy

- Shop at local markets instead of tourist restaurants
- Lunch menus are always cheaper than dinner
- Countries like Portugal, Hungary, and Poland are excellent value

## Transport

The Interrail pass is great for 2+ weeks of multi-country travel. Book regional buses on FlixBus for shorter distances.

## Top Budget Destinations

1. Lisbon, Portugal
2. Budapest, Hungary
3. Kraków, Poland
4. Tbilisi, Georgia
5. Belgrade, Serbia

Tags: travel, budget, europe, backpacking, adventure`,
        category: "Travel",
        image_url: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800",
    },
    {
        title: "Understanding React's useEffect: A Complete Mental Model",
        description:
            "Stop fighting useEffect. Learn the right mental model for effects, cleanup functions, and dependency arrays.",
        blog_content: `# Understanding React's useEffect

The most common source of bugs in React apps is misunderstanding useEffect.

## The Right Mental Model

useEffect is NOT a lifecycle replacement. It's a way to synchronize your component with something outside of React.

## Every Effect Has a Cleanup

\`\`\`tsx
useEffect(() => {
    const subscription = subscribe(userId);
    return () => subscription.unsubscribe(); // cleanup
}, [userId]);
\`\`\`

## The Dependency Array Rules

Every reactive value used inside the effect must be in the dependency array. No exceptions.

## Common Anti-Patterns

1. Putting an object literal in deps (creates new ref each render)
2. Missing the cleanup function for subscriptions
3. Using effects for derived state (use useMemo instead)

## When NOT to Use useEffect

If you can compute a value from props and state, compute it during render.

Tags: react, javascript, hooks, webdev, frontend`,
        category: "Technology",
        image_url: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800",
    },
    {
        title: "Plant-Based Eating: A Beginner's 30-Day Roadmap",
        description:
            "A practical, non-preachy guide to transitioning to a plant-based diet with meal ideas, nutrition tips, and common pitfalls to avoid.",
        blog_content: `# Plant-Based Eating: A 30-Day Roadmap

You don't have to go all-in overnight. Small, consistent changes beat a dramatic overhaul that doesn't last.

## Week 1: Crowd Out, Don't Cut Out

Add more plants to what you already eat rather than removing things. Add a handful of spinach to your eggs. Add beans to your pasta.

## Week 2: Protein Planning

The biggest concern is protein. Plan for these sources:
- Lentils (18g per cup)
- Chickpeas (15g per cup)
- Tofu (20g per cup)
- Tempeh (31g per cup)

## Week 3: Master a Few Go-To Recipes

Have 5 reliable meals you can cook without thinking. Reduce decision fatigue.

## Week 4: Dining Out

Most cuisines have naturally plant-friendly options. Indian, Ethiopian, and Middle Eastern are particularly plant-rich.

Tags: health, nutrition, plant-based, food, wellness`,
        category: "Health",
        image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    },
    {
        title: "Freelancing in 2025: How to Land Your First Clients",
        description:
            "From building your portfolio to pricing your services and handling contracts — a complete guide to going freelance.",
        blog_content: `# Freelancing in 2025: Landing Your First Clients

The hardest part of freelancing isn't the work — it's getting started. Here's how to cut through the noise.

## Your Niche Is Your Superpower

Clients hire specialists, not generalists. "React developer for SaaS companies" beats "web developer" every time.

## Build a Portfolio Before You Need One

Do 2–3 projects for free or at a deep discount for local businesses. Real projects beat side projects every time.

## Where to Find Clients

1. **LinkedIn** — post your work, comment on industry posts
2. **Cold outreach** — personalized emails work better than any platform
3. **Warm referrals** — your existing network is your biggest asset
4. **Upwork / Toptal** — good for building reviews, but race-to-the-bottom pricing

## Pricing Your Work

Never charge hourly for projects. Use project-based pricing calculated from a realistic time estimate × desired hourly rate × 1.5 (buffer).

Tags: freelancing, business, career, entrepreneurship, productivity`,
        category: "Business",
        image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    },
];

const seed = async () => {
    console.log("🌱 Seeding 10 dummy blogs...");

    for (const blog of blogs) {
        const slug = slugify(blog.title);
        try {
            await sql`
                INSERT INTO blogs (slug, title, description, blog_content, category, image_url, author, created_at)
                VALUES (
                    ${slug},
                    ${blog.title},
                    ${blog.description},
                    ${blog.blog_content},
                    ${blog.category},
                    ${blog.image_url},
                    'seed-author',
                    NOW() - (random() * interval '90 days')
                )
                ON CONFLICT (slug) DO NOTHING;
            `;
            console.log(`  ✅ ${blog.title}`);
        } catch (err: any) {
            console.warn(`  ⚠️  Skipped "${blog.title}": ${err.message}`);
        }
    }

    console.log("✅ Seed complete!");
    process.exit(0);
};

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
