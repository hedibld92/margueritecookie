<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import axios from 'axios'

const cookies = ref([])
const loading = ref(true)
const error = ref(null)
const cartStore = useCartStore()
const isAddingToCart = ref(false)

const fetchCookies = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get('http://localhost:3000/api/cookies')
    cookies.value = response.data
  } catch (err) {
    error.value = "Erreur lors du chargement des cookies. Veuillez réessayer."
    console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const addToCart = async (cookie) => {
  try {
    isAddingToCart.value = true
    await cartStore.addToCart(cookie._id)
    // Feedback visuel
    const notification = document.createElement('div')
    notification.className = 'notification'
    notification.textContent = '✅ Cookie ajouté au panier'
    document.body.appendChild(notification)
    setTimeout(() => notification.remove(), 2000)
  } catch (err) {
    console.error('Erreur lors de l\'ajout au panier:', err)
    // Feedback d'erreur
    const notification = document.createElement('div')
    notification.className = 'notification notification--error'
    notification.textContent = '❌ Erreur lors de l\'ajout au panier'
    document.body.appendChild(notification)
    setTimeout(() => notification.remove(), 2000)
  } finally {
    isAddingToCart.value = false
  }
}

onMounted(() => {
  fetchCookies()
})
</script>

<template>
  <div class="boutique">
    <section class="hero">
      <div class="hero__content">
        <h1>Nos Délicieux Cookies</h1>
        <p>Découvrez notre sélection de cookies artisanaux, préparés avec amour</p>
      </div>
    </section>

    <section class="filters">
      <div class="container">
        <div class="search-bar">
          <input type="text" placeholder="Rechercher un cookie..." class="search-input">
        </div>
      </div>
    </section>

    <section class="products" v-if="!loading">
      <div class="container">
        <div class="products__grid">
          <div v-for="cookie in cookies" :key="cookie._id" class="product-card">
            <div class="product-card__image">
              <div class="product-card__emoji">🍪</div>
            </div>
            <div class="product-card__content">
              <h3 class="product-card__title">{{ cookie.name }}</h3>
              <p class="product-card__description">{{ cookie.description }}</p>
              <div class="product-card__footer">
                <span class="product-card__price">{{ formatPrice(cookie.price) }}</span>
                <button 
                  class="btn btn--primary"
                  @click="addToCart(cookie)"
                  :disabled="isAddingToCart"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-else class="loading">
      <div class="loading__spinner"></div>
      <p>Chargement de nos délicieux cookies...</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchCookies" class="btn btn--primary">Réessayer</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.boutique {
  min-height: 100vh;
  background-color: var(--background-color);
}

.hero {
  background: linear-gradient(135deg, var(--primary-color), darken(#f59e0b, 20%));
  padding: 6rem 0 4rem;
  text-align: center;
  margin-bottom: 2rem;

  &__content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;

    h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      color: white;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    p {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      max-width: 600px;
      margin: 0 auto;
    }
  }
}

.filters {
  margin-bottom: 3rem;
  
  .search-bar {
    max-width: 600px;
    margin: 0 auto;
    
    .search-input {
      width: 100%;
      padding: 1rem 1.5rem;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-radius: 50px;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
      }
    }
  }
}

.products {
  padding: 2rem 0 4rem;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
}

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }

  &__image {
    height: 200px;
    background: linear-gradient(45deg, #fef3c7, #fde68a);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__emoji {
    font-size: 6rem;
    animation: float 3s ease-in-out infinite;
  }

  &__content {
    padding: 2rem;
  }

  &__title {
    font-size: 1.5rem;
    color: var(--secondary-color);
    margin-bottom: 0.75rem;
    font-weight: 600;
  }

  &__description {
    color: var(--text-color);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &__price {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
  }

  .btn {
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }
}

.loading {
  text-align: center;
  padding: 4rem 0;

  &__spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    animation: spin 1s linear infinite;
  }

  p {
    color: var(--text-color);
    font-size: 1.1rem;
  }
}

.error {
  text-align: center;
  padding: 4rem 0;
  
  p {
    color: #ef4444;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
  z-index: 1000;

  &--error {
    background-color: #ef4444;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 5rem 0 3rem;

    &__content {
      h1 {
        font-size: 2.5rem;
      }

      p {
        font-size: 1.1rem;
      }
    }
  }

  .products {
    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
  }

  .product-card {
    &__content {
      padding: 1.5rem;
    }
  }
}
</style> 