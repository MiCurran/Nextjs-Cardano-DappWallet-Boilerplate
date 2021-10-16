// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Cardano } from '../../../../../lib/blockfrost/blockfrost';

export default async function handler(req, res) {
    const { address } = req.query 
    if (req.method === 'GET') {
        const addressDetails = await Cardano.addresses(address);
        res.status(200).json({addressDetails})
    } 
    // Handle any other HTTP method
    else {
        res.status(500).json({ error: 'Only supports GET requests'})
      }
  }
  