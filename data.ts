
import { CategoriesData, Quote } from './types';

export const CATEGORY_ORDER = ['curiosidade', 'proposito', 'acao', 'realizacao', 'reinvencao'];

export const categories: CategoriesData = {
  curiosidade: {
    id: 'curiosidade',
    label: 'CURIOSIDADE',
    color: '#246CA0', // Azul profundo
    // Certifique-se de salvar a imagem em public/assets/card-curiosidade.png
    cardBackImage: '/assets/card-curiosidade.png', 
    questions: [
      "O que desperta seus sentidos e atenção hoje (sons, imagens, cheiros ou lugares) que fazem você se sentir vivo(a)?",
      "Em que momentos você se percebe observando algo com encantamento, como se fosse a primeira vez?",
      "De que forma o ambiente à sua volta influencia sua vontade de aprender e descobrir coisas novas?",
      "Você sente que sua curiosidade aumenta quando está em um ambiente seguro e acolhedor, ou no desafio por algo novo?",
      "O que te enche de energia e entusiasmo ao descobrir ou compreender algo novo, mesmo em pequenas coisas do dia a dia?",
      "Sobre qual assunto você poderia passar horas conversando sem ver o tempo passar?",
      "O que você gostaria de aprender hoje apenas pelo prazer da descoberta, sem nenhuma utilidade prática imediata?",
      "Se você pudesse viajar agora para qualquer lugar para investigar algo, para onde iria?"
    ]
  },
  proposito: {
    id: 'proposito',
    label: 'PROPÓSITO',
    color: '#F89D42', // Laranja quente
    cardBackImage: '/assets/card-proposito.png',
    questions: [
      "O que faz sua vida ter sentido hoje?",
      "Qual legado você deseja deixar?",
      "O que orienta suas escolhas neste momento da vida?",
      "Quais são as causas, ideias ou pessoas que despertam o seu melhor?",
      "O que dá sentido aos seus dias quando o entusiasmo diminui?",
      "Como você gostaria de ser lembrado pelas pessoas que realmente importam para você?",
      "Se dinheiro e tempo não fossem problemas, a que atividade você dedicaria a maior parte dos seus dias?",
      "Qual foi o momento recente em que você sentiu que estava exatamente onde deveria estar?"
    ]
  },
  acao: {
    id: 'acao',
    label: 'AÇÃO',
    color: '#E74930', // Vermelho vibrante
    cardBackImage: '/assets/card-acao.png',
    questions: [
      "O que ainda te faz levantar da cadeira e agir, mesmo quando está cansado(a)?",
      "O que te impede de dizer “agora é minha vez”?",
      "O que você tem adiado por medo de mudar a própria rotina?",
      "O que te move hoje: necessidade, propósito ou prazer?",
      "O que te dá energia e vontade de agir neste momento da vida?",
      "Qual é o menor passo possível que você pode dar hoje em direção a um sonho antigo?",
      "O que você faria imediatamente se tivesse a certeza absoluta de que não falharia?",
      "Quem são as pessoas que podem te apoiar ou colaborar com seus próximos passos?"
    ]
  },
  realizacao: {
    id: 'realizacao',
    label: 'REALIZAÇÃO',
    color: '#056D41', // Verde profundo
    cardBackImage: '/assets/card-realizacao.png',
    questions: [
      "Quais conquistas recentes você reconhece como fruto do seu próprio esforço?",
      "De que forma você celebra suas vitórias, mesmo as pequenas?",
      "Quais aprendizados mais te orgulham na sua trajetória até aqui?",
      "O que te faz sentir que está evoluindo como pessoa nesta fase da vida?",
      "Como você pode reconhecer e validar suas conquistas, sem depender do olhar externo?",
      "Qual foi o 'não' mais difícil que você disse, mas que hoje te traz orgulho?",
      "Que habilidade ou talento você desenvolveu ao longo da vida que considera seu maior trunfo?",
      "Qual memória simples do passado te traz uma sensação profunda de paz e dever cumprido?"
    ]
  },
  reinvencao: {
    id: 'reinvencao',
    label: 'REINVENÇÃO',
    color: '#903B91', // Roxo reflexivo
    cardBackImage: '/assets/card-reinvencao.png',
    questions: [
      "De que forma suas conquistas e experiências anteriores podem servir de base para novos começos?",
      "Quais mudanças internas ou externas têm te convidado a se reinventar?",
      "O que significa, para você, “recomeçar com novos significados”?",
      "Que valores ou propósitos permanecem como bússola, mesmo quando tudo muda?",
      "O que você precisa deixar ir para abrir espaço para o novo?",
      "Qual parte da sua identidade antiga já não serve mais para quem você é hoje?",
      "Que crença limitante você estaria disposto a abandonar para viver uma nova fase?",
      "Se você pudesse desenhar sua vida do zero hoje, o que manteria e o que mudaria?"
    ]
  }
};

export const quotes: Quote[] = [
  {
    text: "Quem tem um porquê enfrenta qualquer como.",
    author: "Viktor Frankl"
  },
  {
    text: "A motivação é a energia interna que dá direção, intensidade e persistência ao comportamento.",
    author: "Johnmarshall Reeve"
  },
  {
    text: "A vida não é uma sequência de perdas, mas uma sucessão de possibilidades para novas integrações.",
    author: "Erik Erikson"
  },
  {
    text: "O que um homem pode ser, ele deve ser. Essa necessidade de autorrealização é a base da motivação humana.",
    author: "Abraham Maslow"
  },
  {
    text: "O reconhecimento interno das próprias conquistas gera satisfação genuína e realização pessoal.",
    author: "Albert Bandura"
  },
  {
    text: "Daqui a vinte anos você estará mais decepcionado pelas coisas que não fez do que pelas que fez.",
    author: "Mark Twain"
  },
  {
    text: "Envelhecer é obrigatório, crescer é opcional.",
    author: "Chili Davis"
  },
  {
    text: "A única maneira de fazer um excelente trabalho é amar o que você faz.",
    author: "Steve Jobs"
  },
  {
    text: "Sua visão só se tornará clara quando você olhar para dentro do seu próprio coração.",
    author: "Carl Jung"
  },
  {
    text: "Não é o que olhamos que importa, é o que vemos.",
    author: "Henry David Thoreau"
  }
];
