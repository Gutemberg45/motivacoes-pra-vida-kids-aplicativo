// Configuração do Clerk
import { Clerk } from '@clerk/clerk-js';

const clerkPublishableKey = import.meta.env.CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Chave do Clerk não definida nas variáveis de ambiente");
}

export const clerk = new Clerk(clerkPublishableKey);
await clerk.load({ signInUrl: '/login.html' });

// Verifica se o usuário está logado
export function usuarioLogado() {
  return clerk.user !== null;
}

export function idUsuarioAtual() {
  return clerk.user?.id || null;
}
