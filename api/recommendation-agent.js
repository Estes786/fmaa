// api/recommendation-agent.js
import { handleCors } from '../lib/cors.js';
import { supabase } from '../lib/supabase.js';

export default async (req, res) => {
  // Handle CORS
  if (handleCors(req, res)) return;

  try {
    // Handle based on HTTP method
    if (req.method === 'GET') {
      // Get recommendations with filtering options
      const { 
        user_id, 
        category, 
        limit = 10, 
        offset = 0,
        include_metadata = false 
      } = req.query;

      let query = supabase.from('recommendations').select('*');

      // Apply filters
      if (user_id) {
        query = query.eq('user_id', user_id);
      }

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query
        .order('confidence_score', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Enhance data with metadata if requested
      let enhancedData = data;
      if (include_metadata === 'true' && data && data.length > 0) {
        enhancedData = await Promise.all(
          data.map(async (rec) => {
            const metadata = await getRecommendationMetadata(rec.id);
            return {
              ...rec,
              metadata
            };
          })
        );
      }

      // Calculate summary
      const summary = calculateRecommendationSummary(enhancedData);

      return res.status(200).json({
        status: 'success',
        data: enhancedData,
        summary,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          count: enhancedData ? enhancedData.length : 0
        }
      });
    } 
    else if (req.method === 'POST') {
      // Generate new recommendations
      const { 
        user_id, 
        category, 
        preferences = {}, 
        context = {},
        count = 5 
      } = req.body;

      if (!user_id || !category) {
        return res.status(400).json({
          status: 'error',
          message: 'user_id and category are required'
        });
      }

      // Validate category
      const validCategories = ['product', 'content', 'service', 'custom'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
        });
      }

      // Generate recommendations
      const recommendations = await generateRecommendations(
        user_id, 
        category, 
        preferences, 
        context, 
        count
      );

      // Save recommendations to database
      const recommendationData = recommendations.map(rec => ({
        user_id,
        category,
        item_id: rec.item_id,
        title: rec.title,
        description: rec.description,
        confidence_score: rec.confidence_score,
        reasoning: rec.reasoning,
        metadata: rec.metadata,
        created_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('recommendations')
        .insert(recommendationData)
        .select();

      if (error) throw error;

      return res.status(201).json({
        status: 'success',
        data,
        message: 'Recommendations generated successfully'
      });
    }
    else if (req.method === 'PUT') {
      // Update recommendation feedback
      const { id } = req.query;
      const { feedback, rating, clicked = false } = req.body;

      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'Recommendation ID is required'
        });
      }

      const updateData = {
        updated_at: new Date().toISOString()
      };

      if (feedback !== undefined) updateData.feedback = feedback;
      if (rating !== undefined) updateData.rating = rating;
      if (clicked !== undefined) updateData.clicked = clicked;

      const { data, error } = await supabase
        .from('recommendations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        data,
        message: 'Recommendation feedback updated successfully'
      });
    }
    else if (req.method === 'DELETE') {
      // Delete recommendations
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'Recommendation ID is required'
        });
      }

      const { error } = await supabase
        .from('recommendations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        message: 'Recommendation deleted successfully'
      });
    }
    else {
      return res.status(405).json({
        status: 'error',
        message: 'Method not allowed'
      });
    }
  } catch (error) {
    console.error('Recommendation Agent Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions
async function generateRecommendations(user_id, category, preferences, context, count) {
  // This is a simplified recommendation generation
  // In a real implementation, you would use ML models or recommendation algorithms
  
  const mockRecommendations = [];
  const categories = {
    product: ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
    content: ['Articles', 'Videos', 'Podcasts', 'Tutorials'],
    service: ['Consulting', 'Support', 'Training', 'Maintenance'],
    custom: ['Custom Items']
  };

  const items = categories[category] || categories.custom;

  for (let i = 0; i < count; i++) {
    const item = items[i % items.length];
    const confidence = Math.random() * 0.4 + 0.6; // 0.6 to 1.0

    mockRecommendations.push({
      item_id: `item_${category}_${i}`,
      title: `${item} Recommendation ${i + 1}`,
      description: `Personalized ${item.toLowerCase()} recommendation based on your preferences`,
      confidence_score: parseFloat(confidence.toFixed(3)),
      reasoning: `Based on your ${category} preferences and recent activity`,
      metadata: {
        category,
        source: 'recommendation_engine',
        algorithm: 'collaborative_filtering',
        generated_at: new Date().toISOString()
      }
    });
  }

  return mockRecommendations;
}

async function getRecommendationMetadata(recommendationId) {
  try {
    const { data, error } = await supabase
      .from('recommendation_metadata')
      .select('*')
      .eq('recommendation_id', recommendationId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting recommendation metadata:', error);
    return null;
  }
}

function calculateRecommendationSummary(recommendations) {
  if (!recommendations || recommendations.length === 0) {
    return {
      total: 0,
      by_category: {},
      average_confidence: 0,
      average_rating: 0
    };
  }

  const summary = {
    total: recommendations.length,
    by_category: {},
    average_confidence: 0,
    average_rating: 0
  };

  let totalConfidence = 0;
  let totalRating = 0;
  let ratedCount = 0;

  recommendations.forEach(rec => {
    // Count by category
    summary.by_category[rec.category] = (summary.by_category[rec.category] || 0) + 1;
    
    // Calculate confidence
    totalConfidence += rec.confidence_score || 0;
    
    // Calculate rating
    if (rec.rating) {
      totalRating += rec.rating;
      ratedCount++;
    }
  });

  summary.average_confidence = parseFloat((totalConfidence / recommendations.length).toFixed(3));
  summary.average_rating = ratedCount > 0 
    ? parseFloat((totalRating / ratedCount).toFixed(2))
    : 0;

  return summary;
}