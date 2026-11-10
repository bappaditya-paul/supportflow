import React, { useState, useEffect } from 'react';
import {
  Key,
  Globe,
  Cpu,
  Users,
  Copy,
  Check,
  Plus,
  Trash2,
  Shield,
  Lock,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { FacehashAvatar } from '../components/primitives';

interface ApiKeyRow {
  id: string;
  name: string;
  type: string;
  prefix: string;
  createdAt: string;
  linkedTeammate?: string | null;
}

interface DomainRow {
  id: string;
  domain: string;
  isTest: boolean;
  createdAt?: string;
}

export const DeveloperSettings: React.FC = () => {
  const [subTab, setSubTab] = useState<'keys' | 'domains' | 'byok' | 'team'>('keys');

  // Keys State (live from backend)
  const [apiKeys, setApiKeys] = useState<ApiKeyRow[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<'Test Public Key' | 'Live Public Key' | 'Secret Key'>('Test Public Key');

  // Allowed Domains State (live from backend)
  const [domains, setDomains] = useState<DomainRow[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [domainsSaved, setDomainsSaved] = useState(false);

  // BYOK State
  const [useByok, setUseByok] = useState(false);
  const [openRouterKey, setOpenRouterKey] = useState('');

  const fetchKeys = async () => {
    try {
      setLoadingKeys(true);
      const res = await fetch('http://localhost:8000/api/v1/settings/keys');
      if (res.ok) {
        const data = await res.json();
        setApiKeys(
          data.map((k: any) => ({
            id: k.id,
            name: k.name,
            type: k.key_type || 'Test Public Key',
            prefix: k.prefix,
            createdAt: k.created_at || '11/7/2026',
            linkedTeammate: k.linked_teammate,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
    } finally {
      setLoadingKeys(false);
    }
  };

  const fetchDomains = async () => {
    try {
      setLoadingDomains(true);
      const res = await fetch('http://localhost:8000/api/v1/settings/domains');
      if (res.ok) {
        const data = await res.json();
        setDomains(
          data.map((d: any) => ({
            id: d.id,
            domain: d.domain,
            isTest: d.is_test ?? false,
            createdAt: d.created_at,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch domains:', err);
    } finally {
      setLoadingDomains(false);
    }
  };

  useEffect(() => {
    fetchKeys();
    fetchDomains();
  }, []);

  const copyKey = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch('http://localhost:8000/api/v1/settings/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName.trim(),
          key_type: newKeyType,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setApiKeys((prev) => [
          ...prev,
          {
            id: created.id,
            name: created.name,
            type: created.key_type,
            prefix: created.prefix,
            createdAt: created.created_at,
            linkedTeammate: created.linked_teammate,
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to create API key:', err);
    }

    setNewKeyName('');
    setIsKeyModalOpen(false);
  };

  const handleRevokeKey = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/settings/keys/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setApiKeys((prev) => prev.filter((k) => k.id !== id));
      }
    } catch (err) {
      console.error('Failed to revoke API key:', err);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomainInput.trim()) return;
    const domainVal = newDomainInput.trim();
    try {
      const res = await fetch('http://localhost:8000/api/v1/settings/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domainVal,
          is_test: domainVal.includes('localhost') || domainVal.includes('127.0.0.1'),
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setDomains((prev) => [
          ...prev,
          {
            id: created.id,
            domain: created.domain,
            isTest: created.is_test,
            createdAt: created.created_at,
          },
        ]);
        setNewDomainInput('');
      }
    } catch (err) {
      console.error('Failed to add domain:', err);
    }
  };

  const handleRemoveDomain = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/settings/domains/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDomains((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error('Failed to remove domain:', err);
    }
  };

  const handleSaveDomains = () => {
    setDomainsSaved(true);
    setTimeout(() => setDomainsSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-canvas font-sans select-none text-neutral-900 dark:text-neutral-200">
      {/* Settings Header & Sub-Nav */}
      <div className="border-b border-border-default bg-surface-base px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Developer & Workspace Settings</span>
            <span className="px-2 py-0.5 rounded-[3px] bg-neutral-100 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 border border-border-default text-[10px] font-mono">
              SECURITY & KEYS
            </span>
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-0.5">
            Manage CORS allowed domains, publishable widget tokens, and bring-your-own LLM keys.
          </p>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex rounded-[4px] bg-neutral-100 dark:bg-white/[0.03] border border-border-default p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setSubTab('keys')}
            className={`px-3 py-1.5 text-xs font-mono rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'keys' ? 'bg-[#DF3E03] text-white font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>API Keys</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('domains')}
            className={`px-3 py-1.5 text-xs font-mono rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'domains' ? 'bg-[#DF3E03] text-white font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Allowed Domains</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('byok')}
            className={`px-3 py-1.5 text-xs font-mono rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'byok' ? 'bg-[#DF3E03] text-white font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>LLM BYOK</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('team')}
            className={`px-3 py-1.5 text-xs font-mono rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'team' ? 'bg-[#DF3E03] text-white font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team & RBAC</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl w-full">
        {/* SUBTAB 1: API KEYS */}
        {subTab === 'keys' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-mono uppercase">Public and Private API Keys</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-0.5">
                  Create, review, and revoke cryptographic keys connected to your support widget.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsKeyModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-mono font-medium rounded-[4px] flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New API Key</span>
              </button>
            </div>

            <div className="border border-border-default rounded-[4px] overflow-hidden bg-surface-base">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border-default bg-neutral-50 dark:bg-[#090a0f] text-neutral-500 dark:text-neutral-400 text-[11px]">
                    <th className="p-3.5 font-medium">Name</th>
                    <th className="p-3.5 font-medium">Type</th>
                    <th className="p-3.5 font-medium">Key Prefix</th>
                    <th className="p-3.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {loadingKeys ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-neutral-500 dark:text-neutral-400">
                        <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2" />
                        Fetching keys from backend...
                      </td>
                    </tr>
                  ) : apiKeys.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-neutral-500 dark:text-neutral-400">
                        No active API keys found. Click "New API Key" to generate.
                      </td>
                    </tr>
                  ) : (
                    apiKeys.map((key) => (
                      <tr key={key.id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02] text-neutral-800 dark:text-neutral-200 transition-colors">
                        <td className="p-3.5 font-medium text-neutral-900 dark:text-white">
                          <div>{key.name}</div>
                          <div className="text-[10px] text-neutral-500 font-normal mt-0.5">{key.createdAt}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-[3px] bg-neutral-100 dark:bg-white/[0.05] border border-border-default text-[10px] text-neutral-700 dark:text-neutral-300">
                            {key.type}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="inline-flex items-center gap-2">
                            <code className="text-emerald-600 dark:text-emerald-400 font-mono">{key.prefix}</code>
                            <button
                              type="button"
                              onClick={() => copyKey(key.id, key.prefix)}
                              className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors"
                              aria-label={`Copy key for ${key.name}`}
                            >
                              {copiedKeyId === key.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleRevokeKey(key.id)}
                            className="px-2.5 py-1 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 border border-border-default hover:border-rose-500/40 rounded-[3px] cursor-pointer transition-colors"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 2: ALLOWED DOMAINS */}
        {subTab === 'domains' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-mono uppercase">Allowed Domains (CORS Whitelist)</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-0.5">
                Only requests from these whitelisted domains and subdomains can initialize customer chat sessions.
              </p>
            </div>

            <div className="p-6 bg-surface-base border border-border-default rounded-[4px] space-y-4">
              <div className="space-y-3">
                {loadingDomains ? (
                  <div className="p-4 text-center text-neutral-500 dark:text-neutral-400 text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2" />
                    Fetching allowed domains...
                  </div>
                ) : domains.length === 0 ? (
                  <div className="p-4 text-center text-neutral-500 dark:text-neutral-400 text-xs">
                    No allowed domains configured yet. Add one below.
                  </div>
                ) : (
                  domains.map((d) => (
                    <div key={d.id} className="flex items-center gap-3">
                      <input
                        type="text"
                        readOnly
                        value={d.domain}
                        aria-label="Whitelisted domain"
                        className="flex-1 px-3.5 py-2 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-white select-all"
                      />
                      {d.isTest && (
                        <span className="px-2 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 text-[10px] font-mono rounded-[3px]">
                          TEST
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveDomain(d.id)}
                        className="p-2 text-neutral-400 hover:text-rose-500 border border-border-default hover:border-rose-400 rounded-[4px] cursor-pointer transition-colors"
                        aria-label={`Remove domain ${d.domain}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Domain Input */}
              <div className="flex items-center gap-3 pt-3 border-t border-border-default">
                <input
                  type="text"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  placeholder="https://app.devscalelab.com or https://staging.mysite.com"
                  aria-label="New allowed domain"
                  className="flex-1 px-3.5 py-2 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#DF3E03] focus-visible:ring-1 focus-visible:ring-[#DF3E03] transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddDomain}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-neutral-800 dark:text-white rounded-[4px] text-xs font-mono font-medium cursor-pointer transition-colors"
                >
                  Add Domain
                </button>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={handleSaveDomains}
                  className="px-5 py-2 bg-[#DF3E03] hover:bg-[#c93702] text-white font-mono text-xs font-semibold rounded-[4px] flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                >
                  {domainsSaved ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{domainsSaved ? 'Domains Saved!' : 'Save Allowed Domains'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: LLM PROVIDER BYOK */}
        {subTab === 'byok' && (
          <div className="space-y-6">
            <div className="p-6 bg-surface-base border border-border-default rounded-[4px] space-y-4">
              <div className="flex items-center justify-between border-b border-border-default pb-4">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-mono uppercase">Bring Your Own Key (BYOK)</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-0.5">
                    Use your custom OpenRouter or Anthropic key. Calls execute through your provider account.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">ENABLE CUSTOM KEY:</span>
                  <button
                    type="button"
                    onClick={() => setUseByok(!useByok)}
                    aria-label="Toggle Bring Your Own Key"
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[#DF3E03] ${
                      useByok ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        useByok ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="byok-secret-key" className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
                  OpenRouter / Model Provider Secret Key
                </label>
                <input
                  id="byok-secret-key"
                  type="password"
                  disabled={!useByok}
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  placeholder="sk-or-v1-xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#DF3E03] focus-visible:ring-1 focus-visible:ring-[#DF3E03] disabled:opacity-50 transition-colors"
                />
                <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Key is encrypted at rest using AES-GCM and never returned in client payloads.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: TEAM & RBAC */}
        {subTab === 'team' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white font-mono uppercase">Team Members & Access Control</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-0.5">
                  1 of 5 seats used on your current plan.
                </p>
              </div>

              <button
                type="button"
                className="px-3.5 py-1.5 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-mono font-medium rounded-[4px] flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Invite Teammate</span>
              </button>
            </div>

            <div className="p-4 bg-surface-base border border-border-default rounded-[4px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FacehashAvatar seed="BIKASH Chandra Paul" size="sm" />
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white font-sans flex items-center gap-2">
                    <span>BIKASH Chandra Paul</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#DF3E03]/10 text-[#DF3E03] rounded-[3px]">
                      YOU
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">bikashchandrapaul615@gmail.com</div>
                </div>
              </div>

              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-[3px] bg-neutral-100 dark:bg-white/[0.05] border border-border-default text-neutral-700 dark:text-neutral-300">
                OWNER (ALL WEBSITES)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* NEW API KEY MODAL */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-base border border-border-default rounded-[4px] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold font-mono uppercase text-neutral-900 dark:text-white border-b border-border-default pb-3">
              Generate New API Key
            </h3>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label htmlFor="modal-key-name" className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">Key Description</label>
                <input
                  id="modal-key-name"
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Staging Widget Key"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#DF3E03] focus-visible:ring-1 focus-visible:ring-[#DF3E03] transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="modal-key-type" className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">Key Type</label>
                <select
                  id="modal-key-type"
                  value={newKeyType}
                  onChange={(e) => setNewKeyType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-[#DF3E03] focus-visible:ring-1 focus-visible:ring-[#DF3E03] cursor-pointer transition-colors"
                >
                  <option value="Test Public Key">Test Public Key (Client Widget - Test Mode)</option>
                  <option value="Live Public Key">Live Public Key (Client Widget - Production)</option>
                  <option value="Secret Key">Secret Key (Backend & Server Integrations)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-mono font-medium rounded-[4px] transition-colors"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

