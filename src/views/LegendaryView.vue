<template>
  <div class="legendary-view container">
    <div class="legendary-header">
      <h1>傳奇武器製作進度</h1>
      <p class="legendary-header__sub">
        整合帳號材料庫、倉庫、所有角色背包，追蹤每把傳奇武器的製作進度
      </p>
    </div>

    <!-- 未登入提示 -->
    <div v-if="!accountStore.isAuthenticated" class="not-auth panel">
      <p>請先在右上角設定 API Key，需要以下權限：<code>account</code>、<code>inventories</code>、<code>progression</code></p>
    </div>

    <template v-else>
      <!-- 載入中 -->
      <div v-if="isLoading" class="loading-block">
        <div class="loading-spinner"></div>
        <span>載入材料資料中…</span>
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="legendaryStore.materialsError" class="error-message panel">
        材料庫存載入失敗：{{ legendaryStore.materialsError }}
      </div>

      <template v-if="!isLoading">
        <!-- 上方：傳奇選擇器 -->
        <div class="selector-section panel">
          <div class="selector-header">
            <h2>選擇傳奇武器</h2>
            <div class="gen-tabs">
              <button
                :class="['gen-tab', { active: selectedGen === 1 }]"
                @click="selectedGen = 1"
              >第一代</button>
            </div>
          </div>
          <div class="legendary-grid">
            <button
              v-for="leg in filteredLegendaries"
              :key="leg.id"
              :class="['legendary-btn', { active: selected?.id === leg.id }]"
              @click="selectLegendary(leg)"
            >
              <span class="legendary-btn__slot">{{ leg.slot }}</span>
              <span class="legendary-btn__name">{{ leg.name }}</span>
              <span class="legendary-btn__tw">{{ leg.nameTw }}</span>
              <!-- 進度條 -->
              <div class="legendary-btn__bar-wrap">
                <div
                  class="legendary-btn__bar"
                  :style="{ width: `${(legendaryStore.getLegendaryProgress(leg) * 100).toFixed(0)}%` }"
                ></div>
              </div>
              <span class="legendary-btn__pct">
                {{ (legendaryStore.getLegendaryProgress(leg) * 100).toFixed(0) }}%
              </span>
            </button>
          </div>
        </div>

        <!-- 下方：選定傳奇的詳細材料進度 -->
        <div v-if="selected" class="detail-section">

          <!-- 標題列 -->
          <div class="detail-header panel">
            <div class="detail-header__title">
              <h2>{{ selected.name }} <span class="tw-name">{{ selected.nameTw }}</span></h2>
              <span class="slot-badge">{{ selected.slot }}</span>
              <a :href="selected.wikiUrl" target="_blank" rel="noopener" class="wiki-link">
                Wiki ↗
              </a>
            </div>
            <div class="detail-header__precursor">
              <span class="precursor-label">前置武器：</span>
              <span class="precursor-name">{{ selected.precursor.name }}</span>
              <span class="precursor-note">{{ selected.precursor.note }}</span>
            </div>
            <!-- 整體進度 -->
            <div class="overall-progress">
              <div class="overall-progress__bar-wrap">
                <div
                  class="overall-progress__bar"
                  :style="{ width: `${(overallPct * 100).toFixed(1)}%` }"
                ></div>
              </div>
              <span class="overall-progress__label">
                可追蹤材料完成度 {{ (overallPct * 100).toFixed(1) }}%
              </span>
            </div>
          </div>

          <!-- 篩選列 -->
          <div class="filter-bar">
            <button
              v-for="cat in CATEGORIES"
              :key="cat.key"
              :class="['filter-btn', { active: activeCat === cat.key }]"
              @click="activeCat = cat.key"
            >
              {{ cat.label }}
              <span class="filter-count">{{ getCatCount(cat.key) }}</span>
            </button>
          </div>

          <!-- 材料列表 -->
          <div class="materials-section panel">
            <div class="materials-list">
              <MaterialRow
                v-for="(mat, idx) in filteredMaterials"
                :key="idx"
                :material="mat"
              />
              <div v-if="filteredMaterials.length === 0" class="empty-cat">
                此分類無材料
              </div>
            </div>
          </div>

          <!-- 成就區塊 -->
          <div v-if="selected.achievements.length > 0" class="achievements-section panel">
            <h3>相關成就</h3>
            <div class="achievements-list">
              <div
                v-for="ach in selected.achievements"
                :key="ach.id"
                :class="['achievement-row', { done: getAchDone(ach.id) }]"
              >
                <div class="achievement-row__status">
                  <span v-if="getAchDone(ach.id)" class="ach-done">✓ 已完成</span>
                  <span v-else-if="getAchProgress(ach.id)" class="ach-progress">
                    {{ getAchProgress(ach.id).current }} / {{ getAchProgress(ach.id).max }}
                  </span>
                  <span v-else class="ach-unknown">未開始</span>
                </div>
                <div class="achievement-row__info">
                  <span class="achievement-row__name">{{ ach.name }}</span>
                </div>
                <a :href="ach.wikiUrl" target="_blank" rel="noopener" class="wiki-link">
                  Wiki ↗
                </a>
              </div>
            </div>
          </div>

          <!-- 特別說明 -->
          <div class="info-notice panel">
            <h4>⚠ 注意事項</h4>
            <ul>
              <li>前置武器（Precursor）、特定禮物中的地城材料等帳號綁定物品無法由 API 自動追蹤。</li>
              <li>Gift of Exploration 需達成<strong>世界地圖 100% 完成度</strong>。</li>
              <li>Gift of Battle 需完成 <strong>WvW Gift of Battle 獎勵賽道</strong>。</li>
              <li>Bloodstone Shard 向 <strong>Miyani</strong> 以 200 Spirit Shards 購買。</li>
              <li>各傳奇武器的特定禮物（Specific Gift）細節請參考 Wiki。</li>
            </ul>
          </div>

        </div>

        <!-- 未選擇傳奇 -->
        <div v-else class="no-selection panel">
          <p>↑ 請從上方選擇欲製作的傳奇武器以查看詳細進度</p>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useAccountStore } from '../stores/account'
