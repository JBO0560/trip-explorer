import React, { useState } from 'react';
import { useTripData } from './hooks/useTripData';
import { MapPin, Calendar, Plane, Train, Camera } from 'lucide-react';
import { TripMap } from './components/TripMap';
import { WhatsAppSnapshotModal } from './components/WhatsAppSnapshotModal';

export const App: React.FC = () => {
  const { trip } = useTripData();

  const [activeLegId, setActiveLegId] = useState<string>(trip.legs[0]?.id || '');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const activeLeg = trip.legs.find((l) => l.id === activeLegId) || trip.legs[0];

  const totalDays = trip.legs.reduce((acc, leg) => acc + (leg.approxDays || 0), 0);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            🌏
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              {trip.title}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${trip.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {trip.status === 'confirmed' ? 'Flights Confirmed' : 'Tentative Dates'}
              </span>
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {trip.overallDateRange} • {totalDays} total days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/25 active:scale-95 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            WhatsApp Screenshot Card
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Itinerary & Legs */}
        <aside className="w-96 border-r border-slate-800 bg-slate-900/40 flex flex-col h-full overflow-y-auto">
          <div className="p-4 border-b border-slate-800/80">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Route Stays</h2>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {trip.legs.map((leg, idx) => {
              const isActive = leg.id === activeLeg?.id;
              const transferAfter = trip.transfers.find((t) => t.fromLegId === leg.id);

              return (
                <div key={leg.id} className="space-y-3">
                  <div
                    onClick={() => setActiveLegId(leg.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold border border-slate-700">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="text-sm font-semibold text-white">{leg.name}</h3>
                          <span className="text-xs text-slate-400">{leg.country}</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50 font-medium">
                        ~{leg.approxDays} days
                      </span>
                    </div>

                    {/* Highlights */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {leg.highlights.slice(0, 3).map((hl, i) => (
                        <span key={i} className="text-[11px] bg-slate-800/70 text-slate-300 px-2 py-0.5 rounded border border-slate-700/50">
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Transfer indicator */}
                  {transferAfter && (
                    <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-950/50 rounded-lg border border-slate-800/50">
                      {transferAfter.type === 'flight' ? (
                        <Plane className="w-3.5 h-3.5 text-sky-400" />
                      ) : (
                        <Train className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span className="font-medium text-slate-300">{transferAfter.notes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center / Right: Map & Detail Panel */}
        <main className="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden">
          {/* Interactive Leaflet Map */}
          <div className="absolute inset-0 z-0">
            <TripMap
              legs={trip.legs}
              transfers={trip.transfers}
              activeLegId={activeLegId}
              onSelectLeg={(id) => setActiveLegId(id)}
            />
          </div>

          {/* Floating Active Leg Info Card Overlay */}
          <div className="absolute bottom-6 right-6 z-10 max-w-sm w-full pointer-events-auto">
            <div className="border border-slate-700/80 bg-slate-900/90 rounded-2xl p-4 backdrop-blur shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">Active Leg</span>
                  <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    {activeLeg?.name}, {activeLeg?.country}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Duration</span>
                  <p className="text-xs font-semibold text-slate-200">~{activeLeg?.approxDays} Days</p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Highlights</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeLeg?.highlights.map((h, i) => (
                    <span key={i} className="text-[11px] bg-slate-800/80 text-slate-200 px-2 py-0.5 rounded border border-slate-700/60">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                <span>Coordinates:</span>
                <span className="font-mono text-slate-300">{activeLeg?.coordinates.join(', ')}</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* WhatsApp Snapshot Card Modal */}
      <WhatsAppSnapshotModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        trip={trip}
        activeLegId={activeLegId}
      />
    </div>
  );
};
