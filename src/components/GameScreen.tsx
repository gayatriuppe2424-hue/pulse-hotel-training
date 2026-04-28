import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CRISIS_DATASET } from '../data/mockScenarios';

export const GameScreen: React.FC = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();

  const [currentId, setCurrentId] = useState(scenarioId || CRISIS_DATASET[0].id);
  const [points, setPoints] = useState(0);
  const [fadeKey, setFadeKey] = useState(currentId);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gameResult, setGameResult] = useState<'SUCCESS' | 'GAMEOVER' | null>(null);
  const [timeLeft, setTimeLeft] = useState(40);

  // Outcome Animation States
  const [activeOutcomeImage, setActiveOutcomeImage] = useState<string | null>(null);
  const [isAnimatingOutcome, setIsAnimatingOutcome] = useState(false);
  const [outcomeMessage, setOutcomeMessage] = useState<string | null>(null);

  const scenario = CRISIS_DATASET.find((s) => s.id === currentId);

  // Trigger fade-in effect when currentId changes
  useEffect(() => {
    if (currentId !== fadeKey) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setFadeKey(currentId);
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentId, fadeKey]);

  useEffect(() => {
    if (scenarioId && scenarioId !== currentId && !gameResult) {
      setCurrentId(scenarioId);
    }
  }, [scenarioId, currentId, gameResult]);

  // Reset timer on new scenario
  useEffect(() => {
    setTimeLeft(40);
  }, [currentId]);

  // Countdown timer
  useEffect(() => {
    if (gameResult || isAnimatingOutcome) return;

    if (timeLeft <= 0) {
      setGameResult('GAMEOVER');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameResult, isAnimatingOutcome]);

  const handleActionClick = (option: any) => {
    if (isAnimatingOutcome) return;

    if (option.outcomeImageUrl) {
      setIsAnimatingOutcome(true);
      setActiveOutcomeImage(option.outcomeImageUrl);
      setOutcomeMessage(option.outcome);
      
      setTimeout(() => {
        setIsAnimatingOutcome(false);
        setActiveOutcomeImage(null);
        setOutcomeMessage(null);
        processAction(option.nextId, option.points);
      }, 2500); // 2.5 second animation delay
    } else {
      processAction(option.nextId, option.points);
    }
  };

  const processAction = (nextId: string, earnedPoints: number) => {
    setPoints((prev) => prev + earnedPoints);
    if (nextId === 'SUCCESS' || nextId === 'GAMEOVER') {
      setGameResult(nextId);
    } else {
      setCurrentId(nextId);
      navigate(`/game/${nextId}`, { replace: true });
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // ── Game Result Overlay ─────────────────────────────────────────────────
  if (gameResult) {
    return (
      <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-50 items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="mb-6">
            {gameResult === 'SUCCESS' ? (
              <svg className="w-20 h-20 mx-auto text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-20 h-20 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">
            {gameResult === 'SUCCESS' ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'}
          </h2>
          <p className="text-slate-400 mb-8 font-medium">Simulation Terminated</p>
          <div className="bg-slate-950 rounded-xl p-6 mb-8 border border-slate-800 shadow-inner">
            <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">Final Safety Score</p>
            <p className={`text-5xl font-black tabular-nums ${gameResult === 'SUCCESS' ? 'text-emerald-400' : 'text-blue-500'}`}>
              {points}
            </p>
          </div>
          <button
            onClick={handleBackToHome}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg hover:shadow-indigo-500/25"
          >
            Return to Headquarters
          </button>
        </div>
      </div>
    );
  }

  if (!scenario) {
    return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Scenario Not Found</div>;
  }

  const crisisActive = scenario.category.includes('Fire');

  // ── Main Game Screen ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0e17] text-slate-50 font-sans overflow-y-auto md:overflow-hidden">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-6 py-0 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shrink-0 h-[56px] sm:h-[64px]">
        <button
          onClick={handleBackToHome}
          className="text-slate-400 hover:text-white transition-colors text-sm font-semibold flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Back to Home</span>
        </button>

        {/* Centre title */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-white font-black text-xs sm:text-base tracking-tight">{scenario.category}</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">Crisis Active</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-4">
          <div className={`flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border ${timeLeft <= 10 ? 'bg-red-950/40 border-red-900/50' : 'bg-slate-900 border-slate-700'}`}>
            <span className={`text-xs font-bold uppercase tracking-widest hidden sm:inline-block ${timeLeft <= 10 ? 'text-red-400' : 'text-slate-400'}`}>Time</span>
            <span className={`text-base sm:text-xl font-black tabular-nums ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-900 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest hidden sm:inline-block">Safety Score</span>
            <span className="text-base sm:text-xl font-black tabular-nums text-amber-400">{points}</span>
          </div>
        </div>
      </header>

      {/* ── 3-PANEL BODY ── */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 gap-2 sm:gap-4 p-2 sm:p-5">

        {/* ── LEFT: Monitoring Area ── */}
        <div className="relative flex-1 md:flex-1 min-h-[200px] sm:min-h-[280px] bg-[#0d1117] rounded-xl border border-slate-800 flex flex-col overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/70 bg-slate-950/50 shrink-0">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Monitoring Area</span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">LIVE</span>
            </div>
          </div>

          {/* Scene */}
          <div className={`flex-1 relative transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {crisisActive && !activeOutcomeImage && (
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(59,130,246,0.2)] pointer-events-none z-10 border-2 border-blue-500/15 animate-pulse rounded-b-xl" />
            )}

            {activeOutcomeImage ? (
              <div className="absolute inset-0 w-full h-full z-20 animate-fade-in bg-black">
                <img
                  src={activeOutcomeImage}
                  alt="Outcome Monitor"
                  className="w-full h-full object-cover opacity-90 transition-transform duration-1000 scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 z-30">
                  <p className="text-amber-400 font-mono text-[10px] tracking-widest uppercase mb-1 animate-pulse">Outcome Analysis</p>
                  <p className="text-lg text-slate-100 font-bold leading-snug drop-shadow-md">{outcomeMessage}</p>
                </div>
              </div>
            ) : scenario.imageUrl ? (
              <>
                <img
                  src={scenario.imageUrl}
                  alt="Scene Monitor"
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 z-20">
                  <p className="text-slate-500 font-mono text-[9px] tracking-widest uppercase mb-1">Visual Feed Analysis</p>
                  <p className="text-sm text-slate-200 font-medium leading-snug">{scenario.visualCue}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-5 text-center p-8">
                <svg className="w-20 h-20 stroke-current text-slate-800" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8"
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <p className="text-slate-600 font-mono text-xs tracking-widest uppercase mb-3">Monitoring Area...</p>
                  <p className="text-slate-400 text-base font-medium leading-relaxed">{scenario.visualCue}</p>
                </div>
              </div>
            )}
          </div>

          {/* Camera label */}
          <div className="shrink-0 px-4 py-2 border-t border-slate-800/70 bg-slate-950/50 flex items-center">
            <span className="font-mono text-[9px] text-slate-700 uppercase tracking-widest">CAM · {scenario.id}</span>
            <span className="ml-auto font-mono text-[9px] text-slate-700 uppercase tracking-widest">{scenario.category}</span>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="w-full md:w-[680px] flex flex-col gap-2 sm:gap-4 shrink-0">

          {/* ── TOP-RIGHT: Active Emergencies ── */}
          <div className="flex-1 bg-[#0d1117] rounded-xl border border-slate-800 flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/70 bg-slate-950/50 shrink-0">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-200">Active Emergencies</span>
              <div className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            </div>

            {/* Scrollable content */}
            <div
              className={`flex-1 overflow-y-auto p-4 flex flex-col gap-3 transition-all duration-500 ${
                isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Active alert card */}
              <div className="border-l-[3px] border-red-500 bg-red-950/20 rounded-r-lg px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-red-400 font-bold text-xs tracking-wide">{scenario.category}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{scenario.narrative}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest px-1">Response Protocol</p>
                {scenario.options.map((option, index) => {
                  const colors = [
                    'border-cyan-800/60 hover:border-cyan-500/80 hover:bg-cyan-950/40 text-cyan-300',
                    'border-violet-800/60 hover:border-violet-500/80 hover:bg-violet-950/40 text-violet-300',
                    'border-fuchsia-800/60 hover:border-fuchsia-500/80 hover:bg-fuchsia-950/40 text-fuchsia-300',
                  ];
                  const btnLabels = ['A', 'B', 'C'];
                  return (
                    <button
                      key={index}
                      onClick={() => handleActionClick(option)}
                      className={`w-full py-3 px-3 bg-slate-900/60 border rounded-lg text-left text-xs font-semibold transition-all duration-200 flex items-center gap-3 group ${colors[index % colors.length]} ${isAnimatingOutcome ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isAnimatingOutcome}
                    >
                      <span className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs shrink-0 group-hover:bg-slate-700 transition-colors">
                        {btnLabels[index]}
                      </span>
                      <span className="text-slate-200 group-hover:text-white transition-colors leading-snug">
                        {option.label.substring(option.label.indexOf(':') + 1).trim()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── BOTTOM-RIGHT: System Logs ── */}
          <div className="hidden sm:flex h-[190px] bg-[#0d1117] rounded-xl border border-slate-800 flex-col overflow-hidden shrink-0">
            {/* Panel header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/70 bg-slate-950/50 shrink-0">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-200">System Logs</span>
              <span className="ml-auto font-mono text-[9px] text-slate-700 uppercase tracking-widest">Real-Time</span>
            </div>

            {/* Log entries */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 font-mono">
              <div className="flex items-start gap-2 bg-amber-950/25 border-l-2 border-amber-500 pl-2 pr-3 py-2 rounded-r-md">
                <span className="text-amber-400 text-[9px] font-bold uppercase tracking-wider shrink-0 mt-px">CRITICAL</span>
                <span className="text-slate-300 text-[10px] leading-snug">
                  ALERT: {scenario.category} — {scenario.narrative.split('.')[0]}.
                </span>
              </div>
              <div className="flex items-start gap-2 pl-2 pr-3 py-1.5">
                <span className="text-slate-600 text-[9px] font-bold uppercase tracking-wider shrink-0 mt-px">INFO</span>
                <span className="text-slate-600 text-[10px] leading-snug">Scenario loaded: {scenario.id} · {scenario.category}</span>
              </div>
              <div className="flex items-start gap-2 pl-2 pr-3 py-1.5">
                <span className="text-slate-600 text-[9px] font-bold uppercase tracking-wider shrink-0 mt-px">SYS</span>
                <span className="text-slate-600 text-[10px] leading-snug">Awaiting operator response selection…</span>
              </div>
              <div className="flex items-start gap-2 pl-2 pr-3 py-1.5">
                <span className="text-slate-700 text-[9px] font-bold uppercase tracking-wider shrink-0 mt-px">SYS</span>
                <span className="text-slate-700 text-[10px] leading-snug">Safety Score: {points} pts accumulated.</span>
              </div>
            </div>
          </div>

        </div>{/* end RIGHT COLUMN */}
      </div>{/* end 3-PANEL BODY */}

    </div>
  );
};

export default GameScreen;