import { useLegendaryStore } from '../stores/legendary'
import { useInventoryStore } from '../stores/inventory'
import { LEGENDARIES } from '../data/legendaries'
import MaterialRow from '../components/legendary/MaterialRow.vue'

const CATEGORIES = [
  { key: 'all',      label: '全部'     },
  { key: 'fortune',  label: '幸運禮物' },
  { key: 'mastery',  label: '精通禮物' },
  { key: 'specific', label: '特定禮物' },
  { key: 'unlock',   label: '解鎖條件' },
]

export default defineComponent({
  name: 'LegendaryView',
  components: { MaterialRow },
  setup() {
    const accountStore   = useAccountStore()
    const legendaryStore = useLegendaryStore()
    const inventoryStore = useInventoryStore()

    const selected    = ref(null)
    const selectedGen = ref(1)
    const activeCat   = ref('all')

    const filteredLegendaries = computed(() =>
      LEGENDARIES.filter(l => l.generation === selectedGen.value)
    )

    const filteredMaterials = computed(() => {
      if (!selected.value) return []
      const mats = selected.value.materials
      if (activeCat.value === 'all') return mats
      return mats.filter(m => m.category === activeCat.value)
    })

    const overallPct = computed(() =>
      selected.value ? legendaryStore.getLegendaryProgress(selected.value) : 0
    )

    const isLoading = computed(() =>
      legendaryStore.materialsLoading || legendaryStore.achievementsLoading
    )

    function getCatCount(catKey) {
      if (!selected.value) return 0
      if (catKey === 'all') return selected.value.materials.length
      return selected.value.materials.filter(m => m.category === catKey).length
    }

    function getAchDone(id) {
      return legendaryStore.getAchievementProgress(id)?.done ?? false
    }

    function getAchProgress(id) {
      const prog = legendaryStore.getAchievementProgress(id)
      if (!prog || prog.done) return null
      if (prog.current == null) return null
      return prog
    }

    async function selectLegendary(leg) {
      selected.value = leg
      activeCat.value = 'all'
      await legendaryStore.preloadItemInfo(leg)
    }

    onMounted(async () => {
      if (!accountStore.isAuthenticated) return
      // 並行載入：材料庫、成就、倉庫
      await Promise.all([
        legendaryStore.loadMaterials(),
        legendaryStore.loadAchievements(),
        inventoryStore.loadBank(),
      ])
      // 若有角色列表，觸發載入（靜默失敗）
      if (accountStore.characters.length === 0) {
        accountStore.loadCharacters().catch(() => {})
      }
    })

    return {
      accountStore,
      legendaryStore,
      selected,
      selectedGen,
      activeCat,
      filteredLegendaries,
      filteredMaterials,
      overallPct,
      isLoading,
      CATEGORIES,
      getCatCount,
      getAchDone,
      getAchProgress,
      selectLegendary,
    }
  },
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.legendary-view {
  padding-bottom: $spacing-xl * 2;
}

.legendary-header {
  margin-bottom: $spacing-lg;

  h1 {
    font-family: $font-title;
    color: $color-gold;
    margin-bottom: $spacing-xs;
  }

  &__sub {
    color: $color-text-muted;
    font-size: 0.85rem;
  }
}

// ── 選擇器 ────────────────────────────────
.selector-section {
  margin-bottom: $spacing-lg;
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;

  h2 { font-size: 1rem; color: $color-gold; margin: 0; }
}

.gen-tabs {
  display: flex;
  gap: $spacing-xs;
}

.gen-tab {
  padding: 4px 12px;
  border-radius: $radius-sm;
  border: 1px solid $color-border;
  background: transparent;
  color: $color-text-muted;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.15s;

  &.active, &:hover {
    border-color: $color-gold;
    color: $color-gold;
  }
}

.legendary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: $spacing-sm;
}

.legendary-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: $spacing-sm;
  background: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  position: relative;
  overflow: hidden;

  &:hover { border-color: $color-gold; }

  &.active {
    border-color: $color-gold;
    background: rgba($color-gold, 0.08);
    box-shadow: 0 0 0 1px $color-gold inset;
  }

  &__slot {
    font-size: 0.65rem;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__name {
    font-size: 0.85rem;
    color: $color-text;
    font-weight: 600;
  }

  &__tw {
    font-size: 0.75rem;
    color: $color-gold;
  }

  &__bar-wrap {
    width: 100%;
    height: 3px;
    background: $color-border;
    border-radius: 2px;
    margin-top: 4px;
    overflow: hidden;
  }

  &__bar {
    height: 100%;
    background: $color-gold;
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  &__pct {
    font-size: 0.65rem;
    color: $color-text-muted;
    align-self: flex-end;
  }
}

// ── 詳細區塊 ─────────────────────────────
.detail-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.detail-header {
  h2 {
    font-family: $font-title;
    color: $color-gold;
    margin: 0 0 $spacing-xs;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    flex-wrap: wrap;
  }

  &__precursor {
    font-size: 0.82rem;
    color: $color-text-muted;
    margin-bottom: $spacing-sm;
  }
}

.tw-name {
  font-size: 0.9rem;
  color: $color-text-muted;
}

.slot-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border: 1px solid $color-gold-dark;
  border-radius: 10px;
  color: $color-gold;
}

.wiki-link {
  font-size: 0.75rem;
  color: $color-blue;
  text-decoration: none;

  &:hover { text-decoration: underline; }
}

.precursor-label { font-weight: 600; color: $color-text; }
.precursor-name  { color: $rarity-legendary; font-weight: 600; margin: 0 4px; }
.precursor-note  { font-size: 0.75rem; color: $color-text-muted; }

// 整體進度條
.overall-progress {
  margin-top: $spacing-sm;

  &__bar-wrap {
    height: 8px;
    background: $color-border;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  &__bar {
    height: 100%;
    background: linear-gradient(90deg, $color-gold-dark, $color-gold-light);
    border-radius: 4px;
    transition: width 0.4s ease;
  }

  &__label {
    font-size: 0.78rem;
    color: $color-text-muted;
  }
}

// ── 篩選列 ───────────────────────────────
.filter-bar {
  display: flex;
  gap: $spacing-xs;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: $radius-sm;
  border: 1px solid $color-border;
  background: transparent;
  color: $color-text-muted;
  cursor: pointer;
  font-size: 0.78rem;
  transition: all 0.15s;

  &:hover { border-color: $color-gold; color: $color-gold; }

  &.active {
    border-color: $color-gold;
    color: $color-gold;
    background: rgba($color-gold, 0.1);
  }
}

.filter-count {
  background: $color-bg-dark;
  border-radius: 10px;
  padding: 0 5px;
  font-size: 0.65rem;
  color: $color-text-muted;
}

// ── 材料列表 ─────────────────────────────
.materials-section {
  padding: $spacing-sm 0;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.empty-cat {
  padding: $spacing-md;
  text-align: center;
  color: $color-text-muted;
  font-size: 0.85rem;
}

// ── 成就區塊 ─────────────────────────────
.achievements-section {
  h3 {
    font-size: 0.95rem;
    color: $color-gold;
    margin: 0 0 $spacing-md;
  }
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.achievement-row {
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
  border: 1px solid $color-border;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.03); }

  &.done { border-color: rgba($color-green, 0.4); }
}

.achievement-row__status {
  font-size: 0.75rem;
  text-align: center;
}

.ach-done     { color: $color-green; font-weight: 600; }
.ach-progress { color: $color-gold; }
.ach-unknown  { color: $color-text-muted; }

.achievement-row__name { font-size: 0.82rem; color: $color-text; }

// ── 其他 ─────────────────────────────────
.info-notice {
  font-size: 0.82rem;

  h4 { color: $color-gold; margin: 0 0 $spacing-sm; font-size: 0.9rem; }

  ul {
    margin: 0;
    padding-left: 1.4em;
    color: $color-text-muted;
    line-height: 1.7;
  }

  strong { color: $color-text; }
}

.no-selection {
  text-align: center;
  color: $color-text-muted;
  padding: $spacing-xl;
}

.loading-block {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
  color: $color-text-muted;
}

// 共用 panel - 使用 global.scss 的全域定義
.not-auth { text-align: center; color: $color-text-muted; padding: $spacing-xl; }
.error-message { border-color: rgba($color-red, 0.5); color: $color-red; }
</style>
