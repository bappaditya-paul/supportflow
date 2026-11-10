import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Tag, Sparkles, BookOpen } from 'lucide-react';
import { FacehashAvatar, MaskLogo } from '../components/primitives';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    seed: string;
    role: string;
  };
  featured?: boolean;
}

const CATEGORIES = [
  'all',
  'announcement',
  'avatar',
  'design',
  'nextjs',
  'open-source',
  'react',
  'support',
  'vision',
];

const POSTS: BlogPost[] = [
  {
    slug: 'why-we-built-facehash-deterministic-avatars',
    title: 'Why We Built Facehash: Deterministic Generative Avatars for Customer Support',
    excerpt:
      'How abstract SVG faces with pastel palettes and deterministic seed hashing create warm, friendly customer interactions without requiring slow photo uploads or third-party image hosts.',
    category: 'design',
    readTime: '4 min read',
    date: 'November 4, 2026',
    author: {
      name: 'Lucas Mouilleron',
      seed: 'lucas',
      role: 'Founding Engineer',
    },
    featured: true,
  },
  {
    slug: 'zero-hallucination-customer-support-tools',
    title: 'Zero-Hallucination Customer Support: Gating LLMs with Deterministic Python Tools',
    excerpt:
      'Why allowing language models to guess customer subscription status or account tiers is fatal for SaaS businesses, and how our multi-agent architecture uses verified tool calling.',
    category: 'support',
    readTime: '6 min read',
    date: 'October 30, 2026',
    author: {
      name: 'Alex Rivera',
      seed: 'alex',
      role: 'Lead Architect',
    },
  },
  {
    slug: 'bridging-mattermost-and-switch-ai',
    title: 'Bridging Mattermost & Switch AI for High-Throughput Cloud Support',
    excerpt:
      'A deep dive into how SupportFlow routes web widget tickets into native Mattermost channels with two-way thread synchronization and human operator sign-off gates.',
    category: 'announcement',
    readTime: '5 min read',
    date: 'October 21, 2026',
    author: {
      name: 'Sarah Chen',
      seed: 'sarah',
      role: 'Platform Engineer',
    },
  },
  {
    slug: 'live-ghost-typing-websockets-decreases-resolution-time',
    title: 'How Live Ghost Typing Over WebSockets Decreases Time-to-Resolution by 40%',
    excerpt:
      'Streaming keystrokes in real time allows support operators to read queries and prepare context before the customer even finishes typing and presses Enter.',
    category: 'react',
    readTime: '3 min read',
    date: 'October 12, 2026',
    author: {
      name: 'Marc Louvion',
      seed: 'marc',
      role: 'Product Lead',
    },
  },
  {
    slug: 'shadcn-support-widget-under-10-lines',
    title: 'Shipping a Production Customer Support Widget in Under 10 Lines of Code',
    excerpt:
      'Learn how we packaged SupportFlow into the shadcn CLI registry so developers can add a full-featured customer support drawer with a single command.',
    category: 'nextjs',
    readTime: '4 min read',
    date: 'September 28, 2026',
    author: {
      name: 'Nico Jeannen',
      seed: 'nico',
      role: 'Developer Relations',
    },
  },
];

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts =
    selectedCategory === 'all'
      ? POSTS
      : POSTS.filter((p) => p.category === selectedCategory);

  const featuredPost = POSTS.find((p) => p.featured) || POSTS[0];
  const gridPosts = filteredPosts.filter((p) => p.slug !== featuredPost.slug);

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden transition-colors">
      <div className="pt-16 sm:pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium tracking-tight text-[#DF3E03] mb-4 border border-white/[0.08] rounded-[3px] bg-white/[0.03]"
          >
            <span>[Engineering & Architecture]</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white [text-wrap:balance]">
            Blog
          </h1>
          <p className="mt-3 text-sm text-neutral-400 font-mono">
            Thoughts, design systems, and agent orchestration patterns from our team.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-14 text-xs font-mono">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-[3px] border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-white bg-white text-neutral-950 font-semibold shadow-xs'
                    : 'border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/[0.16] bg-white/[0.03]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Featured Hero Article */}
        {selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-14 border border-white/[0.08] bg-[#121319] rounded-[4px] p-6 sm:p-10 shadow-xs flex flex-col md:flex-row gap-8 items-center"
          >
            {/* Visual Avatar Hero Showcase */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#090a0f] border border-white/[0.08] rounded-[4px]">
              <div className="flex -space-x-4 hover:space-x-2 transition-all">
                <FacehashAvatar seed="kate" size={96} />
                <FacehashAvatar seed="lucas" size={96} />
                <FacehashAvatar seed="alex" size={96} />
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-[#DF3E03] text-white font-mono text-[10px] font-bold rounded-[3px] uppercase">
                    FEATURED
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    {featuredPost.date} · {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 leading-snug">
                  {featuredPost.title}
                </h2>
                <p className="text-sm text-neutral-400 leading-relaxed mb-6 font-sans">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <FacehashAvatar seed={featuredPost.author.seed} size={28} />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {featuredPost.author.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      {featuredPost.author.role}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-xs font-medium text-[#DF3E03] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Read article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3-Column Grid of Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridPosts.map((post, idx) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              className="border border-white/[0.08] bg-[#121319] rounded-[4px] p-6 flex flex-col justify-between shadow-xs hover:border-white/[0.16] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 border border-white/[0.08] bg-white/[0.05] text-neutral-300 font-mono text-[10px] rounded-[3px] uppercase">
                    {post.category}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white tracking-tight mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6 line-clamp-3 font-sans">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FacehashAvatar seed={post.author.seed} size={24} />
                  <span className="text-xs font-medium text-neutral-200">
                    {post.author.name}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {post.date}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

