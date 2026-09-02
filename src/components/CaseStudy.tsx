import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Database,
  Server,
  Smartphone,
  KeyRound,
  DollarSign,
  ShieldAlert,
  Cpu,
  Globe,
  Lock,
  RefreshCw,
  Zap,
} from 'lucide-react';

// ── SajiloGig Case Study (unchanged) ─────────────────────────────────────────

const SajiloGigCaseStudy: React.FC = () => {
  const [diagramMode, setDiagramMode] = useState<'architecture' | 'escrow' | 'kyc'>('architecture');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: 3-Part Engineering Breakdown */}
      <div className="lg:col-span-6 space-y-6">
        {/* Part 1: Problem */}
        <div className="p-5 rounded-xl bg-surface space-y-2 transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <span className="w-6 h-6 rounded-md bg-accent/10 text-accent flex items-center justify-center text-xs">
              1
            </span>
            <span>The Problem Solved</span>
          </div>
          <p className="text-xs md:text-sm text-secondary leading-relaxed pl-8">
            Student freelancers in Nepal often run into trust issues on both sides: clients worry a student will disappear midway through, and students worry they won't get paid after handing over code. Traditional escrow platforms weren't an option because payment gateway setup fees and minimums ate up too much of a $20–$50 micro-gig.
          </p>
        </div>

        {/* Part 2: Key Trade-off */}
        <div className="p-5 rounded-xl bg-surface space-y-2 border-l-4 border-l-accent transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <span className="w-6 h-6 rounded-md bg-primary text-surface flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>The Trade-off: Simulated Escrow in PHP vs. Smart Contracts</span>
          </div>
          <p className="text-xs md:text-sm text-secondary leading-relaxed pl-8">
            <strong className="font-semibold text-primary">The Decision:</strong> Instead of deploying Ethereum L1 smart contracts, I built a server-side state machine in PHP.
            <br />
            <strong className="font-semibold text-primary">Why:</strong> Over 85% of our student target users didn't own crypto wallets. Gas spikes on mainnet ($5–$20 per transaction) would have cost more than the gigs themselves. Building a simulated escrow in PHP let clients pay with local digital wallets while still protecting both parties through state-enforced payout releases.
          </p>
        </div>

        {/* Part 3: Hindsight */}
        <div className="p-5 rounded-xl bg-surface space-y-2 transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <span className="w-6 h-6 rounded-md bg-accent/10 text-accent flex items-center justify-center text-xs">
              3
            </span>
            <span>What I Learned & What I'd Change</span>
          </div>
          <p className="text-xs md:text-sm text-secondary leading-relaxed pl-8">
            The main downside of simulated escrow is platform liability: everything hinges on the server staying trusted and online. In early testing, I also ran into a bug where disputed gigs would hang in a pending state indefinitely if the client stopped replying—I had to add a 7-day auto-resolution timer. In a modern v2, I'd use ERC-4337 Account Abstraction with Paymasters so users can interact with real smart contracts without paying gas fees or needing crypto beforehand.
          </p>
        </div>
      </div>

      {/* Right Column: Interactive System Architecture Diagram */}
      <div className="lg:col-span-6 rounded-2xl bg-surface p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-flat pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <Layers className="w-4 h-4 text-accent" />
            <span>Interactive Architecture Diagram</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-surface-subtle p-1 rounded-lg">
            {(['architecture', 'escrow', 'kyc'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setDiagramMode(mode)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all cursor-pointer ${diagramMode === mode
                    ? 'bg-surface text-accent font-semibold shadow-xs'
                    : 'text-muted hover:text-primary'
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Diagram Canvas */}
        <div className="p-4 rounded-xl bg-surface-subtle min-h-[300px] flex flex-col justify-between space-y-4">

          {/* Mode 1: Main System Architecture */}
          {diagramMode === 'architecture' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs font-semibold text-muted flex items-center justify-between">
                <span>CLIENT / FRONTEND</span>
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-surface">HTML5 / JS / Tailwind</span>
              </div>

              <div className="p-3 rounded-lg bg-surface flex items-center justify-between gap-3 text-xs font-medium text-primary">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-accent" />
                  <span>Client / Freelancer Portal</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted" />
                <span className="text-muted">HTTPS REST Requests</span>
              </div>

              <div className="text-xs font-semibold text-muted flex items-center justify-between">
                <span>BACKEND API & AUTH</span>
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-surface">PHP / RBAC Engine</span>
              </div>

              <div className="p-3 rounded-lg bg-surface border-accent-flat flex items-center justify-between gap-3 text-xs font-medium text-primary">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-accent" />
                  <span>SajiloGig PHP Core Controller</span>
                </div>
                <div className="flex gap-1">
                  <span className="px-1.5 py-0.5 rounded-sm bg-accent-light text-accent text-[10px]">KYC Guard</span>
                  <span className="px-1.5 py-0.5 rounded-sm bg-accent-light text-accent text-[10px]">Escrow State</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-muted flex items-center justify-between">
                <span>DATA & SECURITY STORE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-surface">MySQL Relational DB</span>
              </div>

              <div className="p-3 rounded-lg bg-surface flex items-center justify-between gap-3 text-xs font-medium text-primary">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-accent" />
                  <span>MySQL Database (Encrypted Audit Logs)</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          )}

          {/* Mode 2: Escrow State Machine */}
          {diagramMode === 'escrow' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="text-xs font-semibold text-muted">ESCROW STATE MACHINE FLOW</div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-3 rounded-lg bg-surface text-center space-y-1">
                  <DollarSign className="w-4 h-4 text-amber-500 mx-auto" />
                  <div className="text-xs font-bold text-primary">1. Fund Lock</div>
                  <p className="text-[10px] text-muted">Client deposits gig value into escrow ledger.</p>
                </div>

                <div className="p-3 rounded-lg bg-surface text-center space-y-1">
                  <ShieldCheck className="w-4 h-4 text-accent mx-auto" />
                  <div className="text-xs font-bold text-primary">2. Deliverable Check</div>
                  <p className="text-[10px] text-muted">Student submits code; client reviews diff.</p>
                </div>

                <div className="p-3 rounded-lg bg-surface text-center space-y-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                  <div className="text-xs font-bold text-primary">3. Auto Release</div>
                  <p className="text-[10px] text-muted">Funds transferred to student wallet/account.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface text-xs text-muted leading-relaxed">
                <strong className="font-semibold text-primary">Fail-safe:</strong> If deliverable dispute occurs, dispute arbitration locks state and triggers manual audit review.
              </div>
            </div>
          )}

          {/* Mode 3: Visual KYC Flow */}
          {diagramMode === 'kyc' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="text-xs font-semibold text-muted">VISUAL KYC & ROLE-BASED ACCESS CONTROL</div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-surface flex items-center justify-between text-xs text-primary">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-accent" />
                    <span>Student ID Upload & Hash Generation</span>
                  </div>
                  <span className="text-[10px] text-muted">SHA-256</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface flex items-center justify-between text-xs text-primary">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>Admin Verification & RBAC Role Assignment</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-semibold">Verified Freelancer</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface flex items-center justify-between text-xs text-primary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Bidding Privilege Unlocked</span>
                  </div>
                  <span className="text-[10px] text-muted font-mono">Access Granted</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── DeadManSwitch Case Study ──────────────────────────────────────────────────

const DeadManSwitchCaseStudy: React.FC = () => {
  const [diagramMode, setDiagramMode] = useState<'encryption' | 'heartbeat' | 'release'>('encryption');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: 3-Part Engineering Breakdown */}
      <div className="lg:col-span-6 space-y-6">
        {/* Part 1: Problem */}
        <div className="p-5 rounded-xl bg-surface space-y-2 transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <span className="w-6 h-6 rounded-md bg-accent/10 text-accent flex items-center justify-center text-xs">
              1
            </span>
            <span>The Problem Solved</span>
          </div>
          <p className="text-xs md:text-sm text-secondary leading-relaxed pl-8">
            Digital asset inheritance is an awkward problem. The typical options are flawed: you either trust a centralized company (an exchange or custodian) that can freeze or leak your keys, or you hand unencrypted credentials directly to relatives while you're still alive. I wanted a way to pass on sensitive access keys only if the owner stops checking in, without any third party ever seeing the plaintext data.
          </p>
        </div>

        {/* Part 2: Key Trade-off */}
        <div className="p-5 rounded-xl bg-surface space-y-2 border-l-4 border-l-accent transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <span className="w-6 h-6 rounded-md bg-primary text-surface flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>The Trade-off: Client-Side Encryption vs. On-Chain Storage</span>
          </div>
          <p className="text-xs md:text-sm text-secondary leading-relaxed pl-8">
            <strong className="font-semibold text-primary">The rejected approach:</strong> Storing encrypted data directly in contract storage is expensive ($0.64/KB on Ethereum mainnet) and permanently public.
            <br /><br />
            <strong className="font-semibold text-primary">The decision:</strong> Encrypt payloads with AES-256-GCM in the browser before they touch a network, then pin the shards to IPFS. The smart contract only tracks the IPFS content hash and the heartbeat timer. When the timer expires, the contract executes an ERC-4337 UserOperation to deliver the decryption keys to the beneficiary.
          </p>
        </div>

        {/* Part 3: Hindsight */}
        <div className="p-5 rounded-xl bg-surface space-y-2 transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <span className="w-6 h-6 rounded-md bg-accent/10 text-accent flex items-center justify-center text-xs">
              3
            </span>
            <span>What I Learned & What I'd Change</span>
          </div>
          <p className="text-xs md:text-sm text-secondary leading-relaxed pl-8">
            The biggest headache was reliable delivery without a centralized cron server polling the blockchain. The current implementation relies on IPFS pinning services; if those pins expire without being re-hosted, the shards can get lost. For v2, I'd connect long-term Filecoin storage deals and use ERC-4337 Paymasters so checking in doesn't require holding ETH in your wallet just for heartbeat gas.
          </p>
        </div>
      </div>

      {/* Right Column: Interactive System Architecture Diagram */}
      <div className="lg:col-span-6 rounded-2xl bg-surface p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-flat pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <Layers className="w-4 h-4 text-accent" />
            <span>Interactive Architecture Diagram</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-surface-subtle p-1 rounded-lg">
            {(['encryption', 'heartbeat', 'release'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setDiagramMode(mode)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all cursor-pointer ${diagramMode === mode
                    ? 'bg-surface text-accent font-semibold shadow-xs'
                    : 'text-muted hover:text-primary'
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Diagram Canvas */}
        <div className="p-4 rounded-xl bg-surface-subtle min-h-[300px] flex flex-col justify-between space-y-4">

          {/* Mode 1: Client-Side Encryption Flow */}
          {diagramMode === 'encryption' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs font-semibold text-muted flex items-center justify-between">
                <span>CLIENT-SIDE ENCRYPTION LAYER</span>
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-surface">Never leaves browser raw</span>
              </div>

              <div className="p-3 rounded-lg bg-surface flex items-center justify-between gap-3 text-xs font-medium text-primary">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-500" />
                  <span>Sensitive Payload (keys, docs)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted" />
                <span className="px-1.5 py-0.5 rounded-sm bg-rose-500/10 text-rose-500 text-[10px] font-mono-code">AES-256-GCM</span>
              </div>

              <div className="text-xs font-semibold text-muted flex items-center justify-between">
                <span>DECENTRALIZED STORAGE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-surface">IPFS Content Addressing</span>
              </div>

              <div className="p-3 rounded-lg bg-surface flex items-center justify-between gap-3 text-xs font-medium text-primary">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-accent" />
                  <span>Encrypted Shards → IPFS Nodes</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-sm bg-accent-light text-accent text-[10px] font-mono-code">CID Hash</span>
              </div>

              <div className="text-xs font-semibold text-muted flex items-center justify-between">
                <span>ON-CHAIN REGISTRY</span>
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-surface">ERC-4337 Smart Contract</span>
              </div>

              <div className="p-3 rounded-lg bg-surface flex items-center justify-between gap-3 text-xs font-medium text-primary">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-accent" />
                  <span>Contract Stores IPFS CID + Timer</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          )}

          {/* Mode 2: Heartbeat Mechanism */}
          {diagramMode === 'heartbeat' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="text-xs font-semibold text-muted">HEARTBEAT LIVENESS MECHANISM</div>

              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-surface flex items-center justify-between text-xs text-primary">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                    <div>
                      <div className="font-semibold">Owner Sends Ping Tx</div>
                      <div className="text-[10px] text-muted">Zero-value UserOperation resets timer</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-500 font-semibold">ACTIVE</span>
                </div>

                <div className="p-3 rounded-lg bg-surface flex items-center justify-between text-xs text-primary">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-amber-500" />
                    <div>
                      <div className="font-semibold">Timer Countdown Runs</div>
                      <div className="text-[10px] text-muted">Configurable interval (days/weeks)</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-amber-500 font-semibold">WATCHING</span>
                </div>

                <div className="p-3 rounded-lg bg-surface flex items-center justify-between text-xs text-primary">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-rose-500" />
                    <div>
                      <div className="font-semibold">Timer Elapses — No Ping</div>
                      <div className="text-[10px] text-muted">Contract transitions to inheritance state</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-rose-500/10 text-rose-500 font-semibold">TRIGGERED</span>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Key Release Flow */}
          {diagramMode === 'release' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="text-xs font-semibold text-muted">TRUSTLESS KEY RELEASE FLOW</div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-surface flex items-center justify-between text-xs text-primary">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-rose-500" />
                    <span>Heartbeat Timer Elapses On-Chain</span>
                  </div>
                  <span className="text-[10px] text-rose-500 font-semibold font-mono-code">TRIGGER</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface flex items-center justify-between text-xs text-primary">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-accent" />
                    <span>ERC-4337 UserOperation Bundle Executes</span>
                  </div>
                  <span className="text-[10px] text-muted font-mono-code">Paymaster</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface flex items-center justify-between text-xs text-primary">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-accent" />
                    <span>IPFS CID Delivered to Beneficiary Address</span>
                  </div>
                  <span className="text-[10px] text-muted font-mono-code">On-Chain</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface flex items-center justify-between text-xs text-primary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Beneficiary Decrypts Locally with Shard Keys</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-semibold">Inherited</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface text-xs text-muted leading-relaxed">
                <strong className="font-semibold text-primary">Zero-custody guarantee:</strong> No single party — not the contract deployer, not IPFS nodes, not MetaMask — can reconstruct the payload without both the IPFS shards and the beneficiary decryption key.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Case Study Switcher Shell ─────────────────────────────────────────────────

type StudyId = 'sajilogig' | 'deadmanswitch';

export const CaseStudy: React.FC = () => {
  const [expandedStudy, setExpandedStudy] = useState<StudyId | null>(null);
  const detailRef = React.useRef<HTMLDivElement>(null);

  const studyCards: {
    id: StudyId;
    title: string;
    badge: string;
    subtitle: string;
    summary: string;
    takeaways: string[];
    tech: string[];
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
      {
        id: 'sajilogig',
        title: 'SajiloGig',
        badge: 'Freelance Platform',
        subtitle: 'Building a simulated escrow state machine for student freelancers',
        summary:
          'Why I chose a server-side state machine over Ethereum smart contracts for low-value micro-gigs, and how I handled escrow dispute edge cases.',
        takeaways: [
          'Simulated Escrow vs. Ethereum gas costs ($0 fee vs $5–$20/tx on mainnet)',
          'State-machine transitions (funded → working → submitted → approved)',
          'Photo KYC checks to reduce throwaway client accounts',
          'Auto-resolution timeouts to prevent disputed funds from getting stuck',
        ],
        tech: ['PHP', 'MySQL', 'State Machine', 'RBAC', 'KYC Engine'],
        icon: DollarSign,
      },
      {
        id: 'deadmanswitch',
        title: 'DeadManSwitch',
        badge: 'Decentralized Inheritance',
        subtitle: 'Triggering digital inheritance on-chain without a custodian',
        summary:
          'Using browser-side AES-256-GCM encryption, IPFS sharding, and ERC-4337 smart contract triggers to pass on access keys automatically.',
        takeaways: [
          'Encrypting payloads in the browser so plaintext never touches a server',
          'Storing hashes on-chain to bypass expensive Ethereum storage ($0.64/KB)',
          'ERC-4337 account abstraction to automate beneficiary key release',
        ],
        tech: ['React', 'ethers.js', 'ERC-4337', 'AES-256-GCM', 'IPFS'],
        icon: Lock,
      },
    ];

  const handleToggleStudy = (id: StudyId) => {
    if (expandedStudy === id) {
      setExpandedStudy(null);
    } else {
      setExpandedStudy(id);
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <section id="case-study" className="py-16 md:py-24 border-t border-flat max-w-6xl mx-auto px-4 md:px-8">
      {/* Section Header */}
      <div className="space-y-3 mb-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent" />
          <span>Case Studies</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Engineering Notes & Architecture
            </h2>
            <p className="text-secondary text-sm md:text-base mt-1 max-w-2xl">
              Breakdowns of technical trade-offs, architecture decisions, and what I learned from building these systems.
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Case Study Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {studyCards.map((study) => {
          const IconComponent = study.icon;
          const isExpanded = expandedStudy === study.id;

          return (
            <div
              key={study.id}
              onClick={() => handleToggleStudy(study.id)}
              className={`group rounded-2xl bg-surface border border-transparent p-6 md:p-7 flex flex-col justify-between space-y-6 transition-all duration-300 cursor-pointer relative overflow-hidden ${isExpanded
                  ? 'border-primary ring-2 ring-primary/20 shadow-md'
                  : 'hover:border-accent hover:shadow-sm'
                }`}
            >
              <div className="space-y-4">
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono-code font-semibold px-2.5 py-0.5 rounded-md bg-surface-subtle border-flat text-muted uppercase tracking-wider">
                    {study.badge}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isExpanded
                        ? 'bg-primary text-surface'
                        : 'bg-surface-subtle text-primary group-hover:bg-primary group-hover:text-surface'
                      }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-xl font-bold text-primary tracking-tight group-hover:text-primary transition-colors flex items-center gap-2">
                    <span>{study.title}</span>
                  </h3>
                  <p className="text-xs font-medium text-muted mt-1">{study.subtitle}</p>
                </div>

                {/* Summary */}
                <p className="text-xs md:text-sm text-secondary leading-relaxed">
                  {study.summary}
                </p>

                {/* Key Takeaways */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
                    Key Architectural Takeaways:
                  </div>
                  {study.takeaways.map((takeaway, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Tech Tags & Action Button */}
              <div className="pt-2 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {study.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono-code text-muted bg-surface-subtle"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStudy(study.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${isExpanded
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 border border-zinc-200/60 dark:border-zinc-800'
                    }`}
                >
                  <span>
                    {isExpanded ? 'Viewing Case Study (Click to Collapse)' : 'Read Full Case Study'}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Descriptive Form Section */}
      {expandedStudy && (
        <div
          ref={detailRef}
          className="scroll-mt-24 rounded-2xl bg-surface border-flat p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300 shadow-lg"
        >
          {/* Descriptive Form Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-flat">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-code font-bold px-2 py-0.5 rounded-md bg-primary text-surface uppercase">
                  Active Deep Dive
                </span>
                <span className="text-xs text-muted font-medium">
                  {expandedStudy === 'sajilogig' ? 'Platform Architecture' : 'Web3 Protocol'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-primary tracking-tight">
                {expandedStudy === 'sajilogig'
                  ? 'SajiloGig: Engineering Escrow Systems & Trust for Micro-Freelancing'
                  : 'DeadManSwitch: Trustless Digital Inheritance with ERC-4337 Account Abstraction'}
              </h3>
            </div>

            {/* Controls: Switcher + Close Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  setExpandedStudy(expandedStudy === 'sajilogig' ? 'deadmanswitch' : 'sajilogig')
                }
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-subtle hover:bg-surface border-flat text-muted hover:text-primary transition-colors cursor-pointer"
              >
                Switch to {expandedStudy === 'sajilogig' ? 'DeadManSwitch' : 'SajiloGig'}
              </button>

              <button
                onClick={() => setExpandedStudy(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-subtle hover:bg-rose-500/10 hover:text-rose-500 border-flat text-muted transition-colors cursor-pointer flex items-center gap-1.5"
                title="Collapse Case Study"
              >
                <span>Close</span>
                <span className="text-xs">✕</span>
              </button>
            </div>
          </div>

          {/* Render Full Descriptive Study Content & Diagrams */}
          {expandedStudy === 'sajilogig' && <SajiloGigCaseStudy />}
          {expandedStudy === 'deadmanswitch' && <DeadManSwitchCaseStudy />}

          {/* Bottom Close Button */}
          <div className="pt-6 border-t border-flat flex justify-center">
            <button
              onClick={() => {
                setExpandedStudy(null);
                document.getElementById('case-study')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span>Collapse Case Study</span>
              <ArrowRight className="w-3.5 h-3.5 -rotate-90" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
