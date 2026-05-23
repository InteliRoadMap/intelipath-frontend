import React from 'react';
import { BookOpen, Trophy, Lock, Layout, Database, MonitorPlay, Cpu, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SkillGapCard } from '../component/common/SkillGapCard';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration and redirection
    navigate('/login');
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden font-sans relative">
      
      {/* Left Column - Form */}
      <div className="w-[40%] flex flex-col h-full overflow-y-auto border-r border-gray-100 relative">
        <div className="absolute top-6 left-8 text-[#1E50FF] font-bold text-xl flex items-center gap-2">
          InteliPath
        </div>
        
        <div className="flex-grow flex items-center justify-center mt-12 p-8">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-[#1A1F36] mb-3">Create your account</h1>
            <p className="text-gray-500 mb-10">Join thousands of engineers building their future.</p>

            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E50FF]/20 focus:border-[#1E50FF] transition-all bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E50FF]/20 focus:border-[#1E50FF] transition-all bg-[#F8FAFC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E50FF]/20 focus:border-[#1E50FF] transition-all bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E50FF]/20 focus:border-[#1E50FF] transition-all bg-[#F8FAFC]"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 mt-4 bg-[#1E50FF] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
                GitHub
              </button>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-gray-500 text-sm">Already have an account? </span>
              <Link to="/login" className="text-[#1E50FF] text-sm font-bold hover:underline">Log In</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Dashboard Preview (Matches the image) */}
      <div className="w-[60%] bg-[#F4F7FB] h-full overflow-y-auto px-10 py-8 relative">
        
        {/* Floating Sidebar */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          <button className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500 hover:text-[#1E50FF] transition-colors">
            <BookOpen size={18} />
            <span className="text-[9px] mt-1 font-medium">Learn</span>
          </button>
          <button className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500 hover:text-[#1E50FF] transition-colors">
            <span className="text-[#1E50FF] mb-0.5"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg></span>
            <span className="text-[9px] font-medium text-[#1E50FF]">Track</span>
          </button>
          <button className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500 hover:text-[#1E50FF] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span className="text-[9px] mt-1 font-medium">Improve</span>
          </button>
          <button className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500 hover:text-[#1E50FF] transition-colors">
            <Trophy size={18} className="text-orange-400" />
            <span className="text-[9px] mt-1 font-medium">Achieve</span>
          </button>
        </div>

        {/* Header Header */}
        <div className="text-center mb-8 max-w-lg mx-auto">
          <div className="text-[#1E50FF] font-semibold mb-1 flex justify-center items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.5l7 14h-14l7-14z"/></svg>
            InteliPath
          </div>
          <h2 className="text-xl font-bold text-[#1A1F36]">
            AI-Powered Career Guidance
          </h2>
          <div className="text-lg font-medium mb-1">
            for <span className="text-[#1E50FF]">Software Engineering</span> Students
          </div>
          <p className="text-gray-500 text-xs">
            Your personalized roadmap to learn, grow and build your dream career.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto pr-10 pb-8">
          
          {/* Left Sub-column */}
          <div className="flex flex-col gap-4">
            
            {/* Skill Progress Horizontal */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 mb-4 uppercase tracking-wider">Skill Progress</h3>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center justify-center relative w-[72px] h-[72px] flex-shrink-0">
                  <div className="w-full h-full rounded-full border-4 border-gray-100 border-t-[#1E50FF] border-r-[#1E50FF] flex items-center justify-center transform -rotate-45">
                    <div className="transform rotate-45 flex flex-col items-center">
                      <span className="font-bold text-lg text-[#1E50FF]">75%</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 mt-1">Overall</span>
                </div>
                <div className="flex-grow space-y-2">
                  {[
                    { label: 'Frontend', val: 80 },
                    { label: 'Backend', val: 70 },
                    { label: 'Database', val: 60 },
                    { label: 'DevOps', val: 65 },
                    { label: 'System Design', val: 50 },
                  ].map((skill) => (
                    <div key={skill.label} className="flex items-center gap-3">
                       <span className="text-[10px] text-gray-600 w-20">{skill.label}</span>
                       <div className="flex-grow bg-gray-100 rounded-full h-1.5 overflow-hidden">
                         <div className="bg-[#1E50FF] h-full rounded-full" style={{ width: `${skill.val}%` }}></div>
                       </div>
                       <span className="text-[10px] text-gray-400 w-6 text-right">{skill.val}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill Gap Analysis */}
            <SkillGapCard />

            {/* Recommended */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 mb-4 uppercase tracking-wider">Recommended For You</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1E50FF]">
                    <Layout size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1A1F36]">System Design Basics</div>
                    <div className="text-[10px] text-gray-500">12 lessons</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1E50FF]">
                    <Database size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1A1F36]">Database Indexing</div>
                    <div className="text-[10px] text-gray-500">8 lessons</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1E50FF]">
                    <MonitorPlay size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1A1F36]">Docker Fundamentals</div>
                    <div className="text-[10px] text-gray-500">10 lessons</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sub-column */}
          <div className="flex flex-col gap-4">
            
            {/* Learning Roadmap Horizontal */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Your Learning Roadmap</h3>
                <span className="text-[#1E50FF] font-bold text-xs bg-blue-50 px-2 py-0.5 rounded text-[10px]">68%</span>
              </div>
              <div className="relative flex justify-between px-2 mb-2">
                <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-blue-100"></div>
                <div className="absolute top-2.5 left-4 w-1/2 h-0.5 bg-[#1E50FF]"></div>
                
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E50FF] flex items-center justify-center text-white border-2 border-white shadow-sm">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-[9px] text-gray-700 font-medium text-center">Fundamentals</span>
                </div>
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E50FF] flex items-center justify-center text-white border-2 border-white shadow-sm">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-[9px] text-gray-700 font-medium text-center">Frontend</span>
                </div>
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-[#1E50FF] flex items-center justify-center text-[#1E50FF] shadow-sm">
                    <span className="text-[10px] font-bold">4</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#1A1F36] text-center">Backend</span>
                </div>
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                    <Lock size={10} />
                  </div>
                  <span className="text-[9px] text-gray-400 text-center">DevOps</span>
                </div>
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                    <Lock size={10} />
                  </div>
                  <span className="text-[9px] text-gray-400 text-center leading-tight">System<br/>Design</span>
                </div>
              </div>
            </div>

            {/* Career Recommendation Wide */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center justify-center">
              <h3 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider w-full text-center">Career Recommendation</h3>
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#1E50FF] mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-9 3h2v2h-2v-2zm-4 0h2v2H7v-2zm0 4h10v2H7v-2z"></path><path d="M16 5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4v2h16V5h-4z"></path></svg>
              </div>
              <h4 className="font-bold text-sm text-[#1A1F36]">Backend Developer</h4>
              <div className="text-[#1E50FF] font-bold text-xs mt-1">95% Match</div>
              <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden max-w-[120px]">
                 <div className="bg-[#1E50FF] h-full" style={{width: '95%'}}></div>
              </div>
            </div>

            {/* AI Mentor Horizontal */}
            <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex items-start gap-4">
              <div className="flex-grow">
                 <h4 className="text-xs font-bold text-[#1A1F36] mb-1">Hi! I'm your AI Mentor.</h4>
                 <p className="text-gray-500 text-[10px] leading-relaxed">
                   I'll help you navigate your learning journey.
                 </p>
              </div>
            </div>

            {/* Abstract Developer Graphic Illustration Placeholder */}
            <div className="mt-auto pt-6 flex justify-center">
               <div className="relative w-48 h-32">
                 {/* Person */}
                 <div className="absolute bottom-0 left-4 z-20">
                    <div className="w-16 h-20 bg-blue-500 rounded-t-2xl shadow-lg border-2 border-blue-600 flex justify-center pt-2">
                       {/* Face */}
                       <div className="w-10 h-10 bg-amber-100 rounded-full border-2 border-amber-200"></div>
                    </div>
                 </div>
                 {/* Robot */}
                 <div className="absolute bottom-2 right-4 z-10 flex flex-col items-center gap-1">
                    <div className="w-12 h-10 bg-white rounded-[20px] shadow-sm border border-gray-200 flex items-center justify-center relative overflow-hidden">
                       <div className="w-8 h-4 bg-gray-900 rounded-full flex items-center justify-center gap-1">
                         <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                         <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                       </div>
                    </div>
                    <div className="w-10 h-12 bg-white rounded-t-3xl shadow-sm border border-gray-200 flex items-center justify-center">
                       <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-[8px]">AI</div>
                    </div>
                 </div>
                 {/* Laptop */}
                 <div className="absolute bottom-4 left-16 z-30">
                    <div className="w-20 h-12 bg-gray-900 rounded-md border-2 border-gray-700 flex flex-col p-1 gap-1">
                       <div className="w-full h-1 bg-[#1E50FF]"></div>
                       <div className="w-1/2 h-1 bg-green-400"></div>
                       <div className="w-3/4 h-1 bg-yellow-400"></div>
                       <div className="w-2/3 h-1 bg-purple-400"></div>
                    </div>
                    <div className="w-24 h-2 bg-gray-300 rounded-b-md absolute -bottom-1 -left-2"></div>
                 </div>
               </div>
            </div>

            {/* Bottom Stats Banner (Just a visual rep of the bottom strip in image) */}
            <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-80 backdrop-blur-md border-t border-gray-200 py-3 px-10 flex justify-between items-center z-30">
               <div className="flex flex-col items-center">
                 <div className="flex items-center gap-1 text-[#1E50FF] font-bold"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> 500+</div>
                 <div className="text-[9px] text-gray-500">AI Roadmaps</div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="flex items-center gap-1 text-[#1E50FF] font-bold"><GraduationCap size={14}/> 20K+</div>
                 <div className="text-[9px] text-gray-500">Students</div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="flex items-center gap-1 text-[#1E50FF] font-bold"><Trophy size={14}/> 95%</div>
                 <div className="text-[9px] text-gray-500">Success Rate</div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
