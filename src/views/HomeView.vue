<template>
  <div class="home">
    <section class="hero">
      <h1 class="hero__title">Guild Wars 2 Tracker</h1>
      <p class="hero__subtitle">查詢帳號資訊、角色、物品與 WvW 戰績</p>
      <div class="hero__badges">
        <span v-for="feature in features" :key="feature" class="badge">{{ feature }}</span>
      </div>
    </section>

    <section class="cards">
      <router-link v-for="card in navCards" :key="card.to" :to="card.to" class="nav-card">
        <div class="nav-card__icon">{{ card.icon }}</div>
        <h2 class="nav-card__title">{{ card.title }}</h2>
        <p class="nav-card__desc">{{ card.desc }}</p>
      </router-link>
    </section>

    <section class="api-status panel">
      <h2>API 狀態</h2>
      <div class="api-status__row">
        <span class="api-status__label">連線狀態</span>
        <span :class="['api-status__value', apiOnline ? 'text-green' : 'text-red']">
          {{ apiOnline ? '正常' : '離線' }}
        </span>
      </div>
      <div class="api-status__row">
        <span class="api-status__label">API Key</span>
        <span :class="['api-status__value', accountStore.isAuthenticated ? 'text-green' : 'text-muted']">
          {{ accountStore.isAuthenticated ? '已設定' : '未設定' }}
        </span>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useAccountStore } from '../stores/account'
import gw2Api from '../api/gw2'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const accountStore = useAccountStore()
    const apiOnline = ref(false)

    const features = ['帳號查詢', '角色管理', '物品搜尋', 'WvW 戰績', '交易行']
    const navCards = [
      { to: '/account', icon: '👤', title: '帳號資訊', desc: '查看帳號詳細資料與統計' },
      { to: '/characters', icon: '⚔️', title: '角色列表', desc: '瀏覽所有角色與裝備' },
      { to: '/items', icon: '🗡️', title: '物品搜尋', desc: '搜尋物品資訊與交易行價格' },
      { to: '/maps', icon: '🗺️', title: '地圖資訊', desc: '瀏覽大陸、樓層、地區與 POI' },
      { to: '/inventory', icon: '🎒', title: '背包 & 倉庫', desc: '查看角色背包與帳號倉庫物品' },
      { to: '/wvw', icon: '🏰', title: 'WvW 戰況', desc: '查看伺服器對戰即時資訊' },
    ]

    onMounted(async () => {
      try {
        await gw2Api.get('/build')
        apiOnline.value = true
      } catch {
        apiOnline.value = false
      }
    })

    return { accountStore, apiOnline, features, navCards }
  },
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.home {
  max-width: 1100px;
  margin: 0 auto;
  padding: $spacing-xl $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.hero {
  text-align: center;
  padding: $spacing-xl 0;

  &__title {
    font-size: 2.5rem;
    margin-bottom: $spacing-sm;
  }

  &__subtitle {
    color: $color-text-muted;
    font-size: 1.1rem;
    margin-bottom: $spacing-lg;
  }

  &__badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $spacing-sm;
  }
}

.badge {
  background-color: rgba($color-gold, 0.15);
  border: 1px solid $color-gold-dark;
  color: $color-gold;
  padding: $spacing-xs $spacing-sm;
  border-radius: 9999px;
  font-size: 0.85rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: $spacing-md;
}

.nav-card {
  background-color: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $spacing-lg;
  text-decoration: none;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  &:hover {
    border-color: $color-gold;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba($color-gold, 0.15);
  }

  &__icon {
    font-size: 2rem;
  }

  &__title {
    font-size: 1.1rem;
  }

  &__desc {
    color: $color-text-muted;
    font-size: 0.9rem;
  }
}

.api-status {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  h2 {
    font-size: 1rem;
    margin-bottom: $spacing-xs;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    padding: $spacing-xs 0;
    border-bottom: 1px solid $color-border;

    &:last-child {
      border-bottom: none;
    }
  }

  &__label {
    color: $color-text-muted;
    font-size: 0.9rem;
  }

  &__value {
    font-size: 0.9rem;
    font-weight: bold;
  }
}

.text-green { color: $color-green; }
.text-red { color: $color-red; }
.text-muted { color: $color-text-muted; }
</style>
