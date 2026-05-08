/**
 * GW2 META 事件排程資料
 * 時間單位：UTC 午夜起算的「分鐘數」（0 = 00:00 UTC，90 = 01:30 UTC）
 * 注意：展開版 META 時間為社群公認近似值，實際可能有 ±1-2 分鐘誤差。
 */

// 每隔 periodMinutes 分鐘、從 offsetMinutes 開始的重複時間清單
function repeat(offsetMinutes, periodMinutes = 120) {
  const times = []
  for (let t = offsetMinutes % 1440; t < 1440; t += periodMinutes) {
    times.push(t)
  }
  return times.sort((a, b) => a - b)
}

// ── 展開包識別 ──────────────────────────────────────────
export const EXPANSIONS = {
  core:     { label: 'Core Tyria',            labelZh: '泰瑞亞本島',     color: '#c8a84b' },
  hot:      { label: 'Heart of Thorns',       labelZh: '荊棘之心',       color: '#27ae60' },
  pof:      { label: 'Path of Fire',          labelZh: '烈焰之路',       color: '#e67e22' },
  lws4:     { label: 'Living World S4',       labelZh: '活躍世界第四季', color: '#e74c3c' },
  icebrood: { label: 'Icebrood Saga',         labelZh: '冰族傳說',       color: '#3498db' },
  eod:      { label: 'End of Dragons',        labelZh: '龍落之日',       color: '#9b59b6' },
  soto:     { label: 'Secrets of the Obscure',labelZh: '隱晦之秘',       color: '#1abc9c' },
  janthir:  { label: 'Janthir Wilds',         labelZh: '揚希爾荒野',     color: '#f39c12' },
}

export const CATEGORIES = {
  'world-boss':      { label: '世界首領', color: '#e74c3c' },
  'hard-world-boss': { label: '強化首領', color: '#8e44ad' },
  'meta':            { label: 'META 事件', color: '#2980b9' },
}

