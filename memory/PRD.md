# PRD — Portal de Concurso PMSC 2026 (Instituto AOCP)

## Problem statement
Clonar e rodar o repositório new-paineil-pm-e-cbm-pernanbuccc-003 e depois rebrandizar todo o
site (público + painel admin) do antigo concurso PMPE/CBMPE (Pernambuco) para o novo concurso:
**PMSC 2026 — Polícia Militar de Santa Catarina, Edital nº 002/CCP/2026 — CFP**.

## Arquitetura
- Backend FastAPI (`server.py` + `admin_routes.py` + `email_service.py`) + MongoDB (MONGO_URL/.env).
- Frontend: páginas públicas estáticas em `frontend/public/*.html` + JS (`seduc/concurso.js`).
- Painel admin: bundle React pré-compilado em `frontend/public/donaspainel/`.
- Rotas backend com prefixo `/api`.

## Dados do concurso (atuais)
- Concurso: PMSC 2026 — Polícia Militar de Santa Catarina — Edital nº 002/CCP/2026 — CFP.
- Cargo único: Soldado do Quadro de Praças Policial Militar (QPPM).
- Taxa: R$ 200,00. Encerramento das inscrições: 16/11/2026 às 23h59. Prova: 13/12/2026.
- 12 cidades de prova (SC): Balneário Camboriú, Blumenau, Canoinhas, Chapecó, Criciúma,
  Florianópolis, Joaçaba, Joinville, Lages, Rio do Sul, São Miguel do Oeste, Tubarão.
- Código interno de edital mantido como 'PMPE_26' (identificador interno, não exibido).

## Implementado (até 16/11/2026)
- Repo clonado/rodando; .env preservados.
- Home (`inicio.html`) só com card PMSC; página do concurso renomeada `pmpe.html` -> `pmsc.html`.
- Fluxo de inscrição (termos -> dados -> inscricao -> confirmacao -> pagamento-pix ->
  inscricao-realizada -> minhas-inscricoes) todo com conteúdo/título/logo/UF(SC) PMSC.
- `pagamento-pix.html`: botão "Imprimir comprovante" à direita do "Voltar" -> abre nova aba com
  comprovante de 1 página (logo, concurso, data, protocolo, nome, CPF, cargo, valor, QR Pix,
  botões Imprimir/Fechar) e registra "PIX baixado" no admin via /api/track/pix-downloaded.
- Backend: `/api/inscricao/resumo/{cpf}` agora retorna `data_inscricao`.
- E-mails (cadastro, inscrição realizada, lembrete) rebrandizados p/ PMSC; prazo 16/11/2026.
  From-name "Inscrição Polícia Militar SC"; Telegram "NOVA INSCRIÇÃO - PMSC". Taxa R$ 200,00.
- Painel admin (login/dashboard/configurações/inscrições) rebrandizado para PMSC.

## Observações / pendências
- **E-mail NÃO configurado**: sem RESEND_API_KEY/RESEND_FROM nem EMERGENT_EMAIL_KEY em
  backend/.env -> e-mails são montados mas NÃO enviados. Telegram só dispara se bot configurado.
- Admin usa credenciais padrão (donas / Seinao10@@) por falta de ADMIN_USERNAME/PASSWORD no .env.
- Chave Pix vem das settings do painel admin.

## Backlog sugerido
- P1: Configurar envio real de e-mail (Resend) e login admin próprio.
- P2: Exibir data da prova (13/12/2026) na página do concurso.
