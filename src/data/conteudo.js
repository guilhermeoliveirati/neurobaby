// Conteúdo informativo do NeuroBaby. Valores são médias de referência — não substituem o acompanhamento médico.

// Tamanho médio do bebê por semana: [comprimento cm, peso g]
export const TAMANHO_SEMANA = {
  8: [1.6, 1], 9: [2.3, 2], 10: [3.1, 4], 11: [4.1, 7], 12: [5.4, 14], 13: [7.4, 23], 14: [8.7, 43],
  15: [10.1, 70], 16: [11.6, 100], 17: [13, 140], 18: [14.2, 190], 19: [15.3, 240], 20: [25.6, 300],
  21: [26.7, 360], 22: [27.8, 430], 23: [28.9, 501], 24: [30, 600], 25: [34.6, 660], 26: [35.6, 760],
  27: [36.6, 875], 28: [37.6, 1005], 29: [38.6, 1153], 30: [39.9, 1319], 31: [41.1, 1502], 32: [42.4, 1702],
  33: [43.7, 1918], 34: [45, 2146], 35: [46.2, 2383], 36: [47.4, 2622], 37: [48.6, 2859], 38: [49.8, 3083],
  39: [50.7, 3288], 40: [51.2, 3462], 41: [51.5, 3597], 42: [51.7, 3685],
}

// Marcos do desenvolvimento (com foco no cérebro) por faixa de semanas
export const FATOS_SEMANA = [
  [4, 'O tubo neural, que dará origem ao cérebro e à medula, está se formando. O ácido fólico é essencial agora!'],
  [8, 'O coraçãozinho já bate e os primeiros neurônios começam a se multiplicar rapidamente.'],
  [12, 'Seu bebê já tem reflexos: abre e fecha a boca e mexe os dedinhos.'],
  [16, 'Os olhinhos já se movem e o sistema nervoso começa a controlar os músculos.'],
  [20, 'Seu bebê já consegue ouvir sons — converse e cante para ele!'],
  [24, 'O cérebro cresce muito rápido e o bebê já reage à sua voz e ao toque na barriga.'],
  [28, 'Os olhos abrem e fecham, e o cérebro forma as primeiras dobras (sulcos).'],
  [30, 'Seu bebê já consegue abrir e fechar as mãozinhas e reconhece a sua voz.'],
  [33, 'O cérebro ganha cerca de 1/3 do seu tamanho nas últimas semanas. Ômega-3 ajuda!'],
  [36, 'Os pulmões estão quase prontos e o bebê pratica a sucção e a respiração.'],
  [38, 'Seu bebê está pronto para nascer! O cérebro continua se desenvolvendo intensamente após o parto.'],
]

export const CUIDADOS_TRIMESTRE = {
  1: ['Tome o ácido fólico indicado pelo seu médico', 'Faça os exames do pré-natal', 'Evite álcool, cigarro e automedicação'],
  2: ['Mantenha o controle da glicemia', 'Faça a ultrassonografia morfológica', 'Pratique atividade física leve, se liberada'],
  3: ['Mantenha o controle da glicemia', 'Faça as consultas regularmente', 'Hidrate-se bem', 'Observe os movimentos do bebê'],
}

export const DICAS = [
  'Beber água ajuda no controle da glicemia e no bem-estar da sua e do seu bebê.',
  'Conversar com o bebê na barriga estimula a audição e o vínculo afetivo.',
  'Prefira alimentos integrais: as fibras ajudam a evitar picos de glicose.',
  'Caminhadas leves após as refeições ajudam a baixar a glicemia.',
  'Peixes como sardinha e salmão têm ômega-3, importante para o cérebro do bebê.',
  'Durma bem: o descanso ajuda a regular os hormônios e a glicose.',
  'Fracione as refeições: comer de 3 em 3 horas evita picos e quedas de glicose.',
  'Música calma e o seu toque na barriga ajudam a acalmar o bebê.',
  'Anote suas glicemias sempre no mesmo horário para comparar melhor.',
  'Evite sucos, mesmo naturais: prefira a fruta inteira, com bagaço.',
  'Pele a pele após o nascimento ajuda no vínculo e na amamentação.',
  'Ler em voz alta para o bebê, desde a barriga, estimula a linguagem.',
  'Proteínas no café da manhã ajudam a controlar a glicemia ao longo do dia.',
  'Leve sua caderneta e suas anotações em todas as consultas.',
]

