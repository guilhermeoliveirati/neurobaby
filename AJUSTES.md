# Histórico de ajustes — NeuroBaby

Toda alteração no app sobe a versão em `package.json` (ela aparece no rodapé: "Criado por Guilherme Oliveira | Versão: x.x.x")
e ganha uma entrada aqui, da mais nova para a mais antiga.

Regra da versão (`maior.menor.correção`):
- **correção** (1.1.0 → 1.1.1): conserto de erro ou ajuste pequeno de texto/visual.
- **menor** (1.1.0 → 1.2.0): funcionalidade nova ou mudança visível de tela.
- **maior** (1.x → 2.0.0): mudança grande, por exemplo no formato dos dados salvos.

---

## 1.1.0 — 03/11/2026
- Rodapé em todas as telas: "Criado por Guilherme Oliveira | Versão: x.x.x".
- Removidas as linhas de versão avulsas das telas "Sobre" e "Backup" (agora a versão fica só no rodapé).
- Criado este arquivo `AJUSTES.md` para registrar todos os ajustes.

## 1.0.0 — 03/11/2026
- Primeira versão do webapp (PWA instalável, funciona offline).
- Telas: Abertura/cadastro, Início, Minha Gestação, Caderneta do Diabetes (glicemia, medicações, exames,
  orientações nutricionais, evolução), Desenvolvimento Infantil, Mais para você (perfil, consultas, vacinação,
  perguntas frequentes, fale conosco, sobre, backup).
- Dados salvos no aparelho + backup no Google Drive (pasta oculta de cada conta), exportar/importar JSON e CSV de glicemias.
- Publicado em https://guilhermeoliveirati.github.io/neurobaby/ (GitHub Pages).
- Google Cloud (conta projetosguilherme7@gmail.com, projeto `neurobaby`): login liberado para
  guilhermeoliveira.ti@gmail.com e isabelacoorporativo@gmail.com (modo Teste).
