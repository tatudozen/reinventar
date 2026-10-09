# CLAUDE.md — Reinventar

App separado da Jornada Ikigai, adaptado para público 55+.
O código-fonte React está na raiz deste repositório.

## Comandos

```bash
npm install      # instalar dependências (primeira vez)
npm run dev      # dev server em http://localhost:3000
npm run build    # build de produção
npm run lint     # TypeScript type check
npm run preview  # preview do build
```

## Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Obrigatória | Finalidade |
|----------|-------------|-----------|
| `VITE_GEMINI_API_KEY` | SIM | Análise de resultados por IA |
| `VITE_SUPABASE_URL` | SIM | Supabase self-hosted |
| `VITE_SUPABASE_ANON_KEY` | SIM | Supabase anon key |

## Supabase

Schema: `reinventar` (não o `public`).
Migrations em `supabase/migrations/` — aplicar no self-hosted com:

```bash
supabase db push
```

O cliente já está configurado com `db: { schema: 'reinventar' }` em `src/supabase.ts`.

Leitura de jornadas usa RPCs (não acesso direto à tabela):
```ts
supabase.rpc('get_jornada', { p_id: id })
supabase.rpc('count_referrals', { p_jornada_id: id })
```

## PostgREST self-hosted

Adicionar ao `.env` do Supabase:
```
PGRST_DB_SCHEMAS=public,reinventar
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 4 |
| Roteamento | React Router 7 |
| Animação | Framer Motion |
| IA | Google Gemini |
| Banco | Supabase self-hosted (schema reinventar) |
| Deploy | Vercel |

## Path Alias

`@/*` mapeia para a raiz do projeto.

## PRD

Ver `docs/prd/reinventar-prd.md` no repositório `game-ikigai`.
