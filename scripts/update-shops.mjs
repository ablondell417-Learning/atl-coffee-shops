/**
 * ATL Coffee — Weekly Shop Update Agent
 *
 * Uses the Claude API to research the Atlanta specialty coffee scene and
 * suggest additions/updates to src/data/shops.ts. Validates the generated
 * TypeScript before writing, and exits non-zero if anything fails so the
 * GitHub Actions workflow won't open a PR with bad data.
 *
 * Required env var: ANTHROPIC_API_KEY
 * Run: node scripts/update-shops.mjs
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SHOPS_PATH = join(ROOT, 'src/data/shops.ts');

// ─── Preflight ────────────────────────────────────────────────────────────────

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌  ANTHROPIC_API_KEY environment variable is not set.');
  process.exit(1);
}

const currentShopsTs = readFileSync(SHOPS_PATH, 'utf-8');
const today = new Date().toISOString().split('T')[0];

// ─── Ask Claude to research and return updated shop data ──────────────────────

const client = new Anthropic();

console.log(`🔍  Researching Atlanta coffee shops (${today})…`);

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 8096,
  messages: [
    {
      role: 'user',
      content: `Today is ${today}. You maintain the shop database for ATL Coffee, a web app about Atlanta specialty coffee.

CURRENT SHOPS FILE:
${currentShopsTs}

YOUR TASK:
1. Keep every existing shop (do not remove any).
2. Add up to 5 real Atlanta specialty coffee shops not already in the list. Focus on neighborhoods already represented or ones missing from the list (e.g. Candler Park, Reynoldstown, Edgewood, Little Five Points, Castleberry Hill, Cabbagetown, College Park, Brookhaven, Sandy Springs).
3. If you have clearly better googleRating or googleReviewCount data for an existing shop, update it.

RULES FOR NEW SHOPS:
- Must be a real, currently operating specialty coffee shop in Atlanta or a close suburb.
- Use a real street address.
- Hours must use an en dash with spaces on both sides: "7:00 AM – 6:00 PM" or the string "Closed".
- imageUrl must be a valid Unsplash URL: https://images.unsplash.com/photo-XXXXXXXXXX?w=800&auto=format&fit=crop
- drinkOfTheDay should be a real or plausible specialty drink for that shop.
- Write a 2–3 sentence description that matches the tone of the existing ones.

RETURN FORMAT:
Return ONLY a valid JSON array — no markdown fences, no explanation, just the raw JSON.
Each element must match this exact shape (website is optional):

{
  "id": "kebab-case-unique-id",
  "name": "Shop Name",
  "neighborhood": "Neighborhood",
  "address": "123 Main St, Atlanta, GA 30307",
  "googleRating": 4.6,
  "googleReviewCount": 500,
  "imageUrl": "https://images.unsplash.com/photo-XXXXXXXXXX?w=800&auto=format&fit=crop",
  "website": "https://example.com",
  "description": "Two to three sentences.",
  "drinkOfTheDay": "Drink Name",
  "offersMatcha": false,
  "hours": {
    "Monday": "7:00 AM – 6:00 PM",
    "Tuesday": "7:00 AM – 6:00 PM",
    "Wednesday": "7:00 AM – 6:00 PM",
    "Thursday": "7:00 AM – 6:00 PM",
    "Friday": "7:00 AM – 7:00 PM",
    "Saturday": "8:00 AM – 7:00 PM",
    "Sunday": "8:00 AM – 5:00 PM"
  }
}`,
    },
  ],
});

// ─── Parse the JSON response ──────────────────────────────────────────────────

const raw = response.content[0].text.trim();

// Strip markdown fences if Claude included them despite instructions
const jsonText = raw
  .replace(/^```(?:json)?\n?/, '')
  .replace(/\n?```$/, '')
  .trim();

let shops;
try {
  shops = JSON.parse(jsonText);
} catch (err) {
  console.error('❌  Failed to parse Claude response as JSON.');
  console.error('   ', err.message);
  console.error('\nResponse preview:\n', raw.slice(0, 400));
  process.exit(1);
}

if (!Array.isArray(shops) || shops.length === 0) {
  console.error('❌  Expected a non-empty JSON array from Claude.');
  process.exit(1);
}

console.log(`✅  Claude returned ${shops.length} shops.`);

// ─── Generate TypeScript from JSON ───────────────────────────────────────────

function shopToTs(shop) {
  const websiteLine = shop.website
    ? `\n    website: '${shop.website}',`
    : '';
  const descLine = shop.description
    ? `\n    description: '${shop.description.replace(/'/g, "\\'")}',`
    : '';

  const hoursLines = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
  ]
    .map((day) => `      ${day}: '${shop.hours[day] ?? 'Closed'}',`)
    .join('\n');

  return `  {
    id: '${shop.id}',
    name: '${shop.name.replace(/'/g, "\\'")}',
    neighborhood: '${shop.neighborhood}',
    address: '${shop.address}',
    googleRating: ${Number(shop.googleRating).toFixed(1)},
    googleReviewCount: ${Math.round(Number(shop.googleReviewCount))},
    imageUrl: '${shop.imageUrl}',${websiteLine}${descLine}
    drinkOfTheDay: '${shop.drinkOfTheDay.replace(/'/g, "\\'")}',
    offersMatcha: ${shop.offersMatcha === true || shop.offersMatcha === 'true'},
    hours: {
${hoursLines}
    },
  }`;
}

const updatedTs =
  `import { CoffeeShop } from '../types';\n\nexport const coffeeShops: CoffeeShop[] = [\n` +
  shops.map(shopToTs).join(',\n') +
  `\n];\n`;

// ─── Validate then write ──────────────────────────────────────────────────────

// Back up the original so we can restore if tsc fails
const originalContent = currentShopsTs;

console.log('🔧  Writing updated shops.ts…');
writeFileSync(SHOPS_PATH, updatedTs, 'utf-8');

console.log('🔎  Running TypeScript type check…');
try {
  execSync('node node_modules/typescript/bin/tsc --noEmit', {
    cwd: ROOT,
    stdio: 'pipe',
  });
} catch (err) {
  // Restore original and fail the workflow
  writeFileSync(SHOPS_PATH, originalContent, 'utf-8');
  console.error('❌  Generated TypeScript has type errors — original file restored.');
  console.error(err.stdout?.toString() ?? err.message);
  process.exit(1);
}

console.log(`🎉  shops.ts updated with ${shops.length} shops. TypeScript OK.`);
