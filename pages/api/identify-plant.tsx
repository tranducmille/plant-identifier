// pages/api/identify-plant.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { image } = req.body;

      // Remove the data:image/[type];base64, part
      const base64Image = image.split(',')[1];

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent([
        'Identify this plant and provide the following information: name, scientific name, family, native region, growth habit, flower color, leaf type and a brief description. '
        +'Return the information in JSON format with keys: name, scientificName, family, nativeRegion, growthHabit, flowerColor, leafType, and description.',
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      const jsonString = text.replace(/```json\s*|\s*```/g, '').trim();
      const plantInfo = JSON.parse(jsonString);
      console.log(plantInfo);
      res.status(200).json(plantInfo);
    } catch (error) {
      console.error('Error identifying plant:', error);
      res.status(500).json({ error: 'Failed to identify plant' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}