// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// Use body-parser middleware
app.use(bodyParser.json());

// Create event handler
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  // Check the type of event
  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    // Emit the CommentModerated event
    await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: {
        ...data,
        status
      }
    });
  }

  // Send response
  res.send({});
});

// Listen on port 4003
app.listen(4003, () => {
  console.log('Listening on 4003');
});