import { defineStore } from 'pinia'
import { fetchAccount, fetchCharacters } from '../api/endpoints'

export const useAccountStore = defineStore('account', {
  state: () => ({
    apiKey: localStorage.getItem('gw2_api_key') || '',
    account: null,
    characters: [],
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.apiKey,
    accountName: (state) => state.account?.name || '',
    characterCount: (state) => state.characters.length,
  },

  actions: {
    setApiKey(key) {
      this.apiKey = key
      localStorage.setItem('gw2_api_key', key)
    },

    clearApiKey() {
      this.apiKey = ''
      this.account = null
      this.characters = []
      localStorage.removeItem('gw2_api_key')
    },

    async loadAccount() {
      if (!this.apiKey) return
      this.loading = true
      this.error = null
      try {
        this.account = await fetchAccount()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async loadCharacters() {
      if (!this.apiKey) return
      this.loading = true
      this.error = null
      try {
        this.characters = await fetchCharacters()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
