import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, HelpCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tiers = [
    {
      name: 'Community (OSS)',
      price: '$0',
      period: 'forever',
      description: 'Run completely offline on your own machine or private cloud.',
      features: [
        'Local Switch AI Server (port 34079)',
        '1 Support Room in Mattermost/Slack',
        'Deterministic CLI Python scripts',
        'Customer PII Masking Engine',
        'Local SQLite & JSON Storage',
        'Community Discord Support',
      ],
      cta: 'Deploy Open Source',
      ctaLink: 'https://github.com/sandbox-quantum/switch',
      highlighted: false,
    },
    {
      name: 'Pro Swarm',
      price: isAnnual ? '$39' : '$49',
      period: 'per month',
      description: 'Production-ready AI support desk with real-time operator cockpit.',
      features: [
        'All Community Features',
        'Hosted Switch Bridge Gateway',
        '3 Active Agents (@triager, @investigator, @responder)',
        'Real-time WebSocket Live Ghost Typing',
        'Human Review & Dispatch Gate',
        'Full Operator Cockpit & CRM Drawer',
        'Priority SLA (<15m Response)',
      ],
      cta: 'Start 14-Day Free Trial',
      ctaLink: '/signup?plan=pro',
      highlighted: true,
      badge: 'MOST POPULAR',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'billed annually',
      description: 'Dedicated infrastructure with compliance guarantees for high volume.',
      features: [
        'Everything in Pro Swarm',
        'Dedicated Mattermost / Slack Cluster',
        'Custom Database & Internal Tool Integration',
        'Enterprise SAML 2.0 SSO & SCIM',
        'SOC2 & HIPAA Compliance Isolation',
        'Dedicated Support Engineer & 99.99% SLA',
      ],
      cta: 'Contact Engineering Sales',
      ctaLink: '/signup?plan=enterprise',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: 'Can I run SupportFlow completely offline without external cloud dependencies?',
      a: 'Yes. SupportFlow is built around Switch AI, which runs locally in Docker or on your host (port 34079). Using local models or Codex, zero customer tickets or PII ever leave your private network boundary.',
    },
    {
      q: 'What prevents AI agents from issuing unauthorized refunds or database changes?',
      a: 'SupportFlow enforces an architectural Human Review Gate. The agent swarm only has access to deterministic read-only inspection tools (e.g., checking Stripe charge status or looking up database roles). Proposed resolutions are held in a pending state until a human operator clicks [Approve & Dispatch].',
    },
    {
      q: 'How does the Live Ghost Typing feature work?',
      a: 'When a customer types in the support widget, keystrokes are transmitted over a lightweight WebSocket channel (`ws://localhost:8000/ws`). The operator cockpit renders the text with an amber pulsating indicator before the customer presses Enter, allowing agents to prepare context in advance.',
    },
    {
      q: 'Which team chat platforms are supported?',
      a: 'SupportFlow connects natively to Mattermost, Slack, Discord, and Telegram via Switch AI room templates. Every chat channel becomes a collaborative room where human reps and AI agents share context.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden">
      <section className="pt-16 pb-20 px-4 sm:px-6 max-w-6xl mx-auto w-full text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#161722] border border-blue-900/60 rounded-[2px] text-xs font-mono text-blue-400 mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>Predictable, Transparent Pricing</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto">
          Deploy Local or Scale with Managed Swarms.
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Self-host the entire stack for free, or upgrade to Pro for hosted Switch infrastructure, live ghost typing, and team collaboration.
        </p>

        {/* Monthly / Annual Billing Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-xs ${!isAnnual ? 'text-white font-semibold' : 'text-neutral-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 bg-neutral-800 border border-neutral-700 rounded-full p-0.5 transition-colors cursor-pointer relative"
            aria-label="Toggle annual billing"
          >
            <div
              className={`w-5 h-5 rounded-full bg-blue-500 transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs flex items-center gap-1.5 ${isAnnual ? 'text-white font-semibold' : 'text-neutral-400'}`}>
            Annual
            <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-[2px] font-mono text-[10px]">
              Save 20%
            </span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-6 rounded-[2px] flex flex-col justify-between transition-all ${
                tier.highlighted
                  ? 'bg-[#151722] border-2 border-blue-500 shadow-xl relative'
                  : 'bg-[#121319] border border-neutral-800'
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-6 px-2.5 py-0.5 bg-blue-600 text-white font-mono text-[10px] font-bold rounded-[2px] tracking-wider uppercase shadow-xs">
                  {tier.badge}
                </span>
              )}

              <div>
                <h3 className="text-base font-bold text-white">{tier.name}</h3>
                <p className="text-xs text-neutral-400 mt-1 min-h-[32px]">{tier.description}</p>

                <div className="mt-4 mb-6">
                  <span className="text-3xl sm:text-4xl font-bold font-mono text-white">{tier.price}</span>
                  <span className="text-xs text-neutral-500 ml-2 font-mono">/ {tier.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-neutral-800 text-xs text-neutral-300">
                  <div className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider font-semibold">
                    Included Capabilities
                  </div>
                  {tier.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-850">
                {tier.ctaLink.startsWith('http') ? (
                  <a
                    href={tier.ctaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full block text-center py-2 px-3 text-xs font-semibold rounded-[2px] transition-colors bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <Link
                    to={tier.ctaLink}
                    className={`w-full block text-center py-2 px-3 text-xs font-semibold rounded-[2px] transition-all cursor-pointer shadow-sm ${
                      tier.highlighted
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mt-20 text-left">
          <h2 className="text-lg font-bold text-white mb-4">Detailed Feature Matrix</h2>
          <div className="overflow-x-auto border border-neutral-800 rounded-[2px] bg-[#121319]">
            <table className="w-full text-xs text-neutral-300">
              <thead>
                <tr className="border-b border-neutral-800 bg-[#161722] text-neutral-400 font-mono">
                  <th className="p-3 text-left">Capability</th>
                  <th className="p-3 text-center">Community (OSS)</th>
                  <th className="p-3 text-center">Pro Swarm</th>
                  <th className="p-3 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850 font-mono text-[11px]">
                <tr>
                  <td className="p-3 font-sans text-neutral-200">Switch AI Multi-Agent Support</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-neutral-200">Deterministic Tool Engine</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-neutral-200">Live Keystroke Ghost Typing</td>
                  <td className="p-3 text-center text-neutral-500">—</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-neutral-200">Mandatory Human Review Gate</td>
                  <td className="p-3 text-center text-neutral-300">CLI Only</td>
                  <td className="p-3 text-center text-emerald-400">Web Cockpit</td>
                  <td className="p-3 text-center text-emerald-400">Web + Mobile</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-neutral-200">Customer PII Masking</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Custom Rules</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-20 max-w-3xl mx-auto text-left">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-neutral-800 bg-[#121319] rounded-[2px] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-neutral-200 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <span>{faq.q}</span>
                    <span className="font-mono text-neutral-500 ml-2">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="p-3.5 pt-0 text-xs text-neutral-400 leading-relaxed border-t border-neutral-850 bg-[#0f1015]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};