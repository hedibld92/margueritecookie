<script setup>
import { RouterView } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<template>
  <div class="app">
    <TheNavbar />
    <main class="main-content">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>

<style lang="scss">
@use "sass:color";

:root {
  --primary-color: #42b983;
  --secondary-color: #2c3e50;
  --background-color: #f8f9fa;
  --text-color: #333;
  --border-radius: 8px;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  width: 100%;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: color.adjust(#42b983, $lightness: -10%);
  }

  &--secondary {
    background-color: var(--secondary-color);
    
    &:hover {
      background-color: color.adjust(#2c3e50, $lightness: -10%);
    }
  }
}
</style>
