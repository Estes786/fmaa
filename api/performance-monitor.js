// api/performance-monitor.js
import { handleCors } from '../lib/cors.js';
import { supabase } from '../lib/supabase.js';

export default async (req, res) => {
  // Handle CORS
  if (handleCors(req, res)) return;

  try {
    // Handle based on HTTP method
    if (req.method === 'GET') {
      // Get metrics data with filtering options
      const { 
        service, 
        metric_type, 
        start_date, 
        end_date, 
        limit = 100, 
        offset = 0,
        aggregation = 'raw' // raw, hourly, daily
      } = req.query;

      let query = supabase.from('performance_metrics').select('*');

      // Apply filters
      if (service) {
        query = query.eq('service', service);
      }

      if (metric_type) {
        query = query.eq('metric_type', metric_type);
      }

      if (start_date) {
        query = query.gte('timestamp', start_date);
      }

      if (end_date) {
        query = query.lte('timestamp', end_date);
      }

      const { data, error } = await query
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Process data based on aggregation type
      let processedData = data;
      if (aggregation !== 'raw' && data && data.length > 0) {
        processedData = aggregateMetrics(data, aggregation);
      }

      // Calculate summary statistics
      const summary = calculateSummaryStats(processedData);

      return res.status(200).json({
        status: 'success',
        data: processedData,
        summary,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          count: processedData ? processedData.length : 0
        },
        filters_applied: {
          service,
          metric_type,
          start_date,
          end_date,
          aggregation
        }
      });
    } 
    else if (req.method === 'POST') {
      // Validate request body
      const { service, metric_type, value, metadata = {} } = req.body;

      if (!service || !metric_type || value === undefined) {
        return res.status(400).json({
          status: 'error',
          message: 'service, metric_type, and value are required'
        });
      }

      // Validate value is numeric
      if (typeof value !== 'number') {
        return res.status(400).json({
          status: 'error',
          message: 'value must be a number'
        });
      }

      const timestamp = new Date().toISOString();

      // Calculate additional metrics
      const enhancedMetadata = {
        ...metadata,
        recorded_at: timestamp,
        source: 'api',
        version: '1.0'
      };

      // Create metric record
      const metricData = {
        service,
        metric_type,
        value,
        timestamp,
        metadata: enhancedMetadata
      };

      const { data, error } = await supabase
        .from('performance_metrics')
        .insert(metricData)
        .select()
        .single();

      if (error) throw error;

      // Check for performance alerts
      await checkPerformanceAlerts(service, metric_type, value);

      return res.status(201).json({
        status: 'success',
        data,
        message: 'Performance metric recorded successfully'
      });
    }
    else if (req.method === 'DELETE') {
      // Delete metrics (with optional filtering)
      const { service, metric_type, start_date, end_date } = req.query;

      let query = supabase.from('performance_metrics');

      // Apply filters for deletion
      if (service) {
        query = query.eq('service', service);
      }

      if (metric_type) {
        query = query.eq('metric_type', metric_type);
      }

      if (start_date) {
        query = query.gte('timestamp', start_date);
      }

      if (end_date) {
        query = query.lte('timestamp', end_date);
      }

      const { error } = await query.delete();

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        message: 'Performance metrics deleted successfully'
      });
    }
    else {
      return res.status(405).json({
        status: 'error',
        message: 'Method not allowed'
      });
    }
  } catch (error) {
    console.error('Performance Monitor Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions
function aggregateMetrics(data, aggregation) {
  if (!data || data.length === 0) return [];

  const grouped = {};
  
  data.forEach(metric => {
    const timestamp = new Date(metric.timestamp);
    let key;
    
    if (aggregation === 'hourly') {
      key = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')}T${String(timestamp.getHours()).padStart(2, '0')}:00:00`;
    } else if (aggregation === 'daily') {
      key = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')}`;
    }
    
    if (!grouped[key]) {
      grouped[key] = {
        values: [],
        count: 0,
        sum: 0,
        min: Infinity,
        max: -Infinity
      };
    }
    
    grouped[key].values.push(metric.value);
    grouped[key].count++;
    grouped[key].sum += metric.value;
    grouped[key].min = Math.min(grouped[key].min, metric.value);
    grouped[key].max = Math.max(grouped[key].max, metric.value);
  });

  return Object.entries(grouped).map(([timestamp, stats]) => ({
    timestamp,
    service: data[0].service,
    metric_type: data[0].metric_type,
    value: stats.sum / stats.count, // average
    count: stats.count,
    min: stats.min,
    max: stats.max,
    sum: stats.sum,
    aggregation_type: aggregation
  }));
}

function calculateSummaryStats(data) {
  if (!data || data.length === 0) {
    return {
      count: 0,
      average: 0,
      min: 0,
      max: 0,
      total: 0
    };
  }

  const values = data.map(d => d.value);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const average = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    count: data.length,
    average: parseFloat(average.toFixed(2)),
    min: parseFloat(min.toFixed(2)),
    max: parseFloat(max.toFixed(2)),
    total: parseFloat(sum.toFixed(2))
  };
}

async function checkPerformanceAlerts(service, metric_type, value) {
  try {
    // Define alert thresholds
    const thresholds = {
      response_time: { warning: 1000, critical: 3000 },
      cpu_usage: { warning: 70, critical: 90 },
      memory_usage: { warning: 80, critical: 95 },
      error_rate: { warning: 5, critical: 10 }
    };

    const threshold = thresholds[metric_type];
    if (!threshold) return;

    let alert_level = null;
    if (value >= threshold.critical) {
      alert_level = 'critical';
    } else if (value >= threshold.warning) {
      alert_level = 'warning';
    }

    if (alert_level) {
      // Create alert record
      const alertData = {
        service,
        metric_type,
        value,
        threshold: threshold[alert_level],
        alert_level,
        timestamp: new Date().toISOString(),
        status: 'active'
      };

      await supabase
        .from('performance_alerts')
        .insert(alertData);

      console.log(`Performance alert: ${alert_level} level for ${service} ${metric_type} = ${value}`);
    }
  } catch (error) {
    console.error('Error checking performance alerts:', error);
  }
}