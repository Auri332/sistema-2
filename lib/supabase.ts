
import { createClient } from '@supabase/supabase-js';

// URL fixa do seu projeto
const SUPABASE_URL = "https://dvrxdokxmanaqfkofvse.supabase.co";

// Tenta pegar a chave de várias formas
const getEnvKey = () => {
  try {
    return (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";
  } catch (e) {
    return "";
  }
};

const key = getEnvKey();

// Se não houver chave, exportamos um cliente "fake" que não quebra o app
export const supabase = (key && key.length > 10) 
  ? createClient(SUPABASE_URL, key)
  : {
      auth: { onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
      from: () => ({
        select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => Promise.resolve({ data: null, error: null })
      })
    } as any;
