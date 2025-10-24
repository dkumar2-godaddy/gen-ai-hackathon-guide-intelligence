# Gen AI Hackathon Guide Intelligence

A comprehensive AI-powered agent intelligence system that analyzes customer support conversations to generate actionable insights about agent performance, customer sentiment, and support quality metrics.

## 🎯 Overview

This project is a sophisticated AI system designed for customer care and support departments in website & domain hosting companies. It leverages advanced AI models and Model Context Protocol (MCP) tools to analyze customer-agent interactions, providing real-time insights for fraud detection, threat assessment, abuse monitoring, and performance optimization.

## ✨ Key Features

### 🤖 Agent Intelligence Analysis
- **Real-time Performance Metrics**: Analyze agent performance including sentiment, satisfaction, and resolution rates
- **Fraud & Threat Detection**: AI-powered identification of potential fraud, threats, and abuse in customer interactions
- **Sentiment Analysis**: Advanced sentiment analysis of both customer and agent interactions
- **Escalation Intelligence**: Automatic detection of conversations requiring escalation
- **Performance Optimization**: Track response times, resolution efficiency, and other KPIs

### 📊 Team Management & Reporting
- **Team Summary Reports**: Generate comprehensive team performance summaries for management
- **Agent-specific Insights**: Detailed analysis for individual agents with personalized recommendations
- **Dashboard-Ready Output**: Generate insights in formats suitable for UI dashboards
- **Historical Analysis**: Track performance trends over time

### 🔧 Technical Capabilities
- **MCP Tool Integration**: Seamless integration with Conversation State Service APIs
- **Multi-Model AI Support**: Support for Claude Sonnet 4, Claude 3.5 Sonnet, and GPT-4o
- **Real-time Processing**: Live analysis of ongoing conversations
- **Scalable Architecture**: Built to handle high-volume customer support operations

## 🏗️ Architecture

The system consists of two main components:

```
gen-ai-hackathon-guide-intelligence/
├── LLM-Server/                    # AI Analysis Engine
│   └── gd-agent-sdk-llm/         # TypeScript/Node.js application
│       ├── src/
│       │   ├── agentIntelligenceAnalyzer.ts    # Main analyzer class
│       │   ├── agentIntelligence.ts           # Entry point
│       │   ├── utils/                         # Utility functions
│       │   ├── config/                        # Configuration
│       │   └── prompts/                      # AI prompts
│       └── package.json
├── MCP-Server/                     # Data Access Layer
│   ├── src/
│   │   ├── tools/                  # MCP tools for API integration
│   │   └── utils/                 # OAuth and utility functions
│   ├── main.py                    # FastMCP server entry point
│   └── requirements.txt
└── examples/                      # Sample implementations
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.8 or higher)
- **GoDaddy Agent SDK** access
- **OpenAI API** access
- **GoDaddy environment** access

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd gen-ai-hackathon-guide-intelligence
```

2. **Install LLM Server dependencies**:
```bash
cd LLM-Server/gd-agent-sdk-llm
npm install
```

3. **Install MCP Server dependencies**:
```bash
cd ../../MCP-Server
pip install -r requirements.txt
```

4. **Configure environment variables**:
```bash
# LLM Server
cd ../LLM-Server/gd-agent-sdk-llm
cp src/test.env .env
```

Edit the `.env` file:
```env
# Required: OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Environment (defaults to 'dev')
GD_ENV=dev

# Optional: AI model (defaults to claude-sonnet-4-20250514)
#OPENAI_MODEL=gpt-4o

# Optional: For ASM/GoKnowb features
#SSO_JWT=your-jwt-token-here
```

```bash
# MCP Server
cd ../../MCP-Server
export OAUTH_CLIENT_ID="YOUR_ACTUAL_CLIENT_ID"
export OAUTH_CLIENT_SECRET="YOUR_ACTUAL_CLIENT_SECRET"
export OAUTH_SCOPE="care.dataplane.read:all"
```

### Running the System

1. **Start the MCP Server** (Data Layer):
```bash
cd MCP-Server
python main.py --stdio
```

2. **Start the LLM Server** (AI Analysis):
```bash
cd LLM-Server/gd-agent-sdk-llm
npm run dev
```

## 🔧 Configuration

### AI Models

The system supports multiple AI models:

| Model | Identifier | Description |
|-------|------------|-------------|
| **Claude Sonnet 4** | `claude-sonnet-4-20250514` | Default, most advanced |
| **Claude 3.5 Sonnet** | `claude-3-5-sonnet-20241022` | High performance |
| **GPT-4o** | `gpt-4o` | OpenAI's flagship model |

### Environment Variables

#### LLM Server
| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | ✅ | OpenAI API key for AI model access | - |
| `GD_ENV` | ❌ | GoDaddy environment (dev/prod) | `dev` |
| `OPENAI_MODEL` | ❌ | AI model to use | `claude-sonnet-4-20250514` |
| `SSO_JWT` | ❌ | JWT token for ASM/GoKnowb features | - |

#### MCP Server
| Variable | Required | Description |
|----------|----------|-------------|
| `OAUTH_CLIENT_ID` | ✅ | OAuth 2.0 client ID |
| `OAUTH_CLIENT_SECRET` | ✅ | OAuth 2.0 client secret |
| `OAUTH_SCOPE` | ✅ | OAuth scope (care.dataplane.read:all) |

