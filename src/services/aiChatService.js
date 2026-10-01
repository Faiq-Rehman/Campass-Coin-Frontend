const aiChatService = {
  sendMessage: async (message, history = []) => {
    const token = localStorage.getItem('campus_coin_token');
    if (!token) {
      throw new Error('Please sign in again to use the AI assistant.');
    }

    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message, history })
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || 'Gemini could not answer right now. Please try again.');
    }
    if (typeof result.reply !== 'string' || !result.reply.trim()) {
      throw new Error('Gemini returned an empty response. Please try again.');
    }

    return result.reply;
  }
};

export default aiChatService;