import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, HelpCircle, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { MaskLogo } from '../components/primitives';

export const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tiers = [
    {
      name: 'Free',
      tagline: 'For hobby projects and testing SupportFlow in development.',
      price: '$0',
      originalPrice: null,
      period: 'forever',
      badge: null,
      highlighted: false,
      cta: 'Get started',
      ctaLink: '/signup?plan=free',
      features: [
        '100 active conversations / month',
        '1 workspace seat',
        'Deterministic tool execution engine',
        'Customer PII automatic masking',
        'React 19 & Next.js drop-in widget',
        'Community Discord support',
      ],
    },
    {
      name: 'Hobby',
      tagline: 'For indie hackers and early-stage SaaS shipping fast.',
      price: isAnnual ? '$16' : '$20',
      originalPrice: isAnnual ? '$24' : '$30',
      discount: '33% off',
      period: 'per month',
      badge: 'POPULAR',
      highlighted: false,
      cta: 'Get started',
      ctaLink: '/signup?plan=hobby',
      features: [
        '1,000 active conversations / month',
        '3 workspace seats',
        'Real-time WebSocket ghost typing',
        'Full Switch AI multi-agent swarm',
        'Human Review & Dispatch Gate',
        '7-day conversation history',
        'Standard email support (<24h SLA)',
      ],
    },
    {
      name: 'Pro',
      tagline: 'For production SaaS teams requiring zero hallucinations.',
      price: isAnnual ? '$32' : '$40',
      originalPrice: isAnnual ? '$72' : '$90',
      discount: '56% off',
      period: 'per month',
      badge: 'RECOMMENDED',
      highlighted: true,
      cta: 'Get started',
      ctaLink: '/signup?plan=pro',
      features: [
        'Unlimited conversations & history',
        'Unlimited team seats',
        'Mattermost #cloud-support 2-way bridge',
        'Stripe & Postgres zero-hallucination tools',
        'Custom human approval rules & gates',
        'Operator Cockpit with CRM Drawer',
        'Priority developer Slack / Mattermost channel',
      ],
    },
  ];

  const comparisonRows = [
    {
      category: 'Core Capabilities',
      rows: [
        { feature: 'Autonomous Switch AI Multi-Agent Swarm', free: true, hobby: true, pro: true },
        { feature: 'Deterministic Python Tool Verification', free: true, hobby: true, pro: true },
        { feature: 'Real-time WebSocket Live Ghost Typing', free: false, hobby: true, pro: true },
        { feature: 'Mandatory Human Review Gate', free: 'CLI Only', hobby: 'Web Cockpit', pro: 'Web + Mobile' },
        { feature: 'Customer PII Masking Engine', free: true, hobby: true, pro: true },
      ],
    },
    {
      category: 'Volume & Capacity',
      rows: [
        { feature: 'Monthly Active Conversations', free: '100', hobby: '1,000', pro: 'Unlimited' },
        { feature: 'Operator Seats', free: '1', hobby: '3', pro: 'Unlimited' },
        { feature: 'Conversation History Retention', free: '24 hours', hobby: '7 days', pro: 'Permanent' },
        { feature: 'Max Deterministic Tool Invocations', free: '100 / mo', hobby: '5,000 / mo', pro: 'Unlimited' },
      ],
    },
    {
      category: 'Integrations & Ecosystem',
      rows: [
        { feature: 'Shadcn React 19 Widget Component', free: true, hobby: true, pro: true },
        { feature: 'Mattermost Channel 2-Way Sync', free: false, hobby: false, pro: true },
        { feature: 'Stripe Live Payment Verification', free: false, hobby: true, pro: true },
        { feature: 'PostgreSQL Direct Sync', free: false, hobby: true, pro: true },
        { feature: 'Custom MCP Tool Server Connections', free: false, hobby: false, pro: true },
      ],
    },
  ];

  const faqs = [
    {
      q: 'Can I self-host SupportFlow without any external cloud fees?',
      a: 'Yes, 100%. SupportFlow is open-source and pairs directly with Switch AI running locally on port 34079. You can run the entire backend, Postgres, and Mattermost on your own hardware or VPS without paying a cent.',
    },
    {
      q: 'Why do you use strikethrough prices for launch?',
      a: 'During the Flip the Switch Hackathon launch, all early adopters lock in lifetime discounted rates (up to 56% off) for as long as their subscription remains active.',
    },
    {
      q: 'What prevents AI agents from hallucinating customer data?',
      a: 'SupportFlow enforces an architectural Zero-Hallucination Gate. Agents do not guess balances or subscription status; they must call deterministic tools (e.g. lookup_customer, check_stripe) and show the exact API payloads in the audit trace before drafting a message.',
    },
    {
      q: 'How does the Human Review Gate work?',
      a: 'Any sensitive action—such as resetting an API quota, extending a trial, or updating a database record—is drafted as an actionable proposal card. An operator must click "Approve & Dispatch" to execute the mutation.',
    },
    {
      q: 'Can I change plans at any time?',
      a: 'Yes. Upgrades take effect immediately with prorated billing, and downgrades take effect at the conclusion of your current billing cycle.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-[#0d0e12] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden transition-colors">
      <section className="pt-16 sm:pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto w-full text-center">
        {/* Launch Offer Bracket Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium tracking-tight text-[#DF3E03] dark:text-[#FF6633] mb-6 border border-dashed border-[#DF3E03]/30 dark:border-[#FF6633]/30 bg-[#DF3E03]/5 dark:bg-[#DF3E03]/10 rounded-[2px]"
        >
          <span>[Limited launch offer – up to 56% off lifetime while subscribed]</span>
        </motion.div>

        {/* Page Title */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 max-w-3xl mx-auto leading-tight">
          Predictable, Transparent Pricing
        </h1>
        <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Start free, then grow your SaaS with autonomous AI support agents that never hallucinate customer details.
        </p>

        {/* Monthly / Annual Billing Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-xs font-mono ${!isAnnual ? 'text-neutral-900 dark:text-white font-bold' : 'text-neutral-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full p-0.5 transition-colors cursor-pointer relative"
            aria-label="Toggle annual billing"
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#DF3E03] transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-mono flex items-center gap-1.5 ${isAnnual ? 'text-neutral-900 dark:text-white font-bold' : 'text-neutral-500'}`}>
            <span>Annual</span>
            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-[2px] text-[10px]">
              Save 20%
            </span>
          </span>
        </div>

        {/* Cossistant Vertical Dashed Pricing Matrix */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dashed divide-neutral-200 dark:divide-neutral-800 border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111218] rounded-[2px] shadow-sm text-left">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-6 sm:p-8 flex flex-col justify-between ${
                tier.highlighted ? 'bg-neutral-50/50 dark:bg-neutral-900/40 relative' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {tier.name}
                  </h3>
                  {tier.badge && (
                    <span className="px-2 py-0.5 bg-[#DF3E03] text-white font-mono text-[10px] font-bold rounded-[2px] tracking-wider uppercase">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-500 min-h-[36px] leading-relaxed">
                  {tier.tagline}
                </p>

                {/* Price Display */}
                <div className="mt-6 mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold font-mono text-neutral-950 dark:text-white tracking-tight">
                      {tier.price}
                    </span>
                    {tier.originalPrice && (
                      <span className="text-lg font-mono text-neutral-400 line-through">
                        {tier.originalPrice}
                      </span>
                    )}
                    {tier.discount && (
                      <span className="text-xs font-mono font-semibold text-[#DF3E03] dark:text-[#FF6633]">
                        {tier.discount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">
                    / {tier.period}
                  </span>
                </div>

                {/* Included Features List */}
                <div className="space-y-3 pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800 text-xs">
                  <div className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider font-semibold">
                    Included Features
                  </div>
                  {tier.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-neutral-700 dark:text-neutral-300 leading-snug">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                <Link
                  to={tier.ctaLink}
                  className={`w-full block text-center py-2.5 px-4 text-xs font-semibold rounded-[2px] transition-all cursor-pointer shadow-xs ${
                    tier.highlighted
                      ? 'bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100'
                      : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20 text-left">
          <div className="mb-6">
            <span className="text-xs font-mono text-[#DF3E03] dark:text-[#FF6633] uppercase tracking-wider font-bold">
              [Comprehensive Breakdown]
            </span>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              Feature Comparison Matrix
            </h2>
          </div>

          <div className="overflow-x-auto border border-dashed border-neutral-200 dark:border-neutral-800 rounded-[2px] bg-white dark:bg-[#111218]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 text-neutral-500 font-mono">
                  <th className="p-3.5 text-left font-semibold">Feature</th>
                  <th className="p-3.5 text-center font-semibold w-32">Free</th>
                  <th className="p-3.5 text-center font-semibold w-32">Hobby</th>
                  <th className="p-3.5 text-center font-semibold w-32">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800">
                {comparisonRows.map((cat) => (
                  <React.Fragment key={cat.category}>
                    <tr className="bg-neutral-100/50 dark:bg-neutral-900/60 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                      <td colSpan={4} className="p-2.5 px-3.5 font-bold">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.rows.map((row) => (
                      <tr key={row.feature} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                        <td className="p-3.5 text-neutral-800 dark:text-neutral-200 font-medium">
                          {row.feature}
                        </td>
                        <td className="p-3.5 text-center font-mono">
                          {typeof row.free === 'boolean' ? (
                            row.free ? (
                              <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                            ) : (
                              <span className="text-neutral-400">—</span>
                            )
                          ) : (
                            <span className="text-neutral-600 dark:text-neutral-400">{row.free}</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center font-mono">
                          {typeof row.hobby === 'boolean' ? (
                            row.hobby ? (
                              <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                            ) : (
                              <span className="text-neutral-400">—</span>
                            )
                          ) : (
                            <span className="text-neutral-600 dark:text-neutral-400">{row.hobby}</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center font-mono">
                          {typeof row.pro === 'boolean' ? (
                            row.pro ? (
                              <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                            ) : (
                              <span className="text-neutral-400">—</span>
                            )
                          ) : (
                            <span className="text-neutral-900 dark:text-white font-bold">{row.pro}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive FAQ Section with Motion */}
        <div className="mt-20 max-w-3xl mx-auto text-left">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-[#DF3E03] dark:text-[#FF6633] uppercase tracking-wider font-bold">
              [Answers to Common Questions]
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111218] rounded-[2px] overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:text-[#DF3E03] dark:hover:text-[#FF6633] transition-colors cursor-pointer text-left"
                  >
                    <span>{faq.q}</span>
                    <span className="font-mono text-neutral-400 text-sm ml-2">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 pt-0 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-dashed border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
