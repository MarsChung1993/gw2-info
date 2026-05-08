import { defineStore } from 'pinia'
import { fetchAccountMaterials, fetchAccountAchievements } from '../api/legendary'
import { fetchItems } from '../api/endpoints'
import { useInventoryStore } from './inventory'
import { getAllTrackedItemIds } from '../data/legendaries'

export const useLegendaryStore = defineStore('legendary', {
  state: () => ({
    // 材料庫存（帳號材料庫 /v2/account/materials）
    accountMaterials: [],      // [{ id, count }]
    materialsLoading: false,
    materialsError: null,

    // 帳號成就（/v2/account/achievements）
    accountAchievements: [],   // [{ id, current, max, done, bits }]
    achievementsLoading: false,
    achievementsError: null,

    // 物品資訊快取（id → item）
    itemCache: {},
    itemsLoading: false,
  }),

  getters: {
    /**
     * 聚合所有來源的特定物品數量：
     *   帳號材料庫 + 倉庫 + 所有角色背包
     */
    getTotalItemCount: (state) => (itemId) => {
      if (!itemId) return 0

      // 1. 帳號材料庫
      const matEntry = state.accountMaterials.find(m => m.id === itemId)
      let total = matEntry?.count ?? 0

      // 2. 倉庫（透過 inventory store）
      const inventoryStore = useInventoryStore()
      inventoryStore.bank.forEach(slot => {
        if (slot?.id === itemId) total += (slot.count ?? 1)
      })

      // 3. 所有角色背包
      Object.values(inventoryStore.characterInventories).forEach(charInv => {
        if (!charInv?.bags) return
        charInv.bags.forEach(bag => {
          if (!bag) return
          ;(bag.inventory ?? []).forEach(slot => {
            if (slot?.id === itemId) total += (slot.count ?? 1)
          })
        })
      })

      return total
    },

    /**
     * 取得特定成就進度
     */
    getAchievementProgress: (state) => (achievementId) => {
      return state.accountAchievements.find(a => a.id === achievementId) ?? null
    },

    /**
     * 計算某個傳奇武器的整體材料完成比例 (0~1)
     */
    getLegendaryProgress: (state) => (legendary) => {
      const inventoryStore = useInventoryStore()
      const getCount = (id) => {
        if (!id) return 0
        const matEntry = state.accountMaterials.find(m => m.id === id)
        let total = matEntry?.count ?? 0
        inventoryStore.bank.forEach(slot => {
          if (slot?.id === id) total += (slot.count ?? 1)
        })
        Object.values(inventoryStore.characterInventories).forEach(charInv => {
          if (!charInv?.bags) return
          charInv.bags.forEach(bag => {
            if (!bag) return
            ;(bag.inventory ?? []).forEach(slot => {
              if (slot?.id === id) total += (slot.count ?? 1)
            })
          })
        })
        return total
      }

      const tracked = legendary.materials.filter(m => m.id !== null)
      if (!tracked.length) return 0

      let totalRequired = 0
      let totalHave = 0
      tracked.forEach(m => {
        const have = Math.min(getCount(m.id), m.qty)
        totalHave += have
        totalRequired += m.qty
      })

      return totalRequired > 0 ? totalHave / totalRequired : 0
    },

    /** 取得物品詳細資訊（含名稱、圖示） */
    getItemInfo: (state) => (id) => state.itemCache[id] ?? null,
  },

  actions: {
    /** 載入帳號材料庫存 */
    async loadMaterials() {
      this.materialsLoading = true
      this.materialsError = null
      try {
        this.accountMaterials = await fetchAccountMaterials()
      } catch (err) {
        this.materialsError = err.message
      } finally {
        this.materialsLoading = false
      }
    },

    /** 載入帳號成就進度 */
    async loadAchievements() {
      this.achievementsLoading = true
      this.achievementsError = null
      try {
        this.accountAchievements = await fetchAccountAchievements()
      } catch (err) {
        this.achievementsError = err.message
      } finally {
        this.achievementsLoading = false
      }
    },

    /** 預載特定傳奇武器所需物品的名稱與圖示 */
    async preloadItemInfo(legendary) {
      const ids = getAllTrackedItemIds(legendary).filter(id => id && !this.itemCache[id])
      if (!ids.length) return

      this.itemsLoading = true
      try {
        const BATCH = 200
        for (let i = 0; i < ids.length; i += BATCH) {
          const chunk = ids.slice(i, i + BATCH)
          const items = await fetchItems(chunk)
          items.forEach(item => { this.itemCache[item.id] = item })
        }
      } catch {
        // 物品資訊載入失敗不影響主要功能
      } finally {
        this.itemsLoading = false
      }
    },

    /** 一次載入所有資料 */
    async loadAll(legendary) {
      await Promise.all([
        this.loadMaterials(),
        this.loadAchievements(),
      ])
      if (legendary) {
        await this.preloadItemInfo(legendary)
      }
    },
  },
})
