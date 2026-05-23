export interface Skill {
  name: string;
  current: number;
  target: number;
}

export interface SkillGap {
  id: string;
  type: 'critical' | 'market';
  tag: string;
  severity: string;
  title: string;
  desc: string;
}

export interface Feedback {
  id: string;
  author: string;
  role: string;
  time: string;
  content: string;
  type: 'positive' | 'warning' | 'info';
}

export interface DashboardData {
  overallProgress: number;
  currentPath: string;
  skills: Skill[];
  gaps: SkillGap[];
  feedbacks: Feedback[];
}
