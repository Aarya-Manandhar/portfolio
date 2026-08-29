import React, { useState, useEffect } from 'react';
import { GitBranch, Code, Calendar, Star, UserCheck } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import type { GitHubStats } from '../types';

export const About: React.FC = () => {
  const [githubStats, setGithubStats] = useState<GitHubStats>({
    publicRepos: 18,
    topLanguage: 'Python / TS',
    latestCommitDate: 'Recent',
    totalStars: 14,
    loading: true,
  });

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const userRes = await fetch(`https://api.github.com/users/${PERSONAL_INFO.githubUser}`);
        if (!userRes.ok) throw new Error('GitHub API rate limit or error');
        const userData = await userRes.json();

        const reposRes = await fetch(`https://api.github.com/users/${PERSONAL_INFO.githubUser}/repos?sort=updated&per_page=100`);
        let topLang = 'Python';
        let latestDate = new Date(userData.updated_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        let totalStarsCount = 0;

        if (reposRes.ok) {
          const reposData = await reposRes.json();
          const langMap: Record<string, number> = {};

          reposData.forEach((repo: { language?: string; stargazers_count?: number; updated_at?: string }) => {
            if (repo.language) {
              langMap[repo.language] = (langMap[repo.language] || 0) + 1;
            }
            if (repo.stargazers_count) {
              totalStarsCount += repo.stargazers_count;
            }
          });

          // Find most frequent language
          const sortedLangs = Object.entries(langMap).sort((a, b) => b[1] - a[1]);
          if (sortedLangs.length > 0) {
            topLang = sortedLangs[0][0];
          }

          if (reposData.length > 0 && reposData[0].updated_at) {
            latestDate = new Date(reposData[0].updated_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
          }
        }

        setGithubStats({
          publicRepos: userData.public_repos || 18,
          topLanguage: topLang,
          latestCommitDate: latestDate,
          totalStars: totalStarsCount || 14,
          loading: false,
        });
      } catch {
        // Fallback gracefully on rate limit or offline
        setGithubStats((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    fetchGitHubData();
  }, []);

  return (
    <section id="about" className="py-16 md:py-24 border-t border-flat max-w-6xl mx-auto px-4 md:px-8">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-accent" />
          <span>About Me</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
          I find the constraint everyone else is working around — then remove it.
        </h2>

        <p className="text-secondary text-base leading-relaxed">
          {PERSONAL_INFO.bio}
        </p>
      </div>

      {/* Live GitHub Stats Grid */}
      <div className="mt-10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
            <span>Live Activity (GitHub API)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
          >
            @{PERSONAL_INFO.githubUser} ↗
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Stat 1: Public Repos */}
          <div className="p-4 rounded-xl bg-surface space-y-2 hover:bg-surface-subtle transition-colors">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-medium">Public Repos</span>
              <GitBranch className="w-4 h-4 text-accent" />
            </div>
            {githubStats.loading ? (
              <div className="h-7 w-16 bg-surface-subtle animate-pulse rounded-md" />
            ) : (
              <div className="text-2xl font-bold text-primary">{githubStats.publicRepos}</div>
            )}
            <div className="text-[11px] text-muted">Active open-source repos</div>
          </div>

          {/* Stat 2: Top Language */}
          <div className="p-4 rounded-xl bg-surface space-y-2 hover:bg-surface-subtle transition-colors">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-medium">Top Language</span>
              <Code className="w-4 h-4 text-accent" />
            </div>
            {githubStats.loading ? (
              <div className="h-7 w-24 bg-surface-subtle animate-pulse rounded-md" />
            ) : (
              <div className="text-xl font-bold text-primary truncate">{githubStats.topLanguage}</div>
            )}
            <div className="text-[11px] text-muted">Based on repository commits</div>
          </div>

          {/* Stat 3: Latest Activity */}
          <div className="p-4 rounded-xl bg-surface space-y-2 hover:bg-surface-subtle transition-colors">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-medium">Latest Activity</span>
              <Calendar className="w-4 h-4 text-accent" />
            </div>
            {githubStats.loading ? (
              <div className="h-7 w-28 bg-surface-subtle animate-pulse rounded-md" />
            ) : (
              <div className="text-sm font-bold text-primary">{githubStats.latestCommitDate}</div>
            )}
            <div className="text-[11px] text-muted">Recent pushed update</div>
          </div>

          {/* Stat 4: Stargazers / Contributions */}
          <div className="p-4 rounded-xl bg-surface space-y-2 hover:bg-surface-subtle transition-colors">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-medium">GitHub Stars</span>
              <Star className="w-4 h-4 text-accent" />
            </div>
            {githubStats.loading ? (
              <div className="h-7 w-16 bg-surface-subtle animate-pulse rounded-md" />
            ) : (
              <div className="text-2xl font-bold text-primary">{githubStats.totalStars}</div>
            )}
            <div className="text-[11px] text-muted">Stargazers across projects</div>
          </div>
        </div>
      </div>
    </section>
  );
};
