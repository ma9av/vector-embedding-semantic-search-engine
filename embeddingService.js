import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export async function getEmbedding(text) {
    const result = await hf.featureExtraction({
        model: 'intfloat/e5-small-v2',
        inputs: `query: ${text}`
    });
    return result;
}

// Remove the test code that was causing issues  