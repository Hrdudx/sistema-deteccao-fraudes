// Envelope usado pelos serviços do frontend: além dos dados, informa se eles
// vieram do backend ou do conjunto de demonstração (fallback quando a API não
// responde). A tela usa essa flag para avisar o usuário de forma transparente.
export interface ResultadoConsulta<T> {
  dados: T;
  demonstracao: boolean;
}
