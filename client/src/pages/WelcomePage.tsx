import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Check,
  Copy,
  Terminal,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Edit2,
  ExternalLink,
} from 'lucide-react';
import { MaskLogo, FacehashAvatar } from '../components/primitives';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [websiteName, setWebsiteName] = useState('https://devscalelab.com/');
  const [domain, setDomain] = useState('devscalelab.com');
  const [framework, setFramework] = useState<'nextjs' | 'react'>('nextjs');
  const [integrationMode, setIntegrationMode] = useState<'ai' | 'manual'>('ai');
  const [packageManager, setPackageManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);

  const testApiKey = 'pk_test_0c06f236d0888a9c64aa1ed3c157b5897de21386ce97783516a6735030c73622';

  const handleStartIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setIsCrawling(true);
    setTimeout(() => {
      setIsCrawling(false);
      setStep(2);
    }, 900);
  };

  const aiPromptText = `You are a senior Next.js engineer. Integrate SupportFlow into an existing Next.js project.

Project context:
- Website name: ${websiteName}
- Website domain: ${domain}
- Framework: Next.js
- Package: @supportflow/next
- Install command: pnpm add @supportflow/next

Hard constraints:
1. Install only "@supportflow/next".
2. Keep changes scoped to SupportFlow integration only.
3. Preserve the project's coding style and existing architecture.

Required implementation:
1. Install dependency:
pnpm add @supportflow/next

2. Add/update .env.local with:
NEXT_PUBLIC_SUPPORTFLOW_API_KEY=${testApiKey}

3. Mount <SupportProvider apiKey={process.env.NEXT_PUBLIC_SUPPORTFLOW_API_KEY}> at the app root layout.
4. Import widget CSS:
import "@supportflow/next/styles.css";

5. Render <LazySupport /> inside a React <Suspense fallback={null}> boundary.
`;

  const copyToClipboard = (text: string, isPrompt: boolean) => {
    navigator.clipboard?.writeText(text);
    if (isPrompt) {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col font-sans select-none">
      {/* Top Header Bar matching Cossistant cockpit */}
      <header className="border-b border-white/[0.08] bg-[#0d0e12] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] hover:bg-white/[0.04] cursor-pointer transition-colors border border-transparent hover:border-white/[0.08]">
            <div className="w-5 h-5 rounded-[3px] bg-[#DF3E03] flex items-center justify-center text-white text-[10px] font-bold">
              1
            </div>
            <span className="font-mono text-xs font-semibold text-white tracking-tight">16MOAIAi</span>
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          </div>

          <Link
            to="/dashboard"
            className="text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors hidden sm:inline-block"
          >
            Inbox
          </Link>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <Link
            to="/dashboard"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Agent
          </Link>
          <Link
            to="/dashboard"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Contacts
          </Link>
          <div className="w-6 h-6 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-[10px] text-neutral-300 font-bold">
            D
          </div>
        </div>
      </header>

      {/* Main Form Center Column */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 flex flex-col justify-start">
        <div className="space-y-6">
          {/* STEP 1: CREATE YOUR WEBSITE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-[2px] border text-xs font-mono flex items-center justify-center font-bold ${
                    step === 1
                      ? 'border-emerald-500 text-emerald-400 bg-emerald-950/40'
                      : 'border-emerald-600 bg-emerald-950 text-emerald-400'
                  }`}
                >
                  {step === 2 ? <Check className="w-3 h-3 text-emerald-400" /> : '1'}
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Create your website
                </h2>
              </div>

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-[#DF3E03] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {step === 1 && (
              <div className="pl-8 space-y-5">
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Provide your website details and select your framework. In step 2, you'll get a
                  one-click AI setup prompt by default, with manual integration steps available anytime.
                </p>

                <form onSubmit={handleStartIntegration} className="space-y-4">
                  {/* Website Name */}
                  <div>
                    <label htmlFor="welcome-website-name" className="block text-xs font-medium text-neutral-300 mb-1.5 font-sans">
                      Website Name
                    </label>
                    <input
                      id="welcome-website-name"
                      type="text"
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      placeholder="https://devscalelab.com/"
                      className="w-full px-3.5 py-2.5 bg-[#121319] border border-white/[0.08] rounded-[4px] text-xs text-white font-mono focus:border-[#DF3E03] focus-visible:ring-1 focus-visible:ring-[#DF3E03] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Domain */}
                  <div>
                    <label htmlFor="welcome-domain" className="block text-xs font-medium text-neutral-300 mb-1.5 font-sans">
                      Domain
                    </label>
                    <input
                      id="welcome-domain"
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="Eg. polar.sh"
                      className="w-full px-3.5 py-2.5 bg-[#121319] border border-white/[0.08] rounded-[4px] text-xs text-white font-mono focus:border-[#DF3E03] focus-visible:ring-1 focus-visible:ring-[#DF3E03] focus:outline-none transition-colors"
                      required
                    />
                    <p className="mt-1 text-[11px] text-neutral-500 font-sans">
                      The domain your users will be chatting with you and your AI agents.
                    </p>
                  </div>

                  {/* Framework */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-2 font-sans">
                      Framework
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Next.js Card */}
                      <button
                        type="button"
                        onClick={() => setFramework('nextjs')}
                        className={`p-6 rounded-[4px] border flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                          framework === 'nextjs'
                            ? 'bg-white text-black border-white shadow-sm'
                            : 'bg-[#121319] text-neutral-300 border-white/[0.08] hover:border-white/[0.16]'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-sans ${
                            framework === 'nextjs'
                              ? 'bg-black text-white'
                              : 'bg-white/[0.08] text-white'
                          }`}
                        >
                          N
                        </div>
                        <span className="text-xs font-medium font-sans">Next.js</span>
                      </button>

                      {/* React Card */}
                      <button
                        type="button"
                        onClick={() => setFramework('react')}
                        className={`p-6 rounded-[4px] border flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                          framework === 'react'
                            ? 'bg-white text-black border-white shadow-sm'
                            : 'bg-[#121319] text-neutral-300 border-white/[0.08] hover:border-white/[0.16]'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-sans ${
                            framework === 'react'
                              ? 'bg-black text-[#00d8ff]'
                              : 'bg-white/[0.08] text-[#00d8ff]'
                          }`}
                        >
                          ⚛
                        </div>
                        <span className="text-xs font-medium font-sans">React</span>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!domain.trim() || isCrawling}
                      className={`w-full py-2.5 px-4 rounded-[4px] text-xs font-medium font-sans flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        domain.trim() && !isCrawling
                          ? 'bg-neutral-200 hover:bg-white text-neutral-900 font-semibold shadow-xs'
                          : 'bg-neutral-800/80 text-neutral-500 cursor-not-allowed border border-white/[0.06]'
                      }`}
                    >
                      {isCrawling ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin motion-reduce:animate-none"></span>
                          <span>Initializing Switch AI agents & vector store…</span>
                        </>
                      ) : (
                        <span>Start your Integration</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* STEP 2: INSTALL LOCALLY (ACTIVE OR COLLAPSED) */}
          <div className="space-y-4 pt-2 border-t border-dashed border-neutral-800/60">
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-[2px] border text-xs font-mono flex items-center justify-center font-bold ${
                  step === 2
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/40'
                    : 'border-neutral-800 text-neutral-600 bg-neutral-900'
                }`}
              >
                2
              </div>
              <h2
                className={`text-base font-bold tracking-tight ${
                  step === 2 ? 'text-white' : 'text-neutral-500'
                }`}
              >
                Install SupportFlow locally
              </h2>
            </div>

            {step === 2 && (
              <div className="pl-8 space-y-5">
                {/* Method Switcher Header */}
                <div className="p-4 bg-[#14151e] border border-neutral-800 rounded-[3px] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-sans text-neutral-400">Integration method:</span>
                    <div className="text-xs font-bold text-white font-mono mt-0.5">
                      {integrationMode === 'ai' ? '1-Click Prompt for Cursor / Claude' : 'Manual Code Integration'}
                    </div>
                  </div>

                  <div className="flex rounded-[2px] bg-[#0d0e12] border border-neutral-800 p-0.5">
                    <button
                      type="button"
                      onClick={() => setIntegrationMode('ai')}
                      className={`px-3 py-1 text-xs font-mono rounded-[2px] cursor-pointer transition-colors ${
                        integrationMode === 'ai' ? 'bg-[#DF3E03] text-white font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      AI Prompt (Recommended)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntegrationMode('manual')}
                      className={`px-3 py-1 text-xs font-mono rounded-[2px] cursor-pointer transition-colors ${
                        integrationMode === 'manual' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Manual Steps
                    </button>
                  </div>
                </div>

                {/* AI Prompt Mode */}
                {integrationMode === 'ai' && (
                  <div className="p-5 bg-[#14151e] border border-neutral-800 rounded-[3px] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#DF3E03]" />
                        <span className="text-xs font-bold font-mono text-white">supportflow-prompt.md</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(aiPromptText, true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-[2px] text-xs font-mono cursor-pointer transition-colors"
                      >
                        {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPrompt ? 'Copied!' : 'Copy Prompt'}</span>
                      </button>
                    </div>

                    <div className="bg-[#0b0c10] border border-neutral-800/80 rounded-[2px] p-3 font-mono text-xs text-neutral-300 overflow-x-auto max-h-60 scrollbar-thin">
                      <pre className="whitespace-pre-wrap">{aiPromptText}</pre>
                    </div>

                    <p className="text-[11px] font-sans text-neutral-400">
                      Paste this exact prompt into ChatGPT, Claude, or Cursor Composer. It wires the client SDK and loads your verified API key.
                    </p>
                  </div>
                )}

                {/* Manual Mode */}
                {integrationMode === 'manual' && (
                  <div className="p-5 bg-[#14151e] border border-neutral-800 rounded-[3px] space-y-4">
                    {/* Step 1: Install */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium font-sans text-neutral-300">1. Install package</span>
                        <div className="flex items-center gap-1">
                          {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
                            <button
                              key={pm}
                              type="button"
                              onClick={() => setPackageManager(pm)}
                              className={`px-2 py-0.5 text-[10px] font-mono rounded-[2px] cursor-pointer ${
                                packageManager === pm ? 'bg-neutral-700 text-white font-bold' : 'text-neutral-500 hover:text-white'
                              }`}
                            >
                              {pm}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-2.5 bg-[#0b0c10] border border-neutral-800 rounded-[2px] font-mono text-xs text-emerald-400 flex items-center justify-between">
                        <span>
                          {packageManager === 'pnpm' && 'pnpm add @supportflow/next'}
                          {packageManager === 'npm' && 'npm install @supportflow/next'}
                          {packageManager === 'yarn' && 'yarn add @supportflow/next'}
                          {packageManager === 'bun' && 'bun add @supportflow/next'}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              packageManager === 'pnpm'
                                ? 'pnpm add @supportflow/next'
                                : `${packageManager} install @supportflow/next`,
                              false
                            )
                          }
                          className="p-1 hover:text-white text-neutral-400 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Env Key */}
                    <div>
                      <span className="text-xs font-medium font-sans text-neutral-300 block mb-1.5">
                        2. Add Publishable API Key to .env.local
                      </span>
                      <div className="p-2.5 bg-[#0b0c10] border border-neutral-800 rounded-[2px] font-mono text-xs text-neutral-300 flex items-center justify-between">
                        <span className="truncate">NEXT_PUBLIC_SUPPORTFLOW_API_KEY={testApiKey}</span>
                        <button
                          onClick={() =>
                            copyToClipboard(`NEXT_PUBLIC_SUPPORTFLOW_API_KEY=${testApiKey}`, false)
                          }
                          className="p-1 hover:text-white text-neutral-400 cursor-pointer shrink-0 ml-2"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-3 py-1.5 border border-neutral-800 hover:bg-neutral-800 text-xs font-mono text-neutral-400 hover:text-white rounded-[2px] transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-5 py-2 bg-[#DF3E03] hover:bg-[#c93702] text-white font-mono text-xs font-bold rounded-[2px] transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Open Dashboard Cockpit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
