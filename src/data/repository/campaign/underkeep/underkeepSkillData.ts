const baseUrl = "https://druna-assets.s3.us-east-2.amazonaws.com/CampaignTracker/hero_skills/underkeep_S1";

export interface SkillCard {
  id: string;
  heroId: string;
  skillType: 'melee' | 'ranged' | 'agility' | 'wisdom';
  name: string;
  image: string;
}

export const underkeepSkillCards: SkillCard[] = [
  // ==========================================
  // Herói: Elros
  // ==========================================
  { id: 'elros-melee-1', heroId: 'elros', skillType: 'melee', name: 'Elros Melee Lv1', image: `${baseUrl}/elros-melee-1.png` },
  { id: 'elros-melee-2', heroId: 'elros', skillType: 'melee', name: 'Elros Melee Lv2', image: `${baseUrl}/elros-melee-2.png` },
  { id: 'elros-ranged-1', heroId: 'elros', skillType: 'ranged', name: 'Elros Ranged Lv1', image: `${baseUrl}/elros-ranged-1.png` },
  { id: 'elros-ranged-2', heroId: 'elros', skillType: 'ranged', name: 'Elros Ranged Lv2', image: `${baseUrl}/elros-ranged-2.png` },
  { id: 'elros-agility-1', heroId: 'elros', skillType: 'agility', name: 'Elros Agility Lv1', image: `${baseUrl}/elros-agility-1.png` },
  { id: 'elros-agility-2', heroId: 'elros', skillType: 'agility', name: 'Elros Agility Lv2', image: `${baseUrl}/elros-agility-2.png` },
  { id: 'elros-wisdom-1', heroId: 'elros', skillType: 'wisdom', name: 'Elros Wisdom Lv1', image: `${baseUrl}/elros-wisdom-1.png` },
  { id: 'elros-wisdom-2', heroId: 'elros', skillType: 'wisdom', name: 'Elros Wisdom Lv2', image: `${baseUrl}/elros-wisdom-2.png` },

  // ==========================================
  // Herói: Vorn
  // ==========================================
  { id: 'vorn-melee-1', heroId: 'vorn', skillType: 'melee', name: 'Vorn Melee Lv1', image: `${baseUrl}/vorn-melee-1.png` },
  { id: 'vorn-melee-2', heroId: 'vorn', skillType: 'melee', name: 'Vorn Melee Lv2', image: `${baseUrl}/vorn-melee-2.png` },
  { id: 'vorn-ranged-1', heroId: 'vorn', skillType: 'ranged', name: 'Vorn Ranged Lv1', image: `${baseUrl}/vorn-ranged-1.png` },
  { id: 'vorn-ranged-2', heroId: 'vorn', skillType: 'ranged', name: 'Vorn Ranged Lv2', image: `${baseUrl}/vorn-ranged-2.png` },
  { id: 'vorn-agility-1', heroId: 'vorn', skillType: 'agility', name: 'Vorn Agility Lv1', image: `${baseUrl}/vorn-agility-1.png` },
  { id: 'vorn-agility-2', heroId: 'vorn', skillType: 'agility', name: 'Vorn Agility Lv2', image: `${baseUrl}/vorn-agility-2.png` },
  { id: 'vorn-wisdom-1', heroId: 'vorn', skillType: 'wisdom', name: 'Vorn Wisdom Lv1', image: `${baseUrl}/vorn-wisdom-1.png` },
  { id: 'vorn-wisdom-2', heroId: 'vorn', skillType: 'wisdom', name: 'Vorn Wisdom Lv2', image: `${baseUrl}/vorn-wisdom-2.png` },

  // ==========================================
  // Heroína: Lorelai
  // ==========================================
  { id: 'lorelai-melee-1', heroId: 'lorelai', skillType: 'melee', name: 'Lorelai Melee Lv1', image: `${baseUrl}/lorelai-melee-1.png` },
  { id: 'lorelai-melee-2', heroId: 'lorelai', skillType: 'melee', name: 'Lorelai Melee Lv2', image: `${baseUrl}/lorelai-melee-2.png` },
  { id: 'lorelai-ranged-1', heroId: 'lorelai', skillType: 'ranged', name: 'Lorelai Ranged Lv1', image: `${baseUrl}/lorelai-ranged-1.png` },
  { id: 'lorelai-ranged-2', heroId: 'lorelai', skillType: 'ranged', name: 'Lorelai Ranged Lv2', image: `${baseUrl}/lorelai-ranged-2.png` },
  { id: 'lorelai-agility-1', heroId: 'lorelai', skillType: 'agility', name: 'Lorelai Agility Lv1', image: `${baseUrl}/lorelai-agility-1.png` },
  { id: 'lorelai-agility-2', heroId: 'lorelai', skillType: 'agility', name: 'Lorelai Agility Lv2', image: `${baseUrl}/lorelai-agility-2.png` },
  { id: 'lorelai-wisdom-1', heroId: 'lorelai', skillType: 'wisdom', name: 'Lorelai Wisdom Lv1', image: `${baseUrl}/lorelai-wisdom-1.png` },
  { id: 'lorelai-wisdom-2', heroId: 'lorelai', skillType: 'wisdom', name: 'Lorelai Wisdom Lv2', image: `${baseUrl}/lorelai-wisdom-2.png` },

  // ==========================================
  // Heroína: Maya
  // ==========================================
  { id: 'maya-melee-1', heroId: 'maya', skillType: 'melee', name: 'Maya Melee Lv1', image: `${baseUrl}/maya-melee-1.png` },
  { id: 'maya-melee-2', heroId: 'maya', skillType: 'melee', name: 'Maya Melee Lv2', image: `${baseUrl}/maya-melee-2.png` },
  { id: 'maya-ranged-1', heroId: 'maya', skillType: 'ranged', name: 'Maya Ranged Lv1', image: `${baseUrl}/maya-ranged-1.png` },
  { id: 'maya-ranged-2', heroId: 'maya', skillType: 'ranged', name: 'Maya Ranged Lv2', image: `${baseUrl}/maya-ranged-2.png` },
  { id: 'maya-agility-1', heroId: 'maya', skillType: 'agility', name: 'Maya Agility Lv1', image: `${baseUrl}/maya-agility-1.png` },
  { id: 'maya-agility-2', heroId: 'maya', skillType: 'agility', name: 'Maya Agility Lv2', image: `${baseUrl}/maya-agility-2.png` },
  { id: 'maya-wisdom-1', heroId: 'maya', skillType: 'wisdom', name: 'Maya Wisdom Lv1', image: `${baseUrl}/maya-wisdom-1.png` },
  { id: 'maya-wisdom-2', heroId: 'maya', skillType: 'wisdom', name: 'Maya Wisdom Lv2', image: `${baseUrl}/maya-wisdom-2.png` },

  // ==========================================
  // Herói: Jaheen
  // ==========================================
  { id: 'jaheen-melee-1', heroId: 'jaheen', skillType: 'melee', name: 'Jaheen Melee Lv1', image: `${baseUrl}/jaheen-melee-1.png` },
  { id: 'jaheen-melee-2', heroId: 'jaheen', skillType: 'melee', name: 'Jaheen Melee Lv2', image: `${baseUrl}/jaheen-melee-2.png` },
  { id: 'jaheen-ranged-1', heroId: 'jaheen', skillType: 'ranged', name: 'Jaheen Ranged Lv1', image: `${baseUrl}/jaheen-ranged-1.png` },
  { id: 'jaheen-ranged-2', heroId: 'jaheen', skillType: 'ranged', name: 'Jaheen Ranged Lv2', image: `${baseUrl}/jaheen-ranged-2.png` },
  { id: 'jaheen-agility-1', heroId: 'jaheen', skillType: 'agility', name: 'Jaheen Agility Lv1', image: `${baseUrl}/jaheen-agility-1.png` },
  { id: 'jaheen-agility-2', heroId: 'jaheen', skillType: 'agility', name: 'Jaheen Agility Lv2', image: `${baseUrl}/jaheen-agility-2.png` },
  { id: 'jaheen-wisdom-1', heroId: 'jaheen', skillType: 'wisdom', name: 'Jaheen Wisdom Lv1', image: `${baseUrl}/jaheen-wisdom-1.png` },
  { id: 'jaheen-wisdom-2', heroId: 'jaheen', skillType: 'wisdom', name: 'Jaheen Wisdom Lv2', image: `${baseUrl}/jaheen-wisdom-2.png` },
];

/**
 * @param heroId 
 * @param skillType 
 * @returns 
 */
export function findSkillsFor(heroId: string, skillType: 'melee' | 'ranged' | 'agility' | 'wisdom'): SkillCard[] {
  return underkeepSkillCards.filter(card => card.heroId === heroId && card.skillType === skillType);
}