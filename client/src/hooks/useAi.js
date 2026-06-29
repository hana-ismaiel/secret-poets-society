import api from "@/lib/api"

export function useAi() {
  async function generateAiPoem(prompt) {
    const response = await api.post("/ai/generate", { prompt })
    return response.data
  }

  return { generateAiPoem }
}