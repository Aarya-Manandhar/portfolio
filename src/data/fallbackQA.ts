
// even if offline or if network/API limits are reached.

import { PERSONAL_INFO, PROJECTS, EDUCATION } from './portfolioData';

export function getClientFallbackReply(query: string): string | null {
  const q = query.trim().toLowerCase();

  if (/^(aarya|aaray|arya|aary)[!.?,\s]*$/i.test(q)) {
    return "Hi! I'm Aarya's AI assistant. Ask me about his projects, skills, or experience.";
  }

  // Handle greetings and casual conversation before broad portfolio keywords.
  if (/^(hi+|hello|hey+|how are you\??|how's it going\??|what's up\??|khana khayo\??|khaana khayo\??|have you eaten\??|thanks?( you)?|thx|namaste)[!.?,\s]*$/i.test(q)) {
    if (/how are you|how's it going|what's up/i.test(q)) {
      return "I'm doing well, thanks for asking! I can help with Aarya's projects, skills, experience, or a job description. I'm an AI, so I don't eat, but I appreciate you asking!";
    }
    if (/khana|khaana|eaten/i.test(q)) {
      return "I don't eat, but thanks for asking! I'm here to help with Aarya's projects, skills, or experience.";
    }
    return "Hi! I can help with Aarya's projects, skills, experience, or screening a job description against his background.";
  }

  if (/(job\s*description|\bJD\b|screen\s+(this\s+)?(job|role)|match\s+(this\s+)?(job|role)|fit\s+for\s+(this|the)\s+(job|role)|resume\s+against)/i.test(q)) {
    return "I can compare a job description with Aarya's experience. Paste the full description, and I'll summarize the strongest matches and any requirements that aren't clearly covered by his background.";
  }

  if (/qa\s*suite|playwright|postman|jest|regression|end[-\s]?to[-\s]?end|api\s+test/i.test(q)) {
    return "Aarya built a QA Suite of end-to-end and API tests using Playwright, Postman collections, and Jest to catch regressions on critical user paths.";
  }

  if (/project|app|built|specsense|deadmanswitch|sajilogig|smart-tender|baa-ko-achar/i.test(q)) {
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

  return "I couldn't find that information in Aarya's portfolio. I can help with his role, projects, skills, QA Suite, or experience.";
}
