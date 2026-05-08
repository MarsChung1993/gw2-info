import gw2Api from './gw2'

/**
 * GET /v2/characters/:id/inventory
 * 取得角色背包內容（需要 API Key，scope: characters + inventories）
 *
 * 回傳結構：
 *   bags (array) – 每個背包物件
 *     id        (number)  – 背包物品 ID（可透過 /v2/items 解析）
 *     size      (number)  – 背包格數
 *     inventory (array)   – 背包格內容，空格為 null
 *       id               (number)           – 物品 ID
 *       count            (number)           – 數量（1–250）
 *       charges          (number, optional) – 剩餘充能次數
 *       infusions        (number[], optional) – 注靈 ID 陣列
 *       upgrades         (number[], optional) – 升級組件 ID 陣列
 *       skin             (number, optional)  – 外觀 ID
 *       stats            (object, optional)  – 屬性資訊
 *         id             (number)            – itemstat ID
 *         attributes     (object)            – 各屬性數值
 *       dyes             (number[], optional)– 染色 ID 陣列
 *       binding          (string, optional)  – 'Account' | 'Character'
 *       bound_to         (string, optional)  – 綁定的角色名稱
 *
 * @param {string} characterName - 角色名稱（URL encoded）
 */
export const fetchCharacterInventory = (characterName) =>
  gw2Api.get(`/characters/${encodeURIComponent(characterName)}/inventory`)

/**
 * GET /v2/account/bank
 * 取得帳號倉庫內容（需要 API Key，scope: account + inventories）
 * 不含材料庫存，空格回傳 null
 *
 * 每個物品欄位：
 *   id                   (number)           – 物品 ID
 *   count                (number)           – 數量
 *   charges              (number, optional) – 剩餘充能次數
 *   skin                 (number, optional) – 外觀 ID（可透過 /v2/skins 解析）
 *   dyes                 (number[], optional)– 染色 ID 陣列
 *   upgrades             (number[], optional)– 升級組件 ID 陣列
 *   upgrade_slot_indices (number[], optional)– 對應 upgrades 的插槽位置
 *   infusions            (number[], optional)– 注靈 ID 陣列
 *   binding              (string, optional)  – 'Account' | 'Character'
 *   bound_to             (string, optional)  – 角色綁定名稱
 *   stats                (object, optional)  – 屬性資訊
 *     id                 (number)            – itemstat ID
 *     attributes         (object)            – 各屬性數值
 *       Power / Precision / Toughness / Vitality
 *       ConditionDamage / ConditionDuration / Healing
 *       BoonDuration / CritDamage / AgonyResistance
 */
export const fetchAccountBank = () => gw2Api.get('/account/bank')
