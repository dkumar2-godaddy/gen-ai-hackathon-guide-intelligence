# Agent Intelligence Analyzer

A comprehensive system for analyzing customer support agent performance using MCP (Model Context Protocol) tools and AI-powered insights.

## Features

- **Real-time Agent Analysis**: Analyze agent performance metrics including sentiment, satisfaction, and resolution rates
- **Team Summary Reports**: Generate comprehensive team performance summaries for management
- **MCP Tool Integration**: Seamlessly integrate with Conversation State Service APIs
- **Advanced Sentiment Analysis**: AI-powered sentiment analysis of customer interactions
- **Agent-specific Insights**: Detailed analysis for individual agents

## Architecture

```
LLM-Server/
├── src/
│   ├── agentIntelligenceAnalyzer.ts    # Main analyzer class
│   ├── agentIntelligence.ts           # Entry point
│   ├── utils/
│   │   ├── mcpClient.ts               # MCP client utilities
│   │   └── sentimentAnalyzer.ts       # Sentiment analysis
│   ├── config/
│   │   └── mcpConfig.ts               # Configuration
│   └── testIntegration.ts             # Test script
```

## MCP Tools Integration

The system integrates with three MCP tools:

1. **conversation_state_search**: Search for conversations by date range and filters
2. **conversation_state_ucid_detail**: Get detailed conversation information by UCID
3. **conversation_state_transcripts**: Retrieve conversation transcripts

## Usage

### Basic Usage

```typescript
import { AgentIntelligenceAnalyzer } from './agentIntelligenceAnalyzer';

const analyzer = new AgentIntelligenceAnalyzer();
await analyzer.initialize();

const summary = await analyzer.generateTeamFullDaySummary({
  contactCenterId: 'gd-dev-us-001',
  startDate: '2025-10-15 00:00',
  endDate: '2025-10-15 23:59'
});

console.log(summary);
```

### Agent Metrics

The system provides the following metrics for each agent:

- **Agent ID & Name**: Unique identifier and display name
- **Active Status**: Whether the agent is currently active
- **Conversation Count**: Number of conversations handled
- **Sentiment Score**: Overall sentiment of customer interactions (0-1)
- **Customer Satisfaction**: Customer satisfaction rating (0-1)
- **Escalation Rate**: Rate of escalated conversations (0-1)
- **Resolution Rate**: Rate of resolved conversations (0-1)
- **Average Response Time**: Average time to respond to customers

### Team Summary

The team summary includes:

- Total number of agents and active agents
- Total conversations in the date range
- Average sentiment across all agents
- Top performing agents
- Agents needing attention
- Comprehensive AI-generated summary

## Setup

### Prerequisites

1. Node.js 18+
2. Python 3.8+ (for MCP Server)
3. Access to Conversation State Service APIs

### Installation

```bash
cd LLM-Server/gd-agent-sdk-llm
npm install
```

### Configuration

Update the configuration in `src/config/mcpConfig.ts`:

```typescript
export const MCP_CONFIG = {
  serverPath: '../MCP-Server/main.py',
  defaultContactCenterId: 'your-contact-center-id',
  // ... other config
};
```

### Environment Variables

Set up the following environment variables for the MCP Server:

```bash
# MCP Server environment variables
CONVERSATION_API_BASE_URL=https://your-api-base-url
CONVERSATION_STATE_SEARCH_ENDPOINT=/conversation-state/filters/search
CONVERSATION_STATE_UCID_ENDPOINT=/conversation-state/{ucid}
CONVERSATION_STATE_TRANSCRIPTS_ENDPOINT=/transcripts/ucid/{ucid}

# OAuth credentials
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_TOKEN_URL=your-token-url
```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Testing

```bash
# Run the integration test
npx ts-node src/testIntegration.ts
```

## Workflow

1. **Initialize**: Connect to MCP Server
2. **Search**: Query conversations by date range
3. **Extract**: Get UCIDs from search results
4. **Detail**: Fetch detailed conversation data for each UCID
5. **Transcripts**: Retrieve transcripts for sentiment analysis
6. **Analyze**: Calculate agent metrics and sentiment scores
7. **Summarize**: Generate AI-powered team summary

## API Reference

### AgentIntelligenceAnalyzer

#### Methods

- `initialize()`: Initialize MCP connection
- `generateTeamFullDaySummary(params)`: Generate team summary
- `cleanup()`: Clean up resources

#### Parameters

```typescript
interface AnalysisParams {
  contactCenterId: string;
  startDate: string;
  endDate: string;
  limit?: number;
}
```

#### Returns

```typescript
interface TeamSummary {
  totalAgents: number;
  activeAgents: number;
  totalConversations: number;
  averageSentiment: number;
  topPerformers: AgentMetrics[];
  needsAttention: AgentMetrics[];
  summary: string;
}
```

## Error Handling

The system includes comprehensive error handling:

- MCP connection failures
- API request timeouts
- Invalid data responses
- Network connectivity issues

## Performance Considerations

- Pagination support for large datasets
- Configurable timeouts
- Efficient data processing
- Memory management for large transcript sets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

ISC License
