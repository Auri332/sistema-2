
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  return process.env.API_KEY || (import.meta as any).env.VITE_API_KEY || "";
};

export const generateEducationalInsights = async (studentData: any) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "O Mentor IA está desativado (Chave API ausente). Configure a variável VITE_API_KEY.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Você é um Coordenador Pedagógico sênior com 20 anos de experiência em educação infantil.
      Analise o perfil deste aluno da creche e gere um relatório de desenvolvimento:
      
      Nome: ${studentData.name}
      Idade: ${studentData.age} anos
      Frequência: ${studentData.attendance}%
      Engajamento: ${studentData.performance}/100
      
      Por favor, forneça em Português Brasileiro:
      1. DIAGNÓSTICO: Uma análise carinhosa e profissional sobre o estado atual da criança.
      2. ATIVIDADES: 3 sugestões de brincadeiras lúdicas que ajudem a melhorar o engajamento ou coordenação motora.
      3. MENSAGEM AOS PAIS: Uma nota positiva para ser enviada via app.`,
    });
    
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro no Mentor IA:", error);
    return "O Mentor IA encontrou um erro técnico. Verifique se sua chave API é válida e tem créditos.";
  }
};

export const generateNewsletter = async (schoolEvents: string[]) => {
  const apiKey = getApiKey();
  if (!apiKey) return "Erro: API Key não configurada.";

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crie um boletim semanal acolhedor para os pais da creche com base nestes eventos: ${schoolEvents.join(", ")}. 
      Use um tom doce, emojis e organize em tópicos.`,
    });
    return response.text || "Erro ao formatar boletim.";
  } catch (error) {
    console.error("Erro no Newsletter IA:", error);
    return "Erro ao gerar boletim automático.";
  }
};
