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
│   │   │   ├── em-construcao/      # Relatórios e Usuários (ainda sem tela)
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
- [x] Tela de Login integrada à US01 e nome/perfil do usuário no menu
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
- [ ] Relatórios e Usuários

## Equipe

Desenvolvido por Hayyra Eduarda Rocha Honorio (Home, navegação e componentes visuais) como parte do Sistema de Gerenciamento de Riscos, em conjunto com Airon Francelino, Eduarda Gabriela Rosa Protazio, Gabriella Cotrim Viana da Silva e Diogo Pereira da Silva.
