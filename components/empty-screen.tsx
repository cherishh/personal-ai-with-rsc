import { Button } from '@/components/ui/button';
import { ExternalLink } from '@/components/external-link';
import { IconArrowRight } from '@/components/ui/icons';

const exampleMessages = [
  {
    heading: "帮我查看今天的日程",
    message: "帮我查看今天的日程",
  },
  {
    heading: "约一个明天下午 4 点的会",
    message: "约一个明天下午 4 点的会",
  },
  {
    heading: "苹果公司(AAPL)的股价怎么样?",
    message: "苹果公司(AAPL)的股价怎么样?",
  },
  {
    heading: "帮我买进100股微软(MSFT)",
    message: "帮我买进100股微软(MSFT)",
  },
  {
    heading: "我的微博上有什么新鲜事？",
    message: "我的微博上有什么新鲜事？",
  }
];

export function EmptyScreen({
  username,
  submitMessage,
}: {
  username: string;
  submitMessage: (message: string) => void;
}) {
  return (
    <div className='mx-auto max-w-2xl px-4'>
      <div className='rounded-lg border bg-background p-8 mb-4'>
        <h1 className='mb-2 text-lg font-semibold'>Hi👋 {username}！</h1>
        <p className='mb-2 leading-normal text-muted-foreground'>
          我是<strong className='italic'> 你 </strong>
          的智能个人助理。不同于常见的聊天机器人，我特别设计为仅为你服务，我知道你的兴趣和需求，并可以直接帮你处理各种事务。
        </p>
        <p className='mb-2 leading-normal text-muted-foreground'>
          比如我可以直接帮你购买股票，为你管理日程，或者帮你看看社交网络上你的朋友们都有什么新鲜事。你可以尝试问我一些问题，或者直接点击下面的示例按钮。
        </p>
        <p className='leading-normal text-muted-foreground'>试试下面的例子:</p>
        <div className='mt-4 flex flex-col items-start space-y-2 mb-4'>
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant='link'
              className='h-auto p-0 text-base'
              onClick={async () => {
                submitMessage(message.message);
              }}
            >
              <IconArrowRight className='mr-2 text-muted-foreground' />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
      <p className='leading-normal text-muted-foreground text-[0.8rem] text-center max-w-full ml-auto mr-auto'>
        这是一个demo，旨在演示AI除了文字问答(且通常仅能以
        <code className='border border-solid rounded-sm px-1 mx-1'>markdown</code>
        格式回复)之外，还可以帮你做什么。当前所有数据均为mock，但只要稍加改造很容易换成真实数据。如果你有任何问题或建议，请随时
        <a className='underline px-1' href='https://zhongxi.app'>
          联系我
        </a>
        。
      </p>
    </div>
  );
}
