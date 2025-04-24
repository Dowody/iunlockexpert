export function startMockWebSocketServer() {
    const mockServer = new WebSocket('ws://localhost:3001');
  
    mockServer.onopen = () => {
      console.log('Mock WebSocket server connected');
    };
  
    mockServer.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      // Simulate a delay before the agent responds
      setTimeout(() => {
        const response = {
          id: Date.now().toString(),
          text: `Thank you for your message: "${message.text}". How can I assist you further?`,
          sender: 'agent',
          timestamp: new Date(),
        };
        mockServer.send(JSON.stringify(response));
      }, 1000);
    };
  
    return mockServer;
  }
  