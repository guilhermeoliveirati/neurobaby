# NeuroBaby

Webapp (PWA instalável) para acompanhar a gestação, o diabetes gestacional e o desenvolvimento do bebê.
"O desenvolvimento começa antes de nascer."

## Telas
- **Abertura / cadastro** — nome, DUM ou DPP (ou data de nascimento do bebê).
- **Início** — semanas de gestação, atalhos, dica do dia, tamanho do bebê, última glicemia e próxima consulta.
- **Minha Gestação** — semana a semana (peso/comprimento estimados, fato sobre o cérebro, cuidados do trimestre) e registros de peso/pressão.
- **Caderneta do Diabetes** — controle glicêmico (metas por momento, gráfico, filtros Dia/Semana/Mês/Todos, CSV), medicações, exames, orientações nutricionais e evolução semanal.
- **Desenvolvimento Infantil** — marcos por faixa de idade (marcáveis), atividades e resumo.
- **Mais para você** — perfil, consultas, vacinação (gestante e bebê), FAQ, contato, sobre e backup.

## Como rodar
O Google Drive (J:) não suporta `node_modules`, então as dependências ficam em `%LOCALAPPDATA%\NeuroBaby-deps`
e o script roda o Vite apontando para o código desta pasta. **Não rode `npm install` aqui.**

```powershell
.\ferramentas\neurobaby.ps1 dev      # servidor local em http://localhost:5180 (também na rede, para abrir no celular)
.\ferramentas\neurobaby.ps1 build    # gera a pasta dist/ para publicar
.\ferramentas\neurobaby.ps1 preview  # testa o build
```

A pasta `dist/` pode ser publicada em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, Firebase Hosting).
Para instalar como app no celular e usar o Google Drive, ela precisa estar em **HTTPS**.

## Dados e backup
- Tudo fica salvo no aparelho (localStorage).
- **Google Drive**: backup em `neurobaby-backup.json` na pasta oculta `appDataFolder` (escopo `drive.appdata`), como no app Glicose.
  Cada alteração é enviada automaticamente enquanto a sessão do Google estiver ativa (~1h); depois aparece "Sincronizar".
- Exportar/Importar arquivo JSON (importar mescla) e exportar glicemias em CSV.

### Configurar o Google Drive
1. No Google Cloud, ative a **Google Drive API** e configure a tela de consentimento OAuth.
2. Crie uma credencial OAuth do tipo **Aplicativo da Web** e adicione em "Origens JavaScript autorizadas"
   `http://localhost:5180` e o endereço HTTPS onde o app for publicado.
3. Coloque o Client ID em `.env.local` (`VITE_GOOGLE_CLIENT_ID=...`, veja `.env.example`)
   ou no app em **Perfil → Backup e Google Drive → Configuração avançada do Google**.

## Versão
A versão fica em `package.json` e aparece em "Sobre" e "Backup". Incremente a cada alteração.

> As informações do app são educativas e não substituem a orientação da equipe de saúde.
