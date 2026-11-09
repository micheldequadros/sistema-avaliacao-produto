import "server-only";

// CONTRATO (Fase 0). Implementação: agente sign-in (plans/sign-in.md).
// A assinatura abaixo não pode mudar: feedback depende dela.

export type CurrentAccount = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

/** Conta logada (ativa), ou `null`. Deduplicada por request. */
export async function getCurrentAccount(): Promise<CurrentAccount | null> {
  return null;
}
