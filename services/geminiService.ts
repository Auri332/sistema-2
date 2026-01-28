
import { GoogleGenAI } from "@google/genai";

// SDK initialization logic following the @google/genai coding guidelines.
// Always use process.env.API_KEY directly and instantiate inside the functions.

export const generateEducationalInsights = async (studentData: any) => {
  // Use a new instance to ensure up-to-date API key access.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    
    // Use .text property (not a function) to extract the string result.
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro no Mentor IA:", error);
    return "O Mentor IA encontrou um erro técnico.";
  }
};

export const generateNewsletter = async (schoolEvents: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crie um boletim semanal acolhedor para os pais da creche com base nestes eventos: ${schoolEvents.join(", ")}. 
      Use um tom doce, emojis e organize em tópicos.`,
    });
    // Use .text property directly.
    return response.text || "Erro ao formatar boletim.";
  } catch (error) {
    console.error("Erro no Newsletter IA:", error);
    return "Erro ao gerar boletim automático.";
  }
};