// ── 事件排程 ────────────────────────────────────────────
// 標準世界首領以 2 小時為一週期（00:00、02:00 … UTC 為各區塊起點）
// 依 Wiki 實際快照驗證的偏移量：
//   區塊 +0:00 Shatterer → +0:15 Svanir → +0:30 Modniir → +0:45 FireElem
//   → +1:00 Admiral → +1:15 JungleWurm → +1:30 Megadestroyer → +1:45 ShadowBehemoth
export const META_EVENTS = [

  // ════════════════ CORE TYRIA — 世界首領 ════════════════
  {
    id: 'shatterer',
    name: '破碎者',
    nameEn: 'The Shatterer',
    zone: '火焰山脊平原',
    expansion: 'core',
    category: 'world-boss',
    icon: '🐉',
    times: repeat(0),        // 00:00, 02:00, 04:00 … UTC
    durationMin: 15,
  },
  {
    id: 'svanir',
    name: '斯瓦尼爾巫師長',
    nameEn: 'Svanir Shaman Chief',
    zone: '旅人丘陵',
    expansion: 'core',
    category: 'world-boss',
    icon: '🧊',
    times: repeat(15),       // 00:15, 02:15 …
    durationMin: 15,
  },
  {
    id: 'modniir',
    name: '莫德尼爾・烏爾戈斯',
    nameEn: 'Modniir Ulgoth',
    zone: '哈拉希後地',
    expansion: 'core',
    category: 'world-boss',
    icon: '⚔️',
    times: repeat(30),       // 00:30, 02:30 …
    durationMin: 15,
  },
  {
    id: 'fire-elemental',
    name: '火元素',
    nameEn: 'Fire Elemental',
    zone: '梅特里卡省',
    expansion: 'core',
    category: 'world-boss',
    icon: '🔥',
    times: repeat(45),       // 00:45, 02:45 …
    durationMin: 15,
  },
  {
    id: 'admiral-covington',
    name: '泰達・科文頓上將',
    nameEn: 'Admiral Taidha Covington',
    zone: '血潮海岸',
    expansion: 'core',
    category: 'world-boss',
    icon: '🏴‍☠️',
    times: repeat(60),       // 01:00, 03:00 …
    durationMin: 15,
  },
  {
    id: 'great-jungle-wurm',
    name: '叢林大蠕蟲',
    nameEn: 'Great Jungle Wurm',
    zone: '卡萊頓森林',
    expansion: 'core',
    category: 'world-boss',
    icon: '🐛',
    times: repeat(75),       // 01:15, 03:15 …
    durationMin: 15,
  },
  {
    id: 'megadestroyer',
    name: '超級毀滅者',
    nameEn: 'Megadestroyer',
    zone: '熔岩漩渦山',
    expansion: 'core',
    category: 'world-boss',
    icon: '🌋',
    times: repeat(90),       // 01:30, 03:30 …
    durationMin: 15,
  },
  {
    id: 'shadow-behemoth',
    name: '暗影巨獸',
    nameEn: 'Shadow Behemoth',
    zone: '皇后谷',
    expansion: 'core',
    category: 'world-boss',
    icon: '👁️',
    times: repeat(105),      // 01:45, 03:45 …
    durationMin: 15,
  },
  {
    id: 'claw-of-jormag',
    name: '喬爾馬格之爪',
    nameEn: 'Claw of Jormag',
    zone: '霜凍海灣',
    expansion: 'core',
    category: 'world-boss',
    icon: '❄️',
    times: repeat(0, 150),   // 每 2.5h：00:00, 02:30, 05:00 …
    durationMin: 15,
  },

  // ════════════════ CORE TYRIA — 強化世界首領 ════════════════
  {
    id: 'tequatl',
    name: '特克塔爾',
    nameEn: 'Tequatl the Sunless',
    zone: '閃火沼澤',
    expansion: 'core',
    category: 'hard-world-boss',
    icon: '🦎',
    // 固定時間 UTC：00:00, 03:00, 07:00, 11:30, 16:00, 19:00
    times: [0, 180, 420, 690, 960, 1140],
    durationMin: 20,
  },
  {
    id: 'triple-trouble',
    name: '三重麻煩（進化叢林蠕蟲）',
    nameEn: 'Triple Trouble',
    zone: '血潮海岸',
    expansion: 'core',
    category: 'hard-world-boss',
    icon: '🐍',
    // 固定時間 UTC：01:00, 04:00, 10:30, 15:00, 18:00, 23:00
    times: [60, 240, 630, 900, 1080, 1380],
    durationMin: 20,
  },
  {
    id: 'karka-queen',
    name: '卡卡女王',
    nameEn: 'Karka Queen',
    zone: '南日灣',
    expansion: 'core',
    category: 'hard-world-boss',
    icon: '🦀',
    // 每 6 小時：00:00, 06:00, 12:00, 18:00 UTC
    times: repeat(0, 360),
    durationMin: 15,
  },

  // ════════════════ HEART OF THORNS ════════════════
  {
    id: 'verdant-brink-night',
    name: '翠蔓山崖 — 夜間與敵人',
    nameEn: 'Verdant Brink: Night and the Enemy',
    zone: '翠蔓山崖',
    expansion: 'hot',
    category: 'meta',
    icon: '🌿',
    times: repeat(0),        // 每 2h 整點
    durationMin: 40,
  },
  {
    id: 'auric-basin-octovine',
    name: '黃金盆地 — 章魚藤決戰',
    nameEn: 'Auric Basin: Battle in Tarir (Octovine)',
    zone: '黃金盆地',
    expansion: 'hot',
    category: 'meta',
    icon: '🟡',
    times: repeat(45),       // 每 2h 的 :45
    durationMin: 20,
  },
  {
    id: 'tangled-depths-chak',
    name: '糾纏深淵 — 查克喙蟲',
    nameEn: 'Tangled Depths: Chak Gerent',
    zone: '糾纏深淵',
    expansion: 'hot',
    category: 'meta',
    icon: '🕷️',
    times: repeat(30),       // 每 2h 的 :30
    durationMin: 20,
  },
  {
    id: 'dragons-stand',
    name: '龍之據點',
    nameEn: "Dragon's Stand",
    zone: '龍之據點',
    expansion: 'hot',
    category: 'meta',
    icon: '⚔️',
    times: repeat(90),       // 每 2h 的 1:30
    durationMin: 60,
  },

  // ════════════════ PATH OF FIRE ════════════════
  {
    id: 'palawadan',
    name: '帕拉瓦丹，伊斯坦之珠',
    nameEn: 'Palawadan, Jewel of Istan',
    zone: '伊斯坦領域',
    expansion: 'pof',
    category: 'meta',
    icon: '☀️',
    times: repeat(45),       // 每 2h 的 :45
    durationMin: 30,
  },
  {
    id: 'serpents-ire',
    name: '毒蛇之怒',
    nameEn: "Serpents' Ire",
    zone: '瓦比領域',
    expansion: 'pof',
    category: 'meta',
    icon: '🐍',
    times: repeat(30),       // 每 2h 的 :30
    durationMin: 30,
  },

  // ════════════════ LIVING WORLD SEASON 4 ════════════════
  {
    id: 'dbs',
    name: '死亡烙印破碎者',
    nameEn: 'Death-Branded Shatterer',
    zone: '賈海峭壁',
    expansion: 'lws4',
    category: 'meta',
    icon: '🐲',
    times: repeat(30),       // 每 2h 的 :30
    durationMin: 20,
  },
  {
    id: 'thunderhead-keep',
    name: '雷頭要塞',
    nameEn: 'Thunderhead Keep',
    zone: '雷頭山峰',
    expansion: 'lws4',
    category: 'meta',
    icon: '⚡',
    times: repeat(0),        // 每 2h 整點
    durationMin: 30,
  },
  {
    id: 'oil-floes',
    name: '油田浮冰',
    nameEn: 'The Oil Floes',
    zone: '雷頭山峰',
    expansion: 'lws4',
    category: 'meta',
    icon: '🛢️',
    times: repeat(90),       // 每 2h 的 1:30
    durationMin: 30,
  },

  // ════════════════ ICEBROOD SAGA ════════════════
  {
    id: 'drakkar',
    name: '德拉卡爾與荒野之靈',
    nameEn: 'Drakkar and Spirits of the Wild',
    zone: '比約拉沼地',
    expansion: 'icebrood',
    category: 'meta',
    icon: '🐋',
    times: repeat(0),        // 每 2h 整點
    durationMin: 25,
  },
  {
    id: 'grothmar',
    name: '格羅斯瑪爾山谷',
    nameEn: 'Grothmar Valley Meta',
    zone: '格羅斯瑪爾山谷',
    expansion: 'icebrood',
    category: 'meta',
    icon: '🔥',
    times: repeat(40),       // 近似：每 2h 的 :40
    durationMin: 35,
  },

  // ════════════════ END OF DRAGONS ════════════════
  {
    id: 'dragons-end',
    name: '龍之終結 — 翡翠海戰役',
    nameEn: "Dragon's End: Battle for the Jade Sea",
    zone: '龍之終結',
    expansion: 'eod',
    category: 'meta',
    icon: '💎',
    times: repeat(0),        // 每 2h 整點
    durationMin: 35,
  },
  {
    id: 'echovald-gang-war',
    name: '回聲森林 — 幫派戰爭',
    nameEn: 'The Echovald Wilds: Gang War',
    zone: '回聲森林',
    expansion: 'eod',
    category: 'meta',
    icon: '🌲',
    times: repeat(0),        // 每 2h 整點（與龍之終結同時）
    durationMin: 30,
  },
  {
    id: 'aetherblade-assault',
    name: '靈氣刃突擊',
    nameEn: 'Aetherblade Assault',
    zone: '西唐省',
    expansion: 'eod',
    category: 'meta',
    icon: '⚙️',
    times: repeat(30),       // 每 2h 的 :30
    durationMin: 20,
  },
  {
    id: 'kaineng-blackout',
    name: '開能大停電',
    nameEn: 'Kaineng Blackout',
    zone: '新開能城',
    expansion: 'eod',
    category: 'meta',
    icon: '🏙️',
    times: repeat(30),       // 每 2h 的 :30
    durationMin: 20,
  },

  // ════════════════ SECRETS OF THE OBSCURE ════════════════
  {
    id: 'skywatch',
    name: '天空觀測群島',
    nameEn: 'Skywatch Archipelago',
    zone: '天空觀測群島',
    expansion: 'soto',
    category: 'meta',
    icon: '☁️',
    times: repeat(0),        // 每 2h 整點
    durationMin: 30,
  },
  {
    id: 'amnytas',
    name: '阿姆尼塔斯防禦戰',
    nameEn: 'Defense of Amnytas',
    zone: '阿姆尼塔斯',
    expansion: 'soto',
    category: 'meta',
    icon: '🌟',
    times: repeat(90),       // 每 2h 的 1:30
    durationMin: 30,
  },

  // ════════════════ JANTHIR WILDS ════════════════
  {
    id: 'janthir-syntri',
    name: '迷霧與怪物',
    nameEn: 'Of Mists and Monsters',
    zone: '揚希爾辛翠',
    expansion: 'janthir',
    category: 'meta',
    icon: '🌫️',
    times: repeat(30),       // 近似
    durationMin: 30,
  },
  {
    id: 'bava-nisos',
    name: '泰坦之旅',
    nameEn: 'A Titanic Voyage',
    zone: '巴瓦尼索斯',
    expansion: 'janthir',
    category: 'meta',
    icon: '⛵',
    times: repeat(0),        // 近似
    durationMin: 30,
  },
]

