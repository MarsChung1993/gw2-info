<template>
  <div class="characters-view container">
    <h1>角色列表</h1>

    <div v-if="!accountStore.isAuthenticated" class="not-auth panel">
      <p>請先設定 API Key 以查看角色資訊。</p>
    </div>

    <template v-else>
      <div v-if="accountStore.loading" class="loading-spinner"></div>
      <div v-else-if="accountStore.error" class="error-message">{{ accountStore.error }}</div>

      <div v-else-if="accountStore.characters.length === 0" class="empty panel">
        <p>沒有角色資料。</p>
        <button class="btn btn--primary" @click="accountStore.loadCharacters()">載入角色</button>
      </div>

      <div v-else class="character-grid">
        <div
          v-for="char in characters"
          :key="char.name"
          class="character-card card"
          @click="selectedChar = char"
          :class="{ active: selectedChar?.name === char.name }"
        >
          <div class="char-header">
            <span :class="['profession-badge', `prof-${char.profession?.toLowerCase()}`]">
              {{ professionIcon(char.profession) }}
            </span>
            <div>
              <div class="char-name">{{ char.name }}</div>
              <div class="char-meta">
                {{ char.race }} {{ char.profession }} — Lv.{{ char.level }}
              </div>
            </div>
          </div>
          <div class="char-stats">
            <span>年齡：{{ Math.floor((char.age || 0) / 3600) }} hr</span>
            <span>死亡：{{ char.deaths ?? 0 }}</span>
          </div>
        </div>
      </div>

      <div v-if="selectedChar" class="char-detail panel">
        <h2>{{ selectedChar.name }}</h2>
        <div class="detail-grid">
          <div class="info-item">
            <span class="info-label">種族</span>
            <span class="info-value">{{ selectedChar.race }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">職業</span>
            <span class="info-value">{{ selectedChar.profession }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">等級</span>
            <span class="info-value">{{ selectedChar.level }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">性別</span>
            <span class="info-value">{{ selectedChar.gender }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">遊玩時數</span>
            <span class="info-value">{{ Math.floor((selectedChar.age || 0) / 3600) }} 小時</span>
          </div>
          <div class="info-item">
            <span class="info-label">死亡次數</span>
            <span class="info-value">{{ selectedChar.deaths ?? 0 }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useAccountStore } from '../stores/account'

const PROFESSION_ICONS = {
  Guardian: '🔵',
  Warrior: '🟡',
  Engineer: '🟤',
  Ranger: '🟢',
  Thief: '🔴',
  Elementalist: '🔥',
  Mesmer: '🟣',
  Necromancer: '💀',
  Revenant: '⚫',
}

export default defineComponent({
  name: 'CharactersView',
  setup() {
    const accountStore = useAccountStore()
    const selectedChar = ref(null)

    const characters = computed(() =>
      accountStore.characters.map ? accountStore.characters : []
    )

    function professionIcon(profession) {
      return PROFESSION_ICONS[profession] || '❓'
    }

    onMounted(() => {
      if (accountStore.isAuthenticated && accountStore.characters.length === 0) {
        accountStore.loadCharacters()
      }
    })

    return { accountStore, selectedChar, characters, professionIcon }
  },
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.characters-view {
  padding: $spacing-xl $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.not-auth, .empty {
  color: $color-text-muted;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: $spacing-md;
}

.character-card {
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  &:hover, &.active {
    border-color: $color-gold;
  }
}

.char-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.profession-badge {
  font-size: 1.8rem;
  width: 44px;
  text-align: center;
}

.char-name {
  font-weight: bold;
  color: $color-gold;
}

.char-meta {
  font-size: 0.85rem;
  color: $color-text-muted;
}

.char-stats {
  display: flex;
  gap: $spacing-md;
  font-size: 0.85rem;
  color: $color-text-muted;
  border-top: 1px solid $color-border;
  padding-top: $spacing-xs;
}

.char-detail {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  h2 { font-size: 1.3rem; }
}

.detail-grid {
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

.info-label {
  color: $color-text-muted;
  font-size: 0.8rem;
}

.info-value {
  color: $color-text;
  font-weight: bold;
}

.btn {
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-sm;
  font-size: 0.9rem;
  border: none;

  &--primary {
    background-color: $color-gold;
    color: $color-bg-dark;
    font-weight: bold;
    cursor: pointer;

    &:hover { background-color: $color-gold-light; }
  }
}
</style>
