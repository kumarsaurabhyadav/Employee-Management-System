import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  try {
    const models = await genAI.listModels();
    console.log('MODELS', models);
  } catch (err) {
    console.error('ERROR', err);
  }
}
main();