// Momentos de medição e metas para diabetes gestacional (referência SBD/ADA)
export const MOMENTOS = [
  { id: 'jejum', nome: 'Jejum', meta: 95 },
  { id: 'pre_almoco', nome: 'Antes do almoço', meta: 95 },
  { id: 'pre_jantar', nome: 'Antes do jantar', meta: 95 },
  { id: '1h_cafe', nome: '1h após café', meta: 140 },
  { id: '1h_almoco', nome: '1h após almoço', meta: 140 },
  { id: '1h_jantar', nome: '1h após jantar', meta: 140 },
  { id: '2h_cafe', nome: '2h após café', meta: 120 },
  { id: '2h_almoco', nome: '2h após almoço', meta: 120 },
  { id: '2h_jantar', nome: '2h após jantar', meta: 120 },
  { id: 'dormir', nome: 'Antes de dormir', meta: 120 },
  { id: 'outro', nome: 'Outro horário', meta: 140 },
]

export const ORIENTACOES = [
  { t: 'Fracione as refeições', d: 'Faça 5 a 6 refeições menores por dia, a cada 3 horas, sem ficar longos períodos em jejum.' },
  { t: 'Escolha carboidratos integrais', d: 'Arroz integral, aveia, pão integral e leguminosas (feijão, lentilha, grão-de-bico) liberam glicose mais devagar.' },
  { t: 'Monte o prato', d: 'Metade do prato com legumes e verduras, 1/4 com proteína e 1/4 com carboidrato.' },
  { t: 'Evite açúcares e ultraprocessados', d: 'Refrigerantes, sucos, doces, biscoitos recheados e farinha branca causam picos de glicemia.' },
  { t: 'Proteína em todas as refeições', d: 'Ovos, queijos brancos, iogurte natural, carnes magras e peixes ajudam a estabilizar a glicose.' },
  { t: 'Ceia é importante', d: 'Um lanche leve antes de dormir ajuda a evitar hipoglicemia durante a noite e glicemia alta no jejum.' },
  { t: 'Movimente-se', d: 'Com liberação médica, caminhe 10 a 15 minutos após as principais refeições.' },
]

// Marcos do desenvolvimento infantil por faixa de idade (meses). Baseado nas orientações da SBP e do CDC.
export const FAIXAS = [
  { id: 'm0', de: 0, ate: 2, nome: '0 a 2 meses' },
  { id: 'm2', de: 2, ate: 4, nome: '2 a 4 meses' },
  { id: 'm4', de: 4, ate: 6, nome: '4 a 6 meses' },
  { id: 'm6', de: 6, ate: 9, nome: '6 a 9 meses' },
  { id: 'm9', de: 9, ate: 12, nome: '9 a 12 meses' },
  { id: 'm12', de: 12, ate: 18, nome: '12 a 18 meses' },
  { id: 'm18', de: 18, ate: 24, nome: '18 a 24 meses' },
  { id: 'm24', de: 24, ate: 36, nome: '2 a 3 anos' },
]

