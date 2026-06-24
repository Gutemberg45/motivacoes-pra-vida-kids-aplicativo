import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function sincronizarUsuario(dadosUsuario) {
  const { id, email, nome_responsavel = "" } = dadosUsuario;

  const { error } = await supabase
    .from('users')
    .upsert({ id, email, nome_responsavel }, { onConflict: 'id' });

  if (error) console.error("Erro ao sincronizar usuário:", error);
}
