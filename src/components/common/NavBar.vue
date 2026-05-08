<template>
  <nav class="navbar">
    <div class="navbar__brand">
      <router-link to="/">
        <img src="/gw2-logo.svg" alt="GW2" class="navbar__logo" />
        <span class="navbar__title">GW2 Tracker</span>
      </router-link>
    </div>

    <ul class="navbar__links">
      <li><router-link to="/">首頁</router-link></li>
      <li><router-link to="/account">帳號</router-link></li>
      <li><router-link to="/characters">角色</router-link></li>
      <li><router-link to="/items">物品</router-link></li>
      <li><router-link to="/maps">地圖</router-link></li>
      <li><router-link to="/inventory">背包</router-link></li>
      <li><router-link to="/wvw">WvW</router-link></li>
    </ul>

    <div class="navbar__auth">
      <template v-if="accountStore.isAuthenticated">
        <span class="navbar__account-name">{{ accountStore.accountName || '已登入' }}</span>
        <button class="btn btn--outline" @click="accountStore.clearApiKey()">登出</button>
      </template>
      <template v-else>
        <button class="btn btn--primary" @click="showApiKeyModal = true">設定 API Key</button>
      </template>
    </div>

    <!-- API Key Modal -->
    <div v-if="showApiKeyModal" class="modal-overlay" @click.self="showApiKeyModal = false">
      <div class="modal">
        <h2>設定 API Key</h2>
        <p class="modal__hint">
          請至
          <a href="https://account.arena.net/applications" target="_blank" rel="noopener">ArenaNet 帳號管理</a>
          建立 API Key
        </p>
        <input
          v-model="apiKeyInput"
          type="text"
          class="input"
          placeholder="貼上您的 API Key..."
          @keyup.enter="submitApiKey"
        />
        <div class="modal__actions">
          <button class="btn btn--outline" @click="showApiKeyModal = false">取消</button>
          <button class="btn btn--primary" @click="submitApiKey">確認</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useAccountStore } from '../../stores/account'

export default defineComponent({
  name: 'NavBar',
  setup() {
    const accountStore = useAccountStore()
    const showApiKeyModal = ref(false)
    const apiKeyInput = ref('')

    async function submitApiKey() {
      if (!apiKeyInput.value.trim()) return
      accountStore.setApiKey(apiKeyInput.value.trim())
      showApiKeyModal.value = false
      apiKeyInput.value = ''
      await accountStore.loadAccount()
    }

    return { accountStore, showApiKeyModal, apiKeyInput, submitApiKey }
  },
})
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;

.navbar {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-sm $spacing-lg;
  background-color: $color-bg-panel;
  border-bottom: 2px solid $color-gold-dark;
  position: sticky;
  top: 0;
  z-index: 100;

  &__brand a {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    text-decoration: none;
  }

  &__logo {
    width: 36px;
    height: 36px;
  }

  &__title {
    font-family: $font-title;
    font-size: 1.3rem;
    color: $color-gold;
    font-weight: bold;
  }

  &__links {
    display: flex;
    list-style: none;
    gap: $spacing-md;
    flex: 1;

    a {
      color: $color-text-muted;
      font-size: 0.95rem;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-sm;
      transition: all 0.2s;

      &:hover,
      &.router-link-active {
        color: $color-gold;
        background-color: rgba($color-gold, 0.1);
      }
    }
  }

  &__auth {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__account-name {
    color: $color-gold;
    font-size: 0.9rem;
  }
}

.btn {
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-sm;
  font-size: 0.9rem;
  border: none;
  transition: all 0.2s;

  &--primary {
    background-color: $color-gold;
    color: $color-bg-dark;
    font-weight: bold;

    &:hover {
      background-color: $color-gold-light;
    }
  }

  &--outline {
    background-color: transparent;
    border: 1px solid $color-gold;
    color: $color-gold;

    &:hover {
      background-color: rgba($color-gold, 0.1);
    }
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  background-color: $color-bg-panel;
  border: 1px solid $color-gold-dark;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  width: 90%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  h2 {
    font-size: 1.3rem;
  }

  &__hint {
    font-size: 0.85rem;
    color: $color-text-muted;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
  }
}

.input {
  width: 100%;
  padding: $spacing-sm $spacing-md;
  background-color: $color-bg-dark;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  color: $color-text;
  font-size: 0.95rem;
  font-family: $font-mono;

  &:focus {
    outline: none;
    border-color: $color-gold;
  }
}
</style>
