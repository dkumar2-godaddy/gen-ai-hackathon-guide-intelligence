import { sampleConversationState } from "../../data/conversationState";
import { sampleTranscripts } from "../../data/trascripts";

const TEAM_FULL_DAY_SUMMARY_PROMPT = `
Below are the responses from a specifc time frame from two seperate APIs. Below responses are from the transcript API:

${sampleTranscripts}

Apart from transcripts, this response has attributes like ucid and contactId. ucid is unique per customer session. When a customer initiates a chat or call, that session might get transferred to different agents but ucid for this session always remains same. And each agent is assigned a unique contactId for that customer interaction session.
And below responses are from conversation state api:

${sampleConversationState}

This response also has attributes ucid and contactId. Additionally, it also has an agentId attributes that uniquely identifies each agent in the system.
Analyse both responses and generate the insights. These insights need to be summarized per agentId and need to be in a presentable format that can be put on a ui dashboard. Map both the responses from transcript API and conversation state api using the common attributes ucid and contactId.
`;

const AGENT_SPECIFIC_SUMMARY_PROMPT = `
Below are the responses from a specifc time frame from two seperate APIs. Below responses are from the transcript API:

${sampleTranscripts}

Apart from transcripts, this response has attributes like ucid and contactId. ucid is unique per customer session. When a customer initiates a chat or call, that session might get transferred to different agents but ucid for this session always remains same. And each agent is assigned a unique contactId for that customer interaction session.
And below responses are from conversation state api:

${sampleConversationState}

This response also has attributes ucid and contactId. Additionally, it also has an agentId attributes that uniquely identifies each agent in the system.
Map both the responses from transcript API and conversation state api using the common attributes ucid and contactId
Analyse both responses and generate detailed insights only for agent jkumari1.
`;

export { TEAM_FULL_DAY_SUMMARY_PROMPT as teamFullDaySummaryPrompt };
export { AGENT_SPECIFIC_SUMMARY_PROMPT as agentSpecificSummaryPrompt };
