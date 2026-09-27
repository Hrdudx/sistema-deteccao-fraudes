export const environment = {
  production: false,
  // Caminho relativo: em desenvolvimento o "ng serve" repassa /api para o backend
  // Spring Boot via proxy.conf.json (evita erro de CORS entre as portas 4200 e 8080).
  // Se o backend estiver em outra porta, ajuste o "target" em proxy.conf.json.
  apiUrl: '/api',
};
