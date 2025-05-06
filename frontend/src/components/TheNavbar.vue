<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isMenuOpen = ref(false)
</script>

<template>
  <nav class="navbar">
    <div class="container navbar__content">
      <RouterLink to="/" class="navbar__logo">
        Marguerite Cookie
      </RouterLink>

      <button class="navbar__toggle" @click="isMenuOpen = !isMenuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="navbar__menu" :class="{ 'is-open': isMenuOpen }">
        <RouterLink to="/" class="navbar__link" @click="isMenuOpen = false">
          Accueil
        </RouterLink>
        <RouterLink to="/boutique" class="navbar__link" @click="isMenuOpen = false">
          Boutique
        </RouterLink>
        <RouterLink to="/contact" class="navbar__link" @click="isMenuOpen = false">
          Contact
        </RouterLink>
        <RouterLink to="/panier" class="navbar__link navbar__link--cart" @click="isMenuOpen = false">
          Panier (0)
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
@use "sass:color";

.navbar {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }

  &__logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
    text-decoration: none;
  }

  &__toggle {
    display: none;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;

    span {
      display: block;
      width: 25px;
      height: 2px;
      background-color: var(--text-color);
      transition: all 0.3s ease;
    }
  }

  &__menu {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  &__link {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: color 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--primary-color);
      transition: width 0.3s ease;
    }

    &:hover {
      color: var(--primary-color);
      &::after {
        width: 100%;
      }
    }

    &.router-link-active {
      color: var(--primary-color);
      &::after {
        width: 100%;
      }
    }

    &--cart {
      background-color: var(--primary-color);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);

      &:hover {
        background-color: color.adjust(#42b983, $lightness: -10%);
        color: white;
        &::after {
          width: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .navbar {
    &__toggle {
      display: flex;
    }

    &__menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 1rem;
      flex-direction: column;
      gap: 1rem;
      box-shadow: var(--box-shadow);

      &.is-open {
        display: flex;
      }
    }
  }
}
</style> 