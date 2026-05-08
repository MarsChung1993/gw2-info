<template>
  <div class="meta-view container">
    <!-- ── 頁首：時鐘 ── -->
    <div class="meta-header">
      <div>
        <h1>META 事件表</h1>
        <p class="meta-header__sub">以伺服器時間（UTC）為基準，每秒自動更新</p>
      </div>
      <div class="clock-block">
        <div class="clock">
          <span class="clock__label">伺服器時間 (UTC)</span>
          <span class="clock__time">{{ utcTimeStr }}</span>
        </div>
        <div class="clock">
          <span class="clock__label">本機時間</span>
          <span class="clock__time">{{ localTimeStr }}</span>
        </div>
      </div>
    </div>

    <!-- ── 篩選列 ── -->
    <div class="filter-bar">
      <!-- 展開包篩選 -->
      <div class="filter-bar__expansions">
        <button
          :class="['filter-btn', { active: selectedExpansion === null }]"
          @click="selectedExpansion = null"
        >全部</button>
        <button
          v-for="(exp, key) in EXPANSIONS"
          :key="key"
          :class="['filter-btn', { active: selectedExpansion === key }]"
          :style="selectedExpansion === key ? { borderColor: exp.color, color: exp.color } : {}"
          @click="selectedExpansion = selectedExpansion === key ? null : key"
        >{{ exp.labelZh }}</button>
      </div>

      <!-- 額外選項 -->
      <div class="filter-bar__options">
        <label class="toggle-label">
          <input v-model="showActiveOnly" type="checkbox" />
          僅顯示活躍/即將
        </label>
        <label class="toggle-label">
          <input v-model="showSoonFirst" type="checkbox" />
          即將優先排序
        </label>
      </div>
    </div>

    <!-- ── 統計條 ── -->
    <div class="stats-bar">
      <span class="stat stat--active">🟢 活躍 {{ activeCount }}</span>
      <span class="stat stat--soon">🟡 即將 {{ soonCount }}</span>
      <span class="stat stat--upcoming">⚪ 稍後 {{ upcomingCount }}</span>
    </div>

    <!-- ── 事件清單 ── -->
    <div v-if="sortedEvents.length === 0" class="empty panel">
      目前沒有符合篩選條件的事件
    </div>

    <div v-else class="event-list">
      <MetaEventRow
        v-for="item in sortedEvents"
        :key="item.event.id"
        :event="item.event"
        :now-utc-seconds="nowUtcSeconds"
      />
    </div>

    <!-- ── 備注 ── -->
    <p class="disclaimer">
      ⚠️ 展開包 META 時間為社群公認近似值；世界首領時間依 Wiki 官方快照驗證。
      實際事件可能因伺服器維護或版本更新而有所差異。
    </p>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { META_EVENTS, EXPANSIONS, getEventStatus } from '../data/metaEvents'
import MetaEventRow from '../components/meta/MetaEventRow.vue'

function padTime(n) {
  return String(n).padStart(2, '0')
}

function formatTime(date, utc) {
  const h = utc ? date.getUTCHours() : date.getHours()
  const m = utc ? date.getUTCMinutes() : date.getMinutes()
  const s = utc ? date.getUTCSeconds() : date.getSeconds()
  return `${padTime(h)}:${padTime(m)}:${padTime(s)}`
}

