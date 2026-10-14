// src/data/fallbackQA.ts
// Client-side fallback that guarantees an intelligent, factual answer
// even if offline or if network/API limits are reached.

import { PERSONAL_INFO, PROJECTS, EDUCATION } from './portfolioData';

export function getClientFallbackReply(query: string): string | null {
  const q = query.trim().toLowerCase();

  // Projects & Apps
  if (/project|app|work|built|specsense|deadmanswitch|sajilogig|smart-tender|baa-ko-achar/i.test(q)) {
    const featuredList = PROJECTS.slice(0, 3).map((p) => p.name).join(', ');
    return `Aarya has built 8 projects including ${featuredList}. You can explore the full showcase below. [ACTION:navigate:projects]`;
  }

  // SpecSense AI
  if (/specsense/i.test(q)) {
    return `SpecSense AI is Aarya's featured NLP project that checks SRS requirement documents for untestable or ambiguous language. [ACTION:navigate:case-study]`;
  }

  // Education / Graduation
  if (/educat|degree|university|college|graduat|csit|tribhuvan/i.test(q)) {
    return `Aarya is enrolled in the ${EDUCATION.degree} program at ${EDUCATION.institution} (${EDUCATION.completionLabel}). [ACTION:navigate:education]`;
  }

  // Role / Job / Internship
  if (/intern|job|work|nabil|role|current|position/i.test(q)) {
    return `Aarya is currently an ${PERSONAL_INFO.currentRole}, building software and AI systems.`;
  }

  // Contact / Hire
  if (/contact|email|reach|hire|available|availability|resume|cv/i.test(q)) {
    return `You can reach Aarya at ${PERSONAL_INFO.email} or connect via GitHub and LinkedIn. [ACTION:navigate:contact]`;
  }

  // Skills / Stack
  if (/skill|stack|tech|python|react|java|php|web3|fastapi/i.test(q)) {
    const tech = PERSONAL_INFO.skillsQuickStrip.join(', ');
    return `Aarya's core technical stack includes ${tech}, along with FastAPI, TypeScript, and database engineering.`;
  }

  // About / Bio
  if (/who|about|background|bio/i.test(q)) {
    return `${PERSONAL_INFO.name} is a full-stack developer with experience in AI tools, backend architectures, and Web3 systems. [ACTION:navigate:about]`;
  }

  // Theme / Dark mode
  if (/dark|light|theme/i.test(q)) {
    return `Toggling portfolio theme now. [ACTION:theme:toggle]`;
  }

  return `I don't have that specific detail right now. Feel free to explore his projects or reach out directly via the Contact section. [ACTION:navigate:contact]`;
}
