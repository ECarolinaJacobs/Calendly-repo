import type { NextApiRequest, NextApiResponse } from 'next'
import type { Event } from '../../components/EventDrawer/types';
type Data = {
  message?: string
  events?: Event[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data> 
) {
  const { method } = req;

  switch (method) {
    
    case "GET":
      try {
        const apiResponse = await fetch("http://localhost:5167/api/event");
        
        if (!apiResponse.ok) {
          return res.status(apiResponse.status).json({ message: "Failed to fetch events from external API." });
        }

        const events = await apiResponse.json();
        return res.status(200).json({ events }); 

      } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({ message: "Internal server error." });
      }

    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}