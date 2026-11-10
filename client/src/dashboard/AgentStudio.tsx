import React, { useState, useEffect } from 'react';
import {
  Bot,
  Settings2,
  Command,
  Wrench,
  Check,
  Copy,
  Plus,
  Sparkles,
  Shield,
  AlertTriangle,
  RotateCcw,
  Save,
  X,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

interface ToolItem {
  id: string;
  name: string;
  tier: 'behavior' | 'action';
  description: string;
  enabled: boolean;
}

interface CustomSkillItem {
  id: string;
  name: string;
  description: string;
  instructions: string;
  createdAt: string;
}

export const AgentStudio: React.FC = () => {
  const [subTab, setSubTab] = useState<'general' | 'behavior' | 'tools'>('general');
  const [agentActive, setAgentActive] = useState(true);
  const [selectedModel, setSelectedModel] = useState('Switch Orchestrator (Local Node 34079)');
  const [copiedId, setCopiedId] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Policy Prompts State
  const [escalationPrompt, setEscalationPrompt] = useState('');
  const [participationPrompt, setParticipationPrompt] = useState('');
  const [groundingPrompt, setGroundingPrompt] = useState('');
  const [capabilitiesPrompt, setCapabilitiesPrompt] = useState('');
  const [visitorIdPrompt, setVisitorIdPrompt] = useState('');
  const [decisionPrompt, setDecisionPrompt] = useState('');

  // Tools & Skills State (Live from backend)
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [customSkills, setCustomSkills] = useState<CustomSkillItem[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);

  // Modal State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [newSkillInstructions, setNewSkillInstructions] = useState(
    '## New Custom Skill\nDescribe when and how this skill should be used.'
  );

  const fetchAgentConfig = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/agent/config');
      if (res.ok) {
        const data = await res.json();
        setAgentActive(data.status === 'active');
        if (data.model) setSelectedModel(data.model);
        if (data.behavior_policies) {
          const bp = data.behavior_policies;
          if (bp.response_behavior) setEscalationPrompt(bp.response_behavior);
          if (bp.participation_policy) setParticipationPrompt(bp.participation_policy);
          if (bp.grounding_policy) setGroundingPrompt(bp.grounding_policy);
          if (bp.capabilities_policy) setCapabilitiesPrompt(bp.capabilities_policy);
          if (bp.visitor_identification) setVisitorIdPrompt(bp.visitor_identification);
          if (bp.decision_policy) setDecisionPrompt(bp.decision_policy);
        }
      }
    } catch (err) {
      console.error('Failed to fetch agent config:', err);
    }
  };

  const fetchTools = async () => {
    try {
      setLoadingTools(true);
      const res = await fetch('http://localhost:8000/api/v1/agent/tools');
      if (res.ok) {
        const data: any[] = await res.json();
        setTools(
          data.map((t) => ({
            id: t.id,
            name: t.name,
            tier: t.tier,
            description: t.description,
            enabled: Boolean(t.enabled),
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch tools:', err);
    } finally {
      setLoadingTools(false);
    }
  };

  const fetchSkills = async () => {
    try {
      setLoadingSkills(true);
      const res = await fetch('http://localhost:8000/api/v1/agent/skills');
      if (res.ok) {
        const data: any[] = await res.json();
        setCustomSkills(
          data.map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            instructions: s.markdown_instructions || s.instructions || '',
            createdAt: s.created_at || '11/06/2026',
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch custom skills:', err);
    } finally {
      setLoadingSkills(false);
    }
  };

  useEffect(() => {
    fetchAgentConfig();
    fetchTools();
    fetchSkills();
  }, []);

  const toggleTool = async (id: string) => {
    const target = tools.find((t) => t.id === id);
    if (!target) return;
    const newEnabled = !target.enabled;

    // Optimistic local update
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: newEnabled } : t))
    );

    try {
      await fetch(`http://localhost:8000/api/v1/agent/tools/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled }),
      });
    } catch (err) {
      console.error('Failed to toggle tool on backend:', err);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      const res = await fetch('http://localhost:8000/api/v1/agent/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSkillName.trim(),
          description: newSkillDesc.trim(),
          instructions: newSkillInstructions,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setCustomSkills((prev) => [
          ...prev,
          {
            id: created.id,
            name: created.name,
            description: created.description,
            instructions: created.markdown_instructions || created.instructions || '',
            createdAt: 'Just now',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to create custom skill:', err);
    }

    setNewSkillName('');
    setNewSkillDesc('');
    setIsSkillModalOpen(false);
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const payload = {
        agent_id: 'agent_01M6T922AE4MTMB5XWB5FV6T8K',
        name: 'SupportFlow Swarm (Triager + Investigator + Responder)',
        status: agentActive ? 'active' : 'disabled',
        model: selectedModel,
        system_prompt:
          'You are a collaborative support swarm for Devscale Lab powered by Switch AI. Your job is to resolve visitor requests quickly, accurately, and safely.',
        behavior_policies: {
          response_behavior: escalationPrompt,
          participation_policy: participationPrompt,
          grounding_policy: groundingPrompt,
          capabilities_policy: capabilitiesPrompt,
          visitor_identification: visitorIdPrompt,
          decision_policy: decisionPrompt,
        },
      };

      const res = await fetch('http://localhost:8000/api/v1/agent/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save agent config:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const copyAgentId = () => {
    navigator.clipboard?.writeText('01M6T922AE4MTMB5XWB5FV6T8K');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-canvas font-sans select-none text-neutral-900 dark:text-neutral-200">
      {/* Studio Header & Sub-Nav */}
      <div className="border-b border-border-default bg-surface-base px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>AI Agent Studio</span>
              <span className="px-2 py-0.5 rounded-[3px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/40 text-[10px] font-mono">
                SWITCH AI SWARM
              </span>
            </h1>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-0.5">
            Configure system behavior, reasoning budgets, and deterministic tool access for your support agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub-tab Pills */}
          <div className="flex rounded-[4px] bg-neutral-100 dark:bg-white/[0.03] border border-border-default p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setSubTab('general')}
              className={`px-3 py-1.5 text-xs font-mono rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors ${
                subTab === 'general'
                  ? 'bg-[#DF3E03] text-white font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>General</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('behavior')}
              className={`px-3 py-1.5 text-xs font-mono rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors ${
                subTab === 'behavior'
                  ? 'bg-[#DF3E03] text-white font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Command className="w-3.5 h-3.5" />
              <span>Behaviour</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('tools')}
              className={`px-3 py-1.5 text-xs font-mono rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors ${
                subTab === 'tools'
                  ? 'bg-[#DF3E03] text-white font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Tools & Skills</span>
            </button>
          </div>

          {/* Global Save Button */}
          <button
            type="button"
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="px-3.5 py-1.5 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-mono font-medium rounded-[4px] flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Swarm</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-5xl w-full">
        {/* SUBTAB 1: GENERAL SETTINGS */}
        {subTab === 'general' && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="p-6 bg-surface-base border border-border-default rounded-[4px] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-mono uppercase">Agent Active Status</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-1">
                  When enabled, SupportFlow autonomously responds to visitor tickets and executes tools.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAgentActive(!agentActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  agentActive ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    agentActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Agent ID & Integration Identifier */}
            <div className="p-6 bg-surface-base border border-border-default rounded-[4px] space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 font-bold mb-1">
                  Agent Identifier (API Reference)
                </label>
                <div className="flex items-center gap-3">
                  <code className="px-3.5 py-2 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] font-mono text-xs text-emerald-600 dark:text-emerald-400 flex-1">
                    01M6T922AE4MTMB5XWB5FV6T8K
                  </code>
                  <button
                    type="button"
                    onClick={copyAgentId}
                    className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white rounded-[4px] text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* AI Model Engine Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 font-bold mb-1">
                  Orchestrator Engine & LLM
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs text-neutral-900 dark:text-white font-mono focus:border-[#DF3E03] focus:outline-none cursor-pointer"
                >
                  <option value="Switch Orchestrator (Local Node 34079)">
                    Switch Orchestrator (Local Node 34079 — Lowest Latency)
                  </option>
                  <option value="Moonshot Kimi K2">Moonshot Kimi K2 (Cossistant Default)</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic via OpenRouter)</option>
                  <option value="GPT-4o">GPT-4o (OpenAI via BYOK)</option>
                </select>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono mt-1.5">
                  Governs primary turn generation. Deterministic auditing tools run locally on Python 3.12 regardless of model.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: BEHAVIOUR POLICIES */}
        {subTab === 'behavior' && (
          <div className="space-y-6">
            {/* Policy 1: Response & Escalation */}
            <div className="p-6 bg-surface-base border border-border-default rounded-[4px] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-mono uppercase">Response & Escalation Policy</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    Defines exact rules when the agent must escalate to a human lead and what handoff message to deliver.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">{escalationPrompt.length} / 50,000</span>
              </div>
              <textarea
                value={escalationPrompt}
                onChange={(e) => setEscalationPrompt(e.target.value)}
                rows={7}
                className="w-full p-3.5 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-neutral-200 focus:border-[#DF3E03] focus:outline-none resize-y"
              />
            </div>

            {/* Policy 2: Participation Policy */}
            <div className="p-6 bg-surface-base border border-border-default rounded-[4px] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-mono uppercase">Participation Policy (ChatOps Rules)</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    Governs whether the AI replies or stays silent in multi-party conversations when a human is handling.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">{participationPrompt.length} / 50,000</span>
              </div>
              <textarea
                value={participationPrompt}
                onChange={(e) => setParticipationPrompt(e.target.value)}
                rows={6}
                className="w-full p-3.5 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-neutral-200 focus:border-[#DF3E03] focus:outline-none resize-y"
              />
            </div>

            {/* Policy 3: Grounding Policy */}
            <div className="p-6 bg-surface-base border border-border-default rounded-[4px] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-mono uppercase flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Grounding Policy (Anti-Hallucination)</span>
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    Mandatory retrieval-first policy enforcing pgvector lookup before answering.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">{groundingPrompt.length} / 50,000</span>
              </div>
              <textarea
                value={groundingPrompt}
                onChange={(e) => setGroundingPrompt(e.target.value)}
                rows={6}
                className="w-full p-3.5 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-neutral-200 focus:border-[#DF3E03] focus:outline-none resize-y"
              />
            </div>

            {/* Policy 4: Visitor Identification Policy */}
            <div className="p-6 bg-surface-base border border-border-default rounded-[4px] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-mono uppercase">Visitor Identification Policy</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    Guides when to ask for email/name without annoying customers.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">Presets:</span>
                  <button
                    onClick={() =>
                      setVisitorIdPrompt(
                        '## Visitor Identification\nAsk for email only if needed to lookup user orders or accounts.'
                      )
                    }
                    className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[10px] font-mono text-neutral-700 dark:text-neutral-300 rounded-[2px]"
                  >
                    Only if needed
                  </button>
                  <button
                    onClick={() =>
                      setVisitorIdPrompt(
                        '## Visitor Identification\nAsk for email on the first customer turn so support can follow up.'
                      )
                    }
                    className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[10px] font-mono text-neutral-700 dark:text-neutral-300 rounded-[2px]"
                  >
                    Ask early
                  </button>
                </div>
              </div>
              <textarea
                value={visitorIdPrompt}
                onChange={(e) => setVisitorIdPrompt(e.target.value)}
                rows={4}
                className="w-full p-3.5 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-neutral-200 focus:border-[#DF3E03] focus:outline-none resize-y"
              />
            </div>
          </div>
        )}

        {/* SUBTAB 3: TOOLS & SKILLS */}
        {subTab === 'tools' && (
          <div className="space-y-8">
            {/* Custom Skills Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-mono uppercase">Custom Playbook Skills</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    User-defined procedures for multi-step agent actions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(true)}
                  className="px-3 py-1.5 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-mono font-bold rounded-[4px] flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create custom tool</span>
                </button>
              </div>

              {loadingSkills ? (
                <div className="p-6 text-center text-neutral-500 font-mono text-xs">
                  <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2" />
                  Loading custom skills...
                </div>
              ) : customSkills.length === 0 ? (
                <div className="p-6 text-center text-neutral-500 font-mono text-xs border border-dashed border-border-default rounded-[4px]">
                  No custom skills created yet. Click "Create custom tool" to define one.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customSkills.map((skill) => (
                    <div key={skill.id} className="p-4 bg-surface-base border border-border-default rounded-[4px] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-[#DF3E03]">{skill.name}</span>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">{skill.createdAt}</span>
                      </div>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 font-sans">{skill.description}</p>
                      <div className="pt-2 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">Deterministic Python Tool Integration</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Behavior Tools Grouped List */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-mono uppercase">Behavior Tools</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                  Toggle dynamic telemetry, title labeling, and knowledge clarification.
                </p>
              </div>

              <div className="border border-border-default bg-surface-base rounded-[4px] divide-y divide-border-subtle overflow-hidden">
                {loadingTools ? (
                  <div className="p-6 text-center text-neutral-500 font-mono text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2" />
                    Loading agent tools...
                  </div>
                ) : (
                  tools
                    .filter((t) => t.tier === 'behavior')
                    .map((t) => (
                      <div
                        key={t.id}
                        className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold font-mono text-neutral-900 dark:text-white">{t.name}</div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-0.5">{t.description}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleTool(t.id)}
                          aria-label={`Toggle ${t.name}`}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-1 focus-visible:ring-[#DF3E03] ${
                            t.enabled ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-800'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              t.enabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Action Tools (Finish Handlers) Grouped List */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-mono uppercase">Action Tools (Finish Handlers)</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                  Autonomous completion handlers when a customer thread concludes.
                </p>
              </div>

              <div className="border border-border-default bg-surface-base rounded-[4px] divide-y divide-border-subtle overflow-hidden">
                {loadingTools ? (
                  <div className="p-6 text-center text-neutral-500 font-mono text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2" />
                    Loading action handlers...
                  </div>
                ) : (
                  tools
                    .filter((t) => t.tier === 'action')
                    .map((t) => (
                      <div
                        key={t.id}
                        className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold font-mono text-neutral-900 dark:text-white">{t.name}</div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-0.5">{t.description}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleTool(t.id)}
                          aria-label={`Toggle ${t.name}`}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-1 focus-visible:ring-[#DF3E03] ${
                            t.enabled ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-800'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              t.enabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE CUSTOM SKILL MODAL */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-base border border-border-default rounded-[4px] max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="text-sm font-bold font-mono uppercase text-neutral-900 dark:text-white">Create Custom Skill Playbook</h3>
              <button
                type="button"
                onClick={() => setIsSkillModalOpen(false)}
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="refund-playbook"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-[#DF3E03] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">Description</label>
                <input
                  type="text"
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                  placeholder="Handles enterprise refund verification and Stripe lookup"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-[#DF3E03] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                  Markdown Instructions (Type @ to mention tools)
                </label>
                <textarea
                  value={newSkillInstructions}
                  onChange={(e) => setNewSkillInstructions(e.target.value)}
                  rows={5}
                  className="w-full p-3 bg-neutral-50 dark:bg-[#090a0f] border border-border-default rounded-[4px] text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-[#DF3E03] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-mono font-bold rounded-[4px]"
                >
                  Create Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
