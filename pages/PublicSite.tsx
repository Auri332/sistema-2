
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/Shared';
import { SiteContent, SitePage } from '../types';

interface PublicSiteProps {
  content: SiteContent;
}

const PublicSite: React.FC<PublicSiteProps> = ({ content }) => {
  const [activePage, setActivePage] = useState<SitePage | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActivePage(null);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* HEADER */}
      <nav className={`fixed w-full z-50 transition-all duration-300 px-6 py-4 flex justify-between items-center ${scrolled || activePage ? 'bg-white shadow-md' : 'bg-transparent text-white'}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('top')}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${scrolled || activePage ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}>
            {content.logo[0]}
          </div>
          <span className={`text-xl font-black tracking-tighter ${scrolled || activePage ? 'text-indigo-950' : 'text-white'}`}>
            {content.institutionName}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('top')} className="text-xs font-black uppercase tracking-widest hover:text-indigo-500 transition-colors">Início</button>
          <button onClick={() => scrollTo('sobre')} className="text-xs font-black uppercase tracking-widest hover:text-indigo-500 transition-colors">Sobre</button>
          
          {/* Menu de Páginas Dinâmicas */}
          {content.pages.length > 0 && (
            <div className="group relative">
              <button className="text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:text-indigo-500 transition-colors">
                Institucional ▾
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {content.pages.map(page => (
                  <button 
                    key={page.id} 
                    onClick={() => { setActivePage(page); window.scrollTo(0, 0); }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    {page.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button variant={scrolled || activePage ? 'primary' : 'outline'} className="text-xs py-2" onClick={() => window.location.hash = 'login'}>Acesso Restrito</Button>
        </div>
      </nav>

      {/* RENDERIZAÇÃO DINÂMICA OU HOME */}
      {activePage ? (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto animate-fadeIn min-h-[80vh]">
          <Badge>Página Institucional</Badge>
          <h1 className="text-5xl font-black text-indigo-950 mt-4 mb-10 leading-tight">{activePage.title}</h1>
          <div className="prose prose-lg text-gray-600 whitespace-pre-wrap leading-relaxed">
            {activePage.content}
          </div>
          <div className="mt-12">
            <Button variant="outline" onClick={() => setActivePage(null)}>Voltar ao Início</Button>
          </div>
        </div>
      ) : (
        <>
          {/* HERO */}
          <section id="top" className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-indigo-950">
              <img src={content.slides[0].image} className="w-full h-full object-cover opacity-30" alt="Background" />
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-indigo-950"></div>
            </div>
            <div className="relative z-10 text-center px-6 max-w-4xl space-y-6">
              <Badge color="bg-white/10 text-white backdrop-blur-md">Educação com Excelência</Badge>
              <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter">{content.heroTitle}</h1>
              <p className="text-lg text-indigo-100/70 max-w-2xl mx-auto">{content.heroSubtitle}</p>
              <div className="flex gap-4 justify-center pt-6">
                <Button className="px-10 py-4" onClick={() => scrollTo('sobre')}>Conheça Mais</Button>
                <Button variant="outline" className="px-10 py-4 text-white border-white/20 hover:bg-white/10" onClick={() => window.location.hash = 'login'}>Portal do Aluno</Button>
              </div>
            </div>
          </section>

          {/* SOBRE */}
          <section id="sobre" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
              <div className="space-y-6">
                <Badge>Sobre Nós</Badge>
                <h2 className="text-4xl md:text-6xl font-black text-indigo-950 leading-tight">Um ambiente feito para brilhar.</h2>
                <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-indigo-600 pl-8">
                  {content.aboutText}
                </p>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
                <img src={content.gallery[1]} className="relative rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500" />
              </div>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer className="bg-indigo-950 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white text-indigo-950 rounded-lg flex items-center justify-center font-black">
                {content.logo[0]}
              </div>
              <span className="text-xl font-black">{content.institutionName}</span>
            </div>
            <p className="text-indigo-200/50 text-sm">Cuidando do futuro através de valores sólidos e tecnologia educacional.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Navegação</h4>
            <div className="flex flex-col gap-3 text-sm text-indigo-200/60">
              <button onClick={() => scrollTo('top')} className="text-left hover:text-white transition-colors">Home</button>
              <button onClick={() => scrollTo('sobre')} className="text-left hover:text-white transition-colors">Sobre</button>
              {content.pages.map(p => (
                <button key={p.id} onClick={() => { setActivePage(p); window.scrollTo(0,0); }} className="text-left hover:text-white transition-colors">{p.title}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Contatos</h4>
            <p className="text-indigo-200/60 text-sm">📍 {content.contact.address}</p>
            <p className="text-indigo-200/60 text-sm">📞 {content.contact.phone}</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Redes Sociais</h4>
            <div className="flex gap-4">
              {['FB', 'IG', 'LI'].map(s => (
                <div key={s} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center font-bold hover:bg-indigo-600 transition-all cursor-pointer">{s}</div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] font-bold text-indigo-300/30 uppercase tracking-[0.3em]">© 2024 {content.institutionName} - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default PublicSite;