// ── 計算工具函式 ────────────────────────────────────────

/**
 * 取得事件在指定 UTC 秒數下的狀態
 * @param {Object} event
 * @param {number} nowUtcSeconds  - 今天 UTC 午夜起算的秒數
 * @returns {{ status: 'active'|'soon'|'upcoming', secondsUntilNext: number, secondsSincePrev: number, nextTimeMin: number, sortKey: number }}
 */
export function getEventStatus(event, nowUtcSeconds) {
  const nowMin = nowUtcSeconds / 60
  const { times, durationMin = 15 } = event

  // 找到「上一個」與「下一個」發生時間
  let prevMin = times[times.length - 1] - 1440  // 昨天最後一次（負值）
  let nextMin = times[0] + 1440                 // 明天第一次（> 1440）

  for (const t of times) {
    if (t <= nowMin) {
      prevMin = t
    } else {
      nextMin = t
      break
    }
  }

  const secSincePrev = nowUtcSeconds - prevMin * 60
  const secUntilNext = nextMin * 60 - nowUtcSeconds

  let status
  if (secSincePrev >= 0 && secSincePrev < durationMin * 60) {
    status = 'active'
  } else if (secUntilNext <= 15 * 60) {
    status = 'soon'
  } else {
    status = 'upcoming'
  }

  return {
    status,
    secondsUntilNext: Math.round(secUntilNext),
    secondsSincePrev: Math.round(secSincePrev),
    nextTimeMin: Math.round(nextMin) % 1440,
    // active 事件排最前（負值），soon 次之，upcoming 最後
    sortKey: status === 'active' ? -secSincePrev : secUntilNext,
  }
}

/**
 * 將秒數格式化為 HH:MM:SS 倒數字串
 */
export function formatCountdown(totalSeconds) {
  if (totalSeconds <= 0) return '00:00'
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * 將分鐘數（0-1439）格式化為 HH:MM UTC
 */
export function formatUtcTime(minutes) {
  const h = Math.floor(((minutes % 1440) + 1440) % 1440 / 60)
  const m = Math.round(((minutes % 1440) + 1440) % 1440 % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
