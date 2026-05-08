import gw2Api from '../gw2'

/**
 * GET /v2/continents
 * 取得所有大陸 ID 列表（目前只有 1=Tyria, 2=Mists）
 */
export const fetchContinentIds = () => gw2Api.get('/continents')

/**
 * GET /v2/continents?ids=all
 * 取得所有大陸基本資訊
 *
 * 回傳欄位：
 *   id             (number)   – 大陸 ID
 *   name           (string)   – 大陸名稱
 *   continent_dims (number[]) – 大陸圖磚尺寸 [width, height]
 *   min_zoom       (number)   – 最小縮放等級
 *   max_zoom       (number)   – 最大縮放等級
 *   floors         (number[]) – 可用樓層 ID 列表
 */
export const fetchContinents = () => gw2Api.get('/continents?ids=all')

/**
 * GET /v2/continents/:continentId
 * 取得單一大陸資訊
 * @param {number} continentId - 大陸 ID（1=Tyria, 2=Mists）
 */
export const fetchContinent = (continentId) =>
  gw2Api.get(`/continents/${continentId}`)

/**
 * GET /v2/continents/:continentId/floors
 * 取得指定大陸的所有樓層 ID 列表
 * @param {number} continentId - 大陸 ID
 */
export const fetchFloorIds = (continentId) =>
  gw2Api.get(`/continents/${continentId}/floors`)

/**
 * GET /v2/continents/:continentId/floors/:floorId
 * 取得樓層完整資訊（含所有地區、地圖、POI、任務、區域）
 *
 * 回傳欄位：
 *   texture_dims  (number[])  – 圖磚材質尺寸 [width, height]
 *   clamped_view  (number[][])– 可下載圖磚的矩形範圍（若存在）
 *   regions       (object)    – 地區 ID → 地區資訊的映射
 *     └ name           (string)    – 地區名稱
 *     └ label_coord    (number[])  – 地區標籤座標 [x, y]
 *     └ continent_rect (number[][])– 大陸座標中的地區範圍
 *     └ maps           (object)    – 地圖 ID → 地圖資訊的映射
 *         └ name             (string)    – 地圖名稱
 *         └ min_level        (number)    – 最低等級
 *         └ max_level        (number)    – 最高等級
 *         └ default_floor    (number)    – 預設樓層
 *         └ label_coord      (number[])  – 地圖標籤座標
 *         └ map_rect         (number[][])– 地圖座標範圍（SW→NE）
 *         └ continent_rect   (number[][])– 大陸座標中的地圖範圍（NW→SE）
 *         └ points_of_interest (object) – 興趣點（地標/路徑點/觀景台）
 *         └ tasks            (object)    – 榮譽之心任務
 *         └ skill_challenges (object[]) – 英雄挑戰點
 *         └ sectors          (object)   – 地圖內的區域
 *         └ adventures       (object[]) – 冒險任務
 *         └ mastery_points   (object[]) – 精通洞察點
 *
 * @param {number} continentId - 大陸 ID
 * @param {number} floorId     - 樓層 ID
 */
export const fetchFloor = (continentId, floorId) =>
  gw2Api.get(`/continents/${continentId}/floors/${floorId}`)

/**
 * GET /v2/continents/:continentId/floors/:floorId/regions
 * 取得指定樓層的所有地區 ID 列表
 */
export const fetchRegionIds = (continentId, floorId) =>
  gw2Api.get(`/continents/${continentId}/floors/${floorId}/regions`)

/**
 * GET /v2/continents/:continentId/floors/:floorId/regions/:regionId
 * 取得單一地區詳細資訊（含所有地圖）
 */
export const fetchRegion = (continentId, floorId, regionId) =>
  gw2Api.get(
    `/continents/${continentId}/floors/${floorId}/regions/${regionId}`
  )

/**
 * GET /v2/continents/:continentId/floors/:floorId/regions/:regionId/maps
 * 取得地區內所有地圖 ID 列表
 */
export const fetchRegionMapIds = (continentId, floorId, regionId) =>
  gw2Api.get(
    `/continents/${continentId}/floors/${floorId}/regions/${regionId}/maps`
  )

/**
 * GET /v2/continents/:continentId/floors/:floorId/regions/:regionId/maps/:mapId
 * 取得地圖詳細資訊（含 POI、任務、區域、冒險、精通點）
 */
export const fetchContinentMap = (continentId, floorId, regionId, mapId) =>
  gw2Api.get(
    `/continents/${continentId}/floors/${floorId}/regions/${regionId}/maps/${mapId}`
  )

/**
 * GET /v2/continents/:continentId/floors/:floorId/regions/:regionId/maps/:mapId/sectors
 * 取得地圖內所有區域資訊
 */
export const fetchSectors = (continentId, floorId, regionId, mapId) =>
  gw2Api.get(
    `/continents/${continentId}/floors/${floorId}/regions/${regionId}/maps/${mapId}/sectors`
  )

/**
 * GET /v2/continents/:continentId/floors/:floorId/regions/:regionId/maps/:mapId/pois
 * 取得地圖內所有興趣點（地標/路徑點/觀景台）
 *
 * 每個 POI 欄位：
 *   id        (number)  – POI ID
 *   name      (string)  – 名稱
 *   type      (string)  – 類型：landmark / waypoint / vista / unlock
 *   floor     (number)  – 所在樓層
 *   coord     (number[])– 座標 [x, y]
 *   chat_link (string)  – 遊戲內聊天連結
 *   icon      (string)  – 僅 unlock 類型才有，圖示 URL
 */
export const fetchPois = (continentId, floorId, regionId, mapId) =>
  gw2Api.get(
    `/continents/${continentId}/floors/${floorId}/regions/${regionId}/maps/${mapId}/pois`
  )

/**
 * GET /v2/continents/:continentId/floors/:floorId/regions/:regionId/maps/:mapId/tasks
 * 取得地圖內所有榮譽之心任務
 *
 * 每個 task 欄位：
 *   id        (number)   – 任務 ID
 *   objective (string)   – 任務目標描述
 *   level     (number)   – 任務等級
 *   coord     (number[]) – 座標 [x, y]
 *   bounds    (number[][])– 任務範圍邊界座標列表
 *   chat_link (string)   – 遊戲內聊天連結
 */
export const fetchTasks = (continentId, floorId, regionId, mapId) =>
  gw2Api.get(
    `/continents/${continentId}/floors/${floorId}/regions/${regionId}/maps/${mapId}/tasks`
  )
