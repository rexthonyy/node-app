// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { knowledgeBase } from '../../../interfaces/KnowledgeBase';
import { apiRequest } from '../../../requests/requests';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<knowledgeBase>
  ) {
    if (req.method === "POST") {
        const result = await apiRequest(
            `listKnowledgeBases?page=${req.body.page}&limit=${req.body.limit}`,
          "GET",
          {}
        );
        if (result.status === 200) {
            res.status(200).json(result.data);
          } else {
            res.status(result.status).json({message: 'bad request'}as any);
          }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({message: `Method ${req.method} not allowed`} as any);
    }
}
