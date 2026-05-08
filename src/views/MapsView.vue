<template>
  <div class="maps-view container">
    <h1>地圖資訊</h1>

    <!-- 頂部控制列 -->
    <div class="controls panel">
      <div class="controls__row">
        <!-- 大陸選擇 -->
        <div class="control-group">
          <label class="control-label">大陸</label>
          <div class="btn-group">
            <button
              v-for="c in mapStore.continents"
              :key="c.id"
              :class="['btn', mapStore.selectedContinentId === c.id ? 'btn--active' : 'btn--outline']"
              @click="selectContinent(c.id)"
            >
              {{ c.name }}
            </button>
          </div>
        </div>

        <!-- 樓層輸入 -->
        <div class="control-group">
          <label class="control-label">樓層 ID</label>
          <div class="inline-input">
            <input
              v-model.number="floorInput"
              type="number"
              class="input input--sm"
              placeholder="e.g. 1"
            />
            <button class="btn btn--primary" @click="loadFloor" :disabled="mapStore.loading">
              載入
            </button>
          </div>
        </div>

        <!-- 快速地圖 ID 搜尋 -->
        <div class="control-group">
          <label class="control-label">依 ID 搜尋地圖</label>
          <div class="inline-input">
            <input
              v-model.number="mapIdInput"
              type="number"
              class="input input--sm"
              placeholder="e.g. 15"
              @keyup.enter="searchMap"
            />
            <button class="btn btn--primary" @click="searchMap" :disabled="mapStore.loading">
              搜尋
            </button>
          </div>
        </div>
      </div>

      <!-- 大陸資訊 -->
      <div v-if="currentContinent" class="continent-info">
        <span class="info-chip">{{ currentContinent.name }}</span>
        <span class="info-chip">圖磚尺寸：{{ currentContinent.continent_dims?.join(' × ') }}</span>
        <span class="info-chip">縮放：{{ currentContinent.min_zoom }} – {{ currentContinent.max_zoom }}</span>
        <span class="info-chip">樓層數：{{ currentContinent.floors?.length }}</span>
      </div>
    </div>

    <div v-if="mapStore.loading" class="loading-spinner"></div>
    <div v-else-if="mapStore.error" class="error-message">{{ mapStore.error }}</div>

    <!-- 搜尋結果：單一地圖（/v2/maps/:id）-->
    <div v-if="searchedMap" class="section">
      <h2 class="section-title">搜尋結果</h2>
      <MapCard :map="searchedMap" expanded />
    </div>

    <!-- 樓層資料：地區 + 地圖 -->
    <div v-if="mapStore.currentFloor" class="section">
      <h2 class="section-title">
        樓層 {{ mapStore.selectedFloorId }} —
        {{ mapStore.regions.length }} 個地區
      </h2>

      <div class="region-grid">
        <div
          v-for="region in mapStore.regions"
          :key="region.id"
          :class="['region-card card', { active: mapStore.selectedRegionId === region.id }]"
          @click="selectRegion(region.id)"
        >
          <div class="region-card__name">{{ region.name }}</div>
          <div class="region-card__meta">
            {{ Object.keys(region.maps || {}).length }} 張地圖
          </div>
        </div>
      </div>

      <!-- 地區內地圖列表 -->
      <div v-if="mapStore.currentRegion" class="region-maps">
        <h3 class="section-subtitle">
          {{ mapStore.currentRegion.name }} — {{ mapStore.currentRegionMaps.length }} 張地圖
        </h3>
        <div class="map-grid">
          <div
            v-for="m in mapStore.currentRegionMaps"
            :key="m.id"
            :class="['map-item card', { active: mapStore.selectedMapId === m.id }]"
            @click="selectMap(m)"
          >
            <div class="map-item__name">{{ m.name }}</div>
            <div class="map-item__meta">
              Lv.{{ m.min_level }}–{{ m.max_level }}
            </div>
          </div>
        </div>

        <!-- 選取地圖詳細 -->
        <div v-if="selectedRegionMap" class="map-detail panel">
          <MapCard :map="selectedRegionMap" :floor-data="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useMapStore } from '../stores/map'
import MapCard from '../components/map/MapCard.vue'

