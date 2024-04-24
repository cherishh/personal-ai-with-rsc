import 'server-only';

import { createAI, createStreamableUI, getMutableAIState } from 'ai/rsc';
import OpenAI from 'openai';

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock,
  Purchase,
  Stocks,
  Events,
} from '@/components/llm-stocks';

import {
  runAsyncFnWithoutBlocking,
  sleep,
  formatNumber,
  runOpenAICompletion,
} from '@/lib/utils';
import { z } from 'zod';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { StockSkeleton } from '@/components/llm-stocks/stock-skeleton';
import { EventsSkeleton } from '@/components/llm-stocks/events-skeleton';
import { StocksSkeleton } from '@/components/llm-stocks/stocks-skeleton';
import { EventsSkeleton as CalendarEventsSkeleton } from '@/components/llm-calendar/events-skeleton';
import { Events as CalendarEvents } from '@/components/llm-calendar';
import { Event } from '@/components/llm-calendar/event';


let isProxy = process.env.NODE_ENV === 'development';
const agent: any = isProxy ? new HttpsProxyAgent('http://127.0.0.1:1087') : null;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  httpAgent: agent,
});

async function confirmPurchase(symbol: string, price: number, amount: number) {
  'use server';

  const aiState = getMutableAIState<typeof AI>();

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>,
  );

  const systemMessage = createStreamableUI(null);

  runAsyncFnWithoutBlocking(async () => {
    // You can update the UI at any point.
    await sleep(1000);

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>,
    );

    await sleep(1000);

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{' '}
          {formatNumber(amount * price)}
        </p>
      </div>,
    );

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>,
    );

    aiState.done([
      ...aiState.get(),
      {
        role: 'system',
        content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
          amount * price
        }]`,
      },
    ]);
  });

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: Date.now(),
      display: systemMessage.value,
    },
  };
}

async function submitUserMessage(content: string) {
  'use server';

  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content,
    },
  ]);

  const reply = createStreamableUI(
    <BotMessage className="items-center">{spinner}</BotMessage>,
  );

  const completion = runOpenAICompletion(openai, {
    model: 'gpt-4-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `\
You are a smart, intelligent, funny and friendly AI assistant, dedicated to server Zhongxi, your one and only user.
As of toning, Most of the time, you can mimic Chandler Bing from Friends, unless you and the user are discussing some serious topics.
The user may ask you about 1)his stock portfolio, 2)his calendar, 3)his social media, or 4)any other general questions. And you'll be given the access to the necessary APIs to help him.

# Stock Trading
You and the user can discuss stock prices and the user can adjust the amount of stocks they want to buy, or place an order, in the UI.

Messages inside [] means that it's a UI element or a user event. For example:
- "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.
- "[User has changed the amount of AAPL to 10]" means that the user has changed the amount of AAPL to 10 in the UI.

