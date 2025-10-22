#!/usr/bin/env ts-node

/**
 * Main entry point for Agent Intelligence Analysis
 * Directly uses the analyzer classes
 */

import { AutonomousAgentIntelligenceAnalyzer } from './autonomousAgentIntelligenceAnalyzer.js';
import { AgentIntelligenceAnalyzer } from './agentIntelligenceAnalyzer.js';
import { MCP_CONFIG } from './config/mcpConfig.js';

async function main() {
  console.log('🚀 Starting Agent Intelligence Analysis...\n');
  
  // Choose which analyzer to use
  const useAutonomous = process.argv.includes('--autonomous');
  const analyzer = useAutonomous 
    ? new AutonomousAgentIntelligenceAnalyzer()
    : new AgentIntelligenceAnalyzer();
  
  try {
    console.log(`📡 Initializing ${useAutonomous ? 'Autonomous' : 'Manual'} Agent...`);
    await analyzer.initialize();
    console.log('✅ Agent initialized successfully\n');
    
    console.log('🔍 Running analysis with MCP_CONFIG defaults:');
    console.log(`   Contact Center: ${MCP_CONFIG.defaultContactCenterId}`);
    console.log(`   Date Range: ${MCP_CONFIG.defaultDateRange.startDate} to ${MCP_CONFIG.defaultDateRange.endDate}\n`);
    
    const result = await analyzer.generateTeamFullDaySummary({
      contactCenterId: MCP_CONFIG.defaultContactCenterId,
      startDate: MCP_CONFIG.defaultDateRange.startDate,
      endDate: MCP_CONFIG.defaultDateRange.endDate
    });
    
    console.log('\n📊 ANALYSIS RESULTS:');
    console.log('=' .repeat(50));
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  } finally {
    console.log('\n🧹 Cleaning up...');
    await analyzer.cleanup();
    console.log('✅ Cleanup completed');
  }
}

// ESM-friendly main guard
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main();
}
