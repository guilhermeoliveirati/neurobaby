// Conteúdos das funções da versão 1.5.0. Textos educativos: não substituem a orientação da equipe de saúde.

// Tamanho do bebê comparado a frutas e legumes, por semana: [nome com artigo, emoji]
export const FRUTAS = {
  4: ['uma semente de papoula', '🌱'], 5: ['uma semente de gergelim', '🌱'], 6: ['um grão de lentilha', '🫘'],
  7: ['um mirtilo', '🫐'], 8: ['uma framboesa', '🍓'], 9: ['uma uva', '🍇'], 10: ['uma azeitona', '🫒'],
  11: ['um morango', '🍓'], 12: ['um limão', '🍋'], 13: ['um maracujá', '🟣'], 14: ['um pêssego', '🍑'],
  15: ['uma laranja', '🍊'], 16: ['um abacate', '🥑'], 17: ['uma cebola grande', '🧅'], 18: ['um pimentão', '🫑'],
  19: ['uma manga', '🥭'], 20: ['uma banana', '🍌'], 21: ['uma cenoura grande', '🥕'], 22: ['um mamão papaia', '🟠'],
  23: ['uma toranja', '🍊'], 24: ['uma espiga de milho', '🌽'], 25: ['uma couve-flor', '🥦'], 26: ['um pé de alface', '🥬'],
  27: ['um repolho', '🥬'], 28: ['uma berinjela', '🍆'], 29: ['uma abóbora pequena', '🎃'], 30: ['um pepino grande', '🥒'],
  31: ['um coco', '🥥'], 32: ['um abacaxi pequeno', '🍍'], 33: ['um abacaxi', '🍍'], 34: ['um melão pequeno', '🍈'],
  35: ['um melão', '🍈'], 36: ['um mamão formosa', '🟠'], 37: ['uma acelga', '🥬'], 38: ['uma abóbora', '🎃'],
  39: ['uma melancia pequena', '🍉'], 40: ['uma melancia', '🍉'], 41: ['uma melancia', '🍉'], 42: ['uma melancia grande', '🍉'],
}

// Pressão arterial na gestação (referência: Ministério da Saúde / FEBRASGO)
export const REF_PRESSAO = [
  ['Normal', 'Menor que 140 x 90', 'ok'],
  ['Alta', 'De 140 x 90 até 159 x 109: avise sua equipe de saúde', 'atencao'],
  ['Muito alta', '160 x 110 ou mais: procure atendimento imediatamente', 'perigo'],
]
export const SINAIS_PRESSAO = 'Dor de cabeça forte, visão embaçada ou com pontos brilhantes, dor no alto da barriga, inchaço repentino no rosto e nas mãos ou falta de ar: procure a maternidade, mesmo com a pressão normal.'

// Músicas para o bebê (na barriga e depois de nascer). Só nomes: a mãe escolhe onde ouvir.
export const MUSICAS = [
  {
    grupo: 'Cantigas de ninar', dica: 'A sua voz é o som preferido do bebê. Cantar, mesmo desafinado, acalma e cria vínculo.',
    itens: ['Nana Neném', 'Boi da Cara Preta', 'Se Essa Rua Fosse Minha', 'Brilha, Brilha Estrelinha', 'Ciranda, Cirandinha', 'Peixe Vivo', 'Dorme Nenê', 'Cai, Cai Balão'],
  },
  {
    grupo: 'Clássicas e calmas', dica: 'Melodias lentas e sem mudanças bruscas ajudam a relaxar a mãe e o bebê.',
    itens: ['Brahms: Canção de Ninar (Wiegenlied)', 'Mozart: Sonata para dois pianos K. 448', 'Bach: Ária na Corda Sol', 'Debussy: Clair de Lune', 'Vivaldi: As Quatro Estações (Primavera)', 'Pachelbel: Cânone em Ré', 'Satie: Gymnopédie nº 1', 'Schubert: Ave Maria'],
  },
  {
    grupo: 'Música brasileira suave', dica: 'Escolha músicas de que você gosta: quando a mãe relaxa, o bebê sente.',
    itens: ['Palavra Cantada (álbuns infantis)', 'Toquinho: Aquarela', 'Adriana Partimpim (Adriana Calcanhotto)', 'Arnaldo Antunes: Saiba', 'Tom Jobim: Wave', 'Maria Bethânia: Canções de ninar', 'Bia Bedran: Cantigas'],
  },
  {
    grupo: 'Sons para relaxar e dormir', dica: 'Ruído branco e sons da natureza lembram o barulho do útero e ajudam no sono do recém-nascido.',
    itens: ['Ruído branco', 'Som de chuva', 'Som de ondas do mar', 'Batimentos do coração', 'Caixinha de música'],
  },
]
export const DICAS_MUSICA = [
  'A partir de 20 semanas o bebê já ouve: cante e converse com a barriga todos os dias.',
  'Volume baixo, como uma conversa. Não encoste fones de ouvido na barriga.',
  'Repita as mesmas músicas: depois de nascer, o bebê tende a se acalmar com o que ouvia na barriga.',
  'Crie um ritual: a mesma música na hora do banho ou de dormir ajuda o bebê a entender a rotina.',
  'Cante olhando para o bebê e faça gestos: música com interação estimula a linguagem.',
]

