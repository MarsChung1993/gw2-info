<template>
  <div class="items-view container">
    <h1>物品搜尋</h1>

    <div class="search-bar">
      <input
        v-model="searchId"
        type="number"
        class="input"
        placeholder="輸入物品 ID（例如：35984）"
        @keyup.enter="search"
      />
      <button class="btn btn--primary" @click="search" :disabled="loading">
        {{ loading ? '搜尋中...' : '搜尋' }}
      </button>
    </div>

    <div class="quick-ids">
      <span class="label">快速搜尋：</span>
      <button
        v-for="preset in presets"
        :key="preset.id"
        class="preset-btn"
        @click="quickSearch(preset.id)"
      >
        {{ preset.name }}
      </button>
    </div>

    <div v-if="loading" class="loading-spinner"></div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else-if="item" class="item-detail panel">
      <div class="item-header">
        <img
          v-if="item.icon"
          :src="item.icon"
          :alt="item.name"
          class="item-icon"
        />
        <div>
          <h2 :class="`rarity-${item.rarity?.toLowerCase()}`">{{ item.name }}</h2>
          <div class="item-type">{{ item.type }} · {{ item.rarity }}</div>
        </div>
      </div>

      <p v-if="item.description" class="item-desc" v-html="formatDesc(item.description)"></p>

      <div class="item-stats">
        <div class="info-item">
          <span class="info-label">等級需求</span>
          <span class="info-value">{{ item.level }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">出售價值</span>
          <span class="info-value">{{ formatGold(item.vendor_value) }}</span>
        </div>
        <div v-if="price" class="info-item">
          <span class="info-label">交易行賣出</span>
          <span class="info-value text-gold">{{ formatGold(price.sells?.unit_price) }}</span>
        </div>
        <div v-if="price" class="info-item">
          <span class="info-label">交易行買入</span>
          <span class="info-value text-green">{{ formatGold(price.buys?.unit_price) }}</span>
        </div>
      </div>

      <div class="item-flags" v-if="item.flags?.length">
        <span v-for="flag in item.flags" :key="flag" class="flag-tag">{{ flag }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { fetchItems, fetchPrices } from '../api/endpoints'

export default defineComponent({
  name: 'ItemsView',
  setup() {
    const searchId = ref('')
    const item = ref(null)
    const price = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const presets = [
      { id: 35984, name: '傳說弓' },
      { id: 46774, name: '神器食物' },
      { id: 19721, name: '精鍊水晶' },
      { id: 68646, name: '強化石' },
    ]

    async function search() {
      const id = parseInt(searchId.value)
      if (!id) return
      loading.value = true
      error.value = null
      item.value = null
      price.value = null
      try {
        const [items, prices] = await Promise.all([
          fetchItems([id]),
          fetchPrices([id]).catch(() => []),
        ])
        item.value = items[0] || null
        price.value = prices[0] || null
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    function quickSearch(id) {
      searchId.value = id
      search()
    }

    function formatGold(copper) {
      if (!copper) return '-'
      const gold = Math.floor(copper / 10000)
      const silver = Math.floor((copper % 10000) / 100)
      const cop = copper % 100
      return `${gold}g ${silver}s ${cop}c`
    }

    function formatDesc(desc) {
      return desc.replace(/<[^>]+>/g, '')
    }

    return { searchId, item, price, loading, error, presets, search, quickSearch, formatGold, formatDesc }
  },
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.items-view {
  padding: $spacing-xl $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.search-bar {
  display: flex;
  gap: $spacing-sm;
}

.input {
  flex: 1;
  padding: $spacing-sm $spacing-md;
  background-color: $color-bg-dark;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  color: $color-text;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: $color-gold;
  }
}

.btn--primary {
  padding: $spacing-sm $spacing-lg;
  background-color: $color-gold;
  color: $color-bg-dark;
  border: none;
  border-radius: $radius-sm;
  font-weight: bold;
  cursor: pointer;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { background-color: $color-gold-light; }
}

.quick-ids {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.label {
  color: $color-text-muted;
  font-size: 0.85rem;
}

.preset-btn {
  background-color: rgba($color-gold, 0.1);
  border: 1px solid $color-gold-dark;
  color: $color-gold;
  padding: 2px $spacing-sm;
  border-radius: $radius-sm;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover { background-color: rgba($color-gold, 0.2); }
}

.item-detail {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.item-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  h2 { margin: 0; }
}

.item-icon {
  width: 64px;
  height: 64px;
  border: 2px solid $color-border;
  border-radius: $radius-sm;
}

.item-type {
  color: $color-text-muted;
  font-size: 0.9rem;
  margin-top: 4px;
}

.item-desc {
  color: $color-text-muted;
  font-size: 0.9rem;
  font-style: italic;
}

.item-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: $spacing-sm;
}

.info-item {
  background-color: $color-bg-dark;
  border-radius: $radius-sm;
  padding: $spacing-sm $spacing-md;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label { color: $color-text-muted; font-size: 0.8rem; }
.info-value { font-weight: bold; }
.text-gold { color: $color-gold; }
.text-green { color: $color-green; }

.item-flags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.flag-tag {
  background-color: rgba($color-text-muted, 0.1);
  border: 1px solid $color-border;
  color: $color-text-muted;
  padding: 2px $spacing-sm;
  border-radius: $radius-sm;
  font-size: 0.8rem;
}
</style>
