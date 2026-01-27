# SCI - Sistema de Contestacoes iFood

Sistema de gerenciamento estrategico de contestacoes para restaurantes integrados ao iFood.

## Sobre o Projeto

O **SCI (Sistema de Contestacoes iFood)** e uma aplicacao web desenvolvida para gerenciar, rastrear e analisar contestacoes de pedidos da plataforma iFood. O sistema foi projetado para a rede de restaurantes **Bode do No**, **Burguer do No** e **Italiano Pizzas**, permitindo controle completo sobre disputas financeiras com a plataforma de delivery.

### Principais Objetivos
- Centralizar o registro de todas as contestacoes
- Acompanhar o status e resultado de cada caso
- Visualizar metricas de recuperacao financeira
- Identificar padroes e responsaveis por cancelamentos
- Projetar perdas e ganhos anuais

---

## Stack Tecnologico

### Frontend
| Tecnologia | Versao | Descricao |
|------------|--------|-----------|
| Next.js | 16.1.4 | Framework React com App Router |
| React | 19.2.3 | Biblioteca de UI |
| TypeScript | 5.x | Tipagem estatica |
| Tailwind CSS | 4.x | Framework de estilos |
| Recharts | 3.7.0 | Biblioteca de graficos |
| Lucide React | 0.562.0 | Biblioteca de icones |
| React Hook Form | 7.71.1 | Gerenciamento de formularios |
| clsx / tailwind-merge | - | Utilitarios de classes CSS |

### Backend
| Tecnologia | Descricao |
|------------|-----------|
| Next.js API Routes | Endpoints REST |
| Google Sheets API | Banco de dados (planilha) |
| googleapis | SDK oficial do Google |

### Ambiente
| Ferramenta | Descricao |
|------------|-----------|
| Bun | Gerenciador de pacotes (bun.lock) |
| Node.js | Runtime JavaScript |

---

## Estrutura de Diretorios

