<template>
  <div :class="['material-row', statusClass]">
    <!-- 物品圖示 -->
    <div class="material-row__icon">
      <img
        v-if="itemInfo?.icon"
        :src="itemInfo.icon"
        :alt="displayName"
        class="item-icon"
      />
      <span v-else class="item-icon item-icon--placeholder">?</span>
    </div>

    <!-- 名稱與備注 -->
    <div class="material-row__info">
      <span class="material-row__name">{{ displayName }}</span>
      <span v-if="material.note" class="material-row__note">{{ material.note }}</span>
    </div>

    <!-- 進度 -->
    <div class="material-row__progress">
      <div class="material-row__bar-wrap">
        <div class="material-row__bar" :style="{ width: barWidth }"></div>
      </div>
      <span class="material-row__count">
        <span :class="['have', { 'have--enough': isEnough }]">{{ haveDisplay }}</span>
        <span class="sep"> / </span>
        <span class="need">{{ material.qty.toLocaleString() }}</span>
      </span>
    </div>

    <!-- 狀態標籤 -->
    <div class="material-row__badge">
      <span v-if="isUnlock" class="badge badge--unlock">解鎖</span>
      <span v-else-if="isEnough" class="badge badge--done">✓</span>
      <span v-else-if="have > 0" class="badge badge--partial">進行中</span>
      <span v-else class="badge badge--none">缺少</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useLegendaryStore } from '../../stores/legendary'

export default defineComponent({
  name: 'MaterialRow',
  props: {
    material: {
      type: Object,
      required: true,
      // { id, name, qty, category, note? }
    },
  },
  setup(props) {
    const legendaryStore = useLegendaryStore()

    const isUnlock = computed(() => props.material.category === 'unlock')

    const itemInfo = computed(() =>
      props.material.id ? legendaryStore.getItemInfo(props.material.id) : null
    )

    const displayName = computed(() =>
      itemInfo.value?.name || props.material.name
    )

    const have = computed(() =>
      isUnlock.value ? 0 : legendaryStore.getTotalItemCount(props.material.id)
    )

    const isEnough = computed(() => have.value >= props.material.qty)

    const haveDisplay = computed(() =>
      isUnlock.value ? '—' : have.value.toLocaleString()
    )

    const barWidth = computed(() => {
      if (isUnlock.value) return '0%'
      const pct = Math.min((have.value / props.material.qty) * 100, 100)
      return `${pct.toFixed(1)}%`
    })

    const statusClass = computed(() => {
      if (isUnlock.value) return 'material-row--unlock'
      if (isEnough.value) return 'material-row--done'
      if (have.value > 0) return 'material-row--partial'
      return 'material-row--none'
    })

    return { itemInfo, displayName, have, isEnough, haveDisplay, barWidth, statusClass, isUnlock }
  },
})
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;

.material-row {
  display: grid;
  grid-template-columns: 40px 1fr 180px 80px;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-sm;
  border-left: 3px solid transparent;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.03); }

  &--done    { border-left-color: $color-green; }
  &--partial { border-left-color: $color-gold; }
  &--none    { border-left-color: $color-red; }
  &--unlock  { border-left-color: $color-blue; }
}

.item-icon {
  width: 32px;
  height: 32px;
  border-radius: $radius-sm;
  object-fit: cover;
  border: 1px solid $color-border;

  &--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-bg-card;
    color: $color-text-muted;
    font-size: 14px;
  }
}

.material-row__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.material-row__name {
  font-size: 0.85rem;
  color: $color-text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.material-row__note {
  font-size: 0.7rem;
  color: $color-text-muted;
  margin-top: 2px;
}

.material-row__progress {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.material-row__bar-wrap {
  height: 4px;
  background: $color-border;
  border-radius: 2px;
  overflow: hidden;
}

.material-row__bar {
  height: 100%;
  background: $color-gold;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.material-row__count {
  font-size: 0.75rem;
  text-align: right;

  .have { color: $color-text-muted; }
  .have--enough { color: $color-green; font-weight: 600; }
  .sep { color: $color-border; }
  .need { color: $color-text; }
}

.badge {
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 10px;
  text-align: center;
  white-space: nowrap;

  &--done    { background: rgba($color-green, 0.2); color: $color-green; }
  &--partial { background: rgba($color-gold, 0.2); color: $color-gold; }
  &--none    { background: rgba($color-red, 0.2); color: $color-red; }
  &--unlock  { background: rgba($color-blue, 0.2); color: $color-blue; }
}
</style>