export const MARCOS = {
  m0: [['Fixa o olhar no rosto', '👀'], ['Acalma-se com a voz', '🎵'], ['Movimenta braços e pernas', '🤸'], ['Levanta a cabeça de bruços', '👶'], ['Reage a sons altos', '👂'], ['Sorri ao dormir', '😊']],
  m2: [['Sustenta a cabeça', '👶'], ['Sorri com frequência', '😊'], ['Segue objetos com o olhar', '👀'], ['Emite sons (aaa, ooo)', '🗣️'], ['Leva as mãos à boca', '✋'], ['Reconhece a mãe', '💜']],
  m4: [['Inicia o rolar', '🔄'], ['Reconhece rostos', '👨‍👩‍👧'], ['Emite sons e gargalhadas', '😄'], ['Explora objetos', '🧸'], ['Pega objetos com as mãos', '✋'], ['Vira a cabeça para sons', '👂']],
  m6: [['Senta sem apoio', '🪑'], ['Balbucia (mamã, papá)', '🗣️'], ['Passa objetos de uma mão a outra', '🤲'], ['Estranha desconhecidos', '🙈'], ['Atende pelo nome', '📣'], ['Começa a engatinhar', '🐾']],
  m9: [['Fica em pé com apoio', '🧍'], ['Faz pinça com os dedos', '🤏'], ['Dá tchau e bate palmas', '👋'], ['Procura objeto escondido', '🔍'], ['Fala primeiras palavras', '💬'], ['Imita gestos', '🪞']],
  m12: [['Anda sozinho', '🚶'], ['Fala algumas palavras', '💬'], ['Aponta o que quer', '👉'], ['Empilha 2 blocos', '🧱'], ['Bebe no copo', '🥛'], ['Brinca de faz de conta', '🧸']],
  m18: [['Corre', '🏃'], ['Junta 2 palavras', '💬'], ['Chuta bola', '⚽'], ['Rabisca com lápis', '✏️'], ['Segue ordens simples', '👂'], ['Come de colher sozinho', '🥄']],
  m24: [['Fala frases curtas', '🗨️'], ['Sobe escadas alternando pés', '🪜'], ['Brinca com outras crianças', '👫'], ['Reconhece cores', '🎨'], ['Controla o xixi de dia', '🚽'], ['Conta pequenas histórias', '📖']],
}

export const ATIVIDADES = {
  m0: ['Converse olhando nos olhos do bebê', 'Faça contato pele a pele', 'Coloque de bruços por alguns minutos, acordado e supervisionado', 'Cante músicas suaves'],
  m2: ['Mostre objetos coloridos e contrastantes', 'Imite os sons que ele faz', 'Faça massagem após o banho', 'Brinque de bruços com um brinquedo à frente'],
  m4: ['Ofereça chocalhos e objetos para pegar', 'Brinque de esconde-esconde com um paninho', 'Leia livros de pano com figuras', 'Estimule o rolar com brinquedos ao lado'],
  m6: ['Sente o bebê com apoio e brinque à frente', 'Nomeie objetos e pessoas', 'Ofereça potes para bater e explorar', 'Deixe explorar texturas diferentes'],
  m9: ['Esconda brinquedos para ele achar', 'Ensine a dar tchau e bater palmas', 'Ofereça alimentos em pedaços para pegar', 'Brinque de empilhar e derrubar'],
  m12: ['Caminhe de mãos dadas', 'Leia e aponte figuras nos livros', 'Brinque de casinha e faz de conta', 'Ofereça giz de cera grosso'],
  m18: ['Brinque de bola', 'Cante músicas com gestos', 'Peça pequenas ajudas (guardar brinquedos)', 'Monte quebra-cabeças simples'],
  m24: ['Conte histórias e faça perguntas', 'Desenhe e pinte juntos', 'Brinque ao ar livre com outras crianças', 'Ensine cores e formas no dia a dia'],
}

