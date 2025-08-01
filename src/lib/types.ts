export type Resource = {
  url: string;
  title: string;
  description: string;
};

export type LogEntry = {
  timestamp: string;
  message: string;
  type: string; // info, warning, error, success
  details?: any;
};

export type ResearchStep = {
  id: string;
  title: string;
  description: string;
  status: string; // pending, active, completed, error
  type: string; // thinking, tool, subtask, output
  details?: string;
  timestamp?: string;
};

export type AgentState = {
  model: string;
  message: string;
  logs: LogEntry[];
  thinking_count: number;
  last_thought: string;
}