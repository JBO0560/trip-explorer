import React, { useState } from 'react';
import { TripData } from './types/trip';
import { initialTripData } from './data/initialTrip';
import { MapPin, Calendar, Plane, Train, Camera } from 'lucide-react';

export const App: React.FC = () => {
  const [trip] = useState<TripData>(() => {
    const saved = localStorage.getItem('trip_explorer_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return initialTripData;
  });

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
        <main className="flex-1 flex flex-col h-full bg-slate-950 relative">
          {/* Mock Map Canvas / Route Display */}
          <div className="flex-1 relative flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
            <div className="max-w-xl w-full border border-slate-800 bg-slate-900/60 rounded-2xl p-6 backdrop-blur shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">Active Region</span>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-500" />
                    {activeLeg?.name}, {activeLeg?.country}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Duration</span>
                  <p className="text-sm font-semibold text-slate-200">~{activeLeg?.approxDays} Days</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Key Highlights</h4>
                <div className="grid grid-cols-2 gap-2">
                  {activeLeg?.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Transit link preview */}
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Coordinates:</span>
                <span className="font-mono text-slate-300">{activeLeg?.coordinates.join(', ')}</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* WhatsApp Snapshot Card Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" /> WhatsApp Sharing Card
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            {/* Visual Card to Screenshot */}
            <div id="whatsapp-card" className="p-5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-700 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-base text-white tracking-tight">🇰🇷 Korea & 🇯🇵 Japan Trip</h4>
                  <p className="text-[11px] text-indigo-300">{trip.overallDateRange}</p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {trip.status}
                </span>
              </div>

              <div className="space-y-2 border-y border-slate-800/80 py-3">
                {trip.legs.map((leg, i) => (
                  <div key={leg.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">
                      {i + 1}. {leg.name} ({leg.country})
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">~{leg.approxDays} days</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 text-center">
                📸 Screenshot & share into WhatsApp group
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
