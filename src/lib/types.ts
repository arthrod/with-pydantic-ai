// State of the agent, make sure this aligns with your agent's state.
export type AgentState = {
  proverbs: string[];
}

// Default state factory for creating initial agent state
export const createDefaultAgentState = (): AgentState => ({
  proverbs: [],
})