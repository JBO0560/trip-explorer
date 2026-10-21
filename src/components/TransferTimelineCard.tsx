import React from 'react';
import { Plane, Train, Clock } from 'lucide-react';
import { TransferConnection } from '../types/trip';

interface TransferCardProps {
  transfer: TransferConnection;
}

/**
 * Production Segmented Flight Journey Timeline Card
 * Displays:
 * - Prominent total travel time banner
 * - Step-by-step segment flight details
 * - Intermediate layover connection windows
 */
export const TransferTimelineCard: React.FC<TransferCardProps> = ({ transfer }) => {
  const isFlight = transfer.type === 'flight';

  return (
    <div className="flex flex-col gap-2 p-3 text-xs bg-slate-900/90 rounded-xl border border-slate-800 shadow-md">
      {/* Total duration header banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-sky-950/80 to-indigo-950/80 p-2.5 rounded-lg border border-sky-800/40">
        <div className="flex items-center gap-1.5 font-bold text-white">
          {isFlight ? <Plane className="w-3.5 h-3.5 text-sky-400" /> : <Train className="w-3.5 h-3.5 text-amber-400" />}
          <span className="font-mono text-sky-200">{transfer.transitCode || transfer.carrier}</span>
        </div>
        {transfer.duration && (
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60 shadow-sm">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{transfer.duration}</span>
          </div>
        )}
      </div>

      {transfer.notes && (
        <div className="text-[11px] text-slate-400 px-0.5">
          {transfer.notes}
        </div>
      )}

      {/* Segments timeline list */}
      {transfer.segments && transfer.segments.length > 0 ? (
        <div className="space-y-2 pl-2 border-l-2 border-slate-800 ml-1.5 my-1">
          {transfer.segments.map((seg, idx) => (
            <div key={idx} className="relative pl-3 space-y-0.5">
              <div className="absolute -left-[13px] top-1.5 w-2.5 h-2.5 rounded-full bg-sky-400 ring-2 ring-slate-900"></div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-white">{seg.from} &rarr; {seg.to}</span>
                <span className="font-mono text-slate-300 font-semibold">{seg.departureTime} - {seg.arrivalTime}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono text-sky-400 font-semibold">{seg.transitCode}</span>
                {seg.seatNotes && <span>{seg.seatNotes}</span>}
              </div>

              {/* Layover connector between flight segments */}
              {idx === 0 && transfer.layover && (
                <div className="my-1.5 py-1 px-2.5 bg-amber-950/50 rounded-lg border border-amber-900/50 text-[10px] text-amber-300 flex items-center justify-between">
                  <span>🔄 Layover in {transfer.layover.city || transfer.layover.airportCode}</span>
                  <span className="font-bold">{transfer.layover.duration}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        transfer.departureTime && transfer.arrivalTime && (
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono pt-1 border-t border-slate-800">
            <span>🛫 {transfer.departureTime}</span>
            <span>🛬 {transfer.arrivalTime}</span>
          </div>
        )
      )}
    </div>
  );
};
