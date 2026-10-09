import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../store';
import { getEmbedUrl, isSafeEmbedUrl } from '../components/MentorVideo';

export default function Home() {
  const navigate = useNavigate();
  const { state } = useApp();
  const embed = getEmbedUrl(state.adminConfig?.videoUrls?.['landing'], false);
  const landingVideo = isSafeEmbedUrl(embed) ? embed : undefined;

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-main)]">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--color-brand-600)] font-serif font-medium">
          <Leaf className="w-5 h-5" />
          <span>Jornada Ikigai</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-900)] transition-colors">
            Facilitadores
          </button>
          <button 
            onClick={() => navigate('/comecar/mentor')}
            className="text-sm font-medium bg-[var(--color-brand-600)] text-white px-5 py-2 rounded-[3px] hover:bg-[var(--color-brand-700)] transition-colors"
          >
            Começar
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-600)] flex items-center justify-center mb-8"
          >
            <Leaf className="w-6 h-6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
              Bússola de Autoconhecimento
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-[var(--color-brand-800)] mb-6 leading-tight">
              Descubra a profissão <br/>
              <span className="italic text-[var(--color-brand-500)]">que combina com Você</span>
            </h1>
            <p className="text-[var(--color-text-muted)] max-w-lg mx-auto mb-10 text-lg leading-relaxed">
              Uma jornada de 8 encontros guiados para adolescentes. Não é um teste vocacional — é um processo profundo de autoconhecimento baseado na filosofia japonesa do Ikigai.
            </p>

            <button
              onClick={() => navigate('/comecar/mentor')}
              className="bg-[var(--color-brand-600)] text-white px-8 py-3.5 rounded-[4px] font-medium text-lg hover:bg-[var(--color-brand-700)] transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-sm"
            >
              Iniciar a Jornada
              <span>→</span>
            </button>
          </motion.div>
        </div>

        {/* Vídeo — logo abaixo da hero (configurável no painel admin) */}
        <section className="max-w-4xl mx-auto px-6 pb-24 -mt-12">
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
            ) : (
              <div className="aspect-[9/16] w-full max-w-sm md:max-w-md mx-auto rounded-xl border-2 border-[var(--color-brand-300)] bg-stone-100 flex flex-col items-center justify-center text-center gap-3 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-white/80 text-[var(--color-brand-600)] flex items-center justify-center shadow-sm">
                  <Play className="w-7 h-7 ml-1" fill="currentColor" />
                </div>
                <span className="text-sm font-mono tracking-widest uppercase text-[var(--color-text-muted)]">
                  Vídeo em breve
                </span>
              </div>
            )}
          </motion.div>
        </section>

        <div className="border-t border-stone-200"></div>

        {/* What is Ikigai */}
        <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
           <div>
             <div className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
               O que é Ikigai
             </div>
             <h2 className="font-serif text-4xl text-[var(--color-brand-800)] mb-6 leading-tight">
               A razão de existir<br/>que os japoneses<br/>chamam de <span className="italic text-[var(--color-brand-500)]">Ikigai</span>
             </h2>
             <div className="text-stone-600 space-y-4 leading-relaxed max-w-md">
               <p>
                 Na ilha de Okinawa, onde vivem algumas das pessoas mais longevas do mundo, o Ikigai é a interseção de quatro pilares: o que você <strong>ama</strong>, no que você é <strong>bom</strong>, o que o <strong>mundo precisa</strong>, e pelo que você pode ser <strong>remunerado</strong>.
               </p>
               <p>
                 Não é um destino fixo. É uma bússola — que se ajusta conforme você cresce.
               </p>
             </div>
           </div>
           
           <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
              <div className="relative w-72 h-72">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border mix-blend-multiply flex flex-col items-center justify-start pt-6 c-love">
                  <span className="text-[10px] font-mono text-white opacity-80 uppercase tracking-wider text-center">O que você<br/>AMA</span>
                </div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-40 h-40 rounded-full border mix-blend-multiply flex flex-col items-end justify-center pr-6 c-good">
                  <span className="text-[10px] font-mono text-white opacity-80 uppercase tracking-wider text-right">No que é<br/>BOM</span>
                </div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-40 h-40 rounded-full border mix-blend-multiply flex flex-col items-start justify-center pl-6 c-world">
                  <span className="text-[10px] font-mono text-white opacity-80 uppercase tracking-wider text-left">Mundo<br/>PRECISA</span>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border mix-blend-multiply flex flex-col items-center justify-end pb-6 c-paid">
                  <span className="text-[10px] font-mono text-white opacity-80 uppercase tracking-wider text-center">Pode ser<br/>PAGO</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black p-4 rounded-full font-black text-lg shadow-2xl border-4 border-cyan-400 z-10">
                  IKIGAI
                </div>
              </div>
           </div>
        </section>

        {/* The Journey */}
        <section className="py-24 border-t border-stone-200">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
                A Jornada
              </div>
              <h2 className="font-serif text-4xl text-[var(--color-brand-800)]">
                8 encontros, 8 descobertas
              </h2>
            </div>

            <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
              {[
                { n: '01', title: 'Mapa de Energia',           desc: 'Mapeie o que te dá energia e o que drena sua energia no cotidiano.' },
                { n: '02', title: 'Talentos na Mochila',       desc: 'Identifique suas inteligências naturais e talentos mais latentes.' },
                { n: '03', title: 'A Grande Causa',            desc: 'Descubra para qual causa do mundo você quer direcionar sua energia.' },
                { n: '04', title: 'Duelo de Mundos',           desc: 'Explore os contextos e ambientes onde você performa melhor.' },
                { n: '05', title: 'Ministério dos Sonhos',     desc: 'Você foi convidado para o governo: escolha o ministério, o cargo e monte a equipe dos seus sonhos.' },
                { n: '06', title: 'O Arquétipo',               desc: 'Conecte seu arquétipo ao problema que deseja resolver no mundo.' },
                { n: '07', title: 'O Garimpo',                 desc: 'Explore profissões em alta e filtre as que mais combinam com você.' },
                { n: '08', title: 'A Carta para o Futuro',     desc: 'Visualize onde você quer estar daqui a 10 anos e escreva essa carta.' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="p-6 border border-stone-200 rounded-xl hover:border-[var(--color-brand-300)] transition-colors">
                  <span className="text-stone-300 font-mono text-sm block mb-3">{n}</span>
                  <h3 className="font-serif text-lg text-stone-800 mb-2 leading-snug">{title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 gap-4">
            <div className="font-serif text-[var(--color-brand-600)] text-sm">Jornada Ikigai</div>
            <div>© 2026 — Uma bússola de autoconhecimento para a Geração Z</div>
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
