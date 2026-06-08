# LAInt

Plataforma simples e dinâmica para acompanhar campanhas ativas na **META** (Facebook/Instagram Ads) em tempo real, com sugestões de otimização de criativos baseadas nos sinais que o algoritmo de entrega da META utiliza (frequência, CTR, custo por resultado, fadiga de criativo, saturação de público).

## Funcionalidades

- Dashboard com performance das campanhas ativas (gasto, impressões, CTR, CPC, CPM, conversões, frequência)
- Conexão com a META via Graph API (Business Manager / conta de anúncios)
- Extração de relatórios de performance dos criativos
- Sugestões automáticas de melhoria de criativos e ajustes de campanha

## Stack

TanStack Start + React 19 + Tailwind CSS v4 + Supabase + Bun, em consistência com o projeto irmão LAClaude.

## Configuração

Copie `.env.example` para `.env` e preencha:

- `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`, `META_APP_ID`, `META_APP_SECRET`: credenciais da Graph API do Business Manager da META
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`: projeto Supabase para persistência

## Desenvolvimento

```bash
bun install
bun run dev
```
