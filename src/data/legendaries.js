/**
 * GW2 第一代傳奇武器製作材料需求資料
 * 資料來源：GW2 官方 Wiki (wiki.guildwars2.com/wiki/Legendary_weapon)
 *
 * 物品 ID 參考 GW2 官方 API /v2/items
 * category 說明:
 *   'fortune'  - Gift of Fortune 幸運禮物相關
 *   'mastery'  - Gift of Mastery 精通禮物相關
 *   'specific' - 傳奇武器特定禮物相關
 *   'unlock'   - 解鎖類（無法從背包/倉庫追蹤）
 */

// ── Gift of Fortune 共通材料（所有第一代傳奇武器相同）──────────────────────
// Gift of Magic 材料
const GIFT_OF_MAGIC = [
  { id: 24295, name: 'Vial of Powerful Blood', qty: 250, category: 'fortune' },
  { id: 24283, name: 'Powerful Venom Sac',     qty: 250, category: 'fortune' },
  { id: 24300, name: 'Elaborate Totem',         qty: 250, category: 'fortune' },
  { id: 24277, name: 'Pile of Crystalline Dust',qty: 250, category: 'fortune' },
]

// Gift of Might 材料
const GIFT_OF_MIGHT = [
  { id: 24357, name: 'Vicious Fang',   qty: 250, category: 'fortune' },
  { id: 24289, name: 'Armored Scale',  qty: 250, category: 'fortune' },
  { id: 24351, name: 'Vicious Claw',   qty: 250, category: 'fortune' },
  { id: 24358, name: 'Ancient Bone',   qty: 250, category: 'fortune' },
]

const GIFT_OF_FORTUNE_MATERIALS = [
  { id: 19675, name: 'Mystic Clover',       qty: 77,  category: 'fortune',
    note: '可由 Mystic Forge 合成（約需 250 神秘幣 + 250 Ectos + 250 黑曜石碎片 + 150 靈魂碎片）' },
  { id: 19721, name: 'Glob of Ectoplasm',   qty: 250, category: 'fortune' },
  ...GIFT_OF_MAGIC,
  ...GIFT_OF_MIGHT,
]

// ── Gift of Mastery 共通材料（所有第一代傳奇武器相同）──────────────────────
const GIFT_OF_MASTERY_MATERIALS = [
  { id: 68646, name: 'Bloodstone Shard',   qty: 1,   category: 'mastery',
    note: '向 Miyani 以 200 Spirit Shards 購買' },
  { id: 19701, name: 'Obsidian Shard',     qty: 250, category: 'mastery' },
  { id: 19651, name: 'Gift of Battle',     qty: 1,   category: 'mastery',
    note: '完成 WvW Gift of Battle Reward Track' },
  { id: null,  name: 'Gift of Exploration', qty: 1,  category: 'unlock',
    note: '世界地圖完成度 100%' },
]

// ── 每把傳奇武器的特定禮物共通材料 ──────────────────────────────────────────
// 大多數第一代傳奇武器的 Specific Gift 都需要以下材料：
//   - 100x Icy Runestone（向 Rojan the Penitent 購買，共 100 金）
//   - 1x Gift of Metal / Gift of Wood / Gift of Energy（依武器種類）
//   - 1x 主題禮物（含地城禮物，以 500 Tales of Dungeon Delving 購買）
// 因各武器差異較大，specific 材料以 note 方式標記，不做數量追蹤

