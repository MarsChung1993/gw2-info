import gw2Api from '../gw2'

/**
 * GET /v2/maps
 * 取得所有地圖 ID 列表
 */
export const fetchMapIds = () => gw2Api.get('/maps')

/**
 * GET /v2/maps/:id
 * 取得單一地圖詳細資訊
 * @param {number} id - 地圖 ID
 *
 * 回傳欄位：
 *   id           (number)  – 地圖 ID
 *   name         (string)  – 地圖名稱
 *   min_level    (number)  – 最低等級需求
 *   max_level    (number)  – 最高等級需求
 *   default_floor(number)  – 預設樓層
 *   type         (string)  – 地圖類型
 *                            Public / Instance / Tutorial / Pvp /
 *                            BlueHome / RedHome / GreenHome /
 *                            Center / EdgeOfTheMists / JumpPuzzle / Unknown
 *   floors       (number[])– 可用樓層列表
 *   region_id    (number)  – 所屬地區 ID
 *   region_name  (string)  – 所屬地區名稱
 *   continent_id (number)  – 所屬大陸 ID
 *   continent_name(string) – 所屬大陸名稱
 *   map_rect     (number[][])– 地圖座標範圍 [[minX, minY], [maxX, maxY]]（SW→NE）
 *   continent_rect(number[][])– 大陸座標系統中的地圖範圍（NW→SE）
 */
export const fetchMap = (id) => gw2Api.get(`/maps/${id}`)

/**
 * GET /v2/maps?ids=<ids>
 * 批量取得多個地圖資訊（最多 200 個）
 * @param {number[]} ids - 地圖 ID 陣列
 */
export const fetchMaps = (ids) => gw2Api.get(`/maps?ids=${ids.join(',')}`)

/**
 * GET /v2/maps?ids=all
 * 取得所有地圖完整資訊（資料量大，謹慎使用）
 */
export const fetchAllMaps = () => gw2Api.get('/maps?ids=all')
