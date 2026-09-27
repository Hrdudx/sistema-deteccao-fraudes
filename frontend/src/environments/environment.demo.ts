// Configuração de APRESENTAÇÃO (npm run demo): não tenta acessar o backend, então
// todas as telas usam direto os dados de demonstração e o terminal fica limpo.
// Para usar o backend de verdade, rode "npm start".
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:9/api',
};
