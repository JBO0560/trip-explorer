import React, { useState, useRef } from 'react';
import { TripData } from '../types/trip';
import {
  X,
  Share2,
  Copy,
  Download,
  Check,
  Calendar,
  MapPin,
  Plane,
  Train,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
  Building,
  Flag,
  ArrowRight,
  Compass
} from 'lucide-react';
import { toBlob, toPng } from 'html-to-image';

export type SnapshotCardMode = 'overview' | 'single-leg' | 'transit';

export interface WhatsAppSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData;
  activeLegId?: string;
}

export const WhatsAppSnapshotModal: React.FC<WhatsAppSnapshotModalProps> = ({
  isOpen,
  onClose,
  trip,
  activeLegId: initialActiveLegId
}) => {
  const [selectedMode, setSelectedMode] = useState<SnapshotCardMode>('overview');
  const [selectedLegId, setSelectedLegId] = useState<string>(
    initialActiveLegId || trip.legs[0]?.id || ''
  );
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'downloaded' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentLeg = trip.legs.find((l) => l.id === selectedLegId) || trip.legs[0];
  const totalDays = trip.legs.reduce((acc, leg) => acc + (leg.approxDays || 0), 0);

  // Derive country flags
  const countries = Array.from(new Set(trip.legs.map((l) => l.country)));
  const countryBadges = countries.map((c) => {
    if (c.toLowerCase().includes('korea')) return { name: c, flag: '🇰🇷' };
    if (c.toLowerCase().includes('japan')) return { name: c, flag: '🇯🇵' };
    return { name: c, flag: '🌏' };
  });

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    try {
      setCopyStatus('copying');
      setFeedbackMessage('');

      // Generate high-resolution blob for crisp display on Retina/mobile
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#090d16'
      });

      if (!blob) {
        throw new Error('Failed to generate image blob');
      }

      if (navigator.clipboard && typeof navigator.clipboard.write === 'function' && typeof ClipboardItem !== 'undefined') {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopyStatus('copied');
        setFeedbackMessage('Image copied to clipboard! Paste directly into WhatsApp.');
        setTimeout(() => setCopyStatus('idle'), 3000);
      } else {
        // Fallback for browsers without ClipboardItem image support
        await handleDownloadImage();
        setCopyStatus('idle');
        setFeedbackMessage('Direct clipboard image copy not supported in this browser; downloaded PNG instead!');
      }
    } catch (err: unknown) {
      console.error('Clipboard copy failed:', err);
      setCopyStatus('error');
      setFeedbackMessage('Could not copy image automatically. Please use Download PNG.');
      setTimeout(() => setCopyStatus('idle'), 4000);
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setDownloadStatus('downloading');
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#090d16'
      });

      const fileName = `whatsapp-trip-${selectedMode}-${selectedMode === 'single-leg' ? currentLeg?.id : 'card'}.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      setDownloadStatus('downloaded');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    } catch (err) {
      console.error('Download failed:', err);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="snapshot-modal-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="snapshot-modal-title" className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                WhatsApp Snapshot Card
              </h2>
              <p className="text-xs text-slate-400">Crisp high-contrast cards formatted for chat bubble viewing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls: Preset selector & Leg picker if single-leg */}
        <div className="px-5 py-3.5 bg-slate-950/60 border-b border-slate-800/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedMode('overview')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  selectedMode === 'overview'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Full Route Overview
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode('single-leg')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  selectedMode === 'single-leg'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> City Deep-Dive
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode('transit')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  selectedMode === 'transit'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Plane className="w-3.5 h-3.5" /> Transit & Flights
              </button>
            </div>

            {selectedMode === 'single-leg' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">City:</span>
                <select
                  value={selectedLegId}
                  onChange={(e) => setSelectedLegId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {trip.legs.map((leg) => (
                    <option key={leg.id} value={leg.id}>
                      {leg.name} ({leg.country})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Preview Scroll Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40 flex flex-col items-center justify-center">
          {/* Card Container Target for html-to-image export */}
          <div
            ref={cardRef}
            data-testid="snapshot-card"
            className="w-full max-w-[420px] rounded-2xl bg-gradient-to-b from-[#0e1626] to-[#090d16] border-2 border-indigo-500/30 p-5 shadow-2xl shadow-indigo-950/50 text-slate-100 flex flex-col gap-4 font-sans relative overflow-hidden"
            style={{
              boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 20px 0 rgba(99, 102, 241, 0.15)'
            }}
          >
            {/* Top Glow Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-400" />

            {/* PRESET 1: FULL ROUTE OVERVIEW */}
            {selectedMode === 'overview' && (
              <>
                <div className="flex items-start justify-between gap-3 border-b border-slate-800/90 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 tracking-wide uppercase mb-1">
                      <span>ITINERARY SNAPSHOT</span>
                    </div>
                    <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="font-medium">{trip.overallDateRange}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1">
                      {countryBadges.map((cb, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800/90 border border-slate-700/80 text-white shadow-sm flex items-center gap-1"
                        >
                          <span>{cb.flag}</span>
                          <span className="text-[11px]">{cb.name}</span>
                        </span>
                      ))}
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                        trip.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {trip.status === 'confirmed' ? 'Flights Confirmed' : 'Tentative Dates'}
                    </span>
                  </div>
                </div>

                {/* Overall Stats Pill Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Duration</span>
                    <p className="text-sm font-black text-indigo-300">{totalDays} Days</p>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Destinations</span>
                    <p className="text-sm font-black text-rose-300">{trip.legs.length} Cities</p>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Travelers</span>
                    <p className="text-sm font-black text-emerald-300 truncate">
                      {trip.travelers.length > 0 ? trip.travelers[0] : 'Solo'}
                    </p>
                  </div>
                </div>

                {/* Stop-by-stop Route Timeline */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Compass className="w-3 h-3 text-indigo-400" /> Planned Route & Stays
                  </span>

                  <div className="space-y-2">
                    {trip.legs.map((leg, index) => {
                      const transferAfter = trip.transfers.find((t) => t.fromLegId === leg.id);
                      return (
                        <div key={leg.id} className="space-y-1.5">
                          <div className="flex items-start justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 hover:border-slate-700 transition">
                            <div className="flex items-start gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                {index + 1}
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-bold text-white tracking-tight">{leg.name}</h4>
                                  <span className="text-[10px] font-medium text-slate-400">({leg.country})</span>
                                </div>
                                <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                                  {leg.highlights.slice(0, 2).join(' • ')}
                                </p>
                              </div>
                            </div>

                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 shrink-0">
                              ~{leg.approxDays}d
                            </span>
                          </div>

                          {/* Transit Connector between legs */}
                          {transferAfter && (
                            <div className="flex items-center gap-2 px-3 py-1 text-[11px] text-slate-300 bg-slate-950/80 border border-slate-800/80 rounded-lg ml-6">
                              {transferAfter.type === 'flight' ? (
                                <Plane className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                              ) : (
                                <Train className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              )}
                              <span className="truncate font-medium">{transferAfter.notes || `${transferAfter.type} transfer`}</span>
                              {transferAfter.transitCode && (
                                <span className="ml-auto font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                  {transferAfter.transitCode}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* PRESET 2: SINGLE LEG / CITY DEEP-DIVE */}
            {selectedMode === 'single-leg' && currentLeg && (
              <>
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 tracking-wider uppercase mb-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{currentLeg.country} STOP</span>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">
                      {currentLeg.name}
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-indigo-400" /> Duration: <strong className="text-white">~{currentLeg.approxDays} Days</strong>
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-white border border-slate-700 flex items-center gap-1">
                    {currentLeg.country.toLowerCase().includes('korea') ? '🇰🇷' : '🇯🇵'}
                    <span>{currentLeg.country}</span>
                  </span>
                </div>

                {/* Accommodation Details */}
                {currentLeg.accommodation && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Building className="w-3 h-3 text-indigo-400" /> Accommodation
                      </span>
                      {currentLeg.accommodation.bookingRef && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                          Ref: {currentLeg.accommodation.bookingRef}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white">{currentLeg.accommodation.name}</h4>
                    {currentLeg.accommodation.notes && (
                      <p className="text-[11px] text-slate-300 leading-snug">{currentLeg.accommodation.notes}</p>
                    )}
                  </div>
                )}

                {/* Highlights Pills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Must-See Highlights
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentLeg.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg shadow-sm"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key POIs / Activities */}
                {currentLeg.activities && currentLeg.activities.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Flag className="w-3 h-3 text-emerald-400" /> Planned Activities & POIs
                    </span>
                    <div className="space-y-1.5">
                      {currentLeg.activities.map((act) => (
                        <div
                          key={act.id}
                          className="bg-slate-900/70 border border-slate-800 rounded-lg p-2 text-xs flex flex-col gap-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{act.name}</span>
                            {act.category && (
                              <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                {act.category}
                              </span>
                            )}
                          </div>
                          {act.notes && (
                            <p className="text-[11px] text-slate-300 line-clamp-2">{act.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* PRESET 3: TRANSIT & FLIGHTS SCHEDULE */}
            {selectedMode === 'transit' && (
              <>
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-sky-400 tracking-wider uppercase mb-1">
                      <Plane className="w-3 h-3" />
                      <span>LOGISTICS & TRANSFERS</span>
                    </div>
                    <h3 className="text-lg font-black text-white tracking-tight">
                      Transit & Flight Schedule
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {trip.transfers.length} intercity connections scheduled
                    </p>
                  </div>

                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Chronological
                  </span>
                </div>

                <div className="space-y-2.5">
                  {trip.transfers.map((transit, idx) => {
                    const fromCity = trip.legs.find((l) => l.id === transit.fromLegId)?.name || transit.fromLegId;
                    const toCity = trip.legs.find((l) => l.id === transit.toLegId)?.name || transit.toLegId;

                    return (
                      <div
                        key={transit.id}
                        className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold border border-slate-700">
                              {idx + 1}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                              <span>{fromCity}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                              <span>{toCity}</span>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              transit.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            {transit.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                          <div className="flex items-center gap-1.5 text-slate-200">
                            {transit.type === 'flight' ? (
                              <Plane className="w-3.5 h-3.5 text-sky-400" />
                            ) : (
                              <Train className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span className="font-semibold">{transit.carrier || transit.type.toUpperCase()}</span>
                            {transit.transitCode && (
                              <span className="font-mono text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded text-[11px] border border-indigo-800/60">
                                {transit.transitCode}
                              </span>
                            )}
                          </div>
                        </div>

                        {transit.notes && (
                          <p className="text-[11px] text-slate-300 leading-snug">{transit.notes}</p>
                        )}

                        {transit.seatNotes && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Info className="w-3 h-3 text-indigo-400" />
                            <span>Seats: {transit.seatNotes}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Footer Badge / Watermark */}
            <div className="pt-2 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1 font-semibold text-slate-300">
                <span>Wayfinder Travel Card</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[9px] text-slate-500">
                <span>📸 Ready for WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackMessage && (
          <div
            role="status"
            className="px-5 py-2 text-xs font-semibold text-center bg-indigo-950/80 text-indigo-300 border-t border-indigo-900/50 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" /> {feedbackMessage}
          </div>
        )}

        {/* Export Action Buttons Footer */}
        <div className="px-5 py-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>High-DPI 2.5x retina snapshot</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyImage}
              disabled={copyStatus === 'copying'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition shadow-md shadow-emerald-600/25 active:scale-95 cursor-pointer"
            >
              {copyStatus === 'copied' ? (
                <>
                  <Check className="w-4 h-4 text-white" /> Copied Image!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Image to Clipboard
                </>
              )}
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={downloadStatus === 'downloading'}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition border border-slate-700 active:scale-95 cursor-pointer"
            >
              {downloadStatus === 'downloaded' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download PNG
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
