import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/home/Reveal";
import ReserveCta from "@/components/home/ReserveCta";
import SiteFooter from "@/components/home/SiteFooter";
import { POSTS, getPost } from "@/lib/posts";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found — Viyanjan" };
  return {
    title: `${post.title} — Viyanjan Journal`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main>
      {/* hero */}
      <article>
        <header className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140b07] via-[#140b07]/40 to-[#140b07]/30" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-3xl px-6 pb-12 md:px-12">
            <Link
              href="/blog"
              className="eyebrow text-[10px] text-cream/60 transition hover:text-gold"
            >
              ← The Journal
            </Link>
            <div className="mt-4 flex items-center gap-3 text-cream/55">
              <span className="eyebrow text-[10px] text-gold">
                {post.category}
              </span>
              <span className="text-xs">· {post.readMins} min read</span>
            </div>
            <h1 className="mt-3 font-display text-4xl font-light leading-tight text-cream md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-cream/55">
              {post.author} · {post.date}
            </p>
          </div>
        </header>

        {/* body */}
        <div className="mx-auto max-w-2xl px-6 py-16 md:px-0">
          <p className="font-display text-2xl font-light italic leading-relaxed text-cream/85">
            {post.excerpt}
          </p>
          <div className="mt-10 space-y-7">
            {post.body.map((block, i) => {
              if (block.type === "h")
                return (
                  <h2
                    key={i}
                    className="pt-2 font-display text-3xl font-light text-gold"
                  >
                    {block.text}
                  </h2>
                );
              if (block.type === "quote")
                return (
                  <blockquote
                    key={i}
                    className="border-l-2 border-gold/50 pl-6 font-display text-2xl font-light italic leading-relaxed text-cream/80"
                  >
                    “{block.text}”
                  </blockquote>
                );
              return (
                <p key={i} className="leading-[1.9] text-cream/70">
                  {block.text}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      {/* more stories */}
      <section className="border-t border-cream/10 bg-black/20 py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-light text-cream">
              More from the Journal
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {more.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream/10 bg-[#1a0f0a] transition hover:border-gold/40"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="eyebrow text-[10px] text-gold">
                      {p.category}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-light leading-tight text-cream transition group-hover:text-gold">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ReserveCta />
      <SiteFooter />
    </main>
  );
}
