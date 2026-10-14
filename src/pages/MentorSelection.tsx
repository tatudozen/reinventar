import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../store';
import { cn } from '../lib/utils';
import { BookOpen, Shield, Flame, Heart, Compass, Sparkles, Monitor, Feather, Brush, CheckCircle2 } from 'lucide-react';
import { MentorVideo } from '../components/MentorVideo';
import { ImageSwiper } from '../components/ui/image-swiper';

const MENTORS = [
  { id: 'sabio', name: 'O Sábio', role: 'Visão de longo prazo', desc: 'Sabedoria, propósito e visão de longo prazo.', image: '/mentors/sabio.png', icon: <BookOpen className="w-8 h-8" />, color: '#d4af37' },
  { id: 'heroi', name: 'O Herói', role: 'Resiliência e superação', desc: 'Resiliência, superação e senso de dever.', image: '/mentors/heroi.png', icon: <Shield className="w-8 h-8" />, color: '#ff3366' },
  { id: 'rebelde', name: 'O Rebelde', role: 'Liberdade e independência', desc: 'Autenticidade, liberdade e independência.', image: '/mentors/rebelde.png', icon: <Flame className="w-8 h-8" />, color: '#ff00e5' },
  { id: 'curadora', name: 'A Curadora', role: 'Empatia e acolhimento', desc: 'Empatia, acolhimento e cuidado.', image: '/mentors/curadora.png', icon: <Heart className="w-8 h-8" />, color: '#33ccff' },
  { id: 'exploradora', name: 'A Exploradora', role: 'Descoberta e coragem', desc: 'Descoberta, coragem e curiosidade.', image: '/mentors/exploradora.png', icon: <Compass className="w-8 h-8" />, color: '#ffcc00' },
  { id: 'criadora', name: 'A Criadora', role: 'Imaginação e originalidade', desc: 'Expressão, imaginação e originalidade.', image: '/mentors/criador.png', icon: <Sparkles className="w-8 h-8" />, color: '#00f2ff' }
];

const MENTOR_IMAGES = MENTORS.map(m => m.image).join(',');

const THEMES = [
  { id: 'cyber', name: 'Tech / Cyberpunk', desc: 'Visual neon, interfaces de simulação e futuro.', icon: <Monitor className="w-8 h-8" />, color: '#00f2ff' },
  { id: 'dark_academia', name: 'Dark Academia', desc: 'Tons profundos, papel e atmosfera universitária.', icon: <Feather className="w-8 h-8" />, color: '#d4af37' },
  { id: 'anime', name: 'Anime / Mangá', desc: 'Cores vibrantes, quadros e cultura pop.', icon: <Brush className="w-8 h-8" />, color: '#ff3366' }
];

const CONTRACTS = [
  "Responda como você é hoje.",
  "O resultado não define seu futuro.",
  "Contradições fazem parte do processo."
];

