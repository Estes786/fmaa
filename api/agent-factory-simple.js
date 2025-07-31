// api/agent-factory-simple.js
export default async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      return res.status(200).json({
        status: 'success',
        message: 'Agent Factory API is working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        data: {
          agents: [
            {
              id: 1,
              name: 'Test Agent',
              type: 'sentiment',
              status: 'active'
            }
          ]
        }
      });
    } 
    else if (req.method === 'POST') {
      return res.status(200).json({
        status: 'success',
        message: 'Agent created successfully!',
        timestamp: new Date().toISOString(),
        data: req.body
      });
    }
    else {
      return res.status(405).json({
        status: 'error',
        message: 'Method not allowed'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};