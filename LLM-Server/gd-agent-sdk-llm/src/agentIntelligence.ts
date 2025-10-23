import { GDAgent } from '@godaddy/agent-sdk';
import { setTracingDisabled, run } from "@openai/agents";
import {  agentSpecificSummaryPrompt } from './prompts/agent-intelligence-prompts.js';

setTracingDisabled(true);

const agent = new GDAgent({
  name: 'Agent Intelligence Analyzer',
  instructions: `
    You are a part of the customer care and support department in a website & domain hosting company. Customers can use the chat or call service to talk to support agents also called guides to raise their concerns 
    and get the queries resolved. These transcripts and conversation related details are stored for later use. 
    You will be provided the transcripts and related metadata, you need to generate insights into customer and agent interaction. 
    The theme of analysis is agent intelligence - that supports customer and guide sentiment to flag fraud, threat, abuse and escalation needs, along with other metrics like the customer or agent wait times.
  `,
  // model: 'claude-3-5-sonnet-20241022',
  model: 'claude-sonnet-4-20250514',
});

// const result = await run(agent, teamFullDaySummaryPrompt);
// console.log(result.finalOutput);

// const result2 = await run(agent, agentSpecificSummaryPrompt);
// console.log(result2.finalOutput);
