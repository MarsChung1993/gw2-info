<script>
import { defineComponent } from 'vue'
import NavBar from './components/common/NavBar.vue'

export default defineComponent({
  name: 'App',
  components: { NavBar },
})
</script>

<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss">
@use './styles/variables' as *;

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>
