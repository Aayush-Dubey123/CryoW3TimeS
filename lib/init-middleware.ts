import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'POST'], // Allowed HTTP methods
  origin: 'https://cryow3times.vercel.app/', // Replace with your allowed origins, e.g., 'https://yourdomain.com'
});

export default function initMiddleware(middleware: any) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

export const corsMiddleware = initMiddleware(cors);
