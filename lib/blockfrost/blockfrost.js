import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

export const Cardano = new BlockFrostAPI({
  projectId: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID, // see: https://blockfrost.io
});
