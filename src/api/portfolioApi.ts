export interface PortfolioData {
  id: string;
  theme: 'dark' | 'light';
  themeColors: {
    primaryColor: string;
    titleColor: string;
    textColor: string;
    bgPrimary: string;
    bgSecondary: string;
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
}

// Mock Database
let mockPortfolioData: PortfolioData = {
  id: 'portfolio-1', // from users.user_id
  theme: 'dark',
  themeColors: {
    primaryColor: '#a78bfa',
    titleColor: '#f8fafc',
    textColor: '#cbd5e1',
    bgPrimary: '#0d0f17',
    bgSecondary: '#151722',
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Inter', sans-serif",
  },
  hero: {
    title: 'About me',
    greeting: 'Hi!',
    name: 'Student Name', // Maps to users.full_name
    role: 'Software Engineering', // Maps to students.major
    description: 'based in the US with experience in building elegant, accessible, and high-performance user interfaces.',
    objective: 'This is my bio...', // Maps to users.bio
    contact: [
      { id: 'contact-1', type: 'Email', value: 'student@example.com', icon: 'fas fa-envelope' }
    ],
    avatarUrl: 'https://via.placeholder.com/150',
  },
  education: [], // Initially empty. In reality, BE could prepopulate 1 item from `students` (university, major, year_of_admission)
  skills: [], // Maps to student_skills -> skills
  projects: [] // Maps to portfolio_project
};

export const portfolioApi = {
  getPortfolio: async (): Promise<PortfolioData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPortfolioData);
      }, 500); // Simulate network delay
    });
  },

  updatePortfolio: async (data: PortfolioData): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockPortfolioData = { ...data };
        console.log('API: Successfully saved portfolio data to DB', mockPortfolioData);
        resolve();
      }, 300); // Simulate network delay
    });
  }
};