export default function MentorSelection() {
  const navigate = useNavigate();
  const { state, setThemeAndMentor, addXP } = useApp();

  const [step, setStep] = useState(0);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(state.mentor || null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(state.theme || 'cyber');
  const [acceptedContracts, setAcceptedContracts] = useState<number[]>([]);
  const [showVideo, setShowVideo] = useState(true);

  const handleSelectMentor = useCallback((mentorId: string) => {
    setSelectedMentor(mentorId);
    setThemeAndMentor(mentorId, selectedTheme || 'cyber');
  }, [selectedTheme, setThemeAndMentor]);

  const handleSwiperChange = useCallback((index: number) => {
    handleSelectMentor(MENTORS[index].id);
  }, [handleSelectMentor]);

  const handleMentorSelect = useCallback((index: number) => {
    handleSelectMentor(MENTORS[index].id);
    setStep(1);
  }, [handleSelectMentor]);

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    setThemeAndMentor(selectedMentor || 'sabio', themeId);
  };

  const handleThemeSwiperChange = useCallback((index: number) => {
    handleSelectTheme(THEMES[index].id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMentor]);

  const handleThemeSelect = useCallback((index: number) => {
    handleSelectTheme(THEMES[index].id);
    setStep(2);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMentor]);

  const THEME_STYLES: Record<string, { bg: string; pattern: string; patternSize?: string; glow: string }> = {
    cyber: {
      bg: 'linear-gradient(150deg, #040d1a 0%, #061624 50%, #081e30 100%)',
      pattern: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,242,255,0.05) 30px, rgba(0,242,255,0.05) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0,242,255,0.05) 30px, rgba(0,242,255,0.05) 31px)',
      glow: 'radial-gradient(circle at 50% 30%, rgba(0,242,255,0.22), transparent 60%)',
    },
    dark_academia: {
      bg: 'linear-gradient(150deg, #0e0b07 0%, #1c1408 50%, #221809 100%)',
      pattern: 'repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(212,175,55,0.05) 18px, rgba(212,175,55,0.05) 19px)',
      glow: 'radial-gradient(circle at 50% 30%, rgba(212,175,55,0.18), transparent 60%)',
    },
    anime: {
      bg: 'linear-gradient(150deg, #0a0510 0%, #130718 50%, #1a0922 100%)',
      pattern: 'radial-gradient(circle, rgba(255,51,102,0.08) 1px, transparent 1px)',
      patternSize: '16px 16px',
      glow: 'radial-gradient(circle at 50% 30%, rgba(255,51,102,0.22), transparent 60%)',
    },
  };

  const themeItems = useMemo(() => THEMES.map(t => {
    const s = THEME_STYLES[t.id];
    return (
      <div
        key={t.id}
        className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden"
        style={{ background: s.bg }}
      >
        {/* Padrão de fundo */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: s.pattern, backgroundSize: s.patternSize }}
        />
        {/* Glow central */}
        <div className="absolute inset-0" style={{ background: s.glow }} />
        {/* Ícone */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-8 relative z-10"
          style={{ backgroundColor: `${t.color}20`, color: t.color, border: `1px solid ${t.color}55` }}
        >
          {t.icon}
        </div>
        <h2 className="text-xl font-bold mb-3 text-center relative z-10" style={{ color: '#ffffff' }}>{t.name}</h2>
        <p className="text-sm text-center leading-relaxed relative z-10" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.desc}</p>
        {/* Linha inferior temática */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(to right, transparent, ${t.color}, transparent)` }}
        />
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const toggleContract = (idx: number) => {
    if (acceptedContracts.includes(idx)) {
      setAcceptedContracts(prev => prev.filter(i => i !== idx));
    } else {
      setAcceptedContracts(prev => [...prev, idx]);
    }
  };

  const handleNext = () => {
    if (step === 0 && selectedMentor) {
      setStep(1);
    } else if (step === 1 && selectedTheme) {
      setStep(2);
    } else if (step === 2 && acceptedContracts.length === CONTRACTS.length) {
      addXP(50);
      navigate('/comecar/fase/1');
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center mt-6 md:mt-10">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-8">
              <h1 className="text-4xl font-serif text-[var(--color-brand-800)] mb-4">A Escolha do Mentor</h1>
              <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
                Diferentes olhares revelam diferentes caminhos. Quem você escolhe para guiar seus primeiros passos?
              </p>
            </div>

            <div className="flex flex-col items-center mb-10">
              <ImageSwiper
                images={MENTOR_IMAGES}
                cardWidth={300}
                cardHeight={440}
                onActiveIndexChange={handleSwiperChange}
                onSelect={handleMentorSelect}
                overlay={
                  <AnimatePresence mode="wait">
                    {(() => {
                      const mentor = MENTORS.find(m => m.id === selectedMentor);
                      if (!mentor) return null;
                      return (
                        <motion.div
                          key={mentor.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="rounded-b-xl overflow-hidden"
                          style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 65%, transparent 100%)',
                            padding: '3.5rem 1.25rem 1.25rem',
                          }}
                        >
                          <div
                            className="text-[10px] font-mono tracking-widest uppercase mb-1"
                            style={{ color: mentor.color }}
                          >
                            {mentor.role}
                          </div>
                          <h2 className="text-xl font-bold text-white mb-1">{mentor.name}</h2>
                          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                            {mentor.desc}
                          </p>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                }
              />
              <p className="text-[10px] font-mono tracking-widest uppercase mt-2 text-[var(--color-text-muted)]">
                ← Arraste para explorar · Duplo toque para confirmar →
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: selectedMentor ? 1 : 0 }}
              disabled={!selectedMentor}
              onClick={handleNext}
              className="bg-[var(--color-brand-600)] px-12 py-4 rounded-xl font-bold uppercase tracking-widest text-[var(--bg-dark)] hover:opacity-90 transition-opacity disabled:pointer-events-none"
            >
              Confirmar Mentor
            </motion.button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-8">
              <h1 className="text-4xl font-serif text-[var(--color-brand-800)] mb-4">Escolha a Atmosfera</h1>
              <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
                A forma como enxergamos o mundo muda o próprio mundo. Qual lente visual combina mais com você agora?
              </p>
            </div>

            <div className="flex flex-col items-center mb-10">
              <ImageSwiper
                items={themeItems}
                cardWidth={300}
                cardHeight={400}
                onActiveIndexChange={handleThemeSwiperChange}
                onSelect={handleThemeSelect}
              />
              <p className="text-[10px] font-mono tracking-widest uppercase mt-2 text-[var(--color-text-muted)]">
                ← Arraste para explorar · Duplo toque para confirmar →
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className="bg-[var(--color-brand-600)] px-12 py-4 rounded-xl font-bold uppercase tracking-widest text-[var(--bg-dark)] hover:opacity-90 transition-opacity"
            >
              Confirmar Atmosfera
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            {!showVideo ? (
              <div className="max-w-xl mx-auto mt-10 p-10 rounded-2xl border border-[var(--color-brand-200)] bg-[var(--glass)] backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20">
                  <Feather className="w-24 h-24 text-[var(--color-brand-500)]" />
                </div>
                
                <h1 className="text-3xl font-serif text-[var(--text-main)] mb-8 text-left">Contrato de Jornada</h1>
                
                <div className="flex flex-col gap-5 text-left mb-10">
                  {CONTRACTS.map((contract, i) => {
                    const isChecked = acceptedContracts.includes(i);
                    return (
                      <div 
                        key={i} 
                        onClick={() => toggleContract(i)}
                        className="flex items-start gap-4 cursor-pointer group"
                      >
                        <div className={cn(
                          "mt-1 w-6 h-6 flex-shrink-0 flex items-center justify-center rounded border transition-colors",
                          isChecked ? "bg-[var(--color-brand-600)] border-[var(--color-brand-600)]" : "border-[var(--color-brand-300)] group-hover:border-[var(--color-brand-500)]"
                        )}>
                          {isChecked && <CheckCircle2 className="w-4 h-4 text-[var(--bg-dark)]" />}
                        </div>
                        <p className={cn(
                          "text-lg transition-colors",
                          isChecked ? "text-[var(--text-main)] font-medium" : "text-[var(--color-text-muted)] group-hover:text-[var(--text-main)]"
                        )}>
                          {contract}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: acceptedContracts.length === CONTRACTS.length ? 1 : 0 }}
                  disabled={acceptedContracts.length !== CONTRACTS.length}
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-[1.02] transition-all disabled:pointer-events-none"
                >
                  Assinar e Começar
                </motion.button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto mt-10">
                <MentorVideo 
                  title="O Contrato"
                  description="Antes de descobrirmos os seus caminhos profissionais, precisamos alinhar o formato da nossa jornada."
                  videoUrl={selectedMentor === 'criadora' ? "https://www.youtube.com/embed/CdYb1eD-wLo?autoplay=1" : undefined}
                  videoId="fase0"
                  onComplete={() => setShowVideo(false)} 
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
