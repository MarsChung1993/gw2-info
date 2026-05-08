import gw2Api from './gw2'

// 帳號資訊
export const fetchAccount = () => gw2Api.get('/account')

// 角色列表
export const fetchCharacters = () => gw2Api.get('/characters')

// 單一角色詳細資訊
export const fetchCharacter = (name) =>
  gw2Api.get(`/characters/${encodeURIComponent(name)}`)

// 世界列表
export const fetchWorlds = () => gw2Api.get('/worlds?ids=all')

// 物品詳細資訊（支援批量 id）
export const fetchItems = (ids) =>
  gw2Api.get(`/items?ids=${ids.join(',')}`)

// 單一物品
export const fetchItem = (id) => gw2Api.get(`/items/${id}`)

// 交易行（當前買賣價格）
export const fetchPrices = (ids) =>
  gw2Api.get(`/commerce/prices?ids=${ids.join(',')}`)

// 成就類別
export const fetchAchievementCategories = () =>
  gw2Api.get('/achievements/categories?ids=all')

// 成就
export const fetchAchievements = (ids) =>
  gw2Api.get(`/achievements?ids=${ids.join(',')}`)

// WvW 比賽
export const fetchWvwMatches = () => gw2Api.get('/wvw/matches')

// 地圖列表
export const fetchMaps = () => gw2Api.get('/maps?ids=all')

// 技能
export const fetchSkills = (ids) =>
  gw2Api.get(`/skills?ids=${ids.join(',')}`)