// Questionário de antecedentes: [id, pergunta]
export const ANTECEDENTES = [
  {
    grupo: 'Doenças físicas (fisiológicas)', itens: [
      ['hipertensao', 'Hipertensão (pressão alta)'], ['diabetes', 'Diabetes'], ['cardiaca', 'Doença do coração'],
      ['tireoide', 'Doença da tireoide'], ['renal', 'Doença nos rins'], ['trombose', 'Trombose ou problema de coagulação'],
      ['asma', 'Asma ou bronquite'], ['anemia', 'Anemia falciforme ou outra anemia hereditária'], ['cancer', 'Câncer'],
      ['autoimune', 'Doença autoimune (lúpus, artrite reumatoide)'],
    ],
  },
  {
    grupo: 'Neurológicas e do desenvolvimento', itens: [
      ['epilepsia', 'Epilepsia ou convulsões'], ['autismo', 'Autismo (TEA)'], ['tdah', 'TDAH'],
      ['intelectual', 'Deficiência intelectual ou atraso no desenvolvimento'], ['genetica', 'Síndrome genética (ex.: Down)'],
      ['paralisia', 'Paralisia cerebral'], ['enxaqueca', 'Enxaqueca forte'], ['malformacao', 'Malformação ao nascer'],
      ['surdez', 'Surdez ou perda auditiva na infância'],
    ],
  },
  {
    grupo: 'Saúde mental (psicológicas)', itens: [
      ['depressao', 'Depressão'], ['ansiedade', 'Ansiedade ou síndrome do pânico'], ['bipolar', 'Transtorno bipolar'],
      ['esquizofrenia', 'Esquizofrenia ou outra psicose'], ['posparto', 'Depressão pós-parto'], ['dependencia', 'Dependência de álcool ou drogas'],
    ],
  },
  {
    grupo: 'Gestações anteriores', itens: [
      ['aborto', 'Perda gestacional (aborto)'], ['prematuro', 'Parto prematuro'], ['preeclampsia', 'Pré-eclâmpsia'],
      ['dmg', 'Diabetes gestacional em outra gravidez'],
    ],
  },
]

// Especialidades para buscar atendimento
export const ESPECIALIDADES = [
  'Obstetra', 'Endocrinologista', 'Nutricionista', 'Pediatra', 'Neuropediatra', 'Psicólogo', 'Psiquiatra',
  'Cardiologista', 'Fonoaudiólogo', 'Fisioterapeuta pélvico', 'Consultora de amamentação', 'Ultrassonografia', 'Laboratório de análises clínicas',
]
export const CONVENIOS = ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Hapvida', 'NotreDame Intermédica', 'Porto Saúde', 'Prevent Senior', 'São Cristóvão', 'Cassi', 'GEAP']

export const PROGRAMAS_SUS = [
  ['Pré-natal na UBS', 'Consultas, exames e vacinas gratuitos durante toda a gestação. Procure a UBS mais perto de casa assim que souber da gravidez.'],
  ['Rede Alyne', 'Programa do Ministério da Saúde (antiga Rede Cegonha) para o cuidado da gestante, do parto e do bebê até 2 anos.'],
  ['Caderneta da Gestante', 'Entregue na primeira consulta do pré-natal. Leve em todas as consultas e na hora do parto.'],
  ['Vinculação à maternidade', 'Pela Lei 11.634/2007 você tem direito de saber e visitar, durante o pré-natal, a maternidade onde vai ter o bebê.'],
  ['Testes do recém-nascido', 'Teste do pezinho, da orelhinha, do olhinho, do coraçãozinho e da linguinha, gratuitos.'],
  ['Bancos de Leite Humano', 'Ajuda com a amamentação e doação de leite. Procure "Banco de Leite" no mapa.'],
  ['Farmácia Popular', 'Medicamentos para diabetes e hipertensão gratuitos com receita.'],
  ['Bolsa Família', 'Benefício extra para gestantes e mães que amamentam inscritas no CadÚnico (procure o CRAS).'],
  ['Meu SUS Digital', 'Aplicativo oficial com vacinas, exames e atendimentos registrados no SUS.'],
]

export const TELEFONES_SAUDE = [
  ['SAMU', '192', 'Emergência'],
  ['Disque Saúde / Ouvidoria do SUS', '136', 'Informações e reclamações sobre o SUS'],
  ['Central de Atendimento à Mulher', '180', 'Violência contra a mulher, inclusive violência obstétrica'],
  ['ANS (planos de saúde)', '0800 701 9656', 'Reclamações sobre o convênio'],
]

