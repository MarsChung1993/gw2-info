<template>
  <div class="wvw-view container">
    <h1>WvW 戰況</h1>
    <p class="subtitle">查看各伺服器即時對戰分數</p>

    <button class="btn btn--primary" @click="loadMatches" :disabled="loading">
      {{ loading ? '載入中...' : '刷新戰況' }}
    </button>

    <div v-if="loading" class="loading-spinner"></div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else-if="matches.length" class="matches">
      <div v-for="match in matches" :key="match.id" class="match-card panel">
        <div class="match-header">
          <h2>{{ match.id }}</h2>
          <span class="match-region">{{ match.id.startsWith('1-') ? 'NA' : 'EU' }}</span>
        </div>

        <div class="teams">
          <div
            v-for="color in ['red', 'blue', 'green']"
            :key="color"
            :class="['team', `team--${color}`]"
          >
            <div class="team-name">{{ worldName(match.worlds[color]) }}</div>
            <div class="team-score">{{ match.scores[color].toLocaleString() }} 分</div>
            <div class="team-kills">擊殺：{{ match.kills[color].toLocaleString() }}</div>
            <div class="team-deaths">死亡：{{ match.deaths[color].toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { fetchWvwMatches } from '../api/endpoints'

export default defineComponent({
  name: 'WvwView',
  setup() {
    const matches = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function loadMatches() {
      loading.value = true
      error.value = null
      try {
        matches.value = await fetchWvwMatches()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    function worldName(id) {
      return `世界 #${id}`
    }

    onMounted(loadMatches)

    return { matches, loading, error, loadMatches, worldName }
  },
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use 'sass:color';

.wvw-view {
  padding: $spacing-xl $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.subtitle {
  color: $color-text-muted;
  margin-top: -$spacing-md;
}

.btn--primary {
  align-self: flex-start;
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

.matches {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.match-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.match-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  h2 { font-size: 1.1rem; margin: 0; }
}

.match-region {
  background-color: rgba($color-blue, 0.2);
  border: 1px solid $color-blue;
  color: color.adjust($color-blue, $lightness: 20%);
  padding: 2px $spacing-sm;
  border-radius: $radius-sm;
  font-size: 0.8rem;
}

.teams {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.team {
  background-color: $color-bg-dark;
  border-radius: $radius-sm;
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  border-top: 3px solid transparent;

  &--red { border-top-color: $color-red; }
  &--blue { border-top-color: $color-blue; }
  &--green { border-top-color: $color-green; }
}

.team-name {
  font-weight: bold;
  font-size: 0.95rem;
}

.team-score {
  font-size: 1.3rem;
  font-weight: bold;
  color: $color-gold;
}

.team-kills, .team-deaths {
  font-size: 0.85rem;
  color: $color-text-muted;
}
</style>
