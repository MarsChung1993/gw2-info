import { defineStore } from 'pinia'
import { fetchCharacterInventory, fetchAccountBank } from '../api/inventory'
import { fetchItems } from '../api/endpoints'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    // 角色背包：charName → { bags, loading, error }
    characterInventories: {},

    // 帳號倉庫
    bank: [],
    bankLoading: false,
    bankError: null,

    // 物品快取（id → item 資料）
    itemCache: {},
    itemsLoading: false,
  }),

  getters: {
    // 取得角色背包狀態
    getCharInventory: (state) => (charName) =>
      state.characterInventories[charName] ?? null,

    // 展開角色背包的所有格子（排除空格）
    getCharItems: (state) => (charName) => {
      const inv = state.characterInventories[charName]
      if (!inv?.bags) return []
      return inv.bags.flatMap((bag, bagIndex) =>
        (bag?.inventory ?? []).map((slot, slotIndex) => ({
          ...slot,
          bagIndex,
          slotIndex,
          bagId: bag.id,
          bagSize: bag.size,
        }))
      )
    },

    // 展開倉庫所有非空格
    bankItems: (state) =>
      state.bank.map((slot, index) => (slot ? { ...slot, slotIndex: index } : null)),

    // 從快取取得物品詳細
    getItemInfo: (state) => (id) => state.itemCache[id] ?? null,
  },

  actions: {
    // 載入角色背包
    async loadCharacterInventory(charName) {
      if (this.characterInventories[charName]?.bags) return

      this.characterInventories[charName] = { bags: null, loading: true, error: null }
      try {
        const data = await fetchCharacterInventory(charName)
        this.characterInventories[charName] = {
          bags: data.bags,
          loading: false,
          error: null,
        }
        await this._resolveItemIds(this._extractItemIds(data.bags))
      } catch (err) {
        this.characterInventories[charName] = {
          bags: null,
          loading: false,
          error: err.message,
        }
      }
    },

    // 強制重新載入角色背包
    async reloadCharacterInventory(charName) {
      delete this.characterInventories[charName]
      await this.loadCharacterInventory(charName)
    },

    // 載入帳號倉庫
    async loadBank() {
      this.bankLoading = true
      this.bankError = null
      try {
        this.bank = await fetchAccountBank()
        const ids = this.bank
          .filter(Boolean)
          .map((s) => s.id)
        await this._resolveItemIds(ids)
      } catch (err) {
        this.bankError = err.message
      } finally {
        this.bankLoading = false
      }
    },

    // 強制重新載入倉庫
    async reloadBank() {
      this.bank = []
      await this.loadBank()
    },

    // 從背包結構中抽出所有物品 ID（含背包本身 + 物品 + 升級組件 + 注靈）
    _extractItemIds(bags) {
      const ids = new Set()
      bags.forEach((bag) => {
        if (!bag) return
        ids.add(bag.id)
        ;(bag.inventory ?? []).forEach((slot) => {
          if (!slot) return
          ids.add(slot.id)
          ;(slot.upgrades ?? []).forEach((id) => ids.add(id))
          ;(slot.infusions ?? []).forEach((id) => ids.add(id))
        })
      })
      return [...ids]
    },

    // 批量解析物品 ID → 名稱/圖示（每批最多 200 筆）
    async _resolveItemIds(ids) {
      const missing = ids.filter((id) => id && !this.itemCache[id])
      if (!missing.length) return

      this.itemsLoading = true
      try {
        // GW2 API 單次最多 200 筆
        const BATCH = 200
        for (let i = 0; i < missing.length; i += BATCH) {
          const chunk = missing.slice(i, i + BATCH)
          const result = await fetchItems(chunk)
          result.forEach((item) => { this.itemCache[item.id] = item })
        }
      } catch {
        // 解析失敗不阻斷主流程
      } finally {
        this.itemsLoading = false
      }
    },
  },
})
