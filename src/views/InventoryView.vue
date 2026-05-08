<template>
  <div class="inventory-view container">
    <h1>背包 &amp; 倉庫</h1>

    <div v-if="!accountStore.isAuthenticated" class="not-auth panel">
      <p>請先在右上角設定 API Key 以查看背包與倉庫資訊。</p>
    </div>

    <template v-else>
      <!-- 標籤頁切換 -->
      <div class="tabs">
        <button
          :class="['tab', { 'tab--active': activeTab === 'inventory' }]"
          @click="activeTab = 'inventory'"
        >角色背包</button>
        <button
          :class="['tab', { 'tab--active': activeTab === 'bank' }]"
          @click="switchToBank"
        >帳號倉庫</button>
      </div>

      <!-- ── 角色背包 ── -->
      <template v-if="activeTab === 'inventory'">
        <!-- 角色選擇 -->
        <div v-if="accountStore.characters.length === 0" class="no-chars panel">
          <p>尚未載入角色列表。</p>
          <button class="btn btn--primary" @click="accountStore.loadCharacters()">載入角色</button>
        </div>

        <template v-else>
          <div class="char-selector">
            <button
              v-for="char in accountStore.characters"
              :key="char"
              :class="['char-btn', { active: selectedChar === char }]"
              @click="selectCharacter(char)"
            >
              {{ char }}
            </button>
          </div>

          <!-- 背包內容 -->
          <div v-if="selectedChar">
            <div v-if="charState?.loading" class="loading-spinner"></div>
            <div v-else-if="charState?.error" class="error-message">{{ charState.error }}</div>

            <div v-else-if="charState?.bags" class="inventory-layout">
              <!-- 背包格 -->
              <div class="bags-area">
                <div
                  v-for="(bag, bi) in charState.bags"
                  :key="bi"
                  class="bag panel"
                >
                  <div class="bag__header">
                    <span class="bag__name">{{ getBagName(bag) }}</span>
                    <span class="bag__info">{{ bag?.size ?? 0 }} 格</span>
                  </div>
                  <div class="bag__slots">
                    <ItemSlot
                      v-for="(slot, si) in (bag?.inventory ?? [])"
                      :key="si"
                      :slot="slot"
                      :selected="isSelected(slot)"
                      @click="selectSlot"
                    />
                  </div>
                </div>

                <div class="inv-summary">
                  共 {{ totalSlots }} 格・{{ usedSlots }} 已使用・{{ emptySlots }} 空格
                </div>
              </div>

              <!-- 物品詳情 -->
              <div class="detail-panel panel">
                <div v-if="!selectedSlot" class="detail-hint">
                  點擊物品格查看詳細資訊
                </div>
                <ItemDetail v-else :slot="selectedSlot" />
              </div>
            </div>
          </div>
        </template>
      </template>

      <!-- ── 帳號倉庫 ── -->
      <template v-if="activeTab === 'bank'">
        <div v-if="inventoryStore.bankLoading" class="loading-spinner"></div>
        <div v-else-if="inventoryStore.bankError" class="error-message">{{ inventoryStore.bankError }}</div>

        <div v-else-if="inventoryStore.bank.length" class="inventory-layout">
          <!-- 倉庫格 -->
          <div class="bags-area">
            <div
              v-for="(tab, ti) in bankTabs"
              :key="ti"
              class="bag panel"
            >
              <div class="bag__header">
                <span class="bag__name">倉庫分頁 {{ ti + 1 }}</span>
                <span class="bag__info">{{ tab.filter(Boolean).length }}/{{ tab.length }}</span>
              </div>
              <div class="bag__slots">
                <ItemSlot
                  v-for="(slot, si) in tab"
                  :key="si"
                  :slot="slot"
                  :selected="isSelected(slot)"
                  @click="selectSlot"
                />
              </div>
            </div>

            <div class="inv-summary">
              共 {{ inventoryStore.bank.length }} 格・
              {{ inventoryStore.bank.filter(Boolean).length }} 已使用・
              {{ inventoryStore.bank.filter(s => !s).length }} 空格
            </div>
          </div>

          <!-- 物品詳情 -->
          <div class="detail-panel panel">
            <div v-if="!selectedSlot" class="detail-hint">
              點擊物品格查看詳細資訊
            </div>
            <ItemDetail v-else :slot="selectedSlot" />
          </div>
        </div>

        <div v-else class="empty panel">
          <p>尚未載入倉庫資料。</p>
          <button class="btn btn--primary" @click="inventoryStore.loadBank()">載入倉庫</button>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useAccountStore } from '../stores/account'
import { useInventoryStore } from '../stores/inventory'
import ItemSlot from '../components/inventory/ItemSlot.vue'
import ItemDetail from '../components/inventory/ItemDetail.vue'

