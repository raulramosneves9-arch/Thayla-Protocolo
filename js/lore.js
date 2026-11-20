/* =========================================================
   THAYLA — Protocolo Guarannapuava
   LORE, documentos e diálogos.
   ========================================================= */

window.LORE = {

  title: 'THAYLA',
  subtitle: 'PROTOCOLO GUARANNAPUAVA',

  intro: [
    { who: '', text: 'Guarannapuava City. 03h12. A chuva não para há três dias.' },
    { who: 'THAYLA', text: 'Três dias sem contato com a delegacia daqui. O último rádio repetiu uma palavra só: "cura".' },
    { who: 'THAYLA', text: 'Sou Thayla Vaz, policial civil. Investigadora. Vim buscar respostas.' },
    { who: 'THAYLA', text: 'Dizem que o Dr. Raul Tickmann transformou a própria cidade em cobaia. A imprensa apelidou o desastre de UmbrellaRaulTick.' },
    { who: 'THAYLA', text: 'Raul... você era o melhor de nós. Antes de virar isso.' },
    { who: 'THAYLA', text: 'Se ainda existe um homem aí dentro, existe uma cura. E eu vou encontrá-la.' },
    { who: '', text: 'CONTROLES:  WASD mover  •  MOUSE mirar  •  CLIQUE atirar  •  F faca  •  ESPAÇO esquiva  •  E interagir  •  TAB inventário' }
  ],

  docs: {
    boletim: {
      type: 'BOLETIM DE OCORRÊNCIA',
      code: '#0471 — 23/10 — 21h40',
      title: 'Rua XV de Novembro',
      body: [
        'Chamado: agressão em via pública. Testemunhas descrevem "carrapatos do tamanho de um punho" saindo do bueiro da praça.',
        'Três agentes foram enviados. Nenhum retornou. As câmeras do circuito interno registraram os corpos se levantando quarenta minutos depois do óbito.',
        'A delegada-chefe mandou trancar o armário de evidências com o material apreendido no laboratório. Senha nova: 427.',
        'Se alguém de fora ler isto: não confiem nos olhos deles. Confiem no cheiro. Eles cheiram a ferrugem.'
      ]
    },

    senha: {
      type: 'ANOTAÇÃO',
      code: 'colada no monitor',
      title: 'Não esqueça, idiota',
      body: [
        'ARMÁRIO DE EVIDÊNCIAS — 427',
        'O resto do material (escopeta, fusível, pé de cabra) está lá dentro. Se a luz do corredor cair de novo, o fusível salva a noite.',
        '— D. Marlene, plantão'
      ]
    },

    carta: {
      type: 'CARTA NÃO ENVIADA',
      code: 'envelope aberto, sem selo',
      title: 'Para Thayla',
      body: [
        'Thayla,',
        'se você está lendo isto, eu já não sou eu. Não vim te pedir perdão — perdão é para quem ainda tem tempo.',
        'A cura existe. Está três portas daqui, na bancada do laboratório. Eu mesmo escrevi o protocolo. Covarde até no fim.',
        'Se eu ainda estiver por dentro quando você chegar, me segure. Se não estiver... não deixe eu machucar mais ninguém.',
        'Você foi a única que nunca teve medo de mim. Tente lembrar disso quando me ver.',
        '— R.'
      ]
    },

    email: {
      type: 'E-MAIL INTERNO',
      code: 'UMBRELLA/BR — servidor local',
      title: 'PROJETO CARRAPATO — encerramento',
      body: [
        'De: diretoria@umbrella-br.com',
        'Para: r.tickmann@umbrella-br.com',
        'Dr. Tickmann, a cidade de Guarannapuava foi isolada por ordem federal. O senhor tem 48 horas para apresentar o antídoto ou será tratado como responsável direto pelas doze mil e quatrocentas infecções.',
        'A amostra do Sujeito Zero permanece no laboratório subterrâneo. Ninguém vai buscá-la. Ninguém vai te buscar.',
        'A Diretoria agradece sua dedicação ao Projeto. O contrato está encerrado.'
      ]
    },

    diario1: {
      type: 'DIÁRIO DE CAMPO',
      code: 'caderno molhado — 12/09',
      title: 'Raul Tickmann',
      body: [
        'Eu queria curar a Helena. Só isso.',
        'A degeneração óssea dela não ia esperar por comitê de ética. O carrapato sintético regenera tecido. Funcionou. Funcionou demais.',
        'Ele não para de regenerar. O que morre, volta. E o que volta não lembra de ser gente — mas lembra de ter fome.',
        'A Helena voltou por quarenta minutos. Ela me olhou. Ela sabia o meu nome. Depois, só havia dentes.',
        'Amanhã eu me injeto o A-3. Se for seguro em mim, é seguro para a cidade. Se não for... que a cidade me perdoe.'
      ]
    },

    diario2: {
      type: 'DIÁRIO DE CAMPO',
      code: 'páginas arrancadas — 02/10',
      title: 'Hora 61',
      body: [
        'Me injetei o A-3 para provar que era seguro. O espelho não devolve mais o meu rosto.',
        'Sinto as pessoas pela temperatura. Sinto a Thayla vindo pela cidade como quem sente a chuva antes dela cair. Ela vai me matar. Eu mereço.',
        'Mas se ela chegar ao laboratório, talvez haja uma saída. O Soro R-7 precisa de três coisas: o meu sangue, o núcleo da rainha e o reagente A-3.',
        'Deixei tudo escrito na bancada. Deixei o caminho aberto. Fiz da minha covardia uma trilha para ela.',
        'A rainha está no esgoto, no ninho. Não a matem sem extrair o núcleo. E não me deixem virar o que a Helena virou.'
      ]
    },

    bula: {
      type: 'PROTOCOLO CONFIDENCIAL',
      code: 'SORO R-7 — síntese',
      title: 'Uma dose. Uma chance.',
      body: [
        'CENTRÍFUGA DE BANCADA — sequência única.',
        '1. Reagente estabilizador A-3 (farmácia do centro).',
        '2. Núcleo extraído da carrapato-rainha (ninho, esgoto).',
        '3. Amostra de sangue do Sujeito Zero (câmara fria, laboratório).',
        'Ordem de inserção: REAGENTE → NÚCLEO → SANGUE. Temperatura: -4 °C. Ciclo único.',
        'Resultado: uma dose. Não há segunda chance. Não há reforço. Não há pedido de desculpas.'
      ]
    },

    memorando: {
      type: 'MEMORANDO 88-B',
      code: 'setor de contenção',
      title: 'Sujeito Zero',
      body: [
        'O Sujeito Zero não é um paciente. É o vetor.',
        'O carrapato não mata o hospedeiro: ele o reinicia. O córtex permanece ativo por tempo indeterminado — é o que chamamos de fase lúcida.',
        'Duração média registrada: 96 horas. Depois disso, o hospedeiro não pensa mais. Só obedece ao ninho.',
        'O Dr. Tickmann está na hora 89.',
        'Recomendação: não há. A Diretoria considera o ativo irrecuperável.'
      ]
    }
  },

  notes: {
    boletim: { label: 'Boletim de Ocorrência', doc: 'boletim' },
    senha: { label: 'Anotação no monitor', doc: 'senha' },
    carta: { label: 'Carta sem selo', doc: 'carta' },
    email: { label: 'E-mail no terminal', doc: 'email' },
    diario1: { label: 'Diário de campo', doc: 'diario1' },
    diario2: { label: 'Páginas arrancadas', doc: 'diario2' },
    bula: { label: 'Protocolo do Soro R-7', doc: 'bula' },
    memorando: { label: 'Memorando 88-B', doc: 'memorando' }
  },

  objectives: {
    start: 'Chegue à Delegacia de Guarannapuava.',
    delegacia: 'Investigue a delegacia. Encontre o Cartão R.P.D.',
    farmacia: 'Siga até a Farmácia, na Praça Central.',
    esgoto: 'Desça ao esgoto. Extraia o núcleo da carrapato-rainha.',
    lab: 'Laboratório subterrâneo: restaure a energia.',
    sintese: 'Sintetize o Soro R-7 na centrífuga.',
    terraco: 'Suba ao terraço. Encontre Raul.',
    final: 'Aplique a cura — ou decida o que ele merece.'
  },

  dialogue: {
    delegacia: [
      { who: 'THAYLA', text: 'Cheiro de ferrugem. O boletim não exagerou.' },
      { who: 'THAYLA', text: 'Preciso do cartão de acesso e da chave da farmácia. E de munição. Muita munição.' }
    ],
    farmacia: [
      { who: 'THAYLA', text: 'A farmácia ainda tem luz. Isso significa que alguém pagou a conta até pouco tempo atrás.' },
      { who: 'THAYLA', text: 'O reagente A-3 deve estar no balcão. E eu preciso sair daqui antes que o cheiro atraia mais deles.' }
    ],
    praca: [
      { who: 'THAYLA', text: 'A praça está vazia. Vazia do jeito errado.' },
      { who: 'THAYLA', text: 'Tem um bueiro no centro. O boletim falava de carrapatos saindo dele.' },
      { who: 'THAYLA', text: 'Preciso de algo para forçar a tampa. Um pé de cabra resolveria.' }
    ],
    esgoto: [
      { who: 'THAYLA', text: 'O ninho. Eles construíram um ninho debaixo da cidade.' },
      { who: 'THAYLA', text: 'Raul escreveu que o núcleo da rainha é a segunda peça do soro. Então eu preciso chegar perto dela.' },
      { who: 'THAYLA', text: 'Ótimo. Eu sempre quis morrer num esgoto.' }
    ],
    queen: [
      { who: 'THAYLA', text: 'Isso não é um carrapato. Isso é uma catedral de dentes.' },
      { who: 'THAYLA', text: 'O núcleo está pulsando no centro do corpo dela. Um tiro bem colocado resolve.' }
    ],
    lab: [
      { who: 'THAYLA', text: 'Laboratório subterrâneo da Umbrella. Onde tudo começou.' },
      { who: 'THAYLA', text: 'Sem energia, a câmara fria e a centrífuga não abrem. Preciso achar o quadro de fusíveis.' }
    ],
    power: [
      { who: 'THAYLA', text: 'Luz. Agora sim.' },
      { who: 'THAYLA', text: 'Sangue do Raul na câmara fria, núcleo no bolso, reagente na mochila. Três peças.' }
    ],
    raul: [
      { who: 'RAUL', text: 'Thayla. Você veio mesmo.' },
      { who: 'THAYLA', text: 'Raul. Ainda dá para te reconhecer. Isso é bom.' },
      { who: 'RAUL', text: 'Não chegue perto. A hora está acabando. Eu sinto a cidade chamando por dentro do meu peito.' },
      { who: 'RAUL', text: 'Eu liberei o A-3 na estação de tratamento. Achei que fosse seguro. Achei que fosse meu. Olha o que eu fiz.' },
      { who: 'THAYLA', text: 'Você escreveu o protocolo do soro. Você deixou o caminho aberto.' },
      { who: 'RAUL', text: 'Covardia, não redenção. Eu não tive coragem de me matar, então deixei que você fizesse o trabalho.' },
      { who: 'RAUL', text: 'Está pronto? O soro está na sua mochila?' },
      { who: 'THAYLA', text: 'Está.' },
      { who: 'RAUL', text: 'Então me segure, Thayla. Porque agora... agora eu não consigo mais parar.' }
    ],
    raul_defeat: [
      { who: 'RAUL', text: 'Thayla... eu ainda estou aqui. Eu ainda estou aqui.' },
      { who: 'THAYLA', text: 'Eu sei. Eu vim te buscar, seu idiota.' },
      { who: 'RAUL', text: 'O soro. Aplique o soro. Por favor. Me dá uma chance de responder por tudo.' },
      { who: '', text: 'A decisão é sua.' }
    ]
  },

  endings: {
    cure: {
      title: 'A CURA',
      lines: [
        'A injeção levou onze segundos.',
        'Quando os olhos dele voltaram a focar, não havia mais fome neles — só cansaço.',
        '"Você demorou", ele disse. E riu. Um riso humano, rouco, pequeno.',
        'Raul Tickmann desceu do terraço algemado, vivo e réu de tudo.',
        'A cura foi replicada em três semanas. Guarannapuava não voltou ao normal. Mas voltou a ter manhãs.',
        'O inquérito tem quatro mil páginas. A primeira linha é minha: "o suspeito se entregou".'
      ]
    },
    shoot: {
      title: 'SILÊNCIO',
      lines: [
        'O tiro foi limpo. Ele não tentou desviar.',
        'O corpo caiu onde meu parceiro havia caído tantas vezes: de joelhos, como quem se desculpa.',
        'A cidade dormiu em silêncio. Sem cura. Sem respostas. Sem réu.',
        'Só eu sei que, no fim, ele pediu que eu não atirasse.',
        'O relatório diz: resistência à prisão. Eu assinei.'
      ]
    },
    leave: {
      title: 'CINZAS',
      lines: [
        'Fechei a porta do terraço e desci.',
        'A chuva cobriu tudo o que ele tentou dizer.',
        'O Soro R-7 ficou na bancada, intacto, esperando alguém com mais coragem do que eu.',
        'Guarannapuava continua no mapa. Só não continua viva.'
      ]
    }
  }
};
