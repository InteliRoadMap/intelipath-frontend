import React, { useState, useEffect, useRef } from 'react';
import { portfolioApi, PortfolioData } from '@/api/portfolioApi';
import { useDebounce } from '@/hooks/useDebounce';
import { EditableText } from './EditableText';
import { ThemeEditor } from './ThemeEditor';
import { IconPicker } from './IconPicker';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import '@/features/portfolio/styles.css';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  initialData: PortfolioData;
}

export const EPortfolioEditor: React.FC<Props> = ({ initialData }) => {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [iconPickerProjectIdx, setIconPickerProjectIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Auto-save logic
  const debouncedData = useDebounce(data, 1500); // 1.5s delay after stop typing
  
  // Track initial mount to prevent saving on first load
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    const saveData = async () => {
      setIsSaving(true);
      try {
        await portfolioApi.updatePortfolio(debouncedData);
      } catch (err) {
        console.error('Failed to save portfolio', err);
      } finally {
        setIsSaving(false);
      }
    };
    
    saveData();
  }, [debouncedData]);

  // Apply theme colors globally when they change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', data.theme);
    document.documentElement.style.setProperty('--primary-color', data.themeColors.primaryColor);
    document.documentElement.style.setProperty('--title-color', data.themeColors.titleColor);
    document.documentElement.style.setProperty('--text-color', data.themeColors.textColor);
    document.documentElement.style.setProperty('--bg-primary', data.themeColors.bgPrimary);
    document.documentElement.style.setProperty('--bg-secondary', data.themeColors.bgSecondary);
    document.documentElement.style.setProperty('--card-background', data.themeColors.bgSecondary);
    document.documentElement.style.setProperty('--heading-font', data.fonts?.heading || "'Outfit', sans-serif");
    document.documentElement.style.setProperty('--body-font', data.fonts?.body || "'Inter', sans-serif");
  }, [data.theme, data.themeColors, data.fonts]);

  // GSAP Animations
  useGSAP(() => {
    // Reveal Elements
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => {
      gsap.fromTo(el, 
        { autoAlpha: 0, y: 40 }, 
        {
          autoAlpha: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Hero Timeline
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    heroTimeline
      .from(".hero-title-pill", { x: -100, opacity: 0, duration: 1 }, 0)
      .from(".hero-img-wrapper", { x: 100, opacity: 0, duration: 1 }, 0.2)
      .from(".hero-text p", { y: 20, opacity: 0, stagger: 0.1 }, 0.4)
      .from(".contact-title", { y: 20, opacity: 0, duration: 0.8 }, 0.6)
      .from(".contact-grid a", { y: 20, opacity: 0, stagger: 0.1 }, 0.8);
      
  }, { scope: containerRef, dependencies: [] }); // Run once on mount

  // Update handlers
  const updateHero = (key: keyof PortfolioData['hero'], value: string) => {
    setData(prev => ({
      ...prev,
      hero: { ...prev.hero, [key]: value }
    }));
  };

  const updateTheme = (key: 'primaryColor' | 'titleColor' | 'textColor', color: string) => {
    setData(prev => ({
      ...prev,
      themeColors: { ...prev.themeColors, [key]: color }
    }));
  };

  const updateFont = (key: 'heading' | 'body', font: string) => {
    setData(prev => ({
      ...prev,
      fonts: { ...prev.fonts, [key]: font }
    }));
  };

  const toggleTheme = () => {
    setData(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
      themeColors: prev.theme === 'dark' ? {
        primaryColor: prev.themeColors.primaryColor,
        bgPrimary: '#f8fafc',
        bgSecondary: '#f1f5f9'
      } : {
        primaryColor: prev.themeColors.primaryColor,
        bgPrimary: '#0d0f17',
        bgSecondary: '#151722'
      }
    }));
  };

  return (
    <div ref={containerRef} className="e-portfolio-wrapper font-inter">
      {isSaving && (
        <div className="fixed top-4 right-4 bg-primary-500 text-white px-4 py-2 rounded shadow-lg z-50 text-sm flex items-center gap-2">
          <i className="fas fa-spinner fa-spin"></i> Saving changes...
        </div>
      )}

      {isEditMode && (
        <ThemeEditor 
          primaryColor={data.themeColors.primaryColor} 
          titleColor={data.themeColors.titleColor}
          textColor={data.themeColors.textColor}
          headingFont={data.fonts?.heading || "'Outfit', sans-serif"}
          bodyFont={data.fonts?.body || "'Inter', sans-serif"}
          onChangeColor={updateTheme}
          onChangeFont={updateFont}
        />
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between border-b border-slate-200 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-3 md:px-8 transition-colors">
        <div className="flex items-center gap-6">
          <div className="logo text-lg font-bold font-outfit text-slate-800 dark:text-white">
            <span className="text-[var(--primary-color)]">IN</span>TELIPATH<span className="text-[var(--primary-color)]">.</span>
          </div>
          <ul className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <li><a href="#hero" className="hover:text-slate-800 dark:hover:text-white transition-colors">Home</a></li>
            <li><a href="#education" className="hover:text-slate-800 dark:hover:text-white transition-colors">Education</a></li>
            <li><a href="#skills" className="hover:text-slate-800 dark:hover:text-white transition-colors">Skills</a></li>
            <li><a href="#projects" className="hover:text-slate-800 dark:hover:text-white transition-colors">Projects</a></li>
          </ul>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400"><i className="fas fa-sun"></i></span>
            <button 
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`}
              title="Toggle Dark Mode"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400"><i className="fas fa-moon"></i></span>
          </div>
          
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Preview</span>
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEditMode ? 'bg-[var(--primary-color)]' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEditMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-semibold text-slate-800 dark:text-white">Edit</span>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header id="hero" className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-[var(--bg-primary)] flex flex-col justify-center">
        <div className="hero-title-pill absolute top-32 left-0 bg-gradient-to-r from-[var(--primary-color)] to-blue-500 py-6 pr-24 pl-[10vw] rounded-r-[100px] shadow-lg z-10 text-[var(--title-color)]">
          <EditableText isEditable={isEditMode} value={data.hero.title} onChange={val => updateHero('title', val)} as="h1" className="text-7xl font-outfit m-0" />
        </div>
        
        <div className="hero-content-wrapper flex flex-col md:flex-row justify-between items-center w-full px-[10vw] mt-60 relative z-20">
          <div className="hero-content flex-1 w-full max-w-2xl text-left">
            <div className="hero-text text-xl leading-relaxed mb-16 text-[var(--text-color)]">
              <p className="text-[var(--text-color)] text-xl leading-relaxed max-w-2xl">
                <EditableText isEditable={isEditMode} value={data.hero.greeting} onChange={val => updateHero('greeting', val)} as="span" className="block mb-2 font-medium" />
                My name is <EditableText isEditable={isEditMode} value={data.hero.name} onChange={val => updateHero('name', val)} as="span" className="text-[var(--primary-color)] font-bold" />.<br/>
                I am a <EditableText isEditable={isEditMode} value={data.hero.role} onChange={val => updateHero('role', val)} as="span" className="text-[var(--primary-color)] font-semibold" /> <EditableText isEditable={isEditMode} value={data.hero.description} onChange={val => updateHero('description', val)} as="span" />
              </p>
              <br/>
              <p><span className="text-[var(--primary-color)] font-semibold">My objective:</span> <EditableText isEditable={isEditMode} value={data.hero.objective} onChange={val => updateHero('objective', val)} multiline /></p>
            </div>

            <h3 className="contact-title text-4xl italic font-extrabold mb-8 font-outfit text-[var(--title-color)]">Contact</h3>
            <div className="contact-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.hero.contact.map((c, idx) => (
                <div key={c.id} className="flex items-center gap-3 text-[var(--text-color)] font-semibold group">
                  {isEditMode ? (
                    <button onClick={() => {
                      const icon = prompt("Enter FontAwesome class for icon:", c.icon);
                      if (icon) {
                        const newContact = [...data.hero.contact];
                        newContact[idx].icon = icon;
                        setData({ ...data, hero: { ...data.hero, contact: newContact } });
                      }
                    }} className={`${c.icon} w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--primary-color)] cursor-pointer hover:bg-[var(--primary-color)] hover:text-white transition-colors`} title="Change Icon"></button>
                  ) : (
                    <i className={`${c.icon} w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--primary-color)]`}></i>
                  )}
                  <EditableText isEditable={isEditMode} value={c.value} onChange={val => {
                    const newContact = [...data.hero.contact];
                    newContact[idx].value = val;
                    setData({ ...data, hero: { ...data.hero, contact: newContact } });
                  }} />
                  {isEditMode && (
                    <button onClick={() => {
                      setData({ ...data, hero: { ...data.hero, contact: data.hero.contact.filter(item => item.id !== c.id) } });
                    }} className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shadow-sm"><i className="fas fa-trash text-sm"></i></button>
                  )}
                </div>
              ))}
              {isEditMode && (
                <button onClick={() => {
                  setData({
                    ...data, 
                    hero: { 
                      ...data.hero, 
                      contact: [...data.hero.contact, { id: 'contact-'+Date.now(), type: 'New', value: 'new.contact@example.com', icon: 'fas fa-link' }] 
                    }
                  });
                }} className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-[var(--primary-color)] text-[var(--primary-color)] rounded-full hover:bg-[var(--primary-color)] hover:text-white transition-colors w-max font-semibold">
                  <i className="fas fa-plus"></i> New Contact
                </button>
              )}
            </div>
          </div>
          
          <div className="hero-img-wrapper relative flex-shrink-0 ml-0 md:ml-16 mt-16 md:mt-0">
            <div className="absolute -top-[10%] -left-[20%] w-[140%] h-[120%] border-2 border-[var(--primary-color)] opacity-30 z-0 animate-morph" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}></div>
            <img src={data.hero.avatarUrl} alt="Profile" className="hero-img-pill w-[360px] h-[480px] object-cover rounded-[200px] relative z-10 border-4 border-[var(--bg-secondary)] shadow-2xl" />
            {isEditMode && (
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 rounded-[200px]">
                <button className="bg-white text-slate-900 px-4 py-2 rounded-full font-semibold text-sm cursor-pointer" onClick={() => {
                  const url = prompt("Enter new image URL", data.hero.avatarUrl);
                  if (url) updateHero('avatarUrl', url);
                }}>Change Image</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* EDUCATION SECTION */}
      <section id="education" className="reveal bg-[var(--bg-secondary)] py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl text-center font-bold font-outfit mb-16 text-[var(--title-color)]">Education</h2>
          <div className="relative border-l-2 border-[var(--border-color)] ml-4">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="relative pl-12 mb-12 last:mb-0 group">
                <div className="absolute left-[-17px] top-1 w-8 h-8 rounded-full bg-[var(--bg-primary)] border-4 border-[var(--primary-color)] shadow-sm group-hover:bg-[var(--primary-color)] transition-colors"></div>
                <div className="bg-[var(--bg-primary)] rounded-2xl p-8 shadow-md border border-[var(--border-color)] transition-transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-2">
                    <EditableText isEditable={isEditMode} value={edu.university} onChange={val => {
                      const newEdu = [...data.education];
                      newEdu[idx].university = val;
                      setData({ ...data, education: newEdu });
                    }} as="h3" className="text-2xl font-bold text-[var(--title-color)]" />
                    {isEditMode && (
                      <button onClick={() => {
                        setData({ ...data, education: data.education.filter(e => e.id !== edu.id) });
                      }} className="bg-red-500 text-white w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><i className="fas fa-trash text-sm"></i></button>
                    )}
                  </div>
                  <p className="text-[var(--primary-color)] font-bold mb-2">
                    <EditableText isEditable={isEditMode} value={edu.degree} onChange={val => {
                      const newEdu = [...data.education];
                      newEdu[idx].degree = val;
                      setData({ ...data, education: newEdu });
                    }} /> | <EditableText isEditable={isEditMode} value={edu.period} onChange={val => {
                      const newEdu = [...data.education];
                      newEdu[idx].period = val;
                      setData({ ...data, education: newEdu });
                    }} />
                  </p>
                  <p className="text-[var(--text-color)]">
                    <EditableText isEditable={isEditMode} value={edu.description} onChange={val => {
                      const newEdu = [...data.education];
                      newEdu[idx].description = val;
                      setData({ ...data, education: newEdu });
                    }} multiline />
                  </p>
                </div>
              </div>
            ))}
            {isEditMode && (
              <div className="pl-12 mt-8">
                <button onClick={() => {
                  setData({ ...data, education: [...data.education, { id: 'edu-'+Date.now(), university: 'New University', degree: 'Degree', period: 'Year', description: 'Description' }] });
                }} className="px-4 py-2 border-2 border-dashed border-[var(--primary-color)] text-[var(--primary-color)] rounded-lg hover:bg-[var(--primary-color)] hover:text-white transition-colors w-full">+ Add Education</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="reveal py-24 px-8 bg-[var(--bg-primary)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl text-center font-bold font-outfit mb-16 text-[var(--title-color)]">My Skills</h2>
          <div className="relative border-l-2 border-[var(--border-color)] ml-4">
            {data.skills.map((skill, idx) => (
              <div key={skill.id} className="relative pl-12 mb-12 last:mb-0 group">
                <div className="absolute left-[-17px] top-1 w-8 h-8 rounded-full bg-[var(--bg-primary)] border-4 border-[var(--primary-color)] shadow-sm group-hover:bg-[var(--primary-color)] transition-colors"></div>
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 shadow-md border border-[var(--border-color)] transition-transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-2">
                    <EditableText isEditable={isEditMode} value={skill.category} onChange={val => {
                      const newSkills = [...data.skills];
                      newSkills[idx].category = val;
                      setData({ ...data, skills: newSkills });
                    }} as="h3" className="text-2xl font-bold text-[var(--title-color)]" />
                    {isEditMode && (
                      <button onClick={() => {
                        setData({ ...data, skills: data.skills.filter(s => s.id !== skill.id) });
                      }} className="bg-red-500 text-white w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><i className="fas fa-trash text-sm"></i></button>
                    )}
                  </div>
                  <p className="text-[var(--primary-color)] font-bold mb-2">
                    <EditableText isEditable={isEditMode} value={skill.stack} onChange={val => {
                      const newSkills = [...data.skills];
                      newSkills[idx].stack = val;
                      setData({ ...data, skills: newSkills });
                    }} />
                  </p>
                  <p className="text-[var(--text-color)]">
                    <EditableText isEditable={isEditMode} value={skill.description} onChange={val => {
                      const newSkills = [...data.skills];
                      newSkills[idx].description = val;
                      setData({ ...data, skills: newSkills });
                    }} multiline />
                  </p>
                </div>
              </div>
            ))}
            {isEditMode && (
              <div className="pl-12 mt-8">
                <button onClick={() => {
                  setData({ ...data, skills: [...data.skills, { id: 'skill-'+Date.now(), category: 'New Category', stack: 'Technologies', description: 'Description' }] });
                }} className="px-4 py-2 border-2 border-dashed border-[var(--primary-color)] text-[var(--primary-color)] rounded-lg hover:bg-[var(--primary-color)] hover:text-white transition-colors w-full">+ Add Skill</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="reveal bg-[var(--bg-secondary)] py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl text-center font-bold font-outfit mb-16 text-[var(--title-color)]">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className="bg-[var(--bg-primary)] rounded-2xl overflow-hidden shadow-lg border border-[var(--border-color)] flex flex-col group transition-transform hover:-translate-y-2 relative">
                {isEditMode && (
                  <button onClick={() => {
                    setData({ ...data, projects: data.projects.filter(p => p.id !== proj.id) });
                  }} className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"><i className="fas fa-trash text-sm"></i></button>
                )}
                <div className="h-48 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--border-color)] flex items-center justify-center text-6xl text-[var(--primary-color)] border-b border-[var(--border-color)] relative">
                  <i className={proj.icon}></i>
                  {isEditMode && (
                    <button onClick={() => setIconPickerProjectIdx(idx)} className="absolute bottom-2 right-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Change Icon</button>
                  )}
                  {iconPickerProjectIdx === idx && (
                    <IconPicker 
                      currentIcon={proj.icon}
                      onSelect={(icon) => {
                        const newProj = [...data.projects];
                        newProj[idx].icon = icon;
                        setData({ ...data, projects: newProj });
                        setIconPickerProjectIdx(null);
                      }}
                      onClose={() => setIconPickerProjectIdx(null)}
                    />
                  )}
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <EditableText isEditable={isEditMode} value={proj.title} onChange={val => {
                    const newProj = [...data.projects];
                    newProj[idx].title = val;
                    setData({ ...data, projects: newProj });
                  }} as="h3" className="text-2xl font-bold mb-2 text-[var(--title-color)]" />
                  <p className="text-[var(--primary-color)] font-bold text-sm mb-4 bg-[var(--primary-color)]/10 self-start px-3 py-1 rounded-full">
                    <EditableText isEditable={isEditMode} value={proj.tech} onChange={val => {
                      const newProj = [...data.projects];
                      newProj[idx].tech = val;
                      setData({ ...data, projects: newProj });
                    }} />
                  </p>
                  <p className="text-[var(--text-color)] mb-6 flex-1">
                    <EditableText isEditable={isEditMode} value={proj.description} onChange={val => {
                      const newProj = [...data.projects];
                      newProj[idx].description = val;
                      setData({ ...data, projects: newProj });
                    }} multiline />
                  </p>
                  <div className="flex gap-4 border-t border-[var(--border-color)] pt-6">
                    <a href={proj.codeLink} className="text-[var(--text-color)] hover:text-[var(--primary-color)] font-semibold flex items-center gap-2" onClick={(e) => {
                      if(!isEditMode) return;
                      e.preventDefault();
                      const link = prompt("Enter Code Link URL", proj.codeLink);
                      if (link) {
                        const newProj = [...data.projects];
                        newProj[idx].codeLink = link;
                        setData({ ...data, projects: newProj });
                      }
                    }}><i className="fab fa-github"></i> Code</a>
                    <a href={proj.demoLink} className="text-[var(--text-color)] hover:text-[var(--primary-color)] font-semibold flex items-center gap-2" onClick={(e) => {
                      if(!isEditMode) return;
                      e.preventDefault();
                      const link = prompt("Enter Demo Link URL", proj.demoLink);
                      if (link) {
                        const newProj = [...data.projects];
                        newProj[idx].demoLink = link;
                        setData({ ...data, projects: newProj });
                      }
                    }}><i className="fas fa-external-link-alt"></i> Live Demo</a>
                  </div>
                </div>
              </div>
            ))}
            {isEditMode && (
              <button onClick={() => {
                setData({ ...data, projects: [...data.projects, { id: 'proj-'+Date.now(), title: 'New Project', tech: 'Tech Stack', description: 'Description', codeLink: '#', demoLink: '#', icon: 'fas fa-code' }] });
              }} className="border-2 border-dashed border-[var(--border-color)] rounded-2xl flex items-center justify-center flex-col gap-4 text-[var(--text-color)] hover:text-[var(--primary-color)] hover:border-[var(--primary-color)] transition-colors h-full min-h-[400px]">
                <i className="fas fa-plus text-4xl"></i>
                <span className="font-bold text-xl">Add Project</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="reveal bg-[var(--bg-primary)] py-16 text-center border-t border-[var(--border-color)]">
        <h2 className="text-3xl font-bold font-outfit text-[var(--title-color)] mb-6">Get in <span className="text-[var(--primary-color)]">touch</span>.</h2>
        <div className="flex justify-center gap-6 mb-6">
          <a href="#" className="text-3xl text-[var(--text-color)] hover:text-[var(--primary-color)] transition-transform hover:-translate-y-1"><i className="fab fa-linkedin"></i></a>
          <a href="#" className="text-3xl text-[var(--text-color)] hover:text-[var(--primary-color)] transition-transform hover:-translate-y-1"><i className="fab fa-behance"></i></a>
          <a href="#" className="text-3xl text-[var(--text-color)] hover:text-[var(--primary-color)] transition-transform hover:-translate-y-1"><i className="fas fa-envelope"></i></a>
        </div>
        <p className="text-[var(--text-color)]">Interested in collaborating? <a href={`mailto:${data.hero.contact.email}`} className="text-[var(--primary-color)] font-bold">{data.hero.contact.email}</a></p>
      </footer>
    </div>
  );
};
