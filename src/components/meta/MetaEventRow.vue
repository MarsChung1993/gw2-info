<template>
  <div :class="['meta-row', `meta-row--${info.status}`]">
    <!-- 狀態指示條 -->
    <div class="meta-row__status-bar"></div>

    <!-- 圖示 -->
    <span class="meta-row__icon">{{ event.icon }}</span>

    <!-- 名稱 / 地區 -->
    <div class="meta-row__info">
      <span class="meta-row__name">{{ event.name }}</span>
      <span class="meta-row__en">{{ event.nameEn }}</span>
      <span class="meta-row__zone">📍 {{ event.zone }}</span>
    </div>

    <!-- 展開包標籤 -->
    <span
      class="meta-row__exp-badge"
      :style="{ backgroundColor: expColor }"
    >{{ expLabel }}</span>

    <!-- 下次時間 (UTC) -->
    <div class="meta-row__time">
      <span class="meta-row__utc-label">下次</span>
      <span class="meta-row__utc">{{ nextUtcStr }}</span>
    </div>

    <!-- 倒數 / 狀態 -->
    <div :class="['meta-row__countdown', `countdown--${info.status}`]">
      <template v-if="info.status === 'active'">
        <span class="countdown__label">進行中</span>
        <span class="countdown__timer">{{ elapsedStr }}</span>
      </template>
      <template v-else>
        <span class="countdown__label">{{ info.status === 'soon' ? '即將開始' : '剩餘' }}</span>
        <span class="countdown__timer">{{ countdownStr }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { getEventStatus, formatCountdown, formatUtcTime, EXPANSIONS } from '../../data/metaEvents'

export default defineComponent({
  name: 'MetaEventRow',
  props: {
    event: { type: Object, required: true },
    nowUtcSeconds: { type: Number, required: true },
  },
  setup(props) {
    const info = computed(() => getEventStatus(props.event, props.nowUtcSeconds))

    const nextUtcStr = computed(() => formatUtcTime(info.value.nextTimeMin))

    const countdownStr = computed(() => formatCountdown(info.value.secondsUntilNext))

    const elapsedStr = computed(() => {
      const s = info.value.secondsSincePrev
      return `+${formatCountdown(s)}`
    })

    const expInfo = computed(() => EXPANSIONS[props.event.expansion] ?? { labelZh: props.event.expansion, color: '#888' })
    const expLabel = computed(() => expInfo.value.labelZh)
    const expColor = computed(() => expInfo.value.color)

    return { info, nextUtcStr, countdownStr, elapsedStr, expLabel, expColor }
  },
})
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;
@use 'sass:color';

.meta-row {
  display: grid;
  grid-template-columns: 4px 36px 1fr auto auto auto;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-sm;
  background-color: $color-bg-card;
  border: 1px solid $color-border;
  transition: border-color 0.3s;

  &--active {
    border-color: $color-gold;
    background-color: color.adjust($color-bg-card, $lightness: 3%);
    .meta-row__status-bar { background-color: $color-gold; }
  }

  &--soon {
    border-color: color.adjust(#f1c40f, $alpha: -0.4);
    .meta-row__status-bar { background-color: #f1c40f; }
  }

  &--upcoming {
    .meta-row__status-bar { background-color: $color-border; }
  }
}

.meta-row__status-bar {
  width: 4px;
  height: 100%;
  min-height: 40px;
  border-radius: 2px;
}

.meta-row__icon {
  font-size: 1.4rem;
  text-align: center;
}

.meta-row__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.meta-row__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: $color-text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-row__en {
  font-size: 0.72rem;
  color: $color-text-muted;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-row__zone {
  font-size: 0.72rem;
  color: $color-text-muted;
}

.meta-row__exp-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
  color: #000;
  white-space: nowrap;
  opacity: 0.9;
}

.meta-row__time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.meta-row__utc-label {
  font-size: 0.68rem;
  color: $color-text-muted;
}

.meta-row__utc {
  font-size: 0.9rem;
  font-family: monospace;
  color: $color-text;
}

.meta-row__countdown {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  min-width: 90px;
}

.countdown__label {
  font-size: 0.68rem;
  color: $color-text-muted;
}

.countdown__timer {
  font-size: 1rem;
  font-family: monospace;
  font-weight: bold;
}

.countdown--active .countdown__timer {
  color: $color-gold;
}

.countdown--soon .countdown__timer {
  color: #f1c40f;
}

.countdown--upcoming .countdown__timer {
  color: $color-text;
}

// 響應式：小螢幕
@media (max-width: $breakpoint-md) {
  .meta-row {
    grid-template-columns: 4px 28px 1fr auto;
    grid-template-rows: auto auto;
  }

  .meta-row__exp-badge { display: none; }

  .meta-row__time {
    grid-row: 2;
    grid-column: 3;
    align-items: flex-start;
    flex-direction: row;
    gap: $spacing-xs;
  }

  .meta-row__countdown {
    grid-row: 2;
    grid-column: 4;
  }
}
</style>
