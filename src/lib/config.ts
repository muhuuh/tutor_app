// Configuration for external services
export const config = {
  reportFunctionUrl:
    import.meta.env.VITE_SUPABASE_FUNCTIONS_URL + "/generate-report",
  chatFunctionUrl: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL + "/chat",
  suggestionsFunctionUrl:
    import.meta.env.VITE_SUPABASE_FUNCTIONS_URL + "/suggestions",
  exerciseForgeWebhookUrl:
    import.meta.env.VITE_SUPABASE_FUNCTIONS_URL + "/exercise-forge",
};