export default defineComponent({
  name: 'MetaView',
  components: { MetaEventRow },
  setup() {
    const now = ref(new Date())
    let timer = null

    onMounted(() => {
      timer = setInterval(() => { now.value = new Date() }, 1000)
    })

    onUnmounted(() => {
      clearInterval(timer)
    })

    // 今天 UTC 午夜起算的秒數（用於計算所有事件狀態）
    const nowUtcSeconds = computed(() => {
      const d = now.value
      return d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds()
    })

    const utcTimeStr = computed(() => formatTime(now.value, true))
    const localTimeStr = computed(() => formatTime(now.value, false))

    // 篩選狀態
    const selectedExpansion = ref(null)
    const showActiveOnly = ref(false)
    const showSoonFirst = ref(true)

    // 帶計算狀態的事件清單
    const eventsWithStatus = computed(() => {
      const sec = nowUtcSeconds.value
      return META_EVENTS.map((event) => ({
        event,
        info: getEventStatus(event, sec),
      }))
    })

    // 計數
    const activeCount = computed(() => eventsWithStatus.value.filter(e => e.info.status === 'active').length)
    const soonCount = computed(() => eventsWithStatus.value.filter(e => e.info.status === 'soon').length)
    const upcomingCount = computed(() => eventsWithStatus.value.filter(e => e.info.status === 'upcoming').length)

    // 篩選 + 排序後的清單
    const sortedEvents = computed(() => {
      let list = eventsWithStatus.value

      // 展開包篩選
      if (selectedExpansion.value) {
        list = list.filter(e => e.event.expansion === selectedExpansion.value)
      }

      // 僅活躍/即將
      if (showActiveOnly.value) {
        list = list.filter(e => e.info.status !== 'upcoming')
      }

      // 排序：active → soon → upcoming，各組內依倒數升冪
      if (showSoonFirst.value) {
        const ORDER = { active: 0, soon: 1, upcoming: 2 }
        list = [...list].sort((a, b) => {
          const od = ORDER[a.info.status] - ORDER[b.info.status]
          if (od !== 0) return od
          return a.info.sortKey - b.info.sortKey
        })
      }

      return list
    })

    return {
      EXPANSIONS,
      nowUtcSeconds,
      utcTimeStr,
      localTimeStr,
      selectedExpansion,
      showActiveOnly,
      showSoonFirst,
      sortedEvents,
      activeCount,
      soonCount,
      upcomingCount,
    }
  },
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use 'sass:color';

.meta-view {
  padding: $spacing-xl $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

// ── 頁首 ──────────────────────────────────────
.meta-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: $spacing-md;

  h1 { margin: 0; }

  &__sub {
    margin: 4px 0 0;
    font-size: 0.82rem;
    color: $color-text-muted;
  }
}

.clock-block {
  display: flex;
  gap: $spacing-lg;
}

.clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;

  &__label {
    font-size: 0.7rem;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__time {
    font-family: monospace;
    font-size: 1.5rem;
    font-weight: bold;
    color: $color-gold;
    letter-spacing: 0.05em;
  }
}

// ── 篩選列 ─────────────────────────────────────
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: $color-bg-panel;
  border: 1px solid $color-border;
  border-radius: $radius-md;
}

.filter-bar__expansions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-btn {
  padding: 4px 12px;
  background: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: 14px;
  font-size: 0.8rem;
  color: $color-text-muted;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { color: $color-text; border-color: $color-text; }
  &.active { color: $color-gold; border-color: $color-gold; background: rgba($color-gold, 0.1); }
}

.filter-bar__options {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.83rem;
  color: $color-text-muted;
  cursor: pointer;

  input[type='checkbox'] { cursor: pointer; accent-color: $color-gold; }
}

// ── 統計條 ─────────────────────────────────────
.stats-bar {
  display: flex;
  gap: $spacing-lg;
  font-size: 0.85rem;
}

.stat {
  &--active { color: $color-gold; }
  &--soon   { color: #f1c40f; }
  &--upcoming { color: $color-text-muted; }
}

// ── 事件清單 ────────────────────────────────────
.event-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.empty {
  color: $color-text-muted;
  padding: $spacing-xl;
  text-align: center;
}

// ── 備注 ────────────────────────────────────────
.disclaimer {
  font-size: 0.75rem;
  color: $color-text-muted;
  border-top: 1px solid $color-border;
  padding-top: $spacing-md;
  line-height: 1.6;
}
</style>
