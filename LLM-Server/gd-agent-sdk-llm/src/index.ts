import express, { Request, Response } from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import { AgentIntelligenceAnalyzer } from './agentIntelligenceAnalyzer.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

type Agent = {
	id: string;
	name: string;
	team: string;
	stats: { calls: number; sentiment: number };
	callStatus: 'available' | 'on-call' | 'offline';
	averageHandlingTime: number; // seconds
};

const mockAgents: Agent[] = [
	{ id: 'agent-1', name: 'Alice', team: 'North', stats: { calls: 12, sentiment: 0.73 }, callStatus: 'available', averageHandlingTime: 320 },
	{ id: 'agent-2', name: 'Bob', team: 'West', stats: { calls: 8, sentiment: 0.61 }, callStatus: 'on-call', averageHandlingTime: 410 },
	{ id: 'agent-3', name: 'Cara', team: 'East', stats: { calls: 15, sentiment: 0.82 }, callStatus: 'offline', averageHandlingTime: 275 }
];

function parseIsoDate(value: unknown): Date | null {
	if (typeof value !== 'string') return null;
	const d = new Date(value);
	return isNaN(d.getTime()) ? null : d;
}

// POST /api/agents - accepts date range in body
app.post('/api/agents', async (req: Request, res: Response) => {
	const { startDate, endDate } = req.body; //should be in format 2025-10-17 00:00

	if (!startDate || !endDate) {
		return res.status(400).json({ error: 'Missing startDate or endDate in request body.' });
	}

	const analyzer = new AgentIntelligenceAnalyzer();
	await analyzer.initialize();
	const result = await analyzer.generateTeamFullDaySummary({
		contactCenterId:  'gd-dev-us-001',
		startDate: startDate,
		endDate: endDate
	});

	return res.json(result);
});

// GET /api/agents/:agentId -> returns agent specific details
app.get('/api/agents/:agentId', (req: Request<{ agentId: string }>, res: Response) => {
	const { agentId } = req.params;
	const agent = mockAgents.find(a => a.id === agentId);
	if (!agent) {
		return res.status(404).json({ error: 'Agent not found' });
	}
	return res.json({
		agentName: agent.name,
		agentId: agent.id,
		sentimentScore: agent.stats.sentiment,
		numberOfConversations: agent.stats.calls,
		callStatus: agent.callStatus,
		averageHandlingTime: agent.averageHandlingTime
	});
});

const server = http.createServer(app);



// websocket to return agentId on alert event
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket) => {
	
	ws.send(JSON.stringify({ agentId: "agentId" }));

	ws.on('message', () => {
		// no-op
	});
});


console.log(process.env.PORT);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
server.listen(PORT, () => {
	console.log(`Middleware server listening on http://localhost:${PORT}`);
});


