import React, { useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TripLeg, TransferConnection } from '../types/trip';
import { getCurvedFlightPath } from './geoUtils';
import { getCountryMeta } from '../utils/countryFlags';

export interface TripMapProps {
  legs: TripLeg[];
  transfers: TransferConnection[];
  activeLegId?: string;
  onSelectLeg?: (legId: string) => void;
  className?: string;
}

// Center view updater when active leg changes or initial mount
const MapController: React.FC<{
  legs: TripLeg[];
  activeLegId?: string;
}> = ({ legs, activeLegId }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (activeLegId) {
      const active = legs.find((l) => l.id === activeLegId);
      if (active) {
        // Pan smoothly towards selected leg
        map.flyTo(active.coordinates, Math.max(map.getZoom(), 7), {
          duration: 1.2,
          easeLinearity: 0.25,
        });
        return;
      }
    }

    if (legs.length > 0) {
      const bounds = L.latLngBounds(legs.map((l) => l.coordinates));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, activeLegId, legs]);

  return null;
};

// Create custom DOM Marker Icon with number and country styling
function createLegIcon(leg: TripLeg, index: number, isActive: boolean) {
  const { flag, badgeColor } = getCountryMeta(leg.country);
  const ringColor = isActive ? 'ring-4 ring-indigo-400 scale-110' : 'ring-2 ring-slate-800';

  const html = `
    <div class="relative group cursor-pointer transition-transform duration-200 select-none ${ringColor} rounded-full">
      <div class="w-10 h-10 rounded-full ${isActive ? 'bg-indigo-600 shadow-lg shadow-indigo-500/50' : 'bg-slate-900 border border-slate-700'} flex items-center justify-center text-white font-bold text-sm">
        ${index + 1}
      </div>
      <div class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full ${badgeColor} text-[10px] flex items-center justify-center border border-white/80 shadow">
        ${flag}
      </div>
      <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-slate-100 text-[11px] font-semibold px-2 py-0.5 rounded shadow-md border border-slate-700 pointer-events-none">
        ${leg.name}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-trip-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
}

function createFlightBadgeIcon(label: string) {
  const html = `
    <div class="flex items-center gap-1 bg-sky-600/90 hover:bg-sky-500 text-white text-[11px] font-bold px-2 py-1 rounded-full shadow-lg border border-sky-300/40 cursor-pointer backdrop-blur transition-transform hover:scale-105">
      <span>✈️</span>
      <span>${label}</span>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-flight-badge',
    iconSize: [110, 26],
    iconAnchor: [55, 13],
  });
}

