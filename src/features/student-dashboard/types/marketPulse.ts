export interface Company {
  company_id: string;
  company_link: string;
  logo: string;
  name: string;
  introduction: Record<string, any>;
  info: Record<string, any>;
  contact: Record<string, any>;
}

export interface Recruitment {
  recruitment_id: string;
  recruitment_link: string;
  title: string;
  salary: string;
  location: string;
  experience: string;
  application_deadline: string; // ISO Date string
  tags: string[];
  descriptions: Record<string, any>;
  general_infos: Record<string, any>;
  related_tags: string[];
}

export interface RecruitmentPost {
  post_id: string;
  company_id: string;
  recruitment_id: string;
  company?: Company;
  recruitment?: Recruitment;
}

export interface TopCompany {
  topCvCompanyId?: string;
  name: string;
  logo: string;
  companyLink: string;
  recruitmentCount: number;
}

export interface SkillDataPoint {
  date: string;
  jobsNeeded: number;
}

export interface SkillTrend {
  skillName: string;
  dataPoints: SkillDataPoint[];
}

export interface SalaryBracket {
  category: string;
  jobCount: number;
}
