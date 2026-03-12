import { type AgentSSEEvent } from 'agent-types';

document.getElementById('btn')!.addEventListener('click', async () => {
  console.log('xxx');
  const container = document.getElementById('container');
  const res = await fetch('/api/agent/stream', {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: '你好',
    }),
  });

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('Response body is empty');
  }

  const decoder = new TextDecoder('utf-8');

  let sseBuffer = '';
  let aiText = '';
  let runFinished = false;

  /** 根据SSE event 不同type渲染or执行不同内容 */
  function handleEventData(data: AgentSSEEvent<any>) {
    switch (data.type) {
      case 'text_delta':
        aiText += data.data.delta;
        break;
      case 'text_completed':
        aiText = data.data.text;
        runFinished = true;
        break;
      case 'run_failed':
        runFinished = true;
        // TODO error展示
        console.error(data.data.error.message);
        break;
      default:
        break;
    }
  }

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    const buffer = decoder.decode(value, { stream: true });
    sseBuffer += buffer;
    // console.log('buffer', buffer);
    const events = buffer.split('\n\n');

    console.log('events', events);
    events.forEach(event => {
      // 去掉空的事件和初始connected
      if (event && !event.includes(': connected')) {
        const data: AgentSSEEvent<any> = JSON.parse(event.split('\n').at(-1)!.slice('data: '.length));
        if (data.type === 'text_delta') {
          console.log('data.data.delta', data.data.delta);
          handleEventData(data);
        }
      }
    });

    if (container) {
      requestAnimationFrame(() => {
        container.innerHTML = aiText;
      });
    }
  }

  if (!runFinished) {
    // 流发完既不是text_completed也没有fun_failed
    console.warn('stream interrupted');
  }
});
