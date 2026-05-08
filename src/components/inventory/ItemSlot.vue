<template>
  <div
    :class="['item-slot', { 'item-slot--empty': !slot, 'item-slot--selected': selected }]"
    @click="$emit('click', slot)"
    :title="itemInfo?.name ?? ''"
  >
    <template v-if="slot && itemInfo">
      <img
        v-if="itemInfo.icon"
        :src="itemInfo.icon"
        :alt="itemInfo.name"
        class="item-slot__icon"
      />
      <div v-else class="item-slot__placeholder">?</div>
      <span v-if="slot.count > 1" class="item-slot__count">{{ slot.count }}</span>
      <span
        v-if="slot.binding"
        :class="['item-slot__binding', `item-slot__binding--${slot.binding.toLowerCase()}`]"
        :title="slot.binding === 'Character' ? `綁定：${slot.bound_to}` : '帳號綁定'"
      >{{ slot.binding === 'Character' ? '角' : '帳' }}</span>
      <div
        v-if="itemInfo.rarity"
        :class="['item-slot__rarity-bar', `rarity-bar--${itemInfo.rarity.toLowerCase()}`]"
      ></div>
    </template>
    <template v-else-if="slot && !itemInfo">
      <div class="item-slot__placeholder item-slot__placeholder--loading">
        <span>{{ slot.id }}</span>
      </div>
      <span v-if="slot.count > 1" class="item-slot__count">{{ slot.count }}</span>
    </template>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useInventoryStore } from '../../stores/inventory'

export default defineComponent({
  name: 'ItemSlot',
  emits: ['click'],
  props: {
    slot: {
      type: Object,
      default: null,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const inventoryStore = useInventoryStore()
    const itemInfo = computed(() =>
      props.slot ? inventoryStore.getItemInfo(props.slot.id) : null
    )
    return { itemInfo }
  },
})
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;

.item-slot {
  position: relative;
  width: 48px;
  height: 48px;
  background-color: #111;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.15s;
  flex-shrink: 0;

  &:hover:not(.item-slot--empty) {
    border-color: $color-gold;
    z-index: 1;
  }

  &--empty {
    cursor: default;
    opacity: 0.3;
  }

  &--selected {
    border-color: $color-gold !important;
    box-shadow: 0 0 6px rgba($color-gold, 0.5);
  }

  &__icon {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    color: $color-text-muted;
    text-align: center;
    padding: 2px;

    &--loading {
      background-color: rgba($color-text-muted, 0.05);
    }
  }

  &__count {
    position: absolute;
    bottom: 1px;
    right: 2px;
    font-size: 0.65rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 2px #000, 0 0 2px #000;
    line-height: 1;
  }

  &__binding {
    position: absolute;
    top: 1px;
    left: 2px;
    font-size: 0.55rem;
    font-weight: bold;
    line-height: 1;
    padding: 1px 2px;
    border-radius: 2px;

    &--account { background: rgba(#2980b9, 0.8); color: #fff; }
    &--character { background: rgba(#c0392b, 0.8); color: #fff; }
  }

  // 底部稀有度色條
  &__rarity-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
  }
}

.rarity-bar {
  &--junk       { background-color: $rarity-junk; }
  &--basic      { background-color: $rarity-basic; }
  &--fine       { background-color: $rarity-fine; }
  &--masterwork { background-color: $rarity-masterwork; }
  &--rare       { background-color: $rarity-rare; }
  &--exotic     { background-color: $rarity-exotic; }
  &--ascended   { background-color: $rarity-ascended; }
  &--legendary  { background-color: $rarity-legendary; }
}
</style>
