export interface Project {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc?: string;
  tech: string[];
  category: 'ai' | 'web3' | 'security' | 'fullstack';
  githubUrl?: string;
  liveUrl?: string;
  iconName: string;
  featured?: boolean;
}

export interface SkillItem {
  name: string;
  deviconSlug?: string;
  usedIn?: string;
}

export interface SkillCategory {
  title: string;
  skills: SkillItem[];
  isWeb3Security?: boolean;
}

export interface TechnicalNote {
  id: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface GitHubStats {
  publicRepos: number;
  topLanguage: string;
  latestCommitDate: string;
  totalStars: number;
  loading: boolean;
  error?: string;
}

export interface RequirementAnalysis {
  score: number;
  vagueCount: number;
  totalWords: number;
  issues: {
    word: string;
    index: number;
    reason: string;
    suggestion: string;
    category: 'subjective' | 'ambiguous' | 'untestable';
  }[];
}
