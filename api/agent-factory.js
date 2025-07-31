// api/agent-factory.js
import { handleCors } from '../lib/cors.js';
import { supabase } from '../lib/supabase.js';

export default async (req, res) => {
  // Handle CORS
  if (handleCors(req, res)) return;

  try {
    // Handle based on HTTP method
    if (req.method === 'GET') {
      // Get agents with optional filtering
      const { 
        type, 
        status, 
        limit = 50, 
        offset = 0,
        include_stats = false 
      } = req.query;

      let query = supabase.from('agents').select('*');

      // Apply filters
      if (type) {
        query = query.eq('type', type);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Enhance data with statistics if requested
      let enhancedData = data;
      if (include_stats === 'true' && data && data.length > 0) {
        enhancedData = await Promise.all(
          data.map(async (agent) => {
            const stats = await getAgentStats(agent.id);
            return {
              ...agent,
              stats
            };
          })
        );
      }

      // Calculate summary
      const summary = calculateAgentSummary(enhancedData);

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
      // Validate request body
      const { name, type, config = {}, description } = req.body;

      if (!name || !type) {
        return res.status(400).json({
          status: 'error',
          message: 'name and type are required'
        });
      }

      // Validate agent type
      const validTypes = ['sentiment', 'recommendation', 'performance', 'custom'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid agent type. Must be one of: ${validTypes.join(', ')}`
        });
      }

      // Create agent with enhanced configuration
      const agentData = {
        name,
        type,
        description: description || `${type} agent created via API`,
        config: {
          ...getDefaultConfig(type),
          ...config
        },
        status: 'created',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('agents')
        .insert(agentData)
        .select()
        .single();

      if (error) throw error;

      // Initialize agent tasks
      await initializeAgentTasks(data.id);

      return res.status(201).json({
        status: 'success',
        data,
        message: 'Agent created successfully'
      });
    }
    else if (req.method === 'PUT') {
      // Update agent
      const { id } = req.query;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'Agent ID is required'
        });
      }

      const { data, error } = await supabase
        .from('agents')
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
        message: 'Agent updated successfully'
      });
    }
    else if (req.method === 'DELETE') {
      // Delete agent
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'Agent ID is required'
        });
      }

      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        message: 'Agent deleted successfully'
      });
    }
    else {
      return res.status(405).json({
        status: 'error',
        message: 'Method not allowed'
      });
    }
  } catch (error) {
    console.error('Agent Factory Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions
function getDefaultConfig(type) {
  const configs = {
    sentiment: {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1000,
      analysis_type: 'sentiment',
      language: 'en'
    },
    recommendation: {
      model: 'gpt-4',
      temperature: 0.8,
      max_tokens: 1500,
      recommendation_type: 'product',
      personalization: true
    },
    performance: {
      model: 'gpt-4',
      temperature: 0.6,
      max_tokens: 2000,
      metrics: ['accuracy', 'speed', 'efficiency'],
      monitoring: true
    },
    custom: {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1000,
      custom_prompt: '',
      custom_parameters: {}
    }
  };

  return configs[type] || configs.custom;
}

async function initializeAgentTasks(agentId) {
  // Initialize default tasks for the agent
  const defaultTasks = [
    {
      agent_id: agentId,
      name: 'Initial Setup',
      type: 'setup',
      status: 'pending',
      priority: 'high'
    }
  ];

  const { error } = await supabase
    .from('agent_tasks')
    .insert(defaultTasks);

  if (error) {
    console.error('Error initializing agent tasks:', error);
  }
}

async function getAgentStats(agentId) {
  try {
    // Get task statistics
    const { data: tasks, error: tasksError } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('agent_id', agentId);

    if (tasksError) throw tasksError;

    // Get performance metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('agent_metrics')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (metricsError) throw metricsError;

    return {
      total_tasks: tasks ? tasks.length : 0,
      completed_tasks: tasks ? tasks.filter(t => t.status === 'completed').length : 0,
      pending_tasks: tasks ? tasks.filter(t => t.status === 'pending').length : 0,
      recent_metrics: metrics || [],
      uptime: calculateUptime(new Date(), new Date()), // Simplified for now
      success_rate: tasks && tasks.length > 0 
        ? (tasks.filter(t => t.status === 'completed').length / tasks.length * 100).toFixed(2)
        : 0
    };
  } catch (error) {
    console.error('Error getting agent stats:', error);
    return {
      total_tasks: 0,
      completed_tasks: 0,
      pending_tasks: 0,
      recent_metrics: [],
      uptime: 0,
      success_rate: 0
    };
  }
}

function calculateUptime(createdAt, lastActivity) {
  const now = new Date();
  const last = lastActivity || createdAt;
  const totalTime = now - createdAt;
  const activeTime = now - last;
  
  return totalTime > 0 ? ((activeTime / totalTime) * 100).toFixed(2) : 0;
}

function calculateAgentSummary(agents) {
  if (!agents || agents.length === 0) {
    return {
      total: 0,
      by_type: {},
      by_status: {},
      average_success_rate: 0
    };
  }

  const summary = {
    total: agents.length,
    by_type: {},
    by_status: {},
    average_success_rate: 0
  };

  let totalSuccessRate = 0;
  let agentsWithStats = 0;

  agents.forEach(agent => {
    // Count by type
    summary.by_type[agent.type] = (summary.by_type[agent.type] || 0) + 1;
    
    // Count by status
    summary.by_status[agent.status] = (summary.by_status[agent.status] || 0) + 1;
    
    // Calculate average success rate
    if (agent.stats && agent.stats.success_rate) {
      totalSuccessRate += parseFloat(agent.stats.success_rate);
      agentsWithStats++;
    }
  });

  summary.average_success_rate = agentsWithStats > 0 
    ? (totalSuccessRate / agentsWithStats).toFixed(2)
    : 0;

  return summary;
}