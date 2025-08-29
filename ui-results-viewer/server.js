const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors());

// Root endpoint for health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'DeepTeam Results Viewer API',
    endpoints: {
      results: '/api/results',
      health: '/api/health',
      files: '/results/*'
    },
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the results directory
app.use('/results', (req, res, next) => {
  console.log(`GET /results${req.path} - Serving results file`);
  next();
}, express.static(path.join(__dirname, '../results')));

// API endpoint to list available results files
app.get('/api/results', (req, res) => {
  console.log('GET /api/results - Fetching results files...');
  try {
    const resultsDir = path.join(__dirname, '../results');
    console.log('Results directory:', resultsDir);
    
    if (!fs.existsSync(resultsDir)) {
      console.error('Results directory does not exist:', resultsDir);
      return res.status(404).json({ error: 'Results directory not found' });
    }
    
    const files = fs.readdirSync(resultsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(resultsDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          modified: stats.mtime,
          path: `/results/${file}`
        };
      })
      .sort((a, b) => b.modified - a.modified); // Sort by most recent first
    
    console.log(`Found ${files.length} results files:`, files.map(f => f.filename));
    res.json(files);
  } catch (error) {
    console.error('Error reading results directory:', error);
    res.status(500).json({ error: 'Failed to read results directory', details: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the React app for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Results API available at http://localhost:${PORT}/api/results`);
  console.log(`Results files served from http://localhost:${PORT}/results/`);
});
