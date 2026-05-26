import SponsorsSection from './components/SponsorsSection';
import ContestStoryClient from './components/ContestStoryClient';
import HomeClient from './components/HomeClient';
import KineticTournamentBandClient from './components/KineticTournamentBandClient';
import TournamentDayClient from './components/TournamentDayClient';
import fs from 'fs';
import path from 'path';

const SUPPORTED_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
const TIERS = ['gold', 'silver', 'bronze', 'friends'] as const;
export type Tier = typeof TIERS[number];

function getSponsorsByTier(): Record<Tier, string[]> {
  const base = path.join(process.cwd(), 'public', 'sponsors');
  const result = {} as Record<Tier, string[]>;
  for (const tier of TIERS) {
    const dir = path.join(base, tier);
    try {
      result[tier] = fs.readdirSync(dir)
        .filter((file) => SUPPORTED_EXTS.includes(path.extname(file).toLowerCase()))
        .map((file) => `/sponsors/${tier}/${file}`);
    } catch {
      result[tier] = [];
    }
  }
  return result;
}

export default function HomePage() {
  const sponsorsByTier = getSponsorsByTier();

  return (
    <div>
      <HomeClient />
      <ContestStoryClient />
      <KineticTournamentBandClient />
      <TournamentDayClient />
      <SponsorsSection sponsorsByTier={sponsorsByTier} />
    </div>
  );
}
