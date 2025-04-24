import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import WebSocket from 'ws';
import { processMessage } from './chatbot'; 

dotenv.config();

const app = express();
const server = http.createServer(app);  // Use http server to combine Express and WebSocket
const wss = new WebSocket.Server({ server });

const clients = new Map();

app.use(cors());
app.use(express.json());

// WebSocket server logic
wss.on('connection', (ws) => {
  const id = Date.now();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };

  clients.set(ws, metadata);

  ws.on('message', async (message) => {
    const response = await processMessage(message.toString());  // Integrating chatbot
    ws.send(JSON.stringify({ type: 'bot', message: response }));
  });
});

// IMEI validation and lookup endpoint
function validateIMEI(imei) {
  const cleanIMEI = imei.replace(/\D/g, '');

  if (cleanIMEI.length !== 15) {
    return 'IMEI must be exactly 15 digits';
  }
  if (!/^\d+$/.test(cleanIMEI)) {
    return 'IMEI must contain only numbers';
  }
  if (/^0{15}$/.test(cleanIMEI)) {
    return 'Invalid IMEI: cannot be all zeros';
  }
  if (/^1{15}$/.test(cleanIMEI)) {
    return 'Invalid IMEI: cannot be all ones';
  }

  const tac = cleanIMEI.substring(0, 8);
  if (!/^[0-9]{8}$/.test(tac)) {
    return 'Invalid Type Allocation Code (TAC)';
  }

  let sum = 0;
  let isEven = false;
  for (let i = cleanIMEI.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanIMEI[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0 ? null : 'Invalid IMEI checksum';
}

async function checkIMEI(imei) {
  try {
    const API_KEY = process.env.IMEI_API_KEY;
    const SERVICE_ID = process.env.IMEI_SERVICE_ID || '1'; // Default service ID

    const response = await fetch(
      `https://dash.dev.imei.info/api/check/${SERVICE_ID}/?imei=${imei}&API_KEY=${API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to check IMEI');
    }

    const data = await response.json();

    return {
      specifications: {
        model_name: data.device?.model_name || 'Unknown',
        manufacturer: data.device?.manufacturer || 'Unknown',
        model_number: data.device?.model_number || 'Unknown',
        device_type: data.device?.type || 'Unknown',
        release_date: data.device?.release_date || 'Unknown'
      },
      blacklist: {
        status: data.blacklist?.status || 'unknown',
        reported_date: data.blacklist?.reported_date || null,
        reason: data.blacklist?.reason || null
      },
      additional_info: {
        carrier: data.carrier?.name || 'Unknown',
        country: data.carrier?.country || 'Unknown',
        warranty: data.warranty?.status || 'Unknown',
        activation_status: data.activation?.status || 'Unknown'
      }
    };
  } catch (error) {
    console.error('IMEI check error:', error);
    throw error;
  }
}

app.get('/api/check-imei', async (req, res) => {
  try {
    const { imei } = req.query;

    if (!imei) {
      return res.status(400).json({ error: 'IMEI parameter is required' });
    }

    const validationError = validateIMEI(imei);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const result = await checkIMEI(imei);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: error.message || 'Failed to check IMEI. Please try again later.'
    });
  }
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});