import React, { useState } from 'react';
import { BookOpen, Layers, ArrowRight, CheckCircle2, ShieldCheck, Database, Server, Smartphone, KeyRound, DollarSign } from 'lucide-react';

export const CaseStudy: React.FC = () => {
  const [diagramMode, setDiagramMode] = useState<'architecture' | 'escrow' | 'kyc'>('architecture');

  return (
    <section id="case-study" className="py-16 md:py-24 border-t border-flat max-w-6xl mx-auto px-4 md:px-8">
      {/* Section Header */}
      <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-accent" />
        <span>Engineering Case Study</span>
      </div>

      <div className="space-y-4 max-w-3xl mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
          SajiloGig: Engineering Escrow Systems & Trust for Micro-Freelancing
        </h2>
        <p className="text-secondary text-base leading-relaxed">
          A deep dive into architecture choices, payment security trade-offs, and systems thinking behind a student developer platform.
        </p>
      </div>

      {/* Grid: Written Breakdown Left, Interactive Architecture Diagram Right */}
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
              Student freelancers in emerging markets face extreme trust asymmetry. Clients worry about unfulfilled code deliverables, while students worry about non-payment after work completion. Traditional escrow services require expensive merchant accounts and high minimum transaction thresholds unusable for $20–$100 micro-gigs.
            </p>
          </div>

          {/* Part 2: Key Trade-off */}
          <div className="p-5 rounded-xl bg-surface space-y-2 border-l-4 border-l-accent transition-colors">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <span className="w-6 h-6 rounded-md bg-accent text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Key Trade-off: Simulated Escrow vs. Smart Contracts</span>
            </div>
            <p className="text-xs md:text-sm text-secondary leading-relaxed pl-8">
              <strong className="font-semibold text-primary">The Decision:</strong> Instead of deploying Ethereum L1 smart contracts, I engineered a server-side state-machine escrow in PHP.
              <br />
              <strong className="font-semibold text-primary">Why:</strong> Over 85% of student clients lacked crypto wallets. Ethereum gas spikes ($5–$20 per tx) would consume up to 30% of micro-gig values. Simulated escrow allowed zero gas fees, instant web2 fiat onboarding, and programmatic release upon client sign-off.
            </p>
          </div>

          {/* Part 3: Hindsight */}
          <div className="p-5 rounded-xl bg-surface space-y-2 transition-colors">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <span className="w-6 h-6 rounded-md bg-accent/10 text-accent flex items-center justify-center text-xs">
                3
              </span>
              <span>Hindsight & Retrospective Improvements</span>
            </div>
            <p className="text-xs md:text-sm text-secondary leading-relaxed pl-8">
              While simulated escrow eliminated user onboarding friction, it retained counterparty risk on the platform server. With hindsight and modern Web3 advancements (ERC-4337 Account Abstraction), v2 will use gasless smart contracts with Paymasters—providing true trustless security without forcing students to hold crypto tokens.
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
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all cursor-pointer ${
                    diagramMode === mode
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
    </section>
  );
};
