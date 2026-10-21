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
  const isKorea = leg.country === 'Korea';
  const flag = isKorea ? '🇰🇷' : '🇯🇵';
  const badgeColor = isKorea ? 'bg-rose-500' : 'bg-red-500';
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

export const TripMap: React.FC<TripMapProps> = ({
  legs,
  transfers,
  activeLegId,
  onSelectLeg,
  className = '',
}) => {
  // Default bounds covering Seoul to Tokyo
  const defaultCenter: [number, number] = [36.2, 133.0]; // Center point in Sea of Japan / East Sea between Korea & Honshu
  const defaultZoom = 6;

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

        {/* Clean CartoDB Dark Matter / Positron or Voyager tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
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
            const flightArc = getCurvedFlightPath(
              fromLeg.coordinates,
              toLeg.coordinates,
              30,
              0.22
            );
            const midIndex = Math.floor(flightArc.length / 2);
            const midPoint = flightArc[midIndex];

            return (
              <React.Fragment key={transfer.id}>
                {/* Glow polyline for flight */}
                <Polyline
                  positions={flightArc}
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
                    <div className="text-xs font-medium">
                      ✈️ {transfer.notes || 'Flight Transfer'} ({fromLeg.name} &rarr; {toLeg.name})
                    </div>
                  </Tooltip>
                </Polyline>

                {/* Mid-flight aircraft badge */}
                {midPoint && (
                  <Marker
                    position={midPoint}
                    icon={createFlightBadgeIcon('Korea Strait')}
                    eventHandlers={{
                      click: () => onSelectLeg?.(toLeg.id),
                    }}
                  />
                )}
              </React.Fragment>
            );
          }

          // Rail / Train transfers (KTX & Shinkansen)
          const isKTX = fromLeg.name.includes('Seoul') || toLeg.name.includes('Seoul');
          const lineColor = isKTX ? '#f59e0b' : '#6366f1'; // Amber for KTX, Indigo for Shinkansen

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
