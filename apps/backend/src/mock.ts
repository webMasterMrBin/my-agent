import type { OpenAI } from 'openai';
// 你好！很高兴见到你～😊 有什么问题、想法，或者需要帮忙的地方吗？无论是学习、工作、生活中的小困惑，还是想聊点有趣的话题，我都很乐意陪你聊聊！
const mockStreamEvents: OpenAI.Chat.Completions.ChatCompletionChunk[] = [
  {
    model: 'qwen-plus',
    id: 'chatcmpl-01af6537-3438-90b3-aa16-902ae9249890',
    choices: [
      {
        delta: {
          content: '你好！很高兴见到你～😊',
        },
        index: 0,
        finish_reason: null,
      },
    ],
    created: 1773370642,
    object: 'chat.completion.chunk',
    usage: null,
  },
  {
    model: 'qwen-plus',
    id: 'chatcmpl-01af6537-3438-90b3-aa16-902ae9249890',
    choices: [
      {
        delta: {
          content: '有什么问题、想法，',
        },
        index: 0,
        finish_reason: null,
      },
    ],
    created: 1773370642,
    object: 'chat.completion.chunk',
    usage: null,
  },
  {
    model: 'qwen-plus',
    id: 'chatcmpl-01af6537-3438-90b3-aa16-902ae9249890',
    choices: [
      {
        delta: {
          content: '或者需要帮忙的地方吗？',
        },
        index: 0,
        finish_reason: null,
      },
    ],
    created: 1773370642,
    object: 'chat.completion.chunk',
    usage: null,
  },
  {
    model: 'qwen-plus',
    id: 'chatcmpl-01af6537-3438-90b3-aa16-902ae9249890',
    choices: [
      {
        delta: {
          content: '无论是学习、工作、生活中的小困惑，',
        },
        index: 0,
        finish_reason: null,
      },
    ],
    created: 1773370642,
    object: 'chat.completion.chunk',
    usage: null,
  },
  {
    model: 'qwen-plus',
    id: 'chatcmpl-01af6537-3438-90b3-aa16-902ae9249890',
    choices: [
      {
        delta: {
          content: '还是想聊点有趣的话题，',
        },
        index: 0,
        finish_reason: null,
      },
    ],
    created: 1773370642,
    object: 'chat.completion.chunk',
    usage: null,
  },
  {
    model: 'qwen-plus',
    id: 'chatcmpl-01af6537-3438-90b3-aa16-902ae9249890',
    choices: [
      {
        delta: {
          content: '我都很乐意',
        },
        index: 0,
        finish_reason: null,
      },
    ],
    created: 1773370642,
    object: 'chat.completion.chunk',
    usage: null,
  },
  {
    model: 'qwen-plus',
    id: 'chatcmpl-01af6537-3438-90b3-aa16-902ae9249890',
    choices: [
      {
        delta: {
          content: '陪你聊聊！',
          // NOTE role tool等其他
        },
        finish_reason: 'stop',
        index: 0,
      },
    ],
    created: 1773370642,
    object: 'chat.completion.chunk',
    usage: null,
  },
  {
    model: 'qwen-plus',
    id: 'chatcmpl-01af6537-3438-90b3-aa16-902ae9249890',
    choices: [],
    created: 1773370642,
    object: 'chat.completion.chunk',
    usage: {
      total_tokens: 50,
      completion_tokens: 41,
      prompt_tokens: 9,
      prompt_tokens_details: { cached_tokens: 0 },
    },
  },
];

async function* creatMockStreamEvents() {
  const tasks = mockStreamEvents.map(
    v => () =>
      new Promise<OpenAI.Chat.Completions.ChatCompletionChunk>(res =>
        setTimeout(() => {
          res(v);
        }, 1000)
      )
  );
  for (const task of tasks) {
    yield await task();
  }
}

export { mockStreamEvents, creatMockStreamEvents };
