# SGR — Frontend (Sistema de Gerenciamento de Riscos)

Frontend em **Angular** do Sistema de Gerenciamento de Riscos (SGR), desenvolvido para a disciplina de Práticas Interdisciplinares — UEG.

## Stack

- **Framework:** Angular (standalone components)
- **Backend/API:** Java + Spring Boot (pasta raiz deste repositório)
- **Dados:** Databricks (camadas Silver/Gold)

O frontend **não acessa o Databricks diretamente** — toda leitura/gravação passa pelo backend, conforme definido no Documento de Modelagem do Sistema (DMS) da equipe.

## Estrutura

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── sidebar/        # Navegação lateral (menu principal)
│   │   ├── pages/
│   │   │   └── home/           # Tela Home (indicadores, resumo do mês/dia)
│   │   ├── services/
│   │   │   └── home.service.ts # Consome a API do backend (com fallback mockado)
│   │   ├── models/
│   │   │   └── indicadores-home.model.ts
│   │   └── app.routes.ts       # Rotas da aplicação
│   └── environments/
│       └── environment.ts      # URL base da API
```

## Menu e navegação

Conforme a seção 9.1 do DMS, o menu lateral segue esta estrutura:

- **Home**
- **Clientes**
- **Ocorrências**
  - PLD
  - Chargeback
  - KYC
  - Fraude
- **Relatórios**
- **Usuários**

> Movimentações e Transacional **não** são categorias de Ocorrência (são contexto financeiro de análise) — não devem ser adicionadas ao submenu de Ocorrências.

## Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org/) e [Angular CLI](https://angular.dev/tools/cli) instalados.

```bash
# a partir da pasta /frontend
npm install
ng serve
```

Acesse `http://localhost:4200`.

## Integração com o backend

O `HomeService` (`src/app/services/home.service.ts`) espera um endpoint `GET /api/home/indicadores` no backend, retornando os dados no formato descrito em `src/app/models/indicadores-home.model.ts`.

**Enquanto esse endpoint não existir no backend**, o serviço cai automaticamente em dados mockados — a tela funciona normalmente para desenvolvimento e demonstração, sem exigir o backend rodando.

A URL base da API é configurada em `src/environments/environment.ts` (`apiUrl`).

## Status (Sprint 3)

- [x] Home com indicadores básicos (ocorrências abertas, tratativas, SLA)
- [x] Blocos "Resumo do mês" (principal) e "Resumo do dia"
- [x] Navegação lateral com o menu oficial do projeto
- [x] Camada de serviço isolada, pronta para integrar com a API real
- [ ] Integração real com o backend (prevista para a Sprint 4)
- [ ] Telas de Clientes, Ocorrências, Relatórios e Usuários (outros integrantes)

## Equipe

Desenvolvido por Hayyra Eduarda Rocha Honorio (Home, navegação e componentes visuais) como parte do Sistema de Gerenciamento de Riscos, em conjunto com Airon Francelino, Eduarda Gabriela Rosa Protazio, Gabriella Cotrim Viana da Silva e Diogo Pereira da Silva.
