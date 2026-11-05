import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

// -------------------------------------------------------------
// STYLES & THEME CONSTANTS
// -------------------------------------------------------------
const THEME = {
  bg: "#0B0F19",
  cardBg: "#111827",
  cardBorder: "#1F2937",
  accentCyan: "#06B6D4",
  accentEmerald: "#10B981",
  accentAmber: "#F59E0B",
  accentRose: "#F43F5E",
  accentPurple: "#8B5CF6",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

// -------------------------------------------------------------
// TOP BAR COMPONENT
// -------------------------------------------------------------
const TopBar: React.FC<{ activeScene: string }> = ({ activeScene }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 28px",
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        backdropFilter: "blur(12px)",
        borderRadius: 16,
        border: `1px solid ${THEME.cardBorder}`,
        fontFamily: THEME.fontSans,
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: THEME.accentCyan,
            boxShadow: `0 0 12px ${THEME.accentCyan}`,
          }}
        />
        <span
          style={{
            color: THEME.textPrimary,
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "-0.5px",
          }}
        >
          SWITCH AI <span style={{ color: THEME.accentCyan }}>×</span> DEVARTISAN
        </span>
        <span
          style={{
            marginLeft: 12,
            padding: "4px 10px",
            backgroundColor: "rgba(6, 182, 212, 0.15)",
            border: `1px solid rgba(6, 182, 212, 0.3)`,
            borderRadius: 6,
            color: THEME.accentCyan,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          #engineering-war-room
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ color: THEME.textMuted, fontSize: 14, fontWeight: 500 }}>
          {activeScene}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: `1px solid rgba(16, 185, 129, 0.3)`,
            borderRadius: 20,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: THEME.accentEmerald,
            }}
          />
          <span
            style={{
              color: THEME.accentEmerald,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            RUNNING LOCALLY (DOCKER)
          </span>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SCENE 1: THE PROBLEM (0 - 135 frames / 0 - 4.5s)
// -------------------------------------------------------------
const Scene1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 14 } });
  const cardProgress = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const pulse = Math.sin(frame / 6) * 0.15 + 0.85;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 100px",
      }}
    >
      <TopBar activeScene="STEP 1 / 4 • PRODUCTION INCIDENT" />

      {/* Red Alert Pill */}
      <div
        style={{
          transform: `scale(${titleProgress})`,
          opacity: titleProgress,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 24px",
          backgroundColor: `rgba(244, 63, 94, ${0.15 * pulse})`,
          border: `1px solid rgba(244, 63, 94, ${0.4 * pulse})`,
          borderRadius: 30,
          marginBottom: 24,
        }}
      >
        <span style={{ fontSize: 20 }}>🚨</span>
        <span
          style={{
            color: THEME.accentRose,
            fontFamily: THEME.fontSans,
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "1px",
          }}
        >
          02:14 AM — PRODUCTION SYSTEM DOWN
        </span>
      </div>

      {/* Main Heading */}
      <h1
        style={{
          color: THEME.textPrimary,
          fontFamily: THEME.fontSans,
          fontSize: 54,
          fontWeight: 900,
          textAlign: "center",
          margin: "0 0 36px 0",
          letterSpacing: "-1.5px",
          opacity: titleProgress,
        }}
      >
        Legacy Bugs & Critical Incidents <br />
        <span style={{ color: THEME.accentRose }}>Crash Your Business</span>
      </h1>

      {/* Code Error Card */}
      <div
        style={{
          transform: `translateY(${interpolate(cardProgress, [0, 1], [40, 0])}px) scale(${cardProgress})`,
          opacity: cardProgress,
          width: "100%",
          maxWidth: 960,
          backgroundColor: THEME.cardBg,
          border: `1px solid rgba(244, 63, 94, 0.3)`,
          borderRadius: 20,
          padding: 32,
          boxShadow: `0 20px 50px rgba(244, 63, 94, 0.1)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: THEME.accentRose }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: THEME.accentAmber }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: THEME.accentEmerald }} />
          <span style={{ color: THEME.textMuted, fontSize: 14, fontFamily: THEME.fontMono, marginLeft: 12 }}>
            cart_service.py: line 34 (KeyError: 'EXPIRED50')
          </span>
        </div>

        <pre
          style={{
            fontFamily: THEME.fontMono,
            fontSize: 20,
            color: THEME.textPrimary,
            lineHeight: 1.6,
            margin: 0,
            backgroundColor: "#0B0F19",
            padding: 24,
            borderRadius: 12,
            border: `1px solid ${THEME.cardBorder}`,
          }}
        >
          <span style={{ color: THEME.accentRose }}>[CRITICAL] 500 Internal Server Error in POST /checkout/calculate</span>
          {"\n"}
          <span style={{ color: THEME.textSecondary }}>  File "cart_service.py", line 34, in calculate_total</span>
          {"\n"}
          <span style={{ color: THEME.accentAmber }}>    discount_pct = self.active_coupons[coupon_code]</span>
          {"\n"}
          <span style={{ color: THEME.accentRose, fontWeight: "bold" }}>
            KeyError: 'EXPIRED50' — 14 customer checkouts aborted!
          </span>
        </pre>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: THEME.textMuted,
            fontSize: 16,
            fontFamily: THEME.fontSans,
          }}
        >
          <span>Traditional Way: Sleep-deprived on-call engineer takes 3+ hours to wake up and triage.</span>
          <span style={{ color: THEME.accentAmber, fontWeight: 700 }}>Avg MTTR: 3.5 Hours ⏳</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// SCENE 2: THE SOLUTION — MEET ALEX (135 - 280 frames / 4.5s - 9.3s)
// -------------------------------------------------------------
const Scene2Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = spring({ frame, fps, config: { damping: 14 } });
  const card1 = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const card2 = spring({ frame: frame - 30, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 100px",
      }}
    >
      <TopBar activeScene="STEP 2 / 4 • THE AI JUNIOR DEVELOPER" />

      {/* Pill */}
      <div
        style={{
          transform: `scale(${anim})`,
          opacity: anim,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 24px",
          backgroundColor: "rgba(6, 182, 212, 0.15)",
          border: `1px solid rgba(6, 182, 212, 0.4)`,
          borderRadius: 30,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 20 }}>🤖</span>
        <span
          style={{
            color: THEME.accentCyan,
            fontFamily: THEME.fontSans,
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "1px",
          }}
        >
          POWERED BY SWITCH AI (SANDBOXAQ)
        </span>
      </div>

      <h1
        style={{
          color: THEME.textPrimary,
          fontFamily: THEME.fontSans,
          fontSize: 52,
          fontWeight: 900,
          textAlign: "center",
          margin: "0 0 40px 0",
          letterSpacing: "-1.5px",
          opacity: anim,
        }}
      >
        Don't Build a Chatbot. <br />
        Hire <span style={{ color: THEME.accentCyan }}>Alex</span> — Your AI Junior Developer
      </h1>

      {/* Two Column Persona Showcase */}
      <div
        style={{
          display: "flex",
          gap: 32,
          width: "100%",
          maxWidth: 1040,
        }}
      >
        {/* Left: Persona Card */}
        <div
          style={{
            flex: 1,
            backgroundColor: THEME.cardBg,
            border: `1px solid ${THEME.cardBorder}`,
            borderRadius: 20,
            padding: 32,
            transform: `translateY(${interpolate(card1, [0, 1], [30, 0])}px)`,
            opacity: card1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                backgroundColor: THEME.accentCyan,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                boxShadow: `0 0 20px ${THEME.accentCyan}66`,
              }}
            >
              👨‍💻
            </div>
            <div>
              <h3 style={{ color: THEME.textPrimary, fontSize: 26, margin: 0, fontWeight: 800 }}>
                Alex (DevArtisan)
              </h3>
              <span style={{ color: THEME.accentEmerald, fontSize: 16, fontWeight: 600 }}>
                ● Active Teammate in Mattermost
              </span>
            </div>
          </div>
          <p style={{ color: THEME.textSecondary, fontSize: 18, lineHeight: 1.6, margin: "0 0 20px 0" }}>
            A persistent digital employee who joins your engineering channel, attends standup, triages errors, writes reproduction tests, and submits patches.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ padding: "6px 12px", backgroundColor: "#1E293B", borderRadius: 8, color: THEME.textPrimary, fontSize: 14 }}>
              Codex CLI
            </span>
            <span style={{ padding: "6px 12px", backgroundColor: "#1E293B", borderRadius: 8, color: THEME.textPrimary, fontSize: 14 }}>
              Local Docker
            </span>
            <span style={{ padding: "6px 12px", backgroundColor: "#1E293B", borderRadius: 8, color: THEME.textPrimary, fontSize: 14 }}>
              Human in Loop
            </span>
          </div>
        </div>

        {/* Right: Architecture Card */}
        <div
          style={{
            flex: 1,
            backgroundColor: THEME.cardBg,
            border: `1px solid ${THEME.cardBorder}`,
            borderRadius: 20,
            padding: 32,
            transform: `translateY(${interpolate(card2, [0, 1], [30, 0])}px)`,
            opacity: card2,
          }}
        >
          <h3 style={{ color: THEME.accentCyan, fontSize: 22, margin: "0 0 16px 0", fontWeight: 700 }}>
            Why Switch AI is the Secret Sauce
          </h3>
          <ul style={{ color: THEME.textSecondary, fontSize: 17, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
            <li><strong style={{ color: THEME.textPrimary }}>Room Architecture:</strong> Every channel becomes a shared memory log.</li>
            <li><strong style={{ color: THEME.textPrimary }}>Multi-Agent Swarm:</strong> Triager + Coder collaborate in same thread.</li>
            <li><strong style={{ color: THEME.textPrimary }}>100% Privacy:</strong> Zero proprietary code leaves your computer.</li>
            <li><strong style={{ color: THEME.textPrimary }}>Zero Lock-in:</strong> Works with any model or existing CLI agent.</li>
          </ul>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// SCENE 3: LIVE SWARM WORKFLOW (280 - 460 frames / 9.3s - 15.3s)
// -------------------------------------------------------------
const Scene3Workflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msg1 = spring({ frame, fps, config: { damping: 14 } });
  const msg2 = spring({ frame: frame - 25, fps, config: { damping: 14 } });
  const terminalAnim = spring({ frame: frame - 55, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 100px",
      }}
    >
      <TopBar activeScene="STEP 3 / 4 • AUTONOMOUS TRIAGE & EXECUTION" />

      <div
        style={{
          display: "flex",
          gap: 28,
          width: "100%",
          maxWidth: 1140,
        }}
      >
        {/* Left: Chat Flow Mockup */}
        <div
          style={{
            flex: 1.1,
            backgroundColor: THEME.cardBg,
            border: `1px solid ${THEME.cardBorder}`,
            borderRadius: 20,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ borderBottom: `1px solid ${THEME.cardBorder}`, paddingBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>💬</span>
            <span style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 16 }}>#engineering-war-room</span>
          </div>

          {/* Alert Message */}
          <div
            style={{
              transform: `scale(${msg1})`,
              opacity: msg1,
              backgroundColor: "rgba(244, 63, 94, 0.1)",
              border: `1px solid rgba(244, 63, 94, 0.25)`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>🚨</span>
              <strong style={{ color: THEME.accentRose, fontSize: 14 }}>Sentry Bot</strong>
              <span style={{ color: THEME.textMuted, fontSize: 12 }}>02:14:02 AM</span>
            </div>
            <p style={{ margin: 0, color: THEME.textPrimary, fontSize: 14, fontFamily: THEME.fontMono }}>
              KeyError: 'EXPIRED50' in cart_service.py line 34
            </p>
          </div>

          {/* Alex Triage Message */}
          <div
            style={{
              transform: `scale(${msg2})`,
              opacity: msg2,
              backgroundColor: "rgba(6, 182, 212, 0.1)",
              border: `1px solid rgba(6, 182, 212, 0.25)`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>👨‍💻</span>
              <strong style={{ color: THEME.accentCyan, fontSize: 14 }}>Alex (Triager)</strong>
              <span style={{ color: THEME.textMuted, fontSize: 12 }}>02:14:05 AM</span>
            </div>
            <p style={{ margin: 0, color: THEME.textPrimary, fontSize: 14, lineHeight: 1.5 }}>
              Identified root cause: unhandled discount lookup when coupon code is invalid.
              <br />
              <strong style={{ color: THEME.accentEmerald }}>@Alex-Coder:</strong> Reproducing and applying defensive fallback.
            </p>
          </div>
        </div>

        {/* Right: Local Terminal Execution */}
        <div
          style={{
            flex: 1.2,
            backgroundColor: "#0B0F19",
            border: `1px solid ${THEME.cardBorder}`,
            borderRadius: 20,
            padding: 24,
            fontFamily: THEME.fontMono,
            transform: `translateY(${interpolate(terminalAnim, [0, 1], [30, 0])}px)`,
            opacity: terminalAnim,
            boxShadow: `0 15px 40px rgba(0,0,0,0.4)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: THEME.accentRose }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: THEME.accentAmber }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: THEME.accentEmerald }} />
            <span style={{ color: THEME.textMuted, fontSize: 13, marginLeft: 8 }}>Codex CLI • Running locally</span>
          </div>

          <div style={{ color: THEME.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
            <p style={{ margin: "0 0 8px 0" }}>
              <span style={{ color: THEME.accentEmerald }}>$</span> python3 test_cart.py
            </p>
            <p style={{ margin: "0 0 12px 0", color: THEME.accentRose }}>
              FAIL: test_invalid_or_expired_coupon{"\n"}
              KeyError: 'EXPIRED50' (Reproduction confirmed)
            </p>

            <p style={{ margin: "0 0 8px 0", color: THEME.accentCyan }}>
              Applying patch: active_coupons.get(coupon_code, 0.0)
            </p>

            <p style={{ margin: "0 0 8px 0" }}>
              <span style={{ color: THEME.accentEmerald }}>$</span> python3 test_cart.py
            </p>
            <div
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: `1px solid rgba(16, 185, 129, 0.4)`,
                padding: "8px 14px",
                borderRadius: 8,
                color: THEME.accentEmerald,
                fontWeight: 700,
                display: "inline-block",
              }}
            >
              ✓ Ran 3 tests in 0.001s • ALL 3 TESTS PASSED (OK)
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// SCENE 4: HUMAN-IN-THE-LOOP & APPROVAL (460 - 580 frames / 15.3s - 19.3s)
// -------------------------------------------------------------
const Scene4Approval: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const diffAnim = spring({ frame, fps, config: { damping: 14 } });
  const approvalAnim = spring({ frame: frame - 25, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 100px",
      }}
    >
      <TopBar activeScene="STEP 4 / 4 • HUMAN-IN-THE-LOOP APPROVAL" />

      <h2
        style={{
          color: THEME.textPrimary,
          fontFamily: THEME.fontSans,
          fontSize: 46,
          fontWeight: 900,
          textAlign: "center",
          margin: "0 0 32px 0",
          letterSpacing: "-1px",
        }}
      >
        Verified Code Patch <span style={{ color: THEME.accentEmerald }}>Ready For Review</span>
      </h2>

      {/* Diff and Approval Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          backgroundColor: THEME.cardBg,
          border: `1px solid ${THEME.cardBorder}`,
          borderRadius: 20,
          padding: 30,
          transform: `scale(${diffAnim})`,
          opacity: diffAnim,
        }}
      >
        {/* Unified Diff View */}
        <pre
          style={{
            fontFamily: THEME.fontMono,
            fontSize: 18,
            lineHeight: 1.7,
            margin: "0 0 24px 0",
            backgroundColor: "#0B0F19",
            padding: 20,
            borderRadius: 12,
            border: `1px solid ${THEME.cardBorder}`,
          }}
        >
          <span style={{ color: THEME.textMuted }}>@@ -32,5 +32,5 @@ def calculate_total(...)</span>
          {"\n"}
          <span style={{ color: THEME.accentRose }}>-    discount_pct = self.active_coupons[coupon_code]</span>
          {"\n"}
          <span style={{ color: THEME.accentEmerald, fontWeight: "bold" }}>
            +    discount_pct = self.active_coupons.get(coupon_code, 0.0)
          </span>
        </pre>

        {/* Human Sign-off in Thread */}
        <div
          style={{
            transform: `translateY(${interpolate(approvalAnim, [0, 1], [20, 0])}px)`,
            opacity: approvalAnim,
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: `1px solid rgba(16, 185, 129, 0.35)`,
            borderRadius: 14,
            padding: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 28 }}>👨‍💼</span>
            <div>
              <strong style={{ color: THEME.textPrimary, fontSize: 16 }}>Senior Engineer (Lead)</strong>
              <p style={{ margin: 0, color: THEME.accentEmerald, fontSize: 15, fontWeight: 600 }}>
                "@Alex patch verified. Approved, ship it to production! 🚀"
              </p>
            </div>
          </div>
          <div
            style={{
              padding: "10px 20px",
              backgroundColor: THEME.accentEmerald,
              borderRadius: 10,
              color: "#000",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: "0.5px",
            }}
          >
            MERGED & DEPLOYED
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// SCENE 5: THE IMPACT & WINNING METRICS (580 - 720 frames / 19.3s - 24s)
// -------------------------------------------------------------
const Scene5Impact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 100px",
        textAlign: "center",
      }}
    >
      <TopBar activeScene="OUTCOME • FLIP THE SWITCH HACKATHON 2026" />

      <h1
        style={{
          color: THEME.textPrimary,
          fontFamily: THEME.fontSans,
          fontSize: 56,
          fontWeight: 900,
          margin: "0 0 16px 0",
          letterSpacing: "-1.5px",
          transform: `scale(${anim})`,
          opacity: anim,
        }}
      >
        Autonomous Engineering. <br />
        <span style={{ color: THEME.accentCyan }}>Powered by Switch AI.</span>
      </h1>

      <p style={{ color: THEME.textSecondary, fontSize: 22, maxWidth: 800, margin: "0 0 44px 0", opacity: anim }}>
        Turning solo AI agents into trustworthy, production-ready teammates.
      </p>

      {/* Metric Cards */}
      <div
        style={{
          display: "flex",
          gap: 24,
          width: "100%",
          maxWidth: 960,
          transform: `translateY(${interpolate(anim, [0, 1], [30, 0])}px)`,
          opacity: anim,
        }}
      >
        <div style={{ flex: 1, backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, borderRadius: 18, padding: 24 }}>
          <span style={{ color: THEME.accentEmerald, fontSize: 40, fontWeight: 900 }}>45 Sec</span>
          <p style={{ color: THEME.textSecondary, margin: "6px 0 0 0", fontSize: 15 }}>Mean Time to Resolution</p>
        </div>

        <div style={{ flex: 1, backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, borderRadius: 18, padding: 24 }}>
          <span style={{ color: THEME.accentCyan, fontSize: 40, fontWeight: 900 }}>100%</span>
          <p style={{ color: THEME.textSecondary, margin: "6px 0 0 0", fontSize: 15 }}>Private & Self-Hosted</p>
        </div>

        <div style={{ flex: 1, backgroundColor: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, borderRadius: 18, padding: 24 }}>
          <span style={{ color: THEME.accentPurple, fontSize: 40, fontWeight: 900 }}>0 Risk</span>
          <p style={{ color: THEME.textSecondary, margin: "6px 0 0 0", fontSize: 15 }}>Human Sign-off Gated</p>
        </div>
      </div>

      <div style={{ marginTop: 40, color: THEME.textMuted, fontSize: 16, fontFamily: THEME.fontSans }}>
        WeMakeDevs × DevTools Academy • Track 1: Best Business Workflow ($2,000)
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// MAIN COMPOSITION
// -------------------------------------------------------------
export const MainWorkflowVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
      <Sequence from={0} durationInFrames={140}>
        <Scene1Problem />
      </Sequence>
      <Sequence from={140} durationInFrames={140}>
        <Scene2Solution />
      </Sequence>
      <Sequence from={280} durationInFrames={180}>
        <Scene3Workflow />
      </Sequence>
      <Sequence from={460} durationInFrames={120}>
        <Scene4Approval />
      </Sequence>
      <Sequence from={580} durationInFrames={140}>
        <Scene5Impact />
      </Sequence>
    </AbsoluteFill>
  );
};
