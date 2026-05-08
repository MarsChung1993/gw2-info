import { defineStore } from 'pinia'
import { fetchItems, fetchPrices } from '../api/endpoints'

export const useItemStore = defineStore('items', {
  state: () => ({
    items: {},
    prices: {},
    loading: false,
    error: null,
  }),

  getters: {
    getItem: (state) => (id) => state.items[id] || null,
    getPrice: (state) => (id) => state.prices[id] || null,
  },

  actions: {
    async loadItems(ids) {
      const missing = ids.filter((id) => !this.items[id])
      if (!missing.length) return
      this.loading = true
      this.error = null
      try {
        const result = await fetchItems(missing)
        result.forEach((item) => {
          this.items[item.id] = item
        })
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async loadPrices(ids) {
      this.loading = true
      this.error = null
      try {
        const result = await fetchPrices(ids)
        result.forEach((price) => {
          this.prices[price.id] = price
        })
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
