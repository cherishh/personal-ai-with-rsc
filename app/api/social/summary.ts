import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { HttpsProxyAgent } from 'https-proxy-agent';


let isProxy = process.env.NODE_ENV === 'development';
const agent: any = isProxy ? new HttpsProxyAgent('http://127.0.0.1:1087') : null;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  httpAgent: agent,
});
 
export const dynamic = 'force-dynamic';
 
export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(messages, 'messages-----------------');
 
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: false,
    max_tokens: 2048,
    messages: [
      {
        role: 'system',
        // todo should only respond on summary related.
        content: 'You are a helpful assistant specialized in text summary. You\'ll be given some posts on social media and you need to summarize them. Keep the summary concise and informative.',
      },
      {
        role: 'user',
        content: `Summarize the following posts: ${messages}`
      }
    ],
  });
 
  return response;
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}