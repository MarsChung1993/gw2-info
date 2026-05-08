import gw2Api from './gw2'

/**
 * GET /v2/account/materials
 * 取得帳號材料庫存（需要 API Key，scope: account + inventories）
 *
 * 每個物品格：
 *   id       (number) – 物品 ID
 *   category (number) – 材料分類 ID
 *   binding  (string) – 'Account'
 *   count    (number) – 數量
 */
export const fetchAccountMaterials = () => gw2Api.get('/account/materials')

/**
 * GET /v2/account/achievements
 * 取得帳號成就進度（需要 API Key，scope: account + progression）
 *
 * 每個成就：
 *   id        (number)           – 成就 ID
 *   bits      (number[], optional) – 已完成的 bit 索引
 *   current   (number, optional) – 當前進度
 *   max       (number, optional) – 最大進度
 *   done      (boolean)          – 是否已完成
 *   repeated  (number, optional) – 重複次數
 */
export const fetchAccountAchievements = () => gw2Api.get('/account/achievements')

/**
 * GET /v2/achievements?ids=...
 * 取得成就詳細資訊（公開 API，不需要 Key）
 * @param {number[]} ids - 成就 ID 陣列
 */
export const fetchAchievementDetails = (ids) =>
  gw2Api.get(`/achievements?ids=${ids.join(',')}`)
