/**
 * Sentiment Analysis Utilities
 */
export interface SentimentResult {
  score: number; // -1 to 1, where -1 is very negative, 1 is very positive
  magnitude: number; // 0 to 1, indicating the strength of the sentiment
  label: 'positive' | 'negative' | 'neutral';
}

export class SentimentAnalyzer {
  private static readonly POSITIVE_WORDS = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
    'helpful', 'thank', 'thanks', 'appreciate', 'solved', 'fixed', 'resolved',
    'perfect', 'love', 'happy', 'satisfied', 'pleased', 'delighted',
    'outstanding', 'brilliant', 'superb', 'marvelous', 'exceptional'
  ];

  private static readonly NEGATIVE_WORDS = [
    'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'hate', 'angry',
    'frustrated', 'disappointed', 'annoyed', 'upset', 'mad', 'furious',
    'problem', 'issue', 'broken', 'failed', 'wrong', 'error', 'mistake',
    'useless', 'waste', 'terrible', 'worst', 'awful', 'disgusting'
  ];

  private static readonly INTENSIFIERS = [
    'very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally',
    'really', 'so', 'quite', 'rather', 'somewhat', 'slightly'
  ];

  static analyzeText(text: string): SentimentResult {
    if (!text || text.trim().length === 0) {
      return { score: 0, magnitude: 0, label: 'neutral' };
    }

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);

    let positiveScore = 0;
    let negativeScore = 0;
    let totalWords = words.length;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!word) continue;
      
      // Check for intensifiers
      const isIntensified = this.INTENSIFIERS.includes(word);
      const multiplier = isIntensified ? 1.5 : 1;

      if (this.POSITIVE_WORDS.includes(word)) {
        positiveScore += multiplier;
      } else if (this.NEGATIVE_WORDS.includes(word)) {
        negativeScore += multiplier;
      }
    }

    // Calculate final score
    const rawScore = (positiveScore - negativeScore) / totalWords;
    const score = Math.max(-1, Math.min(1, rawScore));
    const magnitude = Math.abs(score);

    let label: 'positive' | 'negative' | 'neutral';
    if (score > 0.1) {
      label = 'positive';
    } else if (score < -0.1) {
      label = 'negative';
    } else {
      label = 'neutral';
    }

    return { score, magnitude, label };
  }

  static analyzeConversation(transcripts: any[]): SentimentResult {
    if (!transcripts || transcripts.length === 0) {
      return { score: 0, magnitude: 0, label: 'neutral' };
    }

    let totalScore = 0;
    let totalMagnitude = 0;
    let messageCount = 0;

    transcripts.forEach(transcript => {
      if (transcript.transcripts && Array.isArray(transcript.transcripts)) {
        transcript.transcripts.forEach((message: any) => {
          if (message.participantRole === 'CUSTOMER' && message.content) {
            const sentiment = this.analyzeText(message.content);
            totalScore += sentiment.score;
            totalMagnitude += sentiment.magnitude;
            messageCount++;
          }
        });
      }
    });

    if (messageCount === 0) {
      return { score: 0, magnitude: 0, label: 'neutral' };
    }

    const avgScore = totalScore / messageCount;
    const avgMagnitude = totalMagnitude / messageCount;

    let label: 'positive' | 'negative' | 'neutral';
    if (avgScore > 0.1) {
      label = 'positive';
    } else if (avgScore < -0.1) {
      label = 'negative';
    } else {
      label = 'neutral';
    }

    return { score: avgScore, magnitude: avgMagnitude, label };
  }

  static analyzeAgentPerformance(agentTranscripts: any[]): {
    overallSentiment: SentimentResult;
    customerSatisfaction: number;
    escalationIndicators: number;
    resolutionIndicators: number;
  } {
    const overallSentiment = this.analyzeConversation(agentTranscripts);
    
    // Calculate customer satisfaction (0-1 scale)
    const customerSatisfaction = Math.max(0, Math.min(1, (overallSentiment.score + 1) / 2));
    
    // Look for escalation indicators
    let escalationCount = 0;
    let totalConversations = 0;
    
    agentTranscripts.forEach(transcript => {
      if (transcript.transcripts) {
        totalConversations++;
        const hasEscalation = transcript.transcripts.some((msg: any) => 
          msg.content.toLowerCase().includes('escalate') ||
          msg.content.toLowerCase().includes('manager') ||
          msg.content.toLowerCase().includes('supervisor') ||
          msg.content.toLowerCase().includes('complaint')
        );
        if (hasEscalation) escalationCount++;
      }
    });
    
    const escalationIndicators = totalConversations > 0 ? escalationCount / totalConversations : 0;
    
    // Look for resolution indicators
    let resolutionCount = 0;
    
    agentTranscripts.forEach(transcript => {
      if (transcript.transcripts) {
        const hasResolution = transcript.transcripts.some((msg: any) => 
          msg.content.toLowerCase().includes('resolved') ||
          msg.content.toLowerCase().includes('fixed') ||
          msg.content.toLowerCase().includes('solved') ||
          msg.content.toLowerCase().includes('thank you') ||
          msg.content.toLowerCase().includes('appreciate')
        );
        if (hasResolution) resolutionCount++;
      }
    });
    
    const resolutionIndicators = totalConversations > 0 ? resolutionCount / totalConversations : 0;

    return {
      overallSentiment,
      customerSatisfaction,
      escalationIndicators,
      resolutionIndicators
    };
  }
}