// Dicas para um bom parto
export const PARTO = [
  ['Faça o pré-natal completo', 'No mínimo 6 consultas (o ideal são mais). É no pré-natal que se descobre e trata pressão alta, diabetes e infecções.'],
  ['Escreva um plano de parto', 'Um documento simples com o que você deseja: acompanhante, posições, alívio da dor, contato pele a pele, amamentação na primeira hora. Leve impresso.'],
  ['Conheça a maternidade antes', 'Visite o local, saiba o caminho e como é a entrada. É seu direito no SUS (Lei 11.634/2007).'],
  ['Escolha seu acompanhante', 'Você tem direito a um acompanhante de sua escolha no pré-parto, parto e pós-parto (Lei 11.108/2005), no SUS e no convênio.'],
  ['Prepare o corpo', 'Com liberação médica: caminhada, exercícios de respiração, alongamento, fisioterapia pélvica e massagem perineal a partir de 34 semanas.'],
  ['Conheça os sinais de trabalho de parto', 'Contrações regulares (a cada 5 minutos por 1 hora), perda de líquido ou sangramento. Bebê mexendo menos também é motivo para ir à maternidade.'],
  ['Alívio da dor', 'Existem métodos sem remédio (banho morno, bola, massagem, movimentar-se) e com remédio (analgesia). Pergunte o que a maternidade oferece.'],
  ['Mala pronta a partir de 34 semanas', 'Documentos, Caderneta da Gestante, exames, plano de parto, roupas para você e para o bebê.'],
  ['Com diabetes gestacional', 'Mantenha o controle da glicemia até o fim e leve seu registro. A equipe vai acompanhar a glicemia do bebê após o nascimento.'],
  ['Primeira hora de ouro', 'Peça contato pele a pele e amamentação logo após o nascimento, se você e o bebê estiverem bem.'],
]

// Violência obstétrica: o que é e como se proteger
export const VIOLENCIA = {
  intro: 'Violência obstétrica é qualquer ação ou omissão de profissionais ou instituições de saúde que desrespeite a mulher na gestação, no parto, no pós-parto ou no abortamento.',
  exemplos: [
    'Gritar, humilhar, fazer piadas ou ameaçar.',
    'Negar o acompanhante de sua escolha.',
    'Fazer procedimentos sem explicar e sem seu consentimento (como corte no períneo ou empurrar a barriga — a manobra de Kristeller, que não é recomendada).',
    'Negar alívio da dor, água ou alimento sem motivo.',
    'Impedir que você se movimente ou escolha a posição.',
    'Separar você do bebê sem necessidade médica.',
    'Recusar atendimento ou fazer você peregrinar entre hospitais.',
  ],
  direitos: [
    'Acompanhante de sua escolha durante todo o tempo (Lei 11.108/2005).',
    'Saber e visitar antes a maternidade onde vai ter o bebê (Lei 11.634/2007).',
    'Receber explicação de cada procedimento e poder dizer não.',
    'Ter privacidade e ser chamada pelo nome.',
    'Ter acesso ao seu prontuário.',
  ],
  protecao: [
    'Leve o plano de parto e peça que ele seja anexado ao prontuário.',
    'Combine com o acompanhante que ele pergunte o motivo de cada procedimento.',
    'Anote nomes, horários e o que aconteceu, assim que puder.',
    'Peça cópia do prontuário (é seu direito).',
  ],
  denunciar: [
    'Ouvidoria da própria maternidade ou do hospital.',
    'Disque Saúde 136 (Ouvidoria do SUS).',
    'Central de Atendimento à Mulher: 180.',
    'ANS (convênio): 0800 701 9656.',
    'Defensoria Pública ou Ministério Público do seu estado.',
    'Conselho Regional de Medicina (CRM) ou de Enfermagem (COREN).',
  ],
}

// Lembretes que vão para a agenda do celular
export const LEMBRETES = [
  { tipo: 'pressao', titulo: 'Está na hora de aferir a pressão', emoji: '🩺', horarios: ['08:00', '20:00'], rota: 'diabetes/pressao' },
  { tipo: 'glicemia', titulo: 'Está na hora de medir a glicemia', emoji: '🩸', horarios: ['07:00', '09:00', '13:30', '20:30'], rota: 'diabetes/glicemia' },
  { tipo: 'comer', titulo: 'Não esqueça de comer', emoji: '🍎', horarios: ['07:00', '10:00', '13:00', '16:00', '19:00', '22:00'], rota: 'diabetes/nutricao' },
  { tipo: 'agua', titulo: 'Hora de beber água', emoji: '💧', horarios: ['09:00', '11:00', '15:00', '17:00'], rota: 'inicio' },
  { tipo: 'remedio', titulo: 'Hora do remédio', emoji: '💊', horarios: ['08:00'], rota: 'diabetes/medicacoes' },
]
