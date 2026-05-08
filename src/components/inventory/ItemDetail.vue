<template>
  <div v-if="slot && itemInfo" class="item-detail">
    <div class="item-detail__header">
      <img v-if="itemInfo.icon" :src="itemInfo.icon" :alt="itemInfo.name" class="item-detail__icon" />
      <div>
        <div :class="['item-detail__name', `rarity-${itemInfo.rarity?.toLowerCase()}`]">
          {{ itemInfo.name }}
        </div>
        <div class="item-detail__type">
          {{ itemInfo.type }}
          <span v-if="itemInfo.details?.type"> · {{ itemInfo.details.type }}</span>
        </div>
        <div class="item-detail__rarity" :class="`rarity-${itemInfo.rarity?.toLowerCase()}`">
          {{ itemInfo.rarity }}
        </div>
      </div>
    </div>

    <div class="item-detail__tags">
      <span v-if="slot.count > 1" class="tag tag--count">×{{ slot.count }}</span>
      <span v-if="slot.charges != null" class="tag tag--charges">充能 {{ slot.charges }}</span>
      <span v-if="slot.binding" :class="['tag', `tag--${slot.binding.toLowerCase()}`]">
        {{ slot.binding === 'Account' ? '帳號綁定' : `角色綁定：${slot.bound_to}` }}
      </span>
      <span v-if="itemInfo.level" class="tag tag--level">需等級 {{ itemInfo.level }}</span>
    </div>

    <!-- 屬性 -->
    <div v-if="slot.stats?.attributes && hasAttributes" class="item-detail__stats">
      <div class="stats-title">屬性</div>
      <div class="stats-grid">
        <div v-for="(val, key) in filteredAttributes" :key="key" class="stat-row">
          <span class="stat-key">{{ attrLabel(key) }}</span>
          <span class="stat-val">+{{ val }}</span>
        </div>
      </div>
    </div>

    <!-- 升級組件 -->
    <div v-if="upgrades.length" class="item-detail__upgrades">
      <div class="upgrades-title">升級組件</div>
      <div v-for="u in upgrades" :key="u.id" class="upgrade-row">
        <img v-if="u.icon" :src="u.icon" :alt="u.name" class="upgrade-icon" />
        <span :class="`rarity-${u.rarity?.toLowerCase()}`">{{ u.name }}</span>
      </div>
    </div>

    <!-- 注靈 -->
    <div v-if="infusions.length" class="item-detail__upgrades">
      <div class="upgrades-title">注靈</div>
      <div v-for="inf in infusions" :key="inf.id" class="upgrade-row">
        <img v-if="inf.icon" :src="inf.icon" :alt="inf.name" class="upgrade-icon" />
        <span :class="`rarity-${inf.rarity?.toLowerCase()}`">{{ inf.name }}</span>
      </div>
    </div>

    <!-- 描述 -->
    <p v-if="itemInfo.description" class="item-detail__desc">{{ stripHtml(itemInfo.description) }}</p>

    <div class="item-detail__footer">
      <span class="item-id">ID: {{ slot.id }}</span>
      <span v-if="itemInfo.vendor_value" class="vendor-value">
        售價：{{ formatGold(itemInfo.vendor_value) }}
      </span>
    </div>
  </div>

  <div v-else-if="slot && !itemInfo" class="item-detail item-detail--loading">
    <div class="loading-spinner"></div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useInventoryStore } from '../../stores/inventory'

const ATTR_LABELS = {
  Power: '力量',
  Precision: '精準',
  Toughness: '韌性',
  Vitality: '活力',
  ConditionDamage: '異況傷害',
  ConditionDuration: '異況持續',
  Healing: '治癒力',
  BoonDuration: '祝福持續',
  CritDamage: '爆擊傷害',
  AgonyResistance: '苦難抗性',
  'Condition Damage': '異況傷害',
  'Condition Duration': '異況持續',
  'Boon Duration': '祝福持續',
}

export default defineComponent({
  name: 'ItemDetail',
  props: {
    slot: { type: Object, default: null },
  },
  setup(props) {
    const inventoryStore = useInventoryStore()

    const itemInfo = computed(() =>
      props.slot ? inventoryStore.getItemInfo(props.slot.id) : null
    )

    const filteredAttributes = computed(() => {
      const attrs = props.slot?.stats?.attributes
      if (!attrs) return {}
      return Object.fromEntries(Object.entries(attrs).filter(([, v]) => v > 0))
    })

    const hasAttributes = computed(() => Object.keys(filteredAttributes.value).length > 0)

    const upgrades = computed(() =>
      (props.slot?.upgrades ?? [])
        .map((id) => inventoryStore.getItemInfo(id))
        .filter(Boolean)
    )

    const infusions = computed(() =>
      (props.slot?.infusions ?? [])
        .map((id) => inventoryStore.getItemInfo(id))
        .filter(Boolean)
    )

    function attrLabel(key) { return ATTR_LABELS[key] ?? key }

    function stripHtml(str) {
      return str?.replace(/<[^>]+>/g, '') ?? ''
    }

    function formatGold(copper) {
      if (!copper) return '-'
      const g = Math.floor(copper / 10000)
      const s = Math.floor((copper % 10000) / 100)
      const c = copper % 100
      return `${g}g ${s}s ${c}c`
    }

    return {
      itemInfo,
      filteredAttributes,
      hasAttributes,
      upgrades,
      infusions,
      attrLabel,
      stripHtml,
      formatGold,
    }
  },
})
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;

.item-detail {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  min-height: 120px;

  &--loading {
    justify-content: center;
    align-items: center;
  }

  &__header {
    display: flex;
    gap: $spacing-sm;
    align-items: flex-start;
  }

  &__icon {
    width: 56px;
    height: 56px;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    flex-shrink: 0;
  }

  &__name {
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.2;
  }

  &__type {
    font-size: 0.82rem;
    color: $color-text-muted;
    margin-top: 2px;
  }

  &__rarity {
    font-size: 0.8rem;
    margin-top: 2px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }

  &__stats {
    border-top: 1px solid $color-border;
    padding-top: $spacing-sm;
  }

  &__upgrades {
    border-top: 1px solid $color-border;
    padding-top: $spacing-sm;
  }

  &__desc {
    font-size: 0.85rem;
    color: $color-text-muted;
    font-style: italic;
    border-top: 1px solid $color-border;
    padding-top: $spacing-sm;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: $color-text-muted;
    border-top: 1px solid $color-border;
    padding-top: $spacing-xs;
  }
}

.tag {
  font-size: 0.75rem;
  padding: 2px $spacing-sm;
  border-radius: $radius-sm;
  border: 1px solid $color-border;

  &--count   { color: $color-gold; border-color: $color-gold-dark; }
  &--charges { color: #74b9ff; border-color: #2d6fa0; }
  &--account { background: rgba(#2980b9, 0.2); color: #7fb3d3; border-color: #2980b9; }
  &--character { background: rgba(#c0392b, 0.2); color: #f1948a; border-color: #c0392b; }
  &--level   { color: $color-text-muted; }
}

.stats-title, .upgrades-title {
  font-size: 0.8rem;
  color: $color-text-muted;
  margin-bottom: $spacing-xs;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.stat-key { color: $color-text-muted; }
.stat-val { color: $color-gold; font-weight: bold; }

.upgrade-row {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: 0.85rem;
  margin-bottom: 2px;
}

.upgrade-icon {
  width: 24px;
  height: 24px;
  border: 1px solid $color-border;
  border-radius: 2px;
}

.item-id { font-family: $font-mono; }
.vendor-value { color: $color-gold; }
</style>
