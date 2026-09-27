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
│   │   │   ├── sidebar/            # Navegação lateral com ícones (gaveta no celular)
│   │   │   ├── grafico-rosca/      # Gráfico de rosca em SVG (tipo, status, prioridade)
│   │   │   ├── medidor-sla/        # Medidor semicircular do SLA geral
│   │   │   ├── icone/              # Ícones SVG próprios (sem biblioteca externa)
│   │   │   ├── cabecalho-pagina/   # Título/subtítulo/ações padrão das telas
│   │   │   ├── badge-risco/        # Selo colorido de risco/prioridade
│   │   │   └── estado-lista/       # Carregando / erro com "tentar novamente" / vazio
│   │   ├── pages/
│   │   │   ├── home/               # Indicadores, ocorrências por tipo, resumo do mês/dia
│   │   │   ├── ocorrencias/        # Fila central (MVP) — todas as categorias ou uma só
│   │   │   ├── clientes/           # Consulta de clientes
│   │   │   ├── cliente-detalhe/    # Histórico do cliente (ocorrências, transações, contas)
│   │   │   ├── login/              # Acesso (POST /api/auth/login)
│   │   │   ├── relatorios/         # Relatórios gerenciais (CSV e impressão)
│   │   │   ├── usuarios/           # Usuários e acessos (TEL13)
│   │   │   └── nao-encontrada/     # 404
│   │   ├── services/               # Home, Ocorrências, Clientes e Auth (API + fallback)
│   │   │   └── dados-demonstracao.ts  # Base fictícia no formato do dicionário de dados
│   │   ├── models/                 # Contratos da API e modelos das telas
│   │   ├── utils/formatacao.ts     # Padroniza risco/status vindos do backend
│   │   └── app.routes.ts           # Rotas (lazy loading + título da aba)
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

### Apresentação (sem backend)

```bash
npm run demo
```

Abre o navegador sozinho, usa só os dados de demonstração e não mostra erros de
conexão no terminal. Entre com um dos usuários abaixo (senha `123`). Só o perfil
Administrador acessa a tela **Usuários**:

| Usuário | Perfil |
|---------|--------|
| `adm` | Administrador |
| `airon.economia@gmail.com` | Gestor |
| `diigopereira.15@gmail.com` | Administrador |
| `erosa8614@gmail.com` | Analista de Riscos |
| `GabriellaCotrim@gmail.com` | Analista de Compliance |
| `hayyraroc@gmail.com` | Analista de Riscos |

Com o backend rodando (`npm start`), o login usa o `POST /api/auth/login` de verdade.

Com o backend rodando (`./mvnw spring-boot:run` na raiz), o `ng serve` repassa as
chamadas `/api` para `http://localhost:8080` usando o `proxy.conf.json` — assim não
há erro de CORS. Se o backend estiver em outra porta (ex.: 8081), altere o `target`
nesse arquivo.

Testes unitários: `ng test`.

## Integração com o backend

| Tela | Endpoints consumidos |
|------|----------------------|
| Home | `GET /api/home/indicadores`; se não existir, calcula a partir das ocorrências |
| Ocorrências | `GET /api/alertas-pld`, `/api/chargebacks`, `/api/kycs`, `/api/alertas-fraude` |
| Clientes | `GET /api/clientes`, `GET /api/clientes/{id}/historico` |
| Login | `POST /api/auth/login` |
| Usuários | `POST /api/usuarios` (já existe); `GET`, `PUT /{id}` e `PATCH /{id}/status` previstos no DRE — enquanto não existirem, a tela avisa e aplica só na tela |
| Relatórios | mesmas listas de ocorrências e `GET /api/transacoes` |

Quando a API não responde, cada tela mostra **dados de demonstração** com um aviso
visível, para a apresentação não depender do backend no ar. A base de demonstração
(245 clientes e 156 ocorrências) segue o dicionário de dados — códigos `CLI0001`,
`PLDALT…`, `FRDALT…`, `CBK…`, `KYC…`, severidade `MEDIA/ALTA/CRITICA`, status
`ABERTO/EM_ANALISE/FECHADO`, origem `APP/WEB` — e as regras RN01–RN08.

## Home (modelo aprovado pela equipe)

- **Cards:** clientes cadastrados, ocorrências abertas, tratativas em andamento,
  tratativas concluídas e riscos identificados (alto/crítico) no período. Cada card
  abre a tela correspondente já filtrada.
