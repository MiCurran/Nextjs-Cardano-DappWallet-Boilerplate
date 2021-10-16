// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Cardano } from '../../../../lib/blockfrost/blockfrost';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Process a GET request
        const latestBlock = await Cardano.blocksLatest();
        res.status(200).json({latestBlock})

      } 
      // Handle any other HTTP method
      else {
        res.status(500).json({ error: 'Only supports GET requests'})
      }
  }
  