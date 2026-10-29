import { useNavigate, Link } from 'react-router-dom';
import { Leaf, BookOpen, Compass, Palette, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../store';
import { getEmbedUrl, isSafeEmbedUrl } from '../components/MentorVideo';

const PHASES = [
  { n: '01', title: 'Mapa de Energia',         desc: 'Descubra quais atividades ainda te fazem brilhar — a energia que vai sustentar o que você construir.' },
  { n: '02', title: 'Talentos na Mochila',     desc: 'Reconheça suas competências de décadas e o chapéu de dono(a) que você veste melhor.' },
  { n: '03', title: 'Cenários de Vida',        desc: 'Explore os contextos e ambientes onde você trabalha e se sente mais vivo.' },
  { n: '04', title: 'O Garimpo',               desc: 'Garimpe formatos concretos de atuação — as sementes da sua futura oferta.' },
  { n: '05', title: 'A Dor que Você Resolve',  desc: 'Encontre seu nicho e a dor real que o seu negócio vai resolver.' },
  { n: '06', title: 'Público e Cliente',       desc: 'Defina quem você quer servir e como entregar valor — o outro lado do seu negócio.' },
  { n: '07', title: 'O Modelo da Reinvenção',  desc: 'Desenhe sua oferta, quem paga e sua meta — a engrenagem que transforma experiência em renda.' },
  { n: '08', title: 'Carta ao Eu de Amanhã',   desc: 'Feche com a visão do seu próximo capítulo — e do negócio que nasce dele.' },
];

const PILLARS = [
  { icon: <BookOpen className="w-5 h-5" />, title: 'Experiência',  desc: 'Décadas de vida são capital de trabalho, não peso a carregar.' },
  { icon: <Compass className="w-5 h-5" />,  title: 'Curiosidade',  desc: 'O que ainda te instiga aponta para onde há mercado.' },
  { icon: <Palette className="w-5 h-5" />,  title: 'Oferta',       desc: 'O que você sabe fazer vira algo que alguém recebe — e paga.' },
  { icon: <Target className="w-5 h-5" />,   title: 'Renda',        desc: 'Uma nova fonte de receita, extra ou principal, no seu ritmo.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { state } = useApp();
  const embed = getEmbedUrl(state.adminConfig?.videoUrls?.['landing'], false);
  const landingVideo = isSafeEmbedUrl(embed) ? embed : undefined;

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-main)]">

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--color-brand-600)] font-serif font-medium text-lg">
          <Leaf className="w-5 h-5" />
          <span>Reinventar</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/admin')}
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-900)] transition-colors"
          >
            Facilitadores
          </button>
          <button
            onClick={() => navigate('/comecar/guia')}
            className="text-sm font-medium bg-[var(--color-brand-600)] text-white px-5 py-2 rounded-[3px] hover:bg-[var(--color-brand-700)] transition-colors"
          >
            Começar
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-28 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-14 h-14 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-600)] flex items-center justify-center mb-8"
          >
            <Leaf className="w-7 h-7" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
              Plano de Reinvenção · 55+
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-[var(--color-brand-800)] mb-6 leading-tight">
              Transforme sua experiência<br/>
              <span className="italic text-[var(--color-brand-500)]">em uma nova renda</span>
            </h1>
            <p className="text-[var(--color-text-muted)] max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              Uma jornada de 8 encontros para quem tem 55+ e quer transformar décadas de vida, talento e curiosidade em uma fonte de renda — extra ou principal — com clareza e sem pressa.
            </p>

            <button
              onClick={() => navigate('/comecar/guia')}
              className="bg-[var(--color-brand-600)] text-white px-10 py-4 rounded-[4px] font-medium text-lg hover:bg-[var(--color-brand-700)] transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-sm"
            >
              Iniciar minha Jornada
              <span>→</span>
            </button>

          </motion.div>
        </div>

        {/* Vídeo de apresentação */}
        <section className="max-w-4xl mx-auto px-6 pb-24 -mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {landingVideo ? (
              <div className="aspect-[9/16] w-full max-w-sm md:max-w-md mx-auto rounded-xl overflow-hidden border-2 border-[var(--color-brand-300)] bg-black shadow-sm">
                <iframe
                  src={landingVideo}
                  className="w-full h-full"
                  title="Vídeo de apresentação"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}
          </motion.div>
        </section>

        <div className="border-t border-stone-200" />

        {/* Por que agora */}
        <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
              Por que agora?
            </div>
            <h2 className="font-serif text-4xl text-[var(--color-brand-800)] mb-6 leading-tight">
              A vida não para<br/>aos 55 — ela
              <span className="italic text-[var(--color-brand-500)]"> muda de fase</span>
            </h2>
            <div className="text-stone-600 space-y-4 leading-relaxed max-w-md text-base">
              <p>
                Você chegou até aqui com décadas de experiência, uma rede de relações e aprendizados que nenhum curso ensina. Mas talvez esteja se perguntando: <strong>e agora, como transformo tudo isso em renda?</strong>
              </p>
              <p>
                O Reinventar conduz você, passo a passo, até um <strong>Plano de Reinvenção</strong>: um esboço concreto de como sua experiência pode virar uma nova fonte de receita — sem pressa, sem julgamento, e com toda a seriedade que sua história merece.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {PILLARS.map(({ icon, title, desc }) => (
              <div key={title} className="p-6 border border-stone-200 rounded-xl bg-stone-50 hover:border-[var(--color-brand-300)] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-600)] flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="font-serif text-base text-stone-800 mb-1 font-semibold">{title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </motion.div>
        </section>

        <div className="border-t border-stone-200" />

        {/* As 8 Fases */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
                A Jornada
              </div>
              <h2 className="font-serif text-4xl text-[var(--color-brand-800)]">
                8 fases até o seu Plano de Reinvenção
              </h2>
            </div>

            <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
              {PHASES.map(({ n, title, desc }) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: parseInt(n, 10) * 0.05 }}
                  className="p-6 border border-stone-200 rounded-xl hover:border-[var(--color-brand-300)] transition-colors"
                >
                  <span className="text-stone-300 font-mono text-sm block mb-3">{n}</span>
                  <h3 className="font-serif text-base text-stone-800 mb-2 leading-snug font-semibold">{title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/comecar/guia')}
                className="bg-[var(--color-brand-600)] text-white px-10 py-4 rounded-[4px] font-medium text-base hover:bg-[var(--color-brand-700)] transition-all inline-flex items-center gap-2 shadow-sm"
              >
                Quero começar agora
                <span>→</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 gap-4">
            <div className="font-serif text-[var(--color-brand-600)] text-sm flex items-center gap-1.5">
              <Leaf className="w-4 h-4" /> Reinventar
            </div>
            <div>© 2026 — Transforme sua experiência em renda · 55+</div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
              <Link to="/politica-de-privacidade" className="hover:text-stone-800 transition-colors">Política de Privacidade</Link>
              <Link to="/termos-de-uso" className="hover:text-stone-800 transition-colors">Termos de Uso</Link>
              <span onClick={() => navigate('/admin')} className="hover:text-stone-800 cursor-pointer">Área do Facilitador</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
