<template>
  <nav class="navbar">
    <div class="navbar__container">
      <RouterLink to="/" class="navbar__logo">
        <span class="navbar__logo-emoji">🍪</span>
        <span class="navbar__logo-text">Marguerite Cookie</span>
      </RouterLink>

      <div class="navbar__menu" :class="{ 'is-active': isMenuOpen }">
        <RouterLink to="/" class="navbar__link" @click="closeMenu">Accueil</RouterLink>
        <RouterLink to="/boutique" class="navbar__link" @click="closeMenu">Boutique</RouterLink>
        <RouterLink to="/contact" class="navbar__link" @click="closeMenu">Contact</RouterLink>
        <RouterLink to="/panier" class="navbar__cart" @click="closeMenu">
          <span class="navbar__cart-icon">🛒</span>
          <span v-if="cartItemCount > 0" class="navbar__cart-count">{{ cartItemCount }}</span>
        </RouterLink>
      </div>

      <button class="navbar__toggle" @click="toggleMenu" aria-label="Menu">
        <span class="navbar__toggle-line"></span>
        <span class="navbar__toggle-line"></span>
        <span class="navbar__toggle-line"></span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const isMenuOpen = ref(false)
const cartItemCount = computed(() => cartStore.itemCount)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

const handleResize = () => {
  if (window.innerWidth > 768 && isMenuOpen.value) {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--secondary-color);
    font-weight: 700;
    font-size: 1.5rem;

    &-emoji {
      font-size: 1.8rem;
    }

    &-text {
      @media (max-width: 480px) {
        display: none;
      }
    }
  }

  &__menu {
    display: flex;
    align-items: center;
    gap: 2rem;

    @media (max-width: 768px) {
      position: fixed;
      top: 72px;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: white;
      flex-direction: column;
      padding: 2rem;
      transform: translateX(100%);
      transition: transform 0.3s ease;

      &.is-active {
        transform: translateX(0);
      }
    }
  }

  &__link {
    color: var(--secondary-color);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--primary-color);
      transform: scaleX(0);
      transition: transform 0.3s ease;
      transform-origin: right;
    }

    &:hover::after,
    &.router-link-active::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }

  &__cart {
    position: relative;
    text-decoration: none;
    
    &-icon {
      font-size: 1.5rem;
    }

    &-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: var(--primary-color);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 999px;
      min-width: 20px;
      text-align: center;
    }
  }

  &__toggle {
    display: none;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;

    @media (max-width: 768px) {
      display: flex;
    }

    &-line {
      width: 24px;
      height: 2px;
      background-color: var(--secondary-color);
      transition: transform 0.3s ease;
    }

    .is-active & {
      &-line:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
      }

      &-line:nth-child(2) {
        opacity: 0;
      }

      &-line:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
      }
    }
  }
}
</style> 