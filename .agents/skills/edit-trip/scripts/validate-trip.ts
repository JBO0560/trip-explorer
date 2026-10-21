import { initialTripData } from '../../../../src/data/initialTrip';

function validate() {
  console.log('🔍 Validating Trip Data Configuration...\n');
  let errors = 0;
  let warnings = 0;

  // 1. Validate legs
  const legIds = new Set<string>();
  const countries = new Set<string>();

  if (!initialTripData.legs || initialTripData.legs.length === 0) {
    console.error('❌ Error: Trip has no legs defined.');
    errors++;
  } else {
    initialTripData.legs.forEach((leg, index) => {
      if (!leg.id) {
        console.error(`❌ Error: Leg at index ${index} is missing an id.`);
        errors++;
      } else if (legIds.has(leg.id)) {
        console.error(`❌ Error: Duplicate leg id "${leg.id}".`);
        errors++;
      } else {
        legIds.add(leg.id);
      }

      if (!leg.name) {
        console.error(`❌ Error: Leg "${leg.id}" is missing a name.`);
        errors++;
      }

      if (!leg.country) {
        console.error(`❌ Error: Leg "${leg.id}" is missing a country.`);
        errors++;
      } else {
        countries.add(leg.country);
      }

      if (
        !Array.isArray(leg.coordinates) ||
        leg.coordinates.length !== 2 ||
        typeof leg.coordinates[0] !== 'number' ||
        typeof leg.coordinates[1] !== 'number' ||
        leg.coordinates[0] < -90 ||
        leg.coordinates[0] > 90 ||
        leg.coordinates[1] < -180 ||
        leg.coordinates[1] > 180
      ) {
        console.error(
          `❌ Error: Leg "${leg.id}" has invalid coordinates: ${JSON.stringify(leg.coordinates)}.`
        );
        errors++;
      }

      if (!Array.isArray(leg.highlights) || leg.highlights.length === 0) {
        console.warn(`⚠️ Warning: Leg "${leg.id}" has no highlights.`);
        warnings++;
      }

      if (leg.activities) {
        const actIds = new Set<string>();
        leg.activities.forEach((act) => {
          if (!act.id) {
            console.error(`❌ Error: Activity in leg "${leg.id}" is missing an id.`);
            errors++;
          } else if (actIds.has(act.id)) {
            console.error(`❌ Error: Duplicate activity id "${act.id}" in leg "${leg.id}".`);
            errors++;
          } else {
            actIds.add(act.id);
          }
        });
      }
    });
  }

  // 2. Validate transfers
  if (!initialTripData.transfers || initialTripData.transfers.length === 0) {
    console.warn('⚠️ Warning: Trip has no transit transfers defined.');
    warnings++;
  } else {
    const transferIds = new Set<string>();
    initialTripData.transfers.forEach((t, index) => {
      if (!t.id) {
        console.error(`❌ Error: Transfer at index ${index} is missing an id.`);
        errors++;
      } else if (transferIds.has(t.id)) {
        console.error(`❌ Error: Duplicate transfer id "${t.id}".`);
        errors++;
      } else {
        transferIds.add(t.id);
      }

      if (!legIds.has(t.fromLegId)) {
        console.error(
          `❌ Error: Transfer "${t.id}" references unknown fromLegId: "${t.fromLegId}".`
        );
        errors++;
      }

      if (!legIds.has(t.toLegId)) {
        console.error(
          `❌ Error: Transfer "${t.id}" references unknown toLegId: "${t.toLegId}".`
        );
        errors++;
      }

      if (!['flight', 'train', 'ferry', 'bus', 'other'].includes(t.type)) {
        console.error(`❌ Error: Transfer "${t.id}" has invalid type "${t.type}".`);
        errors++;
      }

      if (!['tentative', 'confirmed'].includes(t.status)) {
        console.error(`❌ Error: Transfer "${t.id}" has invalid status "${t.status}".`);
        errors++;
      }
    });
  }

  // Summary output
  console.log('--- Current Itinerary Summary ---');
  console.log(`Title: ${initialTripData.title}`);
  console.log(`Status: ${initialTripData.status}`);
  console.log(`Date Range: ${initialTripData.overallDateRange}`);
  console.log(`Legs (${initialTripData.legs.length}):`);
  initialTripData.legs.forEach((l, i) => {
    console.log(`  ${i + 1}. [${l.id}] ${l.name}, ${l.country} (~${l.approxDays} days) @ [${l.coordinates.join(', ')}]`);
  });
  console.log(`Transfers (${initialTripData.transfers.length}):`);
  initialTripData.transfers.forEach((t, i) => {
    console.log(`  ${i + 1}. [${t.type.toUpperCase()}] ${t.fromLegId} -> ${t.toLegId} (${t.status}): ${t.notes || t.carrier || 'No notes'}`);
  });
  console.log(`Distinct Countries: ${Array.from(countries).join(', ')}\n`);

  if (errors > 0) {
    console.error(`FAILED: ${errors} errors, ${warnings} warnings found.`);
    process.exit(1);
  } else {
    console.log(`✅ Validation PASSED (${warnings} warnings).`);
  }
}

validate();
