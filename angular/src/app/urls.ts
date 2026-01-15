import { HOME } from "@angular/cdk/keycodes";

const DASH_URL = 'http://localhost:5000';
const CHAT_URL = 'http://localhost:5000';
const AI_URL = 'http://127.0.0.1:8000'; // FastAPI endpoint, port 8000

export const URLS = {
  // GREETING: `${DASH_URL}/greeting`,
  DASHBOARD: `${DASH_URL}/dashboard`,
  CHAT: `${CHAT_URL}/chat`,
  AI: `${AI_URL}/assistant`, 

  HOME_DASH: `${DASH_URL}/home-dashboard`,
  GAMEPLAY_DASH: `${DASH_URL}/gameplay-dashboard`,
  LORE_DASH: `${DASH_URL}/lore-dashboard`,
  NOVEL_DASH: `${DASH_URL}/novel-dashboard`,
  SCREENPLAY_DASH: `${DASH_URL}/screenplay-dashboard`,
  TIMELINE_DASH: `${DASH_URL}/timeline-dashboard`,

  HOME_CHAT: `${CHAT_URL}/home-chat`,
  GAMEPLAY_CHAT: `${CHAT_URL}/gameplay-chat`,
  LORE_CHAT: `${CHAT_URL}/lore-chat`,
  NOVEL_CHAT: `${CHAT_URL}/novel-chat`,
  SCREENPLAY_CHAT: `${CHAT_URL}/screenplay-chat`,
  TIMELINE_CHAT: `${CHAT_URL}/timeline-chat`,

  GAMEPLAY_AI: `${AI_URL}/gameplay`,
  LORE_AI: `${AI_URL}/lore`,
  NOVEL_AI: `${AI_URL}/novel`,
  SCREENPLAY_AI: `${AI_URL}/screenplay`,
  TIMELINE_AI: `${AI_URL}/timeline`,
};