export default defineComponent({
  name: 'MapsView',
  components: { MapCard },
  setup() {
    const mapStore = useMapStore()
    const floorInput = ref(1)
    const mapIdInput = ref('')
    const searchedMap = ref(null)

    const currentContinent = computed(() =>
      mapStore.continents.find((c) => c.id === mapStore.selectedContinentId) ?? null
    )

    const selectedRegionMap = computed(() => {
      if (!mapStore.selectedMapId || !mapStore.currentRegion?.maps) return null
      return {
        id: mapStore.selectedMapId,
        ...mapStore.currentRegion.maps[mapStore.selectedMapId],
      }
    })

    onMounted(async () => {
      await mapStore.loadContinents()
    })

    async function selectContinent(id) {
      mapStore.selectedContinentId = id
      mapStore.currentFloor = null
      mapStore.currentRegion = null
    }

    async function loadFloor() {
      await mapStore.loadFloor(mapStore.selectedContinentId, floorInput.value)
    }

    async function selectRegion(regionId) {
      if (mapStore.selectedRegionId === regionId) {
        mapStore.selectedRegionId = null
        mapStore.currentRegion = null
        return
      }
      await mapStore.loadRegion(
        mapStore.selectedContinentId,
        mapStore.selectedFloorId,
        regionId
      )
    }

    function selectMap(m) {
      if (mapStore.selectedMapId === m.id) {
        mapStore.setSelectedMap(null)
      } else {
        mapStore.setSelectedMap(m.id)
      }
    }

    async function searchMap() {
      if (!mapIdInput.value) return
      searchedMap.value = null
      await mapStore.loadMap(Number(mapIdInput.value))
      searchedMap.value = mapStore.getMap(Number(mapIdInput.value))
    }

    return {
      mapStore,
      floorInput,
      mapIdInput,
      searchedMap,
      currentContinent,
      selectedRegionMap,
      selectContinent,
      loadFloor,
      selectRegion,
      selectMap,
      searchMap,
    }
  },
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.maps-view {
  padding: $spacing-xl $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

// 控制列
.controls {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-lg;
    align-items: flex-end;
  }
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.control-label {
  font-size: 0.8rem;
  color: $color-text-muted;
}

.btn-group {
  display: flex;
  gap: $spacing-xs;
}

.inline-input {
  display: flex;
  gap: $spacing-xs;
}

.input {
  padding: $spacing-sm $spacing-md;
  background-color: $color-bg-dark;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  color: $color-text;
  font-size: 0.95rem;

  &--sm { width: 120px; }

  &:focus {
    outline: none;
    border-color: $color-gold;
  }
}

.continent-info {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
  padding-top: $spacing-sm;
  border-top: 1px solid $color-border;
}

.info-chip {
  background-color: rgba($color-gold, 0.1);
  border: 1px solid $color-gold-dark;
  color: $color-gold;
  padding: 2px $spacing-sm;
  border-radius: 9999px;
  font-size: 0.82rem;
}

// 按鈕
.btn {
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-sm;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &--primary {
    background-color: $color-gold;
    color: $color-bg-dark;
    font-weight: bold;
    &:hover:not(:disabled) { background-color: $color-gold-light; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &--outline {
    background-color: transparent;
    border: 1px solid $color-border;
    color: $color-text-muted;
    &:hover { border-color: $color-gold; color: $color-gold; }
  }

  &--active {
    background-color: rgba($color-gold, 0.2);
    border: 1px solid $color-gold;
    color: $color-gold;
    font-weight: bold;
  }
}

// 地區格線
.section { display: flex; flex-direction: column; gap: $spacing-md; }
.section-title { font-size: 1.1rem; }
.section-subtitle { font-size: 1rem; color: $color-text-muted; }

.region-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: $spacing-sm;
}

.region-card {
  cursor: pointer;
  transition: all 0.2s;

  &:hover, &.active {
    border-color: $color-gold;
  }

  &__name { font-weight: bold; font-size: 0.95rem; margin-bottom: 4px; }
  &__meta { font-size: 0.8rem; color: $color-text-muted; }
}

// 地圖格線
.region-maps {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding-top: $spacing-md;
  border-top: 1px solid $color-border;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: $spacing-xs;
}

.map-item {
  cursor: pointer;
  padding: $spacing-sm;
  transition: all 0.2s;

  &:hover, &.active { border-color: $color-gold; }
  &__name { font-size: 0.9rem; font-weight: bold; }
  &__meta { font-size: 0.78rem; color: $color-text-muted; }
}
</style>
