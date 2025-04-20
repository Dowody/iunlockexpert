const knowledgeBase = require('./knowledgeBase.json');

const processMessage = async (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Check if the message matches any key in the knowledge base
  for (const [key, value] of Object.entries(knowledgeBase)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }

  // If no match is found, return a default response
  return "I'm sorry, I don't have specific information about that. Can you please rephrase your question or ask about IMEI checking, phone unlocking, or our services?";
};

module.exports = { processMessage };
