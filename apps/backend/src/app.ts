import express, { type Request, type Response } from 'express';
import path from 'path';
import OpenAI, { APIError } from 'openai';
import type { AgentSSEEvent } from 'agent-types';
import { v4 as uuid } from 'uuid';

const openai = new OpenAI({
  apiKey: 'sk-c4d80774d6fe4f1b8463792a049560f2',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

const app = express();

app.use('/public', express.static(path.resolve(__dirname, '../../../public')));
app.use(express.json());

function delay(time = 1000) {
  // new Promise(res =>
  //   setTimeout(() => {
  //     res(1);
  //   }, time)
  // );
  let start = performance.now();
  let end = start;
  while (end - start <= time) {
    end = performance.now();
  }
}

app.post('/api/agent/stream', async (req: Request<{}, any, { message: string }>, res) => {
  let sseIsClosed = false;
  function writeSSE<Usage>({ id, data }: { id: string; data: AgentSSEEvent<Usage> }) {
    res.write(`event: message\n`);
    res.write(`id: ${id}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  const { message } = req.body;
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  // 初始一条注释（SSE允许以:开头作为注释/心跳）
  res.write(`: connected\n\n`);
  // console.log('req.body', req.body);

  // 心跳（可选）：防止某些代理/浏览器断开空闲连接
  const heartbeat = setInterval(() => {
    res.write(`: connected ping ${Date.now()}\n\n`);
  }, 15000);

  const stream = await openai.chat.completions.create({
    model: 'qwen-plus',
    messages: [{ role: 'user', content: req.body.message }],
    stream: true,
    stream_options: {
      include_usage: true,
    },
  });

  // 客户端断开时清理资源
  req.on('close', () => {
    sseIsClosed = true;
    clearInterval(heartbeat);
    stream.controller.abort();
    res.end();
  });

  writeSSE({
    id: 'run_started',
    data: {
      id: 'run_started',
      type: 'run_started',
      run_id: 'run_started',
      data: {
        input: {
          message,
        },
      },
    },
  });

  writeSSE({
    id: 'message_started',
    data: {
      id: 'message_started',
      type: 'message_started',
      run_id: 'message_started',
      data: {
        message_id: message,
        role: 'assistant',
      },
    },
  });

  try {
    let fullText = '';
    let usage = null;
    for await (const event of stream) {
      if (sseIsClosed) {
        break;
      }
      if (event.usage) {
        usage = event.usage;
      }

      const delta = event.choices?.[0]?.delta.content;
      if (!delta) {
        continue;
      }
      fullText += delta;

      console.log('event', event);
      writeSSE({
        id: 'text_delta',
        data: {
          id: event.id,
          type: 'text_delta',
          run_id: 'text_delta',
          timestamp: event.created,
          sequence: event.choices[0].index,
          data: {
            message_id: event.choices[0].index,
            delta,
          },
        },
      });
    }

    if (!sseIsClosed) {
      writeSSE({
        id: 'text_completed',
        data: {
          id: 'text_completed',
          type: 'text_completed',
          run_id: 'text_completed',
          data: {
            message_id: 'text_completed',
            text: fullText,
          },
        },
      });

      // TODO message_completed run_completed
      writeSSE({
        id: 'run_completed',
        data: {
          id: 'run_completed',
          type: 'run_completed',
          run_id: 'run_completed',
          data: {
            status: 'completed',
            usage,
          },
        },
      });
    }
  } catch (error) {
    console.log('error', error);
    writeSSE({
      id: 'run_failed',
      data: {
        id: 'run_failed',
        type: 'run_failed',
        run_id: 'run_failed',
        data: {
          status: 'failed',
          error: (() => {
            if (error instanceof APIError) {
              return {
                code: error.code,
                message: error.message,
              };
            }
            if (error instanceof Error) {
              return {
                code: error.name,
                message: error.message,
              };
            }
            return {
              code: '',
              message: '',
            };
          })(),
        },
      },
    });
  } finally {
    sseIsClosed = true;
    clearInterval(heartbeat);
    stream.controller.abort();
    res.end();
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../public/index.html'));
});

app.listen(3000, () => {
  console.log('listen on 3000');
});
