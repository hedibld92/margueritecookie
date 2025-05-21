<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const isMenuOpen = ref(false)
const isScrolled = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="navbar" :class="{ 'is-scrolled': isScrolled }">
    <div class="container navbar__content">
      <RouterLink to="/" class="navbar__logo" @click="closeMenu">
        <span class="navbar__logo-icon">🍪</span>
        <span class="navbar__logo-text">Marguerite Cookie</span>
      </RouterLink>

      <button class="navbar__toggle" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="navbar__menu" :class="{ 'is-open': isMenuOpen }">
        <RouterLink to="/" class="navbar__link" @click="closeMenu">
          Accueil
        </RouterLink>
        <RouterLink to="/boutique" class="navbar__link" @click="closeMenu">
          Boutique
        </RouterLink>
        <RouterLink to="/contact" class="navbar__link" @click="closeMenu">
          Contact
        </RouterLink>
        <RouterLink to="/panier" class="navbar__link navbar__link--cart" @click="closeMenu">
          Panier ({{ cartStore.itemCount }})
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: transparent;
  transition: all 0.3s ease;

  &.is-scrolled {
    background-color: rgba(254, 246, 228, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    padding: 0 2rem;

    @media (max-width: 768px) {
      padding: 0 1rem;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    font-family: var(--font-family);
    color: var(--secondary-color);
    font-weight: 700;
    font-size: 1.5rem;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    &-icon {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.2rem;
      
      &-text {
        display: none;
      }
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
    z-index: 100;

    span {
      display: block;
      width: 25px;
      height: 2px;
      background-color: var(--secondary-color);
      transition: all 0.3s ease;
    }

    &.is-active {
      span {
        &:first-child {
          transform: translateY(8px) rotate(45deg);
        }
        
        &:nth-child(2) {
          opacity: 0;
        }
        
        &:last-child {
          transform: translateY(-8px) rotate(-45deg);
        }
      }
    }

    @media (max-width: 768px) {
      display: flex;
    }
  }

  &__menu {
    display: flex;
    align-items: center;
    gap: 2rem;

    @media (max-width: 768px) {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(254, 246, 228, 0.98);
      flex-direction: column;
      justify-content: center;
      gap: 2rem;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      padding: 2rem;

      &.is-open {
        transform: translateX(0);
      }
    }
  }

  &__link {
    text-decoration: none;
    color: var(--secondary-color);
    font-weight: 500;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--secondary-color);
      transition: width 0.3s ease;
    }

    &:hover, &.router-link-active {
      color: var(--secondary-color);
      
      &::after {
        width: 100%;
      }
    }

    &--cart {
      background-color: var(--secondary-color);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      transition: all 0.3s ease;

      &::after {
        display: none;
      }

      &:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
        color: white;
      }
    }

    @media (max-width: 768px) {
      font-size: 1.5rem;
      
      &--cart {
        margin-top: 1rem;
        padding: 1rem 2rem;
      }
    }
  }
}
</style> 