// ── Gen 1 傳奇武器列表 ──────────────────────────────────────────────────────
export const LEGENDARIES = [
  {
    id: 30685,
    name: 'Twilight',
    nameTw: '暮光',
    slot: '雙手大劍',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/Twilight',
    precursor: { name: 'Dusk', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of Twilight', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Metal + 主題禮物，詳見 Wiki' },
    ],
    achievements: [
      { id: 1714, name: 'Twilight I: The Experimental Sword',    done: false, wikiUrl: 'https://wiki.guildwars2.com/wiki/Twilight_I' },
      { id: 1723, name: 'Twilight II: The Dusk',                 done: false, wikiUrl: 'https://wiki.guildwars2.com/wiki/Twilight_II' },
      { id: 1716, name: 'Twilight III: The Perfected Sword',     done: false, wikiUrl: 'https://wiki.guildwars2.com/wiki/Twilight_III' },
    ],
  },
  {
    id: 30684,
    name: 'Sunrise',
    nameTw: '旭日',
    slot: '雙手大劍',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/Sunrise',
    precursor: { name: 'Dawn', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of Sunrise', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Metal + 主題禮物，詳見 Wiki' },
    ],
    achievements: [
      { id: 1802, name: 'Sunrise I: The Experimental Sword',  done: false, wikiUrl: 'https://wiki.guildwars2.com/wiki/Sunrise_I' },
      { id: 1803, name: 'Sunrise II: The Dawn',              done: false, wikiUrl: 'https://wiki.guildwars2.com/wiki/Sunrise_II' },
      { id: 1804, name: 'Sunrise III: The Perfected Sword',  done: false, wikiUrl: 'https://wiki.guildwars2.com/wiki/Sunrise_III' },
    ],
  },
  {
    id: 30687,
    name: 'Bolt',
    nameTw: '閃電',
    slot: '單手劍',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/Bolt',
    precursor: { name: 'Zap', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of Bolt', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Metal + 主題禮物，詳見 Wiki' },
    ],
    achievements: [
      { id: 1771, name: 'Bolt I: The Experimental Sword',  done: false, wikiUrl: 'https://wiki.guildwars2.com/wiki/Bolt_I' },
      { id: 1772, name: 'Bolt II: The Zap',               done: false, wikiUrl: 'https://wiki.guildwars2.com/wiki/Bolt_II' },
      { id: 1773, name: 'Bolt III: The Perfected Sword',  done: false, wikiUrl: 'https://wiki.guildwars2.com/wiki/Bolt_III' },
    ],
  },
  {
    id: 30698,
    name: 'The Bifrost',
    nameTw: '彩虹橋',
    slot: '法杖',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Bifrost',
    precursor: { name: 'The Legend', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of The Bifrost', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Energy + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30695,
    name: 'Kudzu',
    nameTw: '葛藤弓',
    slot: '長弓',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/Kudzu',
    precursor: { name: 'Leaf of Kudzu', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of Kudzu', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Wood + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30696,
    name: 'Frostfang',
    nameTw: '霜牙',
    slot: '斧頭',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/Frostfang',
    precursor: { name: 'Tooth of Frostfang', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of Frostfang', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Metal + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30692,
    name: 'Incinerator',
    nameTw: '焚化爐',
    slot: '匕首',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/Incinerator',
    precursor: { name: 'Spark', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of Incinerator', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Metal + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30693,
    name: 'The Juggernaut',
    nameTw: '巨像',
    slot: '錘子',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Juggernaut',
    precursor: { name: 'The Colossus', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of The Juggernaut', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Metal + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30697,
    name: 'Quip',
    nameTw: '俏皮話',
    slot: '手槍',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/Quip',
    precursor: { name: 'Chaos Gun', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of Quip', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Metal + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30699,
    name: 'Meteorlogicus',
    nameTw: '氣象學',
    slot: '法杖',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/Meteorlogicus',
    precursor: { name: 'Storm', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of Meteorlogicus', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Energy + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30703,
    name: 'Rodgort',
    nameTw: '羅格特之炬',
    slot: '火把',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/Rodgort',
    precursor: { name: "Rodgort's Flame", note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of Rodgort', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Wood + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30702,
    name: 'Howler',
    nameTw: '嚎叫者',
    slot: '戰號',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/Howler',
    precursor: { name: 'Howl', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of Howler', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Wood + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30688,
    name: 'The Flameseeker Prophecies',
    nameTw: '尋焰預言',
    slot: '盾牌',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Flameseeker_Prophecies',
    precursor: { name: 'The Chosen', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of The Flameseeker Prophecies', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Metal + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30686,
    name: 'The Dreamer',
    nameTw: '夢想家',
    slot: '短弓',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Dreamer',
    precursor: { name: 'The Lover', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of The Dreamer', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Wood + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30700,
    name: 'The Predator',
    nameTw: '掠食者',
    slot: '步槍',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Predator',
    precursor: { name: 'The Hunter', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of The Predator', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Wood + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
  {
    id: 30694,
    name: 'The Minstrel',
    nameTw: '吟遊詩人',
    slot: '法印',
    generation: 1,
    wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Minstrel',
    precursor: { name: 'The Bard', note: '可由掉落、Mystic Forge 或成就合成' },
    materials: [
      ...GIFT_OF_FORTUNE_MATERIALS,
      ...GIFT_OF_MASTERY_MATERIALS,
      { id: null, name: 'Gift of The Minstrel', qty: 1, category: 'specific',
        note: '需 100x Icy Runestone + Gift of Energy + 主題禮物，詳見 Wiki' },
    ],
    achievements: [],
  },
]

/** 取得所有需要追蹤的物品 ID（有效 ID 才計入） */
export function getAllTrackedItemIds(legendary) {
  return legendary.materials
    .filter(m => m.id !== null)
    .map(m => m.id)
}
