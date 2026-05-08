<template>
  <div class="account-view container">
    <h1>帳號資訊</h1>

    <div v-if="!accountStore.isAuthenticated" class="not-auth panel">
      <p>請先在右上角設定 API Key 以查看帳號資訊。</p>
    </div>

    <template v-else>
      <div v-if="accountStore.loading" class="loading-spinner"></div>
      <div v-else-if="accountStore.error" class="error-message">{{ accountStore.error }}</div>

      <div v-else-if="accountStore.account" class="account-panel panel">
        <div class="account-header">
          <h2>{{ accountStore.account.name }}</h2>
          <span class="world-badge">世界 #{{ accountStore.account.world }}</span>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">建立時間</span>
            <span class="info-value">{{ formatDate(accountStore.account.created) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">年齡（小時）</span>
            <span class="info-value">{{ accountStore.account.age ? Math.floor(accountStore.account.age / 3600) : '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">指揮官</span>
            <span class="info-value">{{ accountStore.account.commander ? '是' : '否' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">骨折點數</span>
            <span class="info-value">{{ accountStore.account.fractal_level ?? '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">WvW 排名</span>
            <span class="info-value">{{ accountStore.account.wvw_rank ?? '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">PvP 積分</span>
            <span class="info-value">{{ accountStore.account.pvp_rank ?? '-' }}</span>
          </div>
        </div>

        <div v-if="accountStore.account.guilds?.length" class="guilds">
          <h3>公會</h3>
          <div class="guild-list">
            <span v-for="guild in accountStore.account.guilds" :key="guild" class="guild-tag">
              {{ guild }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useAccountStore } from '../stores/account'

export default defineComponent({
  name: 'AccountView',
  setup() {
    const accountStore = useAccountStore()

    onMounted(() => {
      if (accountStore.isAuthenticated && !accountStore.account) {
        accountStore.loadAccount()
      }
    })

    function formatDate(dateStr) {
      if (!dateStr) return '-'
      return new Date(dateStr).toLocaleDateString('zh-TW')
    }

    return { accountStore, formatDate }
  },
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use 'sass:color';

.account-view {
  padding: $spacing-xl $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  h1 { margin-bottom: 0; }
}

.not-auth {
  color: $color-text-muted;
}

.account-panel {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.account-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  h2 { margin: 0; font-size: 1.5rem; }
}

.world-badge {
  background-color: rgba($color-blue, 0.2);
  border: 1px solid $color-blue;
  color: color.adjust($color-blue, $lightness: 20%);
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
  font-size: 0.85rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

.guilds {
  h3 {
    font-size: 1rem;
    margin-bottom: $spacing-sm;
    color: $color-gold;
  }
}

.guild-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.guild-tag {
  background-color: rgba($color-gold, 0.1);
  border: 1px solid $color-gold-dark;
  color: $color-gold;
  padding: 2px $spacing-sm;
  border-radius: $radius-sm;
  font-size: 0.85rem;
  font-family: $font-mono;
}
</style>
