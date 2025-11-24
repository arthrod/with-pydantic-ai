// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

/**
 * Sends an HTTP 200 response with a JSON body containing `{ name: "John Doe" }` for this API route.
 *
 * @param req - Incoming Next.js API request
 * @param res - Next.js API response used to send a JSON body of type `Data`
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: "John Doe" });
}