- **Gráficos:** ocorrências por tipo, status (Pendente / Em tratativa / Concluída —
  RN10), SLA geral, SLA por tipo e ocorrências por prioridade.
- **Resumo do mês** em primeiro e **Resumo do dia** abaixo (DMS 9.2 / RF12–RF13), com
  filtro de período (RF15).
- **SLA:** o dicionário de dados ainda não tem prazo de SLA por ocorrência. A Home já
  calcula o SLA quando o backend enviar o campo `prazoSla`; até lá mostra
  "SLA ainda indisponível" com dados reais (a demonstração simula prazos).
- **Tela Ocorrências** com três visões: *Ocorrências* (fila de PLD, Chargeback, KYC e
  Fraude), *Movimentações* (todas as transações — `GET /api/transacoes`) e
  *Transacional* (transações com sinal de risco: score ≥ 60, fora do perfil, em análise
  ou negadas). Transações são contexto financeiro da análise, não categoria de ocorrência.
- **Categorias:** somente PLD, Chargeback, KYC e Fraude. O modelo visual trazia
  "Movimentações" e "Transacional", mas o DRE (RN07/RN08) e o DMS (9.4) proíbem essas
  categorias — por isso ficaram de fora.

A URL base da API é configurada em `src/environments/environment.ts` (`apiUrl`).

## Status

### Sprint 3
- [x] Home com indicadores básicos (ocorrências abertas, tratativas, SLA)
- [x] Blocos "Resumo do mês" (principal) e "Resumo do dia"
- [x] Navegação lateral com o menu oficial do projeto
- [x] Camada de serviço isolada, pronta para integrar com a API real

### Sprint 4 — finalização das telas e ajustes de usabilidade
- [x] Home integrada ao backend (indicadores calculados das ocorrências reais)
- [x] Fila central de Ocorrências (MVP): abas por categoria, busca por cliente/CPF/CNPJ/ID, filtros de risco, situação (Pendente / Em tratativa / Concluída) e período, paginação e painel de detalhe
- [x] Telas de Clientes: consulta com filtros e histórico do cliente (ocorrências, transações, contas e risco consolidado)
- [x] Login obrigatório (UC01): sem sessão, qualquer tela leva ao login e depois volta para onde o usuário ia; mensagens de credencial inválida e usuário inativo; login de demonstração com a equipe quando o backend está fora do ar
- [x] Controle de acesso por perfil (RF04): Usuários só para Administrador (menu e rota), com página "Acesso restrito"
- [x] Páginas "em construção" (Relatórios, Usuários) e 404 — nenhum link do menu leva mais a tela em branco
- [x] Home refeita no modelo aprovado: cards com ícones, gráficos de rosca, medidor de SLA, SLA por tipo, prioridade e resumo do dia
- [x] Menu lateral claro com ícones e barra superior com menu do usuário (perfil / sair), como no modelo
- [x] Padrão visual único: fonte Inter, cores validadas para daltonismo, cartões, tabelas com cabeçalho, selos de risco
- [x] Formatos brasileiros (R$ 48.900,00 e dd/MM/aaaa) e textos com acento ("Média", "Em análise")
- [x] Estados de carregando, erro com "Tentar novamente" e lista vazia em todas as telas
- [x] Layout responsivo (menu vira gaveta no celular) e acessibilidade (teclado, foco visível, `aria-*`, "pular para o conteúdo")
- [x] Proxy de desenvolvimento para o backend (sem CORS) e título da aba por tela
- [x] Testes unitários (formatação e cálculo dos indicadores); teste padrão do Angular corrigido
- [ ] Tela de Fraude com filtros avançados (Gabriella) — a rota `/ocorrencias/fraude` usa a fila filtrada até ser integrada
- [x] Relatórios: resumo por tipo, resultado das análises, ocorrências por responsável, clientes com mais ocorrências e movimentações, com filtro de período, exportação CSV e impressão
- [x] Usuários (TEL13): pesquisa, filtros, novo usuário (integrado ao `POST /api/usuarios`), edição, perfil e ativar/inativar sem apagar histórico

## Equipe

Desenvolvido por Hayyra Eduarda Rocha Honorio (Home, navegação e componentes visuais) como parte do Sistema de Gerenciamento de Riscos, em conjunto com Airon Francelino, Eduarda Gabriela Rosa Protazio, Gabriella Cotrim Viana da Silva e Diogo Pereira da Silva.
