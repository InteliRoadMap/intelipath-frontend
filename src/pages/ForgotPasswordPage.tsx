import React from 'react';
import { BookOpen, GraduationCap, Trophy, Lock, Layout, Database, MonitorPlay, Cpu, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SkillGapCard } from '../component/common/SkillGapCard';

const ForgotPasswordPage = () => {
  return (
    <div className="h-screen bg-white flex overflow-hidden font-sans relative">
      
      {/* Left Column - Form */}
      <div className="w-[40%] flex flex-col h-full overflow-y-auto border-r border-gray-100 relative">
        <Link to="/" className="absolute top-6 left-8 text-[#1E50FF] font-bold text-xl flex items-center gap-2 hover:opacity-80 transition-opacity">
          InteliPath
        </Link>
        
        <div className="flex-grow flex items-center justify-center mt-12 p-8">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-[#1A1F36] mb-3">Forgot Password?</h1>
            <p className="text-gray-500 mb-10">Enter your email to receive password reset instructions.</p>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E50FF] transition-all bg-white"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-[#1E50FF] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Send Reset Link
              </button>
            </form>

            <div className="text-center mt-12">
              <Link to="/login" className="inline-flex items-center gap-2 text-[#1E50FF] font-bold hover:opacity-80 transition-opacity text-sm">
                <ArrowLeft size={18} strokeWidth={2.5} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Dashboard Preview (Exactly matches Login Page) */}
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
          <div className="text-[#1E50FF] font-semibold mb-1">InteliPath</div>
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
                    { label: 'Frontend', val: 60 },
                    { label: 'Backend', val: 70 },
                    { label: 'Database', val: 60 },
                    { label: 'DevOps', val: 65 },
                    { label: 'System Design', val: 50 },
                  ].map((skill) => (
                    <div key={skill.label} className="flex items-center gap-3">
                       <span className="text-[10px] text-gray-600 w-20">{skill.label}</span>
                       <div className="flex-grow bg-gray-100 rounded-full h-1">
                         <div className="bg-[#1E50FF] h-1 rounded-full" style={{ width: `${skill.val}%` }}></div>
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
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                    <Database size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1A1F36]">Database Indexing</div>
                    <div className="text-[10px] text-gray-500">8 lessons</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
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
                <span className="text-[#1E50FF] font-bold text-xs">68%</span>
              </div>
              <div className="relative flex justify-between px-2 mb-2">
                <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-blue-100"></div>
                <div className="absolute top-2.5 left-4 w-1/2 h-0.5 bg-[#1E50FF]"></div>
                
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E50FF] flex items-center justify-center text-white border-2 border-white shadow-sm">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-[9px] text-gray-500 text-center">Fundamentals</span>
                </div>
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E50FF] flex items-center justify-center text-white border-2 border-white shadow-sm">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-[9px] text-gray-500 text-center">Frontend</span>
                </div>
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-[#1E50FF] flex items-center justify-center text-[#1E50FF] shadow-sm">
                    <span className="text-[10px] font-bold">4</span>
                  </div>
                  <span className="text-[9px] font-medium text-gray-700 text-center">Backend</span>
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
                  <span className="text-[9px] text-gray-400 text-center">System Design</span>
                </div>
              </div>
            </div>

            {/* Career Recommendation Wide */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center justify-center">
              <h3 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider w-full text-center">Career Recommendation</h3>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1E50FF] mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-9 3h2v2h-2v-2zm-4 0h2v2H7v-2zm0 4h10v2H7v-2z"></path><path d="M16 5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4v2h16V5h-4z"></path></svg>
              </div>
              <h4 className="font-bold text-sm text-[#1A1F36]">Backend Developer</h4>
              <div className="text-[#1E50FF] font-bold text-xs mt-0.5">95% Match</div>
            </div>

            {/* AI Mentor Horizontal */}
            <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1E50FF] relative flex-shrink-0">
                <Cpu size={20} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white"></div>
              </div>
              <p className="text-[#1E50FF] text-[11px] font-medium leading-relaxed">
                Hi! I'm your AI mentor.
                I'll help you navigate your learning journey.
              </p>
            </div>

            {/* Abstract Developer Graphic Illustration Placeholder */}
            <div className="mt-auto pt-6 flex justify-center">
               <div className="relative w-48 h-32">
                 {/* Desk */}
                 <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-800 rounded-full"></div>
                 {/* Monitor 1 */}
                 <div className="absolute bottom-2 left-6 w-16 h-12 bg-gray-900 rounded-md border-2 border-gray-700 flex flex-col justify-between p-1">
                    <div className="w-full h-1.5 bg-blue-500 rounded-sm opacity-50"></div>
                    <div className="w-3/4 h-1.5 bg-green-500 rounded-sm opacity-50"></div>
                 </div>
                 <div className="absolute bottom-2 left-10 w-2 h-4 bg-gray-700"></div>
                 {/* Monitor 2 */}
                 <div className="absolute bottom-2 right-6 w-20 h-14 bg-gray-900 rounded-md border-2 border-gray-700 z-10 flex flex-col p-1 gap-1">
                    <div className="w-full h-1 bg-[#1E50FF]"></div>
                    <div className="w-1/2 h-1 bg-gray-600"></div>
                    <div className="w-3/4 h-1 bg-gray-600"></div>
                 </div>
                 <div className="absolute bottom-2 right-14 w-2 h-6 bg-gray-700"></div>
                 {/* Person */}
                 <div className="absolute bottom-1 left-2 z-20">
                    <div className="w-8 h-10 bg-[#1E50FF] rounded-t-xl"></div>
                    <div className="absolute -top-5 left-1 w-6 h-6 bg-blue-200 rounded-full"></div>
                 </div>
                 {/* Floating elements */}
                 <div className="absolute top-4 right-2 text-blue-500 font-mono text-xs font-bold">&lt;/&gt;</div>
                 <div className="absolute top-10 right-0 w-8 h-1 bg-red-400 rounded-full"></div>
                 <div className="absolute top-12 right-2 w-6 h-1 bg-yellow-400 rounded-full"></div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
