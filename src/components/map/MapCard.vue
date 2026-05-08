<template>
  <div class="map-card">
    <!-- 標頭 -->
    <div class="map-card__header">
      <div>
        <h3 class="map-card__name">{{ map.name }}</h3>
        <div class="map-card__meta">
          <span :class="['type-badge', `type-${typeClass}`]">{{ map.type || '未知類型' }}</span>
          <span v-if="map.min_level !== undefined" class="level-badge">
            Lv.{{ map.min_level }}–{{ map.max_level }}
          </span>
          <span v-if="map.continent_name" class="info-chip">{{ map.continent_name }}</span>
          <span v-if="map.region_name" class="info-chip">{{ map.region_name }}</span>
        </div>
      </div>
      <span class="map-card__id">#{{ map.id }}</span>
    </div>

    <!-- 基本資訊格線 -->
    <div class="info-grid">
      <div class="info-item" v-if="map.default_floor !== undefined">
        <span class="info-label">預設樓層</span>
        <span class="info-value">{{ map.default_floor }}</span>
      </div>
      <div class="info-item" v-if="map.floors?.length">
        <span class="info-label">可用樓層</span>
        <span class="info-value">{{ map.floors.slice(0, 8).join(', ') }}{{ map.floors.length > 8 ? '...' : '' }}</span>
      </div>
      <div class="info-item" v-if="map.continent_id !== undefined">
        <span class="info-label">大陸 ID</span>
        <span class="info-value">{{ map.continent_id }}</span>
      </div>
      <div class="info-item" v-if="map.region_id !== undefined">
        <span class="info-label">地區 ID</span>
        <span class="info-value">{{ map.region_id }}</span>
      </div>
    </div>

    <!-- 座標 -->
    <div v-if="map.map_rect || map.continent_rect" class="coords-section">
      <div v-if="map.map_rect" class="coord-row">
        <span class="coord-label">地圖座標（SW→NE）</span>
        <code class="coord-value">{{ formatRect(map.map_rect) }}</code>
      </div>
      <div v-if="map.continent_rect" class="coord-row">
        <span class="coord-label">大陸座標（NW→SE）</span>
        <code class="coord-value">{{ formatRect(map.continent_rect) }}</code>
      </div>
    </div>

    <!-- 從 continents floor data 展開的詳細資訊 -->
    <template v-if="floorData">
      <!-- POI 統計 -->
      <div v-if="poiStats" class="stats-row">
        <div v-for="(count, type) in poiStats" :key="type" class="stat-chip">
          <span class="stat-icon">{{ poiIcon(type) }}</span>
          <span class="stat-label">{{ poiLabel(type) }}</span>
          <span class="stat-count">{{ count }}</span>
        </div>
      </div>

      <!-- 興趣點列表 -->
      <div v-if="pois.length" class="detail-section">
        <h4 class="detail-title">興趣點（{{ pois.length }}）</h4>
        <div class="poi-list">
          <div v-for="poi in pois.slice(0, visiblePois)" :key="poi.id" class="poi-item">
            <span :class="['poi-type', `poi-type--${poi.type}`]">{{ poiIcon(poi.type) }}</span>
            <span class="poi-name">{{ poi.name || '（無名稱）' }}</span>
            <span class="poi-coord">{{ formatCoord(poi.coord) }}</span>
            <span class="poi-chat" :title="poi.chat_link">{{ poi.chat_link }}</span>
          </div>
        </div>
        <button v-if="pois.length > visiblePois" class="show-more" @click="visiblePois += 20">
          顯示更多（剩餘 {{ pois.length - visiblePois }}）
        </button>
      </div>

      <!-- 榮譽之心 -->
      <div v-if="tasks.length" class="detail-section">
        <h4 class="detail-title">榮譽之心（{{ tasks.length }}）</h4>
        <div class="task-list">
          <div v-for="task in tasks" :key="task.id" class="task-item">
            <span class="task-icon">❤️</span>
            <div>
              <div class="task-objective">{{ task.objective }}</div>
              <div class="task-meta">Lv.{{ task.level }} · {{ formatCoord(task.coord) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 精通點 -->
      <div v-if="masteryPoints.length" class="detail-section">
        <h4 class="detail-title">精通洞察（{{ masteryPoints.length }}）</h4>
        <div class="mastery-list">
          <div v-for="mp in masteryPoints" :key="mp.id" class="mastery-item">
            <span :class="['mastery-region', `mastery-region--${mp.region?.toLowerCase()}`]">
              {{ mp.region }}
            </span>
            <span class="mastery-coord">{{ formatCoord(mp.coord) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'

const TYPE_CLASS_MAP = {
  Public: 'public',
  Instance: 'instance',
  Tutorial: 'tutorial',
  Pvp: 'pvp',
  BlueHome: 'wvw',
  RedHome: 'wvw',
  GreenHome: 'wvw',
  Center: 'wvw',
  EdgeOfTheMists: 'wvw',
  JumpPuzzle: 'wvw',
  Unknown: 'unknown',
}

const POI_ICONS = {
  landmark: '🗺️',
  waypoint: '🔵',
  vista: '👁️',
  unlock: '🔓',
}

const POI_LABELS = {
  landmark: '地標',
  waypoint: '路徑點',
  vista: '觀景台',
  unlock: '解鎖點',
}

export default defineComponent({
  name: 'MapCard',
  props: {
    map: {
      type: Object,
      required: true,
    },
    // 是否顯示 continents floor data（POI / tasks / mastery）
    floorData: {
      type: Boolean,
      default: false,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const visiblePois = ref(20)

    const typeClass = computed(
      () => TYPE_CLASS_MAP[props.map.type] ?? 'unknown'
    )

    const pois = computed(() => {
      const raw = props.map.points_of_interest
      if (!raw) return []
      return Object.values(raw)
    })

    const tasks = computed(() => {
      const raw = props.map.tasks
      if (!raw) return []
      return Object.values(raw)
    })

    const masteryPoints = computed(() => props.map.mastery_points ?? [])

    const poiStats = computed(() => {
      if (!pois.value.length) return null
      return pois.value.reduce((acc, p) => {
        acc[p.type] = (acc[p.type] ?? 0) + 1
        return acc
      }, {})
    })

    function formatRect(rect) {
      if (!rect) return '-'
      return `[${rect[0].join(', ')}] → [${rect[1].join(', ')}]`
    }

    function formatCoord(coord) {
      if (!coord) return '-'
      return `(${coord[0].toFixed(1)}, ${coord[1].toFixed(1)})`
    }

    function poiIcon(type) { return POI_ICONS[type] ?? '📍' }
    function poiLabel(type) { return POI_LABELS[type] ?? type }

    return {
      visiblePois,
      typeClass,
      pois,
      tasks,
      masteryPoints,
      poiStats,
      formatRect,
      formatCoord,
      poiIcon,
      poiLabel,
    }
  },
})
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;

.map-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $spacing-sm;
  }

  &__name { font-size: 1.15rem; margin: 0 0 $spacing-xs; }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
    align-items: center;
  }

  &__id {
    color: $color-text-muted;
    font-family: $font-mono;
    font-size: 0.85rem;
    white-space: nowrap;
  }
}

// 地圖類型 Badge
.type-badge {
  padding: 2px $spacing-sm;
  border-radius: $radius-sm;
  font-size: 0.8rem;
  font-weight: bold;

  &.type-public    { background: rgba(#27ae60, 0.2); color: #4ecb81; border: 1px solid #27ae60; }
  &.type-instance  { background: rgba(#8e44ad, 0.2); color: #c39bd3; border: 1px solid #8e44ad; }
  &.type-tutorial  { background: rgba(#2980b9, 0.2); color: #7fb3d3; border: 1px solid #2980b9; }
  &.type-pvp       { background: rgba(#e74c3c, 0.2); color: #f1948a; border: 1px solid #e74c3c; }
  &.type-wvw       { background: rgba(#e67e22, 0.2); color: #f0b27a; border: 1px solid #e67e22; }
  &.type-unknown   { background: rgba(#7f8c8d, 0.2); color: #aab7b8; border: 1px solid #7f8c8d; }
}

.level-badge {
  background-color: rgba($color-gold, 0.15);
  border: 1px solid $color-gold-dark;
  color: $color-gold;
  padding: 2px $spacing-sm;
  border-radius: $radius-sm;
  font-size: 0.8rem;
}

.info-chip {
  color: $color-text-muted;
  font-size: 0.82rem;
  padding: 2px $spacing-sm;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
}

// 資訊格線
.info-grid {
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
  gap: 2px;
}

.info-label { color: $color-text-muted; font-size: 0.78rem; }
.info-value { font-weight: bold; font-size: 0.9rem; }

// 座標
.coords-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  padding: $spacing-sm;
  background-color: $color-bg-dark;
  border-radius: $radius-sm;
}

.coord-row {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  align-items: baseline;
  font-size: 0.85rem;
}

.coord-label { color: $color-text-muted; white-space: nowrap; }
.coord-value { font-family: $font-mono; color: $color-gold; font-size: 0.82rem; }

// POI 統計
.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  background-color: $color-bg-dark;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  padding: $spacing-xs $spacing-sm;
  font-size: 0.85rem;
}

.stat-label { color: $color-text-muted; }
.stat-count { color: $color-gold; font-weight: bold; }

// 詳細區塊
.detail-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  border-top: 1px solid $color-border;
  padding-top: $spacing-sm;
}

.detail-title { font-size: 0.95rem; color: $color-gold; margin: 0; }

// POI 列表
.poi-list { display: flex; flex-direction: column; gap: 2px; }

.poi-item {
  display: grid;
  grid-template-columns: 24px 1fr auto auto;
  gap: $spacing-sm;
  align-items: center;
  padding: 3px $spacing-sm;
  border-radius: $radius-sm;
  font-size: 0.85rem;

  &:hover { background-color: rgba(255,255,255,0.03); }
}

.poi-type { text-align: center; }
.poi-name { color: $color-text; }
.poi-coord { color: $color-text-muted; font-family: $font-mono; font-size: 0.78rem; }
.poi-chat { color: $color-text-muted; font-family: $font-mono; font-size: 0.78rem; }

.show-more {
  align-self: flex-start;
  background: none;
  border: 1px solid $color-border;
  color: $color-text-muted;
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-sm;
  cursor: pointer;
  font-size: 0.85rem;

  &:hover { border-color: $color-gold; color: $color-gold; }
}

// 任務列表
.task-list { display: flex; flex-direction: column; gap: $spacing-xs; }

.task-item {
  display: flex;
  gap: $spacing-sm;
  align-items: flex-start;
  padding: $spacing-xs 0;
}

.task-icon { font-size: 1rem; margin-top: 2px; }
.task-objective { font-size: 0.9rem; }
.task-meta { font-size: 0.78rem; color: $color-text-muted; margin-top: 2px; }

// 精通點
.mastery-list { display: flex; flex-wrap: wrap; gap: $spacing-xs; }

.mastery-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: 0.82rem;
}

.mastery-region {
  padding: 1px $spacing-sm;
  border-radius: $radius-sm;
  font-size: 0.78rem;
  font-weight: bold;

  &--tyria   { background: rgba(#e74c3c,0.2); color: #f1948a; border: 1px solid #c0392b; }
  &--maguuma { background: rgba(#27ae60,0.2); color: #4ecb81; border: 1px solid #1e8449; }
  &--desert  { background: rgba(#8e44ad,0.2); color: #c39bd3; border: 1px solid #76448a; }
  &--tundra  { background: rgba(#2980b9,0.2); color: #7fb3d3; border: 1px solid #1a5276; }
  &--jade    { background: rgba(#1abc9c,0.2); color: #76d7c4; border: 1px solid #148f77; }
  &--sky     { background: rgba($color-gold,0.2); color: $color-gold; border: 1px solid $color-gold-dark; }
  &--wild    { background: rgba(#2c3e50,0.3); color: #85929e; border: 1px solid #273746; }
  &--magic   { background: rgba(#e67e22,0.2); color: #f0b27a; border: 1px solid #ba6218; }
}

.mastery-coord { font-family: $font-mono; color: $color-text-muted; }
</style>
