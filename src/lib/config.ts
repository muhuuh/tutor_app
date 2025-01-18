// Configuration for external services
export const config = {
  n8nWebhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/test',
  chatWebhookUrl: 'https://arani.app.n8n.cloud/webhook/e505d62b-76a4-43d8-a461-187f7d6dc312/chat',
  exerciseForgeWebhookUrl: import.meta.env.VITE_N8N_EXERCISE_FORGE_WEBHOOK || 'http://localhost:5678/webhook/exercise-forge',
};