## 📊 Data Sources

The system analyzes two primary data sources:

### 1. **Conversation State API**
- Agent information and metadata
- Session timestamps and details
- Contact center assignments
- Conversation status and outcomes

### 2. **Transcript API**
- Full conversation transcripts
- Customer and agent messages
- Timestamps and message metadata
- Sentiment indicators

### Key Data Attributes

- **`ucid`**: Unique conversation identifier per customer session
- **`contactId`**: Unique identifier for each agent interaction
- **`agentId`**: Unique identifier for each support agent
- **`contactCenterId`**: Contact center assignment

## 🛠️ MCP Tools Integration

The system integrates with three specialized MCP tools:

1. **`conversation_state_search`**: Search conversations by date range and filters
2. **`conversation_state_ucid_detail`**: Get detailed conversation information by UCID
3. **`conversation_state_transcripts`**: Retrieve conversation transcripts for analysis

## 📈 Analysis Output

The system generates comprehensive insights including:

### Agent Metrics
- **Performance Scores**: Resolution rates, response times, customer satisfaction
- **Sentiment Analysis**: Customer and agent sentiment throughout conversations
- **Escalation Patterns**: Identification of conversations requiring escalation
- **Fraud Indicators**: Detection of potential fraud, threats, and abuse

### Team Insights
- **Team Performance**: Aggregate metrics across all agents
- **Top Performers**: Identification of high-performing agents
- **Improvement Areas**: Agents needing attention and training
- **Trend Analysis**: Performance trends over time

### Dashboard-Ready Data
- **Real-time Metrics**: Live performance indicators
- **Historical Reports**: Trend analysis and performance history
- **Actionable Insights**: Specific recommendations for improvement

## 🚀 Usage Examples

### Basic Agent Analysis

```typescript
import { AgentIntelligenceAnalyzer } from './agentIntelligenceAnalyzer';

const analyzer = new AgentIntelligenceAnalyzer();
await analyzer.initialize();

const summary = await analyzer.generateTeamFullDaySummary({
  contactCenterId: 'gd-dev-us-001',
  startDate: '2025-01-15 00:00',
  endDate: '2025-01-15 23:59'
});

console.log(summary);
```

### Individual Agent Analysis

```typescript
const agentMetrics = await analyzer.analyzeAgentPerformance({
  agentId: 'agent-123',
  startDate: '2025-01-15 00:00',
  endDate: '2025-01-15 23:59'
});
```

## 🔍 Development

### Adding New Analysis Features

1. **Update AI Prompts**: Modify `src/prompts/agent-intelligence-prompts.ts`
2. **Enhance Analysis Logic**: Update `src/agentIntelligenceAnalyzer.ts`
3. **Add New Data Sources**: Extend the data processing pipeline
4. **Test with Sample Data**: Use provided sample data for testing

### Testing

The project includes comprehensive sample data:
- **Sample conversation states** in `data/conversationState.ts`
- **Sample transcripts** in `data/trascripts.ts`
- **Integration tests** in `src/testIntegration.ts`

### Running Tests

```bash
# Run integration tests
cd LLM-Server/gd-agent-sdk-llm
npx ts-node src/testIntegration.ts

# Run MCP server tests
cd ../../MCP-Server
python -m pytest
```

## 📚 API Reference

### AgentIntelligenceAnalyzer

#### Methods

- `initialize()`: Initialize MCP connection and AI models
- `generateTeamFullDaySummary(params)`: Generate comprehensive team summary
- `analyzeAgentPerformance(params)`: Analyze individual agent performance
- `cleanup()`: Clean up resources and connections

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

## 🔒 Security Considerations

- **OAuth 2.0 Authentication**: Secure API access with token management
- **Input Validation**: Comprehensive validation of all inputs
- **Error Handling**: Secure error responses without sensitive data exposure
- **Data Privacy**: Conversation data processed securely with no persistent storage

## 🐛 Troubleshooting

### Common Issues

1. **MCP Connection Failures**
   - Verify MCP server is running
   - Check OAuth credentials
   - Ensure API endpoints are accessible

2. **AI Model Errors**
   - Verify OpenAI API key
   - Check model availability
   - Review rate limits

3. **Data Access Issues**
   - Confirm OAuth scope permissions
   - Verify contact center IDs
   - Check date range validity

### Debug Mode

Enable debug logging for detailed troubleshooting:

```bash
# LLM Server
DEBUG=true npm run dev

# MCP Server
python main.py --log-level DEBUG --stdio
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

## 📄 License

This project is proprietary to GoDaddy and is not open source.

## 🆘 Support

For questions, issues, or contributions:

- **Internal Support**: Contact the GoDaddy Customer Care team
- **Development Issues**: Reach out to the development team
- **Documentation**: Check the individual component READMEs for detailed information

## 📋 Changelog

### v1.0.0
- ✅ Initial release with core agent intelligence analysis
- ✅ MCP tool integration for Conversation State Service
- ✅ Multi-model AI support (Claude Sonnet 4, Claude 3.5, GPT-4o)
- ✅ Real-time sentiment analysis and fraud detection
- ✅ Team summary reports and individual agent insights
- ✅ Dashboard-ready output formats
- ✅ Comprehensive error handling and logging
- ✅ OAuth 2.0 authentication and security

---

**Built with ❤️ for GoDaddy Customer Care Teams**