```
sci-app/
├── app/                          # App Router (Next.js 13+)
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Dashboard (pagina inicial)
│   ├── globals.css               # Estilos globais + tema
│   ├── favicon.ico               # Icone da aplicacao
│   ├── api/                      # API Routes
│   │   ├── contestacoes/
│   │   │   └── route.ts          # CRUD de contestacoes
│   │   └── dashboard/
│   │       └── route.ts          # Dados do dashboard
│   ├── contestacoes/             # Modulo de contestacoes
│   │   ├── page.tsx              # Pagina principal
│   │   ├── RegisterForm.tsx      # Formulario de registro
│   │   └── SearchTable.tsx       # Tabela de busca
│   ├── auditoria/
│   │   └── page.tsx              # Pagina de auditoria
│   └── importacao/
│       └── page.tsx              # Pagina de importacao
├── components/                   # Componentes reutilizaveis
│   ├── AppShell.tsx              # Container principal
│   ├── Sidebar.tsx               # Menu lateral
│   ├── MobileHeader.tsx          # Header mobile
│   ├── DashboardCharts.tsx       # Graficos do dashboard
│   ├── EditModal.tsx             # Modal de edicao
│   ├── FileDropzone.tsx          # Upload de arquivos
│   ├── ThemeToggle.tsx           # Alternador de tema
│   └── ui/                       # Componentes base
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       └── Modal.tsx
├── lib/
│   └── googleSheets.ts           # Integracao Google Sheets
├── utils/
│   └── mappings.ts               # Mapeamentos de dados
├── public/                       # Assets estaticos
│   ├── logo.png
│   ├── banner.jpg
│   └── *.svg
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## Funcionalidades Detalhadas

### 1. Dashboard (Pagina Inicial)

**Rota:** `/`

O dashboard apresenta uma visao geral completa das contestacoes:

**KPIs Principais:**
- **Total Contestado** - Soma de todos os valores em disputa
- **Valor Recuperado** - Total recuperado com sucesso
- **Valor Perdido** - Diferenca entre contestado e recuperado
- **Ticket Medio** - Valor medio por contestacao

**Projecoes Estrategicas:**
- Perda Mensal acumulada
- Perda Anual projetada (x12)
- Taxa de Sucesso (% de recuperacao)

**Performance por Marca:**
- Tabela com quantidade, valor e taxa de recuperacao por marca
- Marcas: Burguer do No, Italiano Pizzas, Bode do No

**Graficos:**
- Top 5 Restaurantes (por quantidade de contestacoes)
- Top 5 Motivos (principais causas de contestacao)

---

### 2. Registro de Contestacoes

**Rota:** `/contestacoes` (aba "Registrar")

Formulario completo para cadastro de novas contestacoes:

**Campos do Formulario:**
| Campo | Tipo | Descricao |
|-------|------|-----------|
| Data de Abertura | Date | Data do registro |
| Numero do Pedido | Text | ID do pedido no iFood |
| Restaurante | Select | Lista de restaurantes da rede |
| Motivo Geral | Select | Categoria do problema |
| Valor (R$) | Number | Valor da contestacao |
| Descricao | Text | Detalhamento do ocorrido |
| Valor Recuperado | Number | Valor ja recuperado |
| Responsavel | Select | Quem causou o problema |
| Motivo Especifico | Select | Detalhamento do responsavel |

**Restaurantes Disponiveis:**
- Burguer do No: Rio Mar, Almoco, Guararapes, Boa Viagem
- Italiano Pizzas: Guararapes, Olinda, Afogados, Tacaruna
- Bode do No: Olinda, Tacaruna, Guararapes, Boa Viagem, Afogados

**Motivos Gerais:**
- Cancelamento indevido
- Pedido nao recebido pelo cliente
- Taxa cobrada incorretamente
- Problema com pagamento
- Erro no valor do pedido
- Pedido duplicado
- Produto nao disponivel
- Erro do entregador
- Sistema - falha tecnica
- Outros

**Responsaveis e Motivos Especificos:**
- **Restaurante:** Falta de insumos, equipamento quebrado, atraso, erro no preparo
- **Cliente:** Ausente, endereco incorreto, cancelou, nao atende
- **Logistica:** Motoboy atrasou, acidente, moto quebrou, nao encontrou
- **Plataforma:** Erro no app, sistema fora, falha integracao, bug

---

### 3. Busca e Listagem de Contestacoes

**Rota:** `/contestacoes` (aba "Buscar")

**Funcionalidades:**
- Busca por numero do pedido, restaurante ou motivo
- Tabela paginada (8 itens por pagina)
- Ordenacao por data (mais recentes primeiro)
- Status visual com badges coloridos

**Colunas da Tabela:**
| Coluna | Descricao |
|--------|-----------|
| Data | Data de abertura |
| Pedido | Numero do pedido |
| Restaurante | Nome do estabelecimento |
| Motivo | Razao da contestacao |
| Valor | Valor contestado |
| Valor Recuperado | Valor obtido de volta |
| Status | AGUARDANDO, EM ANALISE, FINALIZADO, CANCELADO |
| Acoes | Editar / Excluir |

---

### 4. Edicao de Contestacoes

**Componente:** `EditModal.tsx`

Modal para atualizar o status e resultado de contestacoes existentes.

**Campos Editaveis:**
| Campo | Tipo | Descricao |
|-------|------|-----------|
| Status | Select | Estado atual da contestacao |
| Data Resolucao | Date | Quando foi resolvido |
| Resultado | Textarea | Descricao do resultado |
| Valor Recuperado | Number | Valor final recuperado |
| Observacoes | Textarea | Notas adicionais |

**Status Disponiveis:**
- AGUARDANDO
- EM ANALISE
- FINALIZADO
- CANCELADO

---

### 5. Exclusao de Contestacoes

- Botao de exclusao com confirmacao
- Remove a linha da planilha Google Sheets
- Atualiza a tabela automaticamente apos exclusao

---

### 6. Importacao Automatica

**Rota:** `/importacao`

**Funcionalidades (Interface preparada):**
- Drag and drop de arquivos
- Aceita formatos: .xlsx, .xls, .csv
- Exibe preview do arquivo selecionado
- Botao de confirmacao de importacao

> **Nota:** A funcionalidade de processamento real esta simulada. O sistema exibe uma mensagem de sucesso apos upload.

---

### 7. Auditoria

**Rota:** `/auditoria`

**Funcionalidades (Interface preparada):**
- Upload de relatorio financeiro do iFood
- Comparacao com dados do sistema
- Exibe metricas de auditoria:
  - Cobertura (% de pedidos encontrados)
  - Divergencias (pedidos nao encontrados)
  - Impacto (valor sob analise)

> **Nota:** A funcionalidade de processamento real esta simulada. Retorna dados mock apos upload.

---

### 8. Tema Claro/Escuro

**Componente:** `ThemeToggle.tsx`

- Alternancia entre tema claro (elegante steakhouse) e escuro (shadcn-style)
- Persistencia no localStorage
- Respeita preferencia do sistema operacional
- Transicao suave entre temas

**Paleta Tema Claro:**
- Background: Cream/Off-White (#FDFBF7)
- Primario: Deep Coffee (#4A3728)
- Secundario: Muted Gold (#C5A572)
- Texto: Dark Coffee (#2C2420)

**Paleta Tema Escuro:**
- Background: Zinc 950 (#09090b)
- Primario: White (#fafafa)
- Secundario: Zinc 800 (#27272a)
- Texto: Zinc 50 (#fafafa)

---

## API Endpoints

### GET /api/contestacoes
Retorna todas as contestacoes.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "dataAbertura": "15/01/2026",
      "numeroPedido": "12345",
      "restaurante": "Burguer do No Guararapes",
      "motivo": "Cancelamento indevido",
      "descricao": "Cliente cancelou apos preparo",
      "valor": 45.90,
      "status": "AGUARDANDO",
      "dataResolucao": "",
      "resultado": "",
      "valorRecuperado": 0,
      "observacoes": "",
      "anexos": "",
      "responsavel": "Cliente",
      "motivoEspecifico": "Cliente mudou de ideia"
    }
  ]
}
```

