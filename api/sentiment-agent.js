// api/sentiment-agent.js
import { handleCors } from '../lib/cors.js';
import { supabase } from '../lib/supabase.js';

export default async (req, res) => {
  // Handle CORS
  if (handleCors(req, res)) return;

  try {
    // Handle based on HTTP method
    if (req.method === 'GET') {
      // Get sentiment analysis results with filtering
      const { 
        source, 
        sentiment_type, 
        start_date, 
        end_date, 
        limit = 50, 
        offset = 0 
      } = req.query;

      let query = supabase.from('sentiment_analysis').select('*');

      // Apply filters
      if (source) {
        query = query.eq('source', source);
      }

      if (sentiment_type) {
        query = query.eq('sentiment_type', sentiment_type);
      }

      if (start_date) {
        query = query.gte('created_at', start_date);
      }

      if (end_date) {
        query = query.lte('created_at', end_date);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Calculate sentiment summary
      const summary = calculateSentimentSummary(data);

      return res.status(200).json({
        status: 'success',
        data,
        summary,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          count: data ? data.length : 0
        }
      });
    } 
    else if (req.method === 'POST') {
      // Analyze sentiment for new text
      const { text, source, context = {} } = req.body;

      if (!text) {
        return res.status(400).json({
          status: 'error',
          message: 'Text is required for sentiment analysis'
        });
      }

      // Perform sentiment analysis
      const analysis = await analyzeSentiment(text, context);

      // Save analysis result
      const analysisData = {
        text: text.substring(0, 1000), // Limit text length
        source: source || 'api',
        sentiment_score: analysis.score,
        sentiment_type: analysis.type,
        confidence: analysis.confidence,
        keywords: analysis.keywords,
        context: context,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('sentiment_analysis')
        .insert(analysisData)
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        status: 'success',
        data,
        message: 'Sentiment analysis completed successfully'
      });
    }
    else if (req.method === 'PUT') {
      // Update sentiment analysis
      const { id } = req.query;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'Analysis ID is required'
        });
      }

      const { data, error } = await supabase
        .from('sentiment_analysis')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        data,
        message: 'Sentiment analysis updated successfully'
      });
    }
    else if (req.method === 'DELETE') {
      // Delete sentiment analysis
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'Analysis ID is required'
        });
      }

      const { error } = await supabase
        .from('sentiment_analysis')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        message: 'Sentiment analysis deleted successfully'
      });
    }
    else {
      return res.status(405).json({
        status: 'error',
        message: 'Method not allowed'
      });
    }
  } catch (error) {
    console.error('Sentiment Agent Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions
async function analyzeSentiment(text, context = {}) {
  // This is a simplified sentiment analysis
  // In a real implementation, you would use NLP libraries or AI services
  
  const words = text.toLowerCase().split(/\s+/);
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'love', 'like', 'happy', 'satisfied'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'sad', 'disappointed', 'poor'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  const total = words.length;
  const positiveRatio = positiveCount / total;
  const negativeRatio = negativeCount / total;
  
  let score = 0;
  let type = 'neutral';
  let confidence = 0.5;
  
  if (positiveRatio > negativeRatio) {
    score = positiveRatio;
    type = 'positive';
    confidence = Math.min(0.9, positiveRatio + 0.3);
  } else if (negativeRatio > positiveRatio) {
    score = negativeRatio;
    type = 'negative';
    confidence = Math.min(0.9, negativeRatio + 0.3);
  } else {
    score = 0.5;
    type = 'neutral';
    confidence = 0.5;
  }
  
  // Extract keywords (simplified)
  const keywords = words
    .filter(word => word.length > 3)
    .slice(0, 5);
  
  return {
    score: parseFloat(score.toFixed(3)),
    type,
    confidence: parseFloat(confidence.toFixed(3)),
    keywords
  };
}

function calculateSentimentSummary(analyses) {
  if (!analyses || analyses.length === 0) {
    return {
      total: 0,
      by_sentiment: {},
      average_score: 0,
      average_confidence: 0
    };
  }

  const summary = {
    total: analyses.length,
    by_sentiment: {},
    average_score: 0,
    average_confidence: 0
  };

  let totalScore = 0;
  let totalConfidence = 0;

  analyses.forEach(analysis => {
    // Count by sentiment type
    summary.by_sentiment[analysis.sentiment_type] = 
      (summary.by_sentiment[analysis.sentiment_type] || 0) + 1;
    
    // Calculate averages
    totalScore += analysis.sentiment_score || 0;
    totalConfidence += analysis.confidence || 0;
  });

  summary.average_score = parseFloat((totalScore / analyses.length).toFixed(3));
  summary.average_confidence = parseFloat((totalConfidence / analyses.length).toFixed(3));

  return summary;
}