// 每個倉庫分頁的格數（GW2 每分頁 30 格）
const BANK_TAB_SIZE = 30

export default defineComponent({
  name: 'InventoryView',
  components: { ItemSlot, ItemDetail },
  setup() {
    const accountStore = useAccountStore()
    const inventoryStore = useInventoryStore()

    const activeTab = ref('inventory')
    const selectedChar = ref(null)
    const selectedSlot = ref(null)

    // 當前角色的背包狀態
    const charState = computed(() =>
      selectedChar.value
        ? inventoryStore.getCharInventory(selectedChar.value)
        : null
    )

    // 背包統計
    const allSlots = computed(() => {
      if (!charState.value?.bags) return []
      return charState.value.bags.flatMap((b) => b?.inventory ?? [])
    })
    const totalSlots = computed(() => allSlots.value.length)
    const usedSlots = computed(() => allSlots.value.filter(Boolean).length)
    const emptySlots = computed(() => totalSlots.value - usedSlots.value)

    // 倉庫分頁（每 30 格一頁）
    const bankTabs = computed(() => {
      const items = inventoryStore.bank
      const tabs = []
      for (let i = 0; i < items.length; i += BANK_TAB_SIZE) {
        tabs.push(items.slice(i, i + BANK_TAB_SIZE))
      }
      return tabs
    })

    function getBagName(bag) {
      if (!bag) return '（空背包槽）'
      const info = inventoryStore.getItemInfo(bag.id)
      return info?.name ?? `背包 #${bag.id}`
    }

    function isSelected(slot) {
      if (!slot || !selectedSlot.value) return false
      return selectedSlot.value === slot
    }

    function selectSlot(slot) {
      if (!slot) return
      selectedSlot.value = selectedSlot.value === slot ? null : slot
    }

    async function selectCharacter(name) {
      selectedChar.value = name
      selectedSlot.value = null
      await inventoryStore.loadCharacterInventory(name)
    }

    async function switchToBank() {
      activeTab.value = 'bank'
      selectedSlot.value = null
      if (!inventoryStore.bank.length) {
        await inventoryStore.loadBank()
      }
    }

    // 預設選取第一個角色
    watch(
      () => accountStore.characters,
      (chars) => {
        if (chars.length && !selectedChar.value) {
          selectCharacter(chars[0])
        }
      },
      { immediate: true }
    )

    onMounted(async () => {
      if (accountStore.isAuthenticated && accountStore.characters.length === 0) {
        await accountStore.loadCharacters()
      }
    })

    return {
      accountStore,
      inventoryStore,
      activeTab,
      selectedChar,
      selectedSlot,
      charState,
      totalSlots,
      usedSlots,
      emptySlots,
      bankTabs,
      getBagName,
      isSelected,
      selectSlot,
      selectCharacter,
      switchToBank,
    }
  },
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.inventory-view {
  padding: $spacing-xl $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.not-auth, .no-chars, .empty {
  color: $color-text-muted;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

// 標籤頁
.tabs {
  display: flex;
  gap: 2px;
  border-bottom: 2px solid $color-border;
}

.tab {
  padding: $spacing-sm $spacing-lg;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  color: $color-text-muted;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { color: $color-text; }

  &--active {
    color: $color-gold;
    border-bottom-color: $color-gold;
    font-weight: bold;
  }
}

// 角色選擇列
.char-selector {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.char-btn {
  padding: $spacing-xs $spacing-sm;
  background-color: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  color: $color-text-muted;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover, &.active {
    border-color: $color-gold;
    color: $color-gold;
  }

  &.active { background-color: rgba($color-gold, 0.1); }
}

// 主佈局（背包格 + 詳情）
.inventory-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: $spacing-lg;
  align-items: flex-start;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
  }
}

// 背包區域
.bags-area {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.bag {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__name {
    font-size: 0.9rem;
    font-weight: bold;
    color: $color-gold;
  }

  &__info {
    font-size: 0.8rem;
    color: $color-text-muted;
  }

  &__slots {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}

.inv-summary {
  font-size: 0.82rem;
  color: $color-text-muted;
  text-align: right;
  padding-top: $spacing-xs;
}

// 詳情面板
.detail-panel {
  position: sticky;
  top: 80px;
  min-height: 200px;
}

.detail-hint {
  color: $color-text-muted;
  font-size: 0.85rem;
  text-align: center;
  padding: $spacing-xl 0;
}

// 通用按鈕
.btn {
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-sm;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  align-self: flex-start;

  &--primary {
    background-color: $color-gold;
    color: $color-bg-dark;
    font-weight: bold;
    &:hover { background-color: $color-gold-light; }
  }
}
</style>
