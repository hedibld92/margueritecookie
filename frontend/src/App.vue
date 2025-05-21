<script setup>
import { RouterView } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<template>
  <div class="app">
    <TheNavbar />
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <TheFooter />
  </div>
</template>

<style lang="scss">
@use "sass:color";

:root {
  --primary-color: #f59e0b;
  --secondary-color: #7f5539;
  --background-color: #fef6e4e6;
  --text-color: #333;
  --border-radius: 8px;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --font-family: 'Playfair Display', serif;
  --font-family-sans: 'Poppins', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-sans);
  color: var(--text-color);
  line-height: 1.6;
  width: 100%;
  background-color: var(--background-color);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family);
  color: var(--secondary-color);
  line-height: 1.2;
}

.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

// Animations de transition de page
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// Styles des boutons
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-family: var(--font-family-sans);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  
  &--primary {
    background-color: var(--secondary-color);
    color: white;
    
    &:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
    }
  }
  
  &--outline {
    background-color: transparent;
    border: 2px solid var(--secondary-color);
    color: var(--secondary-color);
    
    &:hover {
      background-color: var(--secondary-color);
      color: white;
      transform: translateY(-2px);
    }
  }
}

// Utilitaires
.text-center { text-align: center; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }
.mb-5 { margin-bottom: 3rem; }
</style>
