import "server-only";

// CONTRATO (Fase 0). Implementação: agente sign-in (plans/sign-in.md).
// As assinaturas abaixo não podem mudar: home e feedback dependem delas.

export type Session = { accountId: string };

/** Cria o cookie de sessão para a conta. */
export async function createSession(_accountId: string): Promise<void> {
  throw new Error("createSession: não implementado (sign-in).");
}

/** Remove o cookie de sessão. */
export async function deleteSession(): Promise<void> {
  throw new Error("deleteSession: não implementado (sign-in).");
}

/** Sessão atual, ou `null` se ausente, inválida ou expirada. */
export async function getSession(): Promise<Session | null> {
  return null;
}
