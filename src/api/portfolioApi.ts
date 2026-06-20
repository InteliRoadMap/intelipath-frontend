import { mainClient, publicClient } from './apiClients';
import { ENDPOINTS } from './endpoints';

export interface PortfolioData {
  id: string;
  theme: 'dark' | 'light';
  themeColors: {
    primaryColor: string;
    titleColor: string;
    textColor: string;
    bgPrimary: string;
    bgSecondary: string;
    radius: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  hero: {
    title: string;
    greeting: string;
    name: string;
    role: string;
    description: string;
    objective: string;
    contact: Array<{
      id: string;
      type: string;
      value: string;
      icon: string;
    }>;
    avatarUrl: string;
  };
  education: Array<{
    id: string;
    university: string;
    degree: string;
    period: string;
    description: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    stack: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    tech: string;
    description: string;
    codeLink: string;
    demoLink: string;
    icon: string;
  }>;
  slug?: string;
  studentId?: string;
}

const defaultPortfolioData: PortfolioData = {
  id: 'new',
  theme: 'light',
  themeColors: {
    primaryColor: '#3b82f6',
    titleColor: '#0f172a',
    textColor: '#334155',
    bgPrimary: '#f8fafc',
    bgSecondary: '#ffffff',
    radius: '16px',
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Inter', sans-serif",
  },
  hero: {
    title: 'About me',
    greeting: 'Hi!',
    name: 'Student Name',
    role: 'Software Engineering',
    description: 'This is a brief description about the student.',
    objective: 'This is my bio...',
    contact: [
      { id: 'contact-1', type: 'Email', value: 'student@example.com', icon: 'fas fa-envelope' }
    ],
    avatarUrl: 'https://via.placeholder.com/150',
  },
  education: [],
  skills: [],
  projects: []
};

// Mapper from Backend PortfolioResponse to Frontend PortfolioData
const mapToFrontendData = (backendData: any): PortfolioData => {
  if (!backendData) return defaultPortfolioData;
  
  const uiData: PortfolioData = JSON.parse(JSON.stringify(defaultPortfolioData)); // deep clone
  
  // User Info mapping
  if (backendData.userInfo) {
    uiData.hero.name = backendData.userInfo.fullName || uiData.hero.name;
    uiData.hero.objective = backendData.userInfo.bio || uiData.hero.objective;
    uiData.slug = backendData.userInfo.portfolioSlug;
    
    // Update contact email if exists
    if (backendData.userInfo.email) {
      uiData.hero.contact[0].value = backendData.userInfo.email;
    }
  }

  // Config mapping
  if (backendData.config) {
    uiData.theme = backendData.config.theme || uiData.theme;
    if (backendData.config.themeColors) uiData.themeColors = { ...uiData.themeColors, ...backendData.config.themeColors };
    if (backendData.config.fonts) uiData.fonts = { ...uiData.fonts, ...backendData.config.fonts };
    if (backendData.config.heroSection) uiData.hero = { ...uiData.hero, ...backendData.config.heroSection };
  }

  // Projects
  if (backendData.projects && Array.isArray(backendData.projects)) {
    uiData.projects = backendData.projects.map((p: any) => ({
      id: p.projectId || `proj-${Date.now()}-${Math.random()}`,
      title: p.projectName || 'Untitled',
      tech: (() => {
        if (!p.techStack) return 'Tech Stack';
        
        // Helper to recursively parse JSON if it's a string
        const deepParse = (val: any): any => {
          if (typeof val === 'string') {
            try {
              const parsed = JSON.parse(val);
              // Only return parsed if it's an object or array to avoid infinite loops on primitive strings
              if (parsed && typeof parsed === 'object') {
                return deepParse(parsed);
              }
            } catch (e) {
              return val;
            }
          }
          if (val && typeof val === 'object' && val.text) {
             return deepParse(val.text);
          }
          return val;
        };

        const cleaned = deepParse(p.techStack);
        
        if (typeof cleaned === 'string') return cleaned;
        if (typeof cleaned === 'object' && cleaned !== null) {
          return Object.values(cleaned).flat().join(', ');
        }
        
        return 'Tech Stack';
      })(),
      description: p.description || '',
      codeLink: p.repoUrl || '#',
      demoLink: p.demoUrl || '#',
      icon: p.icon || 'fas fa-code'
    }));
  }

  // Education
  if (backendData.education && Array.isArray(backendData.education)) {
    uiData.education = backendData.education.map((e: any) => ({
      id: e.educationId || `edu-${Date.now()}-${Math.random()}`,
      university: e.university || '',
      degree: e.degree || '',
      period: e.period || '',
      description: e.description || ''
    }));
  }

  // Skills
  if (backendData.skills && Array.isArray(backendData.skills)) {
    uiData.skills = backendData.skills.map((s: any, idx: number) => ({
      id: `skill-${idx}`,
      category: s.skillName || 'Skill',
      stack: s.techStack || '',
      description: s.customDescription || ''
    }));
  }

  return uiData;
};

// Mapper from Frontend PortfolioData to Backend PortfolioUpsertRequest
const mapToBackendRequest = (uiData: PortfolioData): any => {
  return {
    config: {
      theme: uiData.theme,
      themeColors: uiData.themeColors,
      fonts: uiData.fonts,
      heroSection: uiData.hero,
      skillsSection: null
    },
    projects: uiData.projects.map(p => ({
      projectName: p.title,
      repoUrl: p.codeLink,
      demoUrl: p.demoLink,
      description: p.description,
      techStack: { text: p.tech }, // Map string back to object if necessary
      icon: p.icon,
      stars: 0
    })),
    education: uiData.education.map(e => ({
      university: e.university,
      degree: e.degree,
      period: e.period,
      description: e.description
    }))
  };
};

export const portfolioApi = {
  getPortfolio: async (): Promise<PortfolioData> => {
    try {
      const response = await mainClient.get(ENDPOINTS.STUDENT.PORTFOLIO_ME);
      return mapToFrontendData(response.data);
    } catch (error) {
      console.error('Failed to fetch portfolio', error);
      return defaultPortfolioData; // fallback
    }
  },

  updatePortfolio: async (data: PortfolioData): Promise<void> => {
    try {
      const requestPayload = mapToBackendRequest(data);
      await mainClient.put(ENDPOINTS.STUDENT.PORTFOLIO_ME, requestPayload);
    } catch (error) {
      console.error('Failed to update portfolio', error);
      throw error;
    }
  },

  getPublicPortfolio: async (slug: string): Promise<PortfolioData | null> => {
    try {
      // Calling the backend to get the public portfolio by slug
      // If the endpoint differs, it can be updated here.
      const response = await publicClient.get(`/public/portfolio/${slug}`);
      return mapToFrontendData(response.data);
    } catch (error) {
      console.error('Failed to fetch public portfolio', error);
      return null;
    }
  },

  updateSlug: async (slug: string): Promise<void> => {
    try {
      await mainClient.put(ENDPOINTS.STUDENT.PORTFOLIO_SLUG, { slug });
    } catch (error) {
      console.error('Failed to update slug', error);
      throw error;
    }
  },

  checkSlugAvailability: async (slug: string): Promise<boolean> => {
    try {
      // Typically, an endpoint like GET /student/portfolio/slug/check?slug=...
      // For now, if BE doesn't have it, we assume this endpoint will return { available: boolean }
      // Or it returns 200 OK if available, 409 if taken.
      const response = await mainClient.get(`${ENDPOINTS.STUDENT.PORTFOLIO_SLUG}/check`, { params: { slug } });
      // Depending on BE format, adjust this. Assuming { available: true }
      return response.data?.available !== false;
    } catch (error: any) {
      // If it throws 409 Conflict, it means taken
      if (error.response?.status === 409) {
        return false;
      }
      // If endpoint doesn't exist yet (404), just assume it's true to not block the UI for now
      return true;
    }
  },

  importGithubProject: async (repoUrl: string) => {
    const res = await mainClient.post(ENDPOINTS.STUDENT.PORTFOLIO_GITHUB_IMPORT, { repoUrl });
    return res.data;
  }
};
