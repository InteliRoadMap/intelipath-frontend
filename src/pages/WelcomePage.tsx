import React from 'react';
import { Sparkles } from 'lucide-react';

import { Header } from '../component/layout/Header';
import { Footer } from '../component/layout/Footer';
import { SkillProgressCard } from '../component/common/SkillProgressCard';
import { RoadmapCard } from '../component/common/RoadmapCard';
import { MatchCard } from '../component/common/MatchCard';
import { RecommendedCard } from '../component/common/RecommendedCard';
import { MentorCard } from '../component/common/MentorCard';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-[#F8FAFF] to-[#EAF2FF] font-sans flex flex-col relative overflow-hidden">
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col lg:flex-row px-8 lg:px-16 py-12 max-w-7xl mx-auto w-full z-10">
        
        {/* Left Column (Hero Text) */}
        <div className="lg:w-5/12 flex flex-col justify-center pr-8 mb-12 lg:mb-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-100 bg-white shadow-sm mb-6 w-max">
            <Sparkles size={16} className="text-yellow-500" />
            <span className="text-sm font-medium text-[#1E50FF]">AI-Powered career guidance</span>
          </div>

          <h1 className="text-[2.75rem] font-bold text-[#1A1F36] leading-tight mb-6">
            Welcome to <br />
            <span className="text-[#1E50FF]">InteliPath</span>
          </h1>

          <p className="text-gray-400 text-base leading-relaxed mb-12 max-w-md">
            Navigate your learning journey and career path in AI-powered
            engineering. We use smart algorithms to analyze real-world
            market demand, helping you become a next-generation
            software engineer.
          </p>

          <div className="flex gap-10">
            <div>
              <div className="text-2xl font-bold text-[#1E50FF]">500+</div>
              <div className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">AI Roadmaps</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E50FF]">20K+</div>
              <div className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E50FF]">95%</div>
              <div className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Right Column (Cards / Features) */}
        <div className="lg:w-7/12 flex flex-col">
          {/* Header text for right side */}
          <div className="text-center mb-8">
            <div className="text-[#1E50FF] font-semibold mb-1">InteliPath</div>
            <h2 className="text-2xl font-bold text-[#1A1F36]">
              AI-Powered Career Guidance
            </h2>
            <div className="text-xl font-medium mb-2">
              for <span className="text-[#1E50FF]">Software Engineering</span> Students
            </div>
            <p className="text-gray-500 text-sm">
              Your personalized roadmap to learn, grow and build your dream career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkillProgressCard />

            <div className="flex flex-col gap-4">
              <RoadmapCard />
              <MatchCard />
            </div>

            <RecommendedCard />
            <MentorCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WelcomePage;