// Calendário vacinal (referência PNI). Confirme sempre com a UBS — o calendário pode mudar.
export const VACINAS_GESTANTE = [
  { id: 'g_dtpa', nome: 'dTpa (difteria, tétano e coqueluche)', quando: 'A partir de 20 semanas' },
  { id: 'g_hepb', nome: 'Hepatite B', quando: 'Conforme situação vacinal' },
  { id: 'g_influenza', nome: 'Influenza (gripe)', quando: 'Em qualquer fase, na campanha' },
  { id: 'g_covid', nome: 'COVID-19', quando: 'Em qualquer fase' },
  { id: 'g_vsr', nome: 'VSR (vírus sincicial respiratório)', quando: 'Entre 28 e 36 semanas' },
]

export const VACINAS_BEBE = [
  { idade: 'Ao nascer', meses: 0, itens: [['b_bcg', 'BCG'], ['b_hepb', 'Hepatite B']] },
  { idade: '2 meses', meses: 2, itens: [['b_penta1', 'Pentavalente (1ª)'], ['b_vip1', 'VIP — Poliomielite (1ª)'], ['b_pneumo1', 'Pneumocócica (1ª)'], ['b_rota1', 'Rotavírus (1ª)']] },
  { idade: '3 meses', meses: 3, itens: [['b_menc1', 'Meningocócica C (1ª)']] },
  { idade: '4 meses', meses: 4, itens: [['b_penta2', 'Pentavalente (2ª)'], ['b_vip2', 'VIP — Poliomielite (2ª)'], ['b_pneumo2', 'Pneumocócica (2ª)'], ['b_rota2', 'Rotavírus (2ª)']] },
  { idade: '5 meses', meses: 5, itens: [['b_menc2', 'Meningocócica C (2ª)']] },
  { idade: '6 meses', meses: 6, itens: [['b_penta3', 'Pentavalente (3ª)'], ['b_vip3', 'VIP — Poliomielite (3ª)'], ['b_covid', 'COVID-19'], ['b_flu', 'Influenza']] },
  { idade: '9 meses', meses: 9, itens: [['b_fa1', 'Febre amarela']] },
  { idade: '12 meses', meses: 12, itens: [['b_scr1', 'Tríplice viral (1ª)'], ['b_pneumo_r', 'Pneumocócica (reforço)'], ['b_men_r', 'Meningocócica (reforço)']] },
  { idade: '15 meses', meses: 15, itens: [['b_dtp_r1', 'DTP (1º reforço)'], ['b_vip_r', 'Poliomielite (reforço)'], ['b_hepa', 'Hepatite A'], ['b_tetra', 'Tetra viral']] },
  { idade: '4 anos', meses: 48, itens: [['b_dtp_r2', 'DTP (2º reforço)'], ['b_varic2', 'Varicela (2ª)'], ['b_fa_r', 'Febre amarela (reforço)']] },
]

export const FAQ = [
  ['O que é diabetes gestacional?', 'É o aumento da glicose no sangue que aparece pela primeira vez na gravidez. Com acompanhamento, alimentação adequada e, quando necessário, medicação, a gestação costuma seguir com segurança.'],
  ['Quais são as metas de glicemia?', 'Referências usuais: jejum abaixo de 95 mg/dL, 1 hora após as refeições abaixo de 140 mg/dL e 2 horas após abaixo de 120 mg/dL. Sua equipe pode definir metas diferentes para você.'],
  ['Como calculo a idade gestacional?', 'O app usa a data da última menstruação (DUM) ou a data provável do parto (DPP) informada no seu perfil. Se o ultrassom indicar outra data, atualize no perfil.'],
  ['O diabetes gestacional afeta o cérebro do bebê?', 'Glicemias controladas reduzem riscos para o bebê. Por isso o registro e o acompanhamento frequente são tão importantes.'],
  ['Meus dados ficam salvos onde?', 'No próprio aparelho. Se você conectar o Google Drive, uma cópia de segurança fica numa pasta oculta do seu Drive, acessível só pelo NeuroBaby.'],
  ['Como instalo o app no celular?', 'No Chrome (Android), toque no menu ⋮ e em "Instalar app". No iPhone (Safari), toque em Compartilhar e "Adicionar à Tela de Início".'],
]