### POST /api/contestacoes
Cria nova contestacao.

**Body:**
```json
{
  "dataAbertura": "2026-01-23",
  "numeroPedido": "12345",
  "restaurante": "Burguer do No Guararapes",
  "motivo": "Cancelamento indevido",
  "descricao": "Descricao detalhada",
  "valor": "45.90",
  "responsavel": "Cliente",
  "motivoEspecifico": "Cliente mudou de ideia",
  "status": "AGUARDANDO",
  "observacoes": "",
  "valorRecuperado": "0"
}
```

### PUT /api/contestacoes
Atualiza contestacao existente.

**Body:**
```json
{
  "id": "1",
  "status": "FINALIZADO",
  "dataResolucao": "2026-01-25",
  "resultado": "Valor recuperado integralmente",
  "valorRecuperado": "45.90",
  "observacoes": "iFood aceitou a contestacao"
}
```

### DELETE /api/contestacoes?id=1
Exclui contestacao pelo ID.

### GET /api/dashboard
Retorna dados agregados para o dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "valorTotal": 7500.00,
    "valorRecuperado": 4500.00,
    "valorPerdido": 3000.00,
    "recoveryRate": 60.0,
    "topRestaurantes": [],
    "topMotivos": []
  }
}
```

---

## Instalacao e Configuracao

### Pre-requisitos
- Node.js 18+ ou Bun
- Conta Google com acesso ao Google Sheets API
- Projeto no Google Cloud Console

### 1. Clone o repositorio
```bash
git clone <url-do-repositorio>
cd sci-app
```

### 2. Instale as dependencias
```bash
# Com Bun (recomendado)
bun install

# Ou com npm
npm install

# Ou com yarn
yarn install
```

### 3. Configure as variaveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Credenciais Google Sheets API
GOOGLE_CLIENT_EMAIL=sua-conta-de-servico@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=1FnOYddjOYdqx8kZgxvtWn2sLAejJYOWto1XMXa3n7ag
```

### 4. Configure a planilha Google Sheets

A planilha deve ter uma aba chamada **"Contestacoes iFood"** com as seguintes colunas (a partir da linha 3):

| Coluna | Campo |
|--------|-------|
| A | ID |
| B | Data Abertura |
| C | Numero Pedido |
| D | Restaurante |
| E | Motivo |
| F | Descricao |
| G | Valor (R$ XX,XX) |
| H | Status |
| I | Data Resolucao |
| J | Resultado |
| K | Valor Recuperado |
| L | Observacoes |
| M | Anexos |
| N | Responsavel |
| O | Motivo Especifico |

### 5. Execute o projeto

```bash
# Desenvolvimento
bun dev
# ou
npm run dev

# Build de producao
bun run build
# ou
npm run build

# Iniciar producao
bun start
# ou
npm start
```

Acesse: http://localhost:3000

---

## Deploy

### Vercel (Recomendado)

1. Conecte o repositorio ao Vercel
2. Configure as variaveis de ambiente no painel:
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SPREADSHEET_ID`
3. Deploy automatico a cada push

---

## Estrutura de Dados

### Modelo de Contestacao
```typescript
interface Contestacao {
  id: string;
  dataAbertura: string;      // DD/MM/YYYY
  numeroPedido: string;
  restaurante: string;
  motivo: string;
  descricao: string;
  valor: number;
  status: 'AGUARDANDO' | 'EM ANALISE' | 'FINALIZADO' | 'CANCELADO';
  dataResolucao: string;
  resultado: string;
  valorRecuperado: number;
  observacoes: string;
  anexos: string;
  responsavel: 'Restaurante' | 'Cliente' | 'Logistica' | 'Plataforma';
  motivoEspecifico: string;
}
```

---

## Licenca

Projeto privado - Todos os direitos reservados.

---

## Versao

**SCI BDN v2.1.0**
