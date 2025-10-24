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

function parseIsoDate(value: unknown): Date | null {
	if (typeof value !== 'string') return null;
	const d = new Date(value);
	return isNaN(d.getTime()) ? null : d;
}

// POST /api/agents - accepts date range in body
app.post('/api/agents', async (req: Request, res: Response) => {
	try {
		console.log('📡 Received POST /api/agents request');
		console.log('Request body:', req.body);
		
		const { startDate, endDate } = req.body; //should be in format 2025-10-17 00:00

		if (!startDate || !endDate) {
			console.log('❌ Missing startDate or endDate in request body');
			return res.status(400).json({ error: 'Missing startDate or endDate in request body.' });
		}

		console.log(`🔍 Analyzing team performance for date range: ${startDate} to ${endDate}`);
		
		const analyzer = new AgentIntelligenceAnalyzer();
		await analyzer.initialize();
		console.log('✅ Analyzer initialized successfully');
		
		const result = await analyzer.generateTeamFullDaySummary({
			contactCenterId:  'gd-dev-us-001',
			startDate: startDate,
			endDate: endDate
		});

		console.log('📊 Analysis result:', JSON.stringify(result, null, 2));
		return res.json(result);
	} catch (error) {
		console.error('❌ Error in POST /api/agents:', error);
		return res.status(500).json({ 
			error: 'Internal server error', 
			message: error instanceof Error ? error.message : 'Unknown error',
			agentsSummary: [] // Ensure we return the expected structure even on error
		});
	}
});

// GET /api/agents/:agentId -> returns agent specific details
app.get('/api/agents/:agentId', async (req: Request<{ agentId: string }>, res: Response) => {
	try {
		console.log('📡 Received GET /api/agents/:agentId request');
		console.log('Agent ID:', req.params.agentId);
		console.log('Request body:', req.body);
		
		const { agentId } = req.params;
		const { startDate, endDate } = req.body;
		
		const analyzer = new AgentIntelligenceAnalyzer();
		await analyzer.initialize();
		console.log('✅ Analyzer initialized successfully for agent analysis');
		
		const result = await analyzer.analyzeAgent({
			agentId: agentId,
			startDate: startDate as string,
			endDate: endDate as string
		});
		
		console.log('📊 Agent analysis result:', JSON.stringify(result, null, 2));
		return res.json(result);
	} catch (error) {
		console.error('❌ Error in GET /api/agents/:agentId:', error);
		return res.status(500).json({ 
			error: 'Internal server error', 
			message: error instanceof Error ? error.message : 'Unknown error'
		});
	}
});

const server = http.createServer(app);



// websocket to return agentId on alert event
// const wss = new WebSocketServer({ server, path: '/ws' });

// wss.on('connection', (ws: WebSocket) => {
	
// 	ws.send(JSON.stringify({ agentId: "agentId" }));

// 	ws.on('message', () => {
// 		// no-op
// 	});
// });

// websocket to return agentId on alert event
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket) => {
	
	// Send agentId "jkumari1" after 1 minute (60 seconds)
	setTimeout(() => {
		ws.send(JSON.stringify({ agentId: "jkumari1" }));
	}, 60000); // 60 seconds = 60000 milliseconds

	ws.on('message', () => {
		// no-op
	});
});

console.log(process.env.PORT);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
server.listen(PORT, () => {
	console.log(`Middleware server listening on http://localhost:${PORT}`);
});
