
// even if offline or if network/API limits are reached.

import { PERSONAL_INFO, PROJECTS, EDUCATION } from './portfolioData';

export function getClientFallbackReply(query: string): string | null {
  const q = query.trim().toLowerCase();


  if (/project|app|work|built|specsense|deadmanswitch|sajilogig|smart-tender|baa-ko-achar/i.test(q)) {
    const featuredList = PROJECTS.slice(0, 3).map((p) => p.name).join(', ');
    return `Aarya has built 8 projects including ${featuredList}. You can explore the full showcase below. [ACTION:navigate:projects]`;
  }

  if (/case\s*stud/i.test(q)) {
    return `Aarya has in-depth engineering case studies covering SpecSense AI, SajiloGig, and DeadManSwitch. Exploring the showcase below. [ACTION:navigate:case-study]`;
  }

  if (/specsense/i.test(q)) {
    return `SpecSense AI is Aarya's featured NLP project that checks SRS requirement documents for untestable or ambiguous language. [ACTION:navigate:case-study]`;
  }

  if (/educat|degree|university|college|graduat|csit|tribhuvan/i.test(q)) {
    return `Aarya is enrolled in the ${EDUCATION.degree} program at ${EDUCATION.institution} (${EDUCATION.completionLabel}). [ACTION:navigate:education]`;
  }

  if (/intern|job|work|nabil|role|current|position/i.test(q)) {
    return `Aarya is currently an ${PERSONAL_INFO.currentRole}, building software and AI systems.`;
  }

  if (/linkedin/i.test(q)) {
    return `Connect with Aarya on LinkedIn: [LinkedIn – Aarya Manandhar](${PERSONAL_INFO.linkedinUrl})`;
  }

  if (/github/i.test(q)) {
    return `Explore Aarya's open-source work on GitHub: [GitHub – ${PERSONAL_INFO.githubUser}](${PERSONAL_INFO.githubUrl})`;
  }

  if (/resume|cv|download/i.test(q)) {
    return `You can download Aarya's CV here: [Download Resume](/resume.pdf)\n\nOr jump to the contact section for more ways to connect. [ACTION:navigate:contact]`;
  }

  if (/contact|email|reach|hire|available|availability/i.test(q)) {
    return `Here's how to reach Aarya:\n\n📧 Email: [${PERSONAL_INFO.displayEmail}](mailto:${PERSONAL_INFO.email})\n🔗 LinkedIn: [linkedin.com/in/aaryamanandhar](${PERSONAL_INFO.linkedinUrl})\n🐙 GitHub: [github.com/Aarya-Manandhar](${PERSONAL_INFO.githubUrl})\n\n${PERSONAL_INFO.responsePledge}. [ACTION:navigate:contact]`;
  }

  if (/deployment|live|demo|running/i.test(q)) {
    return `Aarya has active live deployments showcase below, including web applications and tools. [ACTION:navigate:deployments]`;
  }

  if (/skill|stack|tech|python|react|java|php|web3|fastapi/i.test(q)) {
    const tech = PERSONAL_INFO.skillsQuickStrip.join(', ');
    return `Aarya's core technical stack includes ${tech}, along with FastAPI, TypeScript, and database engineering. [ACTION:navigate:skills]`;
  }

  if (/who|about|background|bio/i.test(q)) {
    return `${PERSONAL_INFO.name} is a full-stack developer with experience in AI tools, backend architectures, and Web3 systems. [ACTION:navigate:about]`;
  }

  if (/dark|light|theme/i.test(q)) {
    return `Toggling portfolio theme now. [ACTION:theme:toggle]`;
  }

  return `I don't have that specific detail right now. Feel free to explore his projects or reach out directly:\n\n📧 [${PERSONAL_INFO.displayEmail}](mailto:${PERSONAL_INFO.email}) · 🔗 [LinkedIn](${PERSONAL_INFO.linkedinUrl}) · 🐙 [GitHub](${PERSONAL_INFO.githubUrl}) [ACTION:navigate:contact]`;
}