If the user requests purchasing a stock, call \`show_stock_purchase_ui\` to show the purchase UI.
If the user just wants the price, call \`show_stock_price\` to show the price.
If you want to show trending stocks, call \`list_stocks\`.
If you want to show events, call \`get_events\`.
If the user wants to sell stock, or complete another impossible task, respond that you are a demo and cannot do that.

Besides that, you can also chat with users and do some calculations if needed.

# Calendar
Similarly, you can show the user's calendar events, and the user can ask you to add or remove events. 

If the user asks you to show the calendar, call \`get_calendar_events\` to get the events between the user's selected dates.
If the user asks you to add an event, if the event was mentioned, call \`add_event\` to add the event. If event detail was not mentioned, i.e. only the date was mentioned, or only the headline was mentioned, ask the user for the missing details.
If the user asks you to remove an event, call \`remove_event\` to remove the event.
If the user wants to change an event, call \`modify_event\` to change the event to the new date & show the resulting calendar UI to the user for confirmation.

# Social Media
If the user asks you what's new on his social media, call \`fetch_social_media\` to get posts in the user's feed, and summarize what's new.
If the user asks you to post something, call \`post_social_media\` to post the content to the user's feed.

The user's primary language is Chinese. So respond in Chinese.
The user may also just wanna chat with you, so feel free to chat with him.

Other useful information:
current date: ${new Date().toISOString().slice(0, 10)}
`,
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    functions: [
      {
        name: 'get_calendar_events',
        description:
          'List user\'s events between user highlighted dates that describe stock activity.',
        parameters: z.object({
          startDate: z.string().describe('The start date of the event'),
          endDate: z.string().describe('The end date of the event'),
        }),
      },
      {
        name: 'add_event',
        description:
          'Add an event to the user calendar. Use this to add an event to the user calendar.',
        parameters: z.object({
          startTime: z
            .string()
            .describe('The start time of the event, in ISO-8601 format'),
          endTime: z
            .string()
            .describe('The end time of the event, in ISO-8601 format. If not mentioned, default to 1 hour after the start time.'),
          headline: z.string().describe('The headline of the event'),
          description: z.string().describe('The description of the event. Can be optional if the user did not specify it.'),
        }),
      },
      {
        name: 'remove_event',
        description:
          'Remove an event from the user calendar. Use this to remove an event from the user calendar.',
        parameters: z.object({
          id: z.string().describe('The ID of the event to remove'),
        }),
      },
      {
        name: 'modify_event',
        description:
          'Modify an event in the user calendar. Use this to modify an event in the user calendar.',
        parameters: z.object({
          id: z.string().describe('The ID of the event to modify'),
          newDate: z
            .string()
            .describe('The new date of the event, in ISO-8601 format')
            .optional(),
          newHeadline: z
            .string()
            .describe('The new headline of the event')
            .optional()
        }),
      },
      {
        name: 'show_stock_price',
        description:
          'Get the current stock price of a given stock or currency. Use this to show the price to the user.',
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.',
            ),
          price: z.number().describe('The price of the stock.'),
          delta: z.number().describe('The change in price of the stock'),
        }),
      },
      {
        name: 'show_stock_purchase_ui',
        description:
          'Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency.',
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.',
            ),
          price: z.number().describe('The price of the stock.'),
          numberOfShares: z
            .number()
            .describe(
              'The **number of shares** for a stock or currency to purchase. Can be optional if the user did not specify it.',
            ),
        }),
      },
      {
        name: 'list_stocks',
        description: 'List three imaginary stocks that are trending.',
        parameters: z.object({
          stocks: z.array(
            z.object({
              symbol: z.string().describe('The symbol of the stock'),
              price: z.number().describe('The price of the stock'),
              delta: z.number().describe('The change in price of the stock'),
            }),
          ),
        }),
      },
      {
        name: 'get_events',
        description:
          'List funny imaginary events between user highlighted dates that describe stock activity.',
        parameters: z.object({
          events: z.array(
            z.object({
              date: z
                .string()
                .describe('The date of the event, in ISO-8601 format'),
              headline: z.string().describe('The headline of the event'),
              description: z.string().describe('The description of the event'),
            }),
          ),
        }),
      },
    ],
    temperature: 0,
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(<BotMessage>{content}</BotMessage>);
    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: 'assistant', content }]);
    }
  });

  completion.onFunctionCall('get_calendar_events', async ({ startDate, endDate }) => {
    reply.update(
      <BotCard>
        <CalendarEventsSkeleton />
      </BotCard>,
    );

    // Simulate fetching events.
    await sleep(1000);

    reply.done(
      <BotCard>
        <CalendarEvents events={[{
          id: '1',
          date: '2022-01-01',
          headline: 'New Year\'s Day',
          description: 'Celebrate the new year with your friends and family.',
        }, {
          id: '2',
          date: '2022-02-14',
          headline: 'Valentine\'s Day',
          description: 'Celebrate love with your significant other.',
        }]} />
        <div>{startDate}, {endDate}</div>
      </BotCard>,
    );

    aiState.done([
      ...aiState.get(),
      {
        role: 'function',
        name: 'get_calendar_events',
        content: `[Events between ${startDate} and ${endDate}]`,
      },
    ]);
  });

  completion.onFunctionCall('add_event', async ({ startTime, endTime, headline, description }) => {
    reply.update(
      <BotCard>
        <div>creating event...</div>
      </BotCard>,
    );

    await sleep(1000);

    reply.done(
      <BotCard>
        <Event time={[startTime, endTime]} headline={headline} description={description} />
      </BotCard>,
    );

    aiState.done([
      ...aiState.get(),
      {
        role: 'function',
        name: 'add_event',
        content: `[Added event at ${startTime}: ${headline}]`,
      },
    ]);
  });

  completion.onFunctionCall('list_stocks', async ({ stocks }) => {
    reply.update(
      <BotCard>
        <StocksSkeleton />
      </BotCard>,
    );

    await sleep(1000);

    reply.done(
      <BotCard>
        <Stocks stocks={stocks} />
      </BotCard>,
    );

    aiState.done([
      ...aiState.get(),
      {
        role: 'function',
        name: 'list_stocks',
        content: JSON.stringify(stocks),
      },
    ]);
  });

  completion.onFunctionCall('get_events', async ({ events }) => {
    reply.update(
      <BotCard>
        <EventsSkeleton />
      </BotCard>,
    );

    await sleep(1000);

    reply.done(
      <BotCard>
        <Events events={events} />
      </BotCard>,
    );

    aiState.done([
      ...aiState.get(),
      {
        role: 'function',
        name: 'get_events',
        content: JSON.stringify(events),
      },
    ]);
  });

  completion.onFunctionCall(
    'show_stock_price',
    async ({ symbol, price, delta }) => {
      reply.update(
        <BotCard>
          <StockSkeleton />
        </BotCard>,
      );

      await sleep(1000);

      reply.done(
        <BotCard>
          <Stock name={symbol} price={price} delta={delta} />
        </BotCard>,
      );

      aiState.done([
        ...aiState.get(),
        {
          role: 'function',
          name: 'show_stock_price',
          content: `[Price of ${symbol} = ${price}]`,
        },
      ]);
    },
  );

  completion.onFunctionCall(
    'show_stock_purchase_ui',
    ({ symbol, price, numberOfShares = 100 }) => {
      if (numberOfShares <= 0 || numberOfShares > 1000) {
        reply.done(<BotMessage>Invalid amount</BotMessage>);
        aiState.done([
          ...aiState.get(),
          {
            role: 'function',
            name: 'show_stock_purchase_ui',
            content: `[Invalid amount]`,
          },
        ]);
        return;
      }

      reply.done(
        <>
          <BotMessage>
            Sure!{' '}
            {typeof numberOfShares === 'number'
              ? `Click the button below to purchase ${numberOfShares} shares of $${symbol}:`
              : `How many $${symbol} would you like to purchase?`}
          </BotMessage>
          <BotCard showAvatar={false}>
            <Purchase
              defaultAmount={numberOfShares}
              name={symbol}
              price={+price}
            />
          </BotCard>
        </>,
      );
      aiState.done([
        ...aiState.get(),
        {
          role: 'function',
          name: 'show_stock_purchase_ui',
          content: `[UI for purchasing ${numberOfShares} shares of ${symbol}. Current price = ${price}, total cost = ${
            numberOfShares * price
          }]`,
        },
      ]);
    },
  );

  return {
    id: Date.now(),
    display: reply.value,
  };
}

// Define necessary types and create the AI.

const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
    confirmPurchase,
  },
  initialUIState,
  initialAIState,
});
