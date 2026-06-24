import { Clerk } from '@clerk/clerk-js';

const clerkPublishableKey = import.meta.env.CLERK_PUBLISHABLE_KEY;

export const clerk = new Clerk(clerkPublishableKey);

export async function initClerk() {
  await clerk.load();
}

export function usuarioLogado() {
  return !!clerk.user;
}

export function idUsuarioAtual() {
  return clerk.user?.id || null;
}
