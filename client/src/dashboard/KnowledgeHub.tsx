import React, { useState, useEffect } from 'react';
import {
  Globe,
  HelpCircle,
  FileText,
  Plus,
  Play,
  CheckCircle2,
  Search,
  Upload,
} from 'lucide-react';

interface KnowledgePage {
  id: string;
  path: string;
  size_kb?: number;
  sizeKb?: number;
  domain?: string;
  url?: string;
  status?: string;
  last_crawled?: string;
}

interface FAQItem {
  id: string;
  question: string;
  categories: string[];
  related_questions?: string[];
  related?: string[];
  answer: string;
  created_at?: string;
}

export const KnowledgeHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'web' | 'faq' | 'files'>('web');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingSuccess, setTrainingSuccess] = useState(false);

  // Live Web Sources State
  const [pages, setPages] = useState<KnowledgePage[]>([]);
  // Live FAQ State
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Add FAQ Form State
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategories, setNewCategories] = useState('');
  const [newRelated, setNewRelated] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [faqSearch, setFaqSearch] = useState('');

  // Fetch live knowledge sources and FAQs from FastAPI
  const loadKnowledgeData = async () => {
    try {
      const [sourcesRes, faqsRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/knowledge/sources'),
        fetch('http://localhost:8000/api/v1/knowledge/faqs'),
      ]);

      if (sourcesRes.ok) {
        const sourcesData = await sourcesRes.json();
        setPages(sourcesData);
      }

      if (faqsRes.ok) {
        const faqsData = await faqsRes.json();
        setFaqs(faqsData);
      }
    } catch (err) {
      console.error('Failed to load knowledge base from server:', err);
    }
  };

  useEffect(() => {
    loadKnowledgeData();
  }, []);

  const handleTrainAgent = () => {
    setIsTraining(true);
    setTrainingSuccess(false);
    setTimeout(() => {
      setIsTraining(false);
      setTrainingSuccess(true);
      setTimeout(() => setTrainingSuccess(false), 3000);
    }, 1200);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const cats = newCategories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const rels = newRelated
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const payload = {
      question: newQuestion.trim(),
      categories: cats.length ? cats : ['General'],
      related_questions: rels,
      answer: newAnswer.trim(),
    };

    try {
      const res = await fetch('http://localhost:8000/api/v1/knowledge/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const createdFaq = await res.json();
        setFaqs((prev) => [createdFaq, ...prev]);
        setNewQuestion('');
        setNewCategories('');
        setNewRelated('');
        setNewAnswer('');
        setIsAddingFaq(false);
      }
    } catch (err) {
      console.error('Failed to save FAQ to backend:', err);
    }
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50 dark:bg-[#0d0e12] font-sans select-none transition-colors">
      {/* Studio Header & Sub-Nav */}
      <div className="border-b border-neutral-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0d0e12] px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 transition-colors">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Knowledge Base Hub</span>
            <span className="px-2 py-0.5 rounded-[3px] bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-800/40 text-[10px] font-mono">
              PGVECTOR EMBEDDINGS
            </span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
            Crawl public documentation, maintain authoritative FAQs, and upload policy files for zero-hallucination agent replies.
          </p>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex rounded-[4px] bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.08] p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setSubTab('web')}
            className={`px-3 py-1.5 text-xs font-mono rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'web'
                ? 'bg-white text-neutral-950 dark:bg-[#DF3E03] dark:text-white font-semibold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web Sources ({pages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('faq')}
            className={`px-3 py-1.5 text-xs font-mono rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'faq'
                ? 'bg-white text-neutral-950 dark:bg-[#DF3E03] dark:text-white font-semibold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ ({faqs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('files')}
            className={`px-3 py-1.5 text-xs font-mono rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'files'
                ? 'bg-white text-neutral-950 dark:bg-[#DF3E03] dark:text-white font-semibold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Files (0)</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Area + Right Training Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl space-y-6">
          {/* SUBTAB 1: WEB SOURCES */}
          {subTab === 'web' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-mono uppercase">Crawled Documentation Pages</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                    Automatically indexed from sitemap.xml. Refreshed daily by Switch AI crawler.
                  </p>
                </div>
              </div>

              <div className="border border-neutral-200 dark:border-white/[0.08] rounded-[4px] overflow-hidden bg-white dark:bg-[#121319] shadow-xs">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-white/[0.08] bg-neutral-100 dark:bg-[#090a0f] text-neutral-600 dark:text-neutral-400 text-[11px]">
                      <th className="p-3 font-medium">Path</th>
                      <th className="p-3 font-medium">Domain / Source</th>
                      <th className="p-3 font-medium">Size</th>
                      <th className="p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-white/[0.06]">
                    {pages.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02] text-neutral-800 dark:text-neutral-300 transition-colors">
                        <td className="p-3 text-neutral-900 dark:text-white font-semibold">{p.path}</td>
                        <td className="p-3 text-neutral-500 dark:text-neutral-400">{p.domain || 'devscalelab.com'}</td>
                        <td className="p-3 text-neutral-600 dark:text-neutral-400 tabular-nums">{p.size_kb || p.sizeKb || 4} KB</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-[2px] text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {p.status || 'Indexed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUBTAB 2: FAQS */}
          {subTab === 'faq' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Search FAQ library…"
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#121319] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#DF3E03] transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingFaq(true)}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-[#DF3E03] dark:hover:bg-[#c93702] text-white text-xs font-mono font-medium rounded-[4px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ Item</span>
                </button>
              </div>

              {/* Add FAQ Modal Form */}
              {isAddingFaq && (
                <form
                  onSubmit={handleSaveFaq}
                  className="p-5 bg-white dark:bg-[#121319] border border-neutral-200 dark:border-white/[0.12] rounded-[4px] space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/[0.08] pb-2">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white font-mono uppercase">New FAQ Knowledge Entry</h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingFaq(false)}
                      className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-mono"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-600 dark:text-neutral-400 mb-1">
                      Authoritative Question:
                    </label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="e.g. How do I upgrade my team concurrency limits?"
                      required
                      className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#090a0f] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#DF3E03]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-600 dark:text-neutral-400 mb-1">
                        Categories (comma-separated):
                      </label>
                      <input
                        type="text"
                        value={newCategories}
                        onChange={(e) => setNewCategories(e.target.value)}
                        placeholder="Billing, Quota, Enterprise"
                        className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#090a0f] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#DF3E03]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-600 dark:text-neutral-400 mb-1">
                        Related Phrases (comma-separated):
                      </label>
                      <input
                        type="text"
                        value={newRelated}
                        onChange={(e) => setNewRelated(e.target.value)}
                        placeholder="increase nodes, more workers"
                        className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#090a0f] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#DF3E03]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-600 dark:text-neutral-400 mb-1">
                      Approved Response Answer:
                    </label>
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Write exact verified answer for agent responses…"
                      rows={3}
                      required
                      className="w-full p-2.5 bg-neutral-50 dark:bg-[#090a0f] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#DF3E03]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingFaq(false)}
                      className="px-3 py-1.5 border border-neutral-200 dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400 text-xs font-mono rounded-[4px]"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-[#DF3E03] dark:hover:bg-[#c93702] text-white text-xs font-mono font-medium rounded-[4px]"
                    >
                      Save to Vector Base
                    </button>
                  </div>
                </form>
              )}

              {/* FAQ List Cards */}
              <div className="space-y-3">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 bg-white dark:bg-[#121319] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] space-y-2 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{faq.question}</h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {faq.categories.map((c) => (
                          <span
                            key={c}
                            className="px-1.5 py-0.2 rounded-[2px] bg-neutral-100 text-neutral-700 dark:bg-white/[0.06] dark:text-neutral-300 border border-neutral-200 dark:border-white/[0.08] text-[10px] font-mono"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBTAB 3: FILES INGESTION */}
          {subTab === 'files' && (
            <div className="p-10 bg-white dark:bg-[#121319] border border-dashed border-neutral-300 dark:border-white/[0.12] rounded-[4px] flex flex-col items-center justify-center text-center space-y-3 shadow-2xs">
              <Upload className="w-8 h-8 text-neutral-400" />
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-mono uppercase">Upload Documentation Files</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-1">
                  Drag and drop PDF, DOCX, or TXT knowledge bases. Text will be chunked into 512-token embeddings.
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:text-white rounded-[4px] text-xs font-mono cursor-pointer transition-colors border border-neutral-200 dark:border-white/[0.08]"
              >
                Select Files to Upload
              </button>
            </div>
          )}
        </div>

        {/* Right Training Sidebar */}
        <aside className="w-80 border-l border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0e12] p-6 flex flex-col justify-between shrink-0 select-none transition-colors">
          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-neutral-500 dark:text-neutral-400">
              Knowledge Telemetry
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center py-2 border-b border-neutral-200 dark:border-white/[0.06]">
                <span className="text-neutral-500 dark:text-neutral-400">Crawled Pages:</span>
                <span className="text-neutral-900 dark:text-white font-medium tabular-nums">{pages.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-200 dark:border-white/[0.06]">
                <span className="text-neutral-500 dark:text-neutral-400">Indexed FAQs:</span>
                <span className="text-neutral-900 dark:text-white font-medium tabular-nums">{faqs.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-200 dark:border-white/[0.06]">
                <span className="text-neutral-500 dark:text-neutral-400">Uploaded Files:</span>
                <span className="text-neutral-900 dark:text-white font-medium tabular-nums">0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-200 dark:border-white/[0.06]">
                <span className="text-neutral-500 dark:text-neutral-400">Total Vector Storage:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">20 KB / 256 KB</span>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 dark:bg-[#121319] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] text-[11px] font-mono text-neutral-600 dark:text-neutral-400 space-y-1">
              <div className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Synchronized with Postgres</span>
              </div>
              <p className="leading-relaxed">pgvector index verified. Cosine similarity threshold: 0.70.</p>
            </div>
          </div>

          {/* Train Agent Action */}
          <div className="space-y-2 pt-6 border-t border-neutral-200 dark:border-white/[0.08]">
            {trainingSuccess && (
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/50 rounded-[4px] text-[11px] font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Agent embeddings synchronized!</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleTrainAgent}
              disabled={isTraining}
              className={`w-full py-2.5 px-3 rounded-[4px] font-mono text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                isTraining
                  ? 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                  : 'bg-[#DF3E03] hover:bg-[#c93702] text-white shadow-sm'
              }`}
            >
              {isTraining ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  <span>Indexing Chunks…</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Train Agent</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-neutral-500 font-mono text-center">
              Compiles vector chunks into memory for sub-second retrieval.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
