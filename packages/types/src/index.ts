export type BaseEvent<TType extends string, TData extends object> = {
  /** 事件 ID，用于去重、恢复、重放 */
  id: string;
  /** 事件类型 */
  type: TType;
  /** 一次 agent 执行实例 ID */
  run_id: string;
  /** 递增序号，单个 run 内严格递增 */
  sequence?: number;
  /** 时间戳 */
  timestamp?: string | number;
  /** 业务字段 */
  data: TData;
};

/** === 生命周期 */

export type RunStartedEvent = BaseEvent<
  'run_started',
  {
    // agent_id?: string;
    // thread_id?: string;
    input?: {
      message?: string;
    };
  }
>;

export type RunCompletedEvent<Usage> = BaseEvent<
  'run_completed',
  {
    status: 'completed';
    usage: Usage;
  }
>;

export type RunFailedEvent = BaseEvent<
  'run_failed',
  {
    status: 'failed';
    error: {
      code: string | undefined | null;
      message: string;
      retryable?: boolean;
    };
  }
>;

/** ===== 文本生成 */

export type MessageStartedEvent = BaseEvent<
  'message_started',
  {
    message_id: string;
    role: 'assistant';
  }
>;

export type TextDeltaEvent = BaseEvent<
  'text_delta',
  {
    message_id: number;
    delta: string;
  }
>;

export type TextCompletedEvent = BaseEvent<
  'text_completed',
  {
    message_id: string;
    text: string;
  }
>;

export type MessageCompletedEvent = BaseEvent<
  'message_completed',
  {
    message_id: string;
  }
>;

/** ==== 工具调用 */

export type ToolCallStartedEvent = BaseEvent<
  'tool_call_started',
  {
    call_id: string;
    tool_name: string;
    arguments?: Record<string, unknown>;
  }
>;

export type ToolCallDeltaEvent = BaseEvent<
  'tool_call_delta',
  {
    call_id: string;
    delta: string;
  }
>;

export type ToolCallCompletedEvent = BaseEvent<
  'tool_call_completed',
  {
    call_id: string;
    tool_name: string;
    output?: unknown;
  }
>;

export type ToolCallFailedEvent = BaseEvent<
  'tool_call_failed',
  {
    call_id: string;
    tool_name: string;
    error: {
      code: string;
      message: string;
      retryable?: boolean;
    };
  }
>;

export type StepStartedEvent = BaseEvent<
  'step_started',
  {
    step_id: string;
    name: string;
  }
>;

export type StepCompletedEvent = BaseEvent<
  'step_completed',
  {
    step_id: string;
    name: string;
    summary?: string;
  }
>;

export type HeartbeatEvent = BaseEvent<'heartbeat', {}>;

export type AgentSSEEvent<Usage> =
  | RunStartedEvent
  | RunCompletedEvent<Usage>
  | RunFailedEvent
  | MessageStartedEvent
  | TextDeltaEvent
  | TextCompletedEvent
  | MessageCompletedEvent
  | ToolCallStartedEvent
  | ToolCallDeltaEvent
  | ToolCallCompletedEvent
  | ToolCallFailedEvent
  | StepStartedEvent
  | StepCompletedEvent
  | HeartbeatEvent;
