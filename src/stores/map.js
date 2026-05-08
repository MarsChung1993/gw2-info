import { defineStore } from 'pinia'
import {
  fetchMapIds,
  fetchMap,
  fetchMaps,
  fetchContinents,
  fetchFloor,
  fetchRegion,
} from '../api/map/index'

export const useMapStore = defineStore('map', {
  state: () => ({
    // /v2/maps
    mapIds: [],
    maps: {},          // id → map 物件快取

    // /v2/continents
    continents: [],    // 所有大陸基本資訊

    // 目前選取的大陸/樓層/地區
    selectedContinentId: 1,
    selectedFloorId: 1,
    selectedRegionId: null,
    selectedMapId: null,

    // 目前展開的樓層資料（含所有 regions / maps / pois）
    currentFloor: null,

    // 目前展開的地區資料
    currentRegion: null,

    loading: false,
    error: null,
  }),

  getters: {
    // 取得快取的單一地圖
    getMap: (state) => (id) => state.maps[id] ?? null,

    // 目前大陸名稱
    continentName: (state) => {
      const c = state.continents.find((c) => c.id === state.selectedContinentId)
      return c?.name ?? ''
    },

    // 目前樓層的所有地區（array 形式）
    regions: (state) => {
      if (!state.currentFloor?.regions) return []
      return Object.entries(state.currentFloor.regions).map(([id, r]) => ({
        id: Number(id),
        ...r,
      }))
    },

    // 目前地區的所有地圖（array 形式）
    currentRegionMaps: (state) => {
      if (!state.currentRegion?.maps) return []
      return Object.entries(state.currentRegion.maps).map(([id, m]) => ({
        id: Number(id),
        ...m,
      }))
    },
  },

  actions: {
    // ── /v2/maps ──────────────────────────────────────────
    async loadMapIds() {
      if (this.mapIds.length) return
      this._start()
      try {
        this.mapIds = await fetchMapIds()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async loadMap(id) {
      if (this.maps[id]) return
      this._start()
      try {
        const map = await fetchMap(id)
        this.maps[map.id] = map
        this.selectedMapId = map.id
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async loadMaps(ids) {
      const missing = ids.filter((id) => !this.maps[id])
      if (!missing.length) return
      this._start()
      try {
        const list = await fetchMaps(missing)
        list.forEach((m) => { this.maps[m.id] = m })
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // ── /v2/continents ────────────────────────────────────
    async loadContinents() {
      if (this.continents.length) return
      this._start()
      try {
        this.continents = await fetchContinents()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 載入指定大陸+樓層的完整資料（含所有 regions/maps/pois）
    async loadFloor(continentId, floorId) {
      this._start()
      try {
        this.selectedContinentId = continentId
        this.selectedFloorId = floorId
        this.currentFloor = await fetchFloor(continentId, floorId)
        this.currentRegion = null
        this.selectedRegionId = null
        this.selectedMapId = null
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 從已展開的 floor 中展開地區
    async loadRegion(continentId, floorId, regionId) {
      this._start()
      try {
        this.selectedRegionId = regionId
        this.currentRegion = await fetchRegion(continentId, floorId, regionId)
        this.selectedMapId = null
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setSelectedMap(mapId) {
      this.selectedMapId = mapId
    },

    // 內部輔助：重置 loading/error
    _start() {
      this.loading = true
      this.error = null
    },
  },
})