function createLayoverBadgeIcon(label: string) {
  const html = `
    <div class="flex items-center gap-1 bg-amber-600/90 hover:bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-amber-300/40 cursor-pointer backdrop-blur transition-transform hover:scale-105 whitespace-nowrap">
      <span>🔄</span>
      <span>${label}</span>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-layover-badge',
    iconSize: [110, 22],
    iconAnchor: [55, 11],
  });
}

export const TripMap: React.FC<TripMapProps> = ({
  legs,
  transfers,
  activeLegId,
  onSelectLeg,
  className = '',
}) => {
  // Default initial center point (calculated dynamically from trip legs if present, or global fallback)
  const defaultCenter: [number, number] = useMemo(() => {
    if (legs.length > 0) {
      const avgLat = legs.reduce((acc, l) => acc + l.coordinates[0], 0) / legs.length;
      const avgLng = legs.reduce((acc, l) => acc + l.coordinates[1], 0) / legs.length;
      return [avgLat, avgLng];
    }
    return [30.0, 30.0];
  }, [legs]);
  const defaultZoom = legs.length > 0 ? 5 : 3;

  // Active leg POIs (if any have coordinates)
  const activeLeg = useMemo(() => legs.find((l) => l.id === activeLegId), [legs, activeLegId]);

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        minZoom={4}
        maxZoom={14}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ background: '#090d16' }}
      >
        <MapController legs={legs} activeLegId={activeLegId} />

        {/* Esri World Street Map tiles - global English labels, no API key required */}
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          maxZoom={18}
        />

        {/* Render Transfers */}
        {transfers.map((transfer) => {
          const fromLeg = legs.find((l) => l.id === transfer.fromLegId);
          const toLeg = legs.find((l) => l.id === transfer.toLegId);
          if (!fromLeg || !toLeg) return null;

          const isFlight = transfer.type === 'flight';
          const isTransferActive =
            activeLegId === transfer.fromLegId || activeLegId === transfer.toLegId;

          if (isFlight) {
            const hasLayoverCoords = Boolean(transfer.layover?.coordinates);
            const flightArcs: [number, number][][] = hasLayoverCoords && transfer.layover?.coordinates
              ? [
                  getCurvedFlightPath(fromLeg.coordinates, transfer.layover.coordinates, 20, 0.18),
                  getCurvedFlightPath(transfer.layover.coordinates, toLeg.coordinates, 20, 0.18),
                ]
              : [getCurvedFlightPath(fromLeg.coordinates, toLeg.coordinates, 30, 0.22)];

            return (
              <React.Fragment key={transfer.id}>
                {/* Glow polyline(s) for flight route */}
                {flightArcs.map((arc, arcIdx) => (
                  <Polyline
                    key={`${transfer.id}-arc-${arcIdx}`}
                    positions={arc}
                    pathOptions={{
                      color: '#0284c7', // Sky blue
                      weight: isTransferActive ? 5 : 3.5,
                      opacity: 0.85,
                      dashArray: '8, 8',
                      lineCap: 'round',
                    }}
                    eventHandlers={{
                      click: () => onSelectLeg?.(transfer.toLegId),
                    }}
                  >
                    <Tooltip sticky>
                      <div className="text-xs font-medium space-y-0.5">
                        <div className="font-bold text-sky-300">
                          ✈️ {transfer.transitCode || transfer.carrier || 'Flight Transfer'} ({fromLeg.name} &rarr; {toLeg.name})
                        </div>
                        {transfer.duration && (
                          <div className="text-[11px] text-emerald-400 font-medium">
                            ⏱️ Travel time: {transfer.duration}
                          </div>
                        )}
                        {transfer.departureTime && transfer.arrivalTime && (
                          <div className="text-[11px] text-slate-300 font-mono">
                            🛫 {transfer.departureTime} &rarr; 🛬 {transfer.arrivalTime}
                          </div>
                        )}
                        {transfer.layover && (
                          <div className="text-[11px] text-amber-300">
                            🔄 Layover: {transfer.layover.city || transfer.layover.airportCode}
                            {transfer.layover.duration ? ` • ${transfer.layover.duration}` : ''}
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  </Polyline>
                ))}

                {/* Layover Waypoint Marker if intermediate coordinates are provided */}
                {hasLayoverCoords && transfer.layover?.coordinates && (
                  <Marker
                    position={transfer.layover.coordinates}
                    icon={createLayoverBadgeIcon(
                      `${transfer.layover.airportCode || transfer.layover.city || 'Layover'}${
                        transfer.layover.duration ? ` (${transfer.layover.duration})` : ''
                      }`
                    )}
                  />
                )}

                {/* Mid-flight aircraft badge */}
                {flightArcs[0] && (
                  <Marker
                    position={flightArcs[0][Math.floor(flightArcs[0].length / 2)]}
                    icon={createFlightBadgeIcon(
                      transfer.id === 't-cross'
                        ? 'Korea Strait'
                        : transfer.transitCode || `${fromLeg.name} → ${toLeg.name}`
                    )}
                    eventHandlers={{
                      click: () => onSelectLeg?.(toLeg.id),
                    }}
                  />
                )}
              </React.Fragment>
            );
          }

          // Rail / Train transfers
          const isKTX = fromLeg.name.includes('Seoul') || toLeg.name.includes('Seoul');
          const isHighSpeed = isKTX || fromLeg.name.includes('Tokyo') || toLeg.name.includes('Tokyo');
          const lineColor = isKTX ? '#f59e0b' : isHighSpeed ? '#6366f1' : '#10b981';

          return (
            <Polyline
              key={transfer.id}
              positions={[fromLeg.coordinates, toLeg.coordinates]}
              pathOptions={{
                color: lineColor,
                weight: isTransferActive ? 6 : 4,
                opacity: 0.9,
                dashArray: '12, 6',
                lineJoin: 'round',
              }}
              eventHandlers={{
                click: () => onSelectLeg?.(transfer.toLegId),
              }}
            >
              <Tooltip sticky>
                <div className="text-xs font-medium">
                  🚅 {transfer.notes || 'High-Speed Rail'} ({fromLeg.name} &rarr; {toLeg.name})
                </div>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* POI Markers if active leg has activities with coordinates */}
        {activeLeg?.activities
          ?.filter((act) => act.coordinate)
          .map((act) => (
            <CircleMarker
              key={act.id}
              center={act.coordinate!}
              radius={6}
              pathOptions={{
                fillColor: '#ec4899',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-800">{act.name}</div>
                  {act.category && (
                    <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded">
                      {act.category}
                    </span>
                  )}
                  {act.notes && <p className="text-slate-600">{act.notes}</p>}
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Leg Markers */}
        {legs.map((leg, index) => {
          const isActive = leg.id === activeLegId;
          const icon = createLegIcon(leg, index, isActive);

          return (
            <Marker
              key={leg.id}
              position={leg.coordinates}
              icon={icon}
              zIndexOffset={isActive ? 1000 : 100}
              eventHandlers={{
                click: () => onSelectLeg?.(leg.id),
              }}
            >
              <Popup className="custom-trip-popup">
                <div className="p-1 space-y-2 max-w-xs text-slate-900">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="font-bold text-sm">
                      {index + 1}. {leg.name}
                    </span>
                    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      {leg.country}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Duration: ~{leg.approxDays} Days
                  </p>
                  {leg.highlights.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Top Highlights
                      </span>
                      <ul className="text-xs text-slate-700 list-disc list-inside space-y-0.5">
                        {leg.highlights.slice(0, 3).map((hl, i) => (
                          <li key={i}>{hl}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    onClick={() => onSelectLeg?.(leg.id)}
                    className="w-full mt-2 text-xs py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                  >
                    Focus Itinerary
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default TripMap;
