# Guide Intelligence Draft

A GoDaddy Agent Intelligence project that analyzes customer support conversations to generate insights about agent performance, customer sentiment, and support quality metrics.

## Overview

This project uses AI to analyze customer support transcripts and conversation data to provide actionable insights for customer care teams. It focuses on agent intelligence analysis including fraud detection, threat assessment, abuse monitoring, and escalation needs identification.

## Features

- **Agent Intelligence Analysis**: Analyzes customer and agent interactions to identify patterns and insights
- **Sentiment Analysis**: Evaluates customer and agent sentiment throughout conversations
- **Fraud & Threat Detection**: Flags potential fraud, threats, and abuse in customer interactions
- **Performance Metrics**: Tracks customer and agent wait times, resolution efficiency, and other KPIs
- **Dashboard-Ready Output**: Generates insights in a format suitable for UI dashboards

## Project Structure

```
examples/
└── gd-agent-sdk-llm/
    ├── data/
    │   ├── conversationState.ts    # Sample conversation state data
    │   └── trascripts.ts           # Sample conversation transcripts
    └── src/
        ├── agentIntelligence.ts    # Main agent intelligence analyzer
        ├── prompts/
        │   └── agent-intelligence-prompts.ts  # AI prompts for analysis
        └── test.env               # Environment configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- GoDaddy Agent SDK
- OpenAI API access
- GoDaddy environment access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Guide-Intelligence-Draft
```

2. Install dependencies:
```bash
cd examples/gd-agent-sdk-llm
npm install
```

3. Configure environment variables:
```bash
cp src/test.env .env
```

Edit the `.env` file with your API keys and configuration:
```env
# Required: OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Environment (defaults to 'dev')
GD_ENV=dev

# Optional: Default model (defaults to claude-3-5-sonnet-20241022)
#OPENAI_MODEL=gpt-4o

# Optional: For ASM/GoKnowb features
#SSO_JWT=your-jwt-token-here
```

### Usage

Run the agent intelligence analyzer:

```bash
npm run start
# or
node src/agentIntelligence.ts
```

## Configuration

### Models

The project supports multiple AI models:
- **Claude Sonnet 4** (default): `claude-sonnet-4-20250514`
- **Claude 3.5 Sonnet**: `claude-3-5-sonnet-20241022`
- **GPT-4o**: `gpt-4o` (configurable)

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI model access | - |
| `GD_ENV` | No | GoDaddy environment (dev/prod) | `dev` |
| `OPENAI_MODEL` | No | AI model to use | `claude-3-5-sonnet-20241022` |
| `SSO_JWT` | No | JWT token for ASM/GoKnowb features | - |

## Data Sources

The system analyzes two main data sources:

1. **Transcript API**: Contains conversation transcripts with attributes like `ucid` and `contactId`
2. **Conversation State API**: Contains conversation metadata including agent information, timestamps, and session details

### Key Attributes

- **ucid**: Unique conversation identifier per customer session
- **contactId**: Unique identifier for each agent interaction
- **agentId**: Unique identifier for each support agent

## Analysis Output

The system generates insights including:

- Agent performance metrics
- Customer sentiment analysis
- Fraud and threat indicators
- Escalation recommendations
- Wait time analysis
- Resolution efficiency metrics

## Development

### Adding New Analysis Features

1. Update the prompts in `src/prompts/agent-intelligence-prompts.ts`
2. Modify the agent instructions in `src/agentIntelligence.ts`
3. Add new data sources to the `data/` directory
4. Update the analysis logic as needed

### Testing

The project includes sample data for testing:
- Sample conversation states in `data/conversationState.ts`
- Sample transcripts in `data/trascripts.ts`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to GoDaddy and is not open source.

## Support

For questions or issues, contact the GoDaddy Customer Care team or the development team.

## Changelog

### v1.0.0
- Initial release
- Basic agent intelligence analysis
- Support for multiple AI models
- Dashboard-ready output format
