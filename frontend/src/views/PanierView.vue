<script setup>
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()
const isProcessing = ref(false)

const cartItems = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.total)
const shippingCost = computed(() => cartItems.value.length > 0 ? 5.90 : 0)
const total = computed(() => subtotal.value + shippingCost.value)

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const incrementQuantity = async (item) => {
  try {
    if (!item || !item.cookieId) {
      throw new Error('Article invalide')
    }
    await cartStore.updateQuantity(item.cookieId, item.quantity + 1)
  } catch (error) {
    console.error('Erreur lors de l\'augmentation de la quantité:', error)
  }
}

const decrementQuantity = async (item) => {
  if (item.quantity > 1) {
    try {
      if (!item || !item.cookieId) {
        throw new Error('Article invalide')
      }
      await cartStore.updateQuantity(item.cookieId, item.quantity - 1)
    } catch (error) {
      console.error('Erreur lors de la diminution de la quantité:', error)
    }
  }
}

const removeItem = async (item) => {
  try {
    if (!item || !item.cookieId) {
      throw new Error('Article invalide')
    }
    await cartStore.removeFromCart(item.cookieId)
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error)
  }
}

const checkout = async () => {
  try {
    isProcessing.value = true
    // Logique de paiement à implémenter
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulation
    await cartStore.clearCart()
    router.push('/confirmation')
  } catch (error) {
    console.error('Erreur lors du paiement:', error)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="panier">
    <div class="container">
      <h1 class="panier__title">Votre Panier</h1>

      <div v-if="cartItems.length === 0" class="panier__empty">
        <div class="panier__empty-icon">🛒</div>
        <p>Votre panier est vide</p>
        <RouterLink to="/boutique" class="btn btn--primary">
          Découvrir nos cookies
        </RouterLink>
      </div>

      <div v-else class="panier__content">
        <div class="panier__items">
          <div v-for="item in cartItems" :key="item.cookieId" class="cart-item">
            <div class="cart-item__image">
              <div class="cart-item__emoji">🍪</div>
            </div>
            <div class="cart-item__details">
              <h3 class="cart-item__name">{{ item.name }}</h3>
              <p class="cart-item__price">{{ formatPrice(item.price) }}</p>
            </div>
            <div class="cart-item__quantity">
              <button 
                class="quantity-btn"
                @click="decrementQuantity(item)"
                :disabled="item.quantity <= 1"
              >
                -
              </button>
              <span class="quantity-value">{{ item.quantity }}</span>
              <button 
                class="quantity-btn"
                @click="incrementQuantity(item)"
              >
                +
              </button>
            </div>
            <div class="cart-item__total">
              {{ formatPrice(item.price * item.quantity) }}
            </div>
            <button 
              class="cart-item__remove"
              @click="removeItem(item)"
              aria-label="Supprimer l'article"
            >
              ×
            </button>
          </div>
        </div>

        <div class="panier__summary">
          <h2>Récapitulatif</h2>
          <div class="summary-row">
            <span>Sous-total</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="summary-row">
            <span>Livraison</span>
            <span>{{ formatPrice(shippingCost) }}</span>
          </div>
          <div class="summary-row summary-row--total">
            <span>Total</span>
            <span>{{ formatPrice(total) }}</span>
          </div>
          <button 
            class="btn btn--primary btn--large"
            @click="checkout"
            :disabled="isProcessing"
          >
            {{ isProcessing ? 'Traitement...' : 'Procéder au paiement' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panier {
  padding: 72px 0 4rem;

  &__title {
    font-size: 2.5rem;
    color: var(--secondary-color);
    margin-bottom: 2rem;
    text-align: center;
  }

  &__empty {
    text-align: center;
    padding: 4rem 0;

    &-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    p {
      font-size: 1.2rem;
      color: var(--text-color);
      margin-bottom: 2rem;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;

    @media (max-width: 968px) {
      grid-template-columns: 1fr;
    }
  }

  &__items {
    background: white;
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--box-shadow);
  }

  &__summary {
    background: white;
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--box-shadow);
    height: fit-content;

    h2 {
      font-size: 1.5rem;
      color: var(--secondary-color);
      margin-bottom: 1.5rem;
    }

    .btn {
      width: 100%;
      margin-top: 1.5rem;
    }
  }
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  &__image {
    width: 80px;
    height: 80px;
    border-radius: var(--border-radius);
    background: linear-gradient(45deg, #fef3c7, #fde68a);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__emoji {
    font-size: 2.5rem;
  }

  &__details {
    min-width: 200px;
  }

  &__name {
    font-size: 1.1rem;
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
  }

  &__price {
    color: var(--text-color);
    font-size: 0.9rem;
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__total {
    font-weight: 600;
    color: var(--secondary-color);
    min-width: 100px;
    text-align: right;
  }

  &__remove {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    line-height: 1;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: auto 1fr auto;
    gap: 1rem;

    &__details {
      min-width: 0;
    }

    &__quantity {
      grid-column: 2;
      justify-content: flex-start;
    }

    &__total {
      grid-column: 3;
      text-align: right;
    }

    &__remove {
      grid-column: 3;
      grid-row: 1;
      justify-self: end;
    }
  }
}

.quantity-btn {
  background: none;
  border: 1px solid #ddd;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.quantity-value {
  min-width: 30px;
  text-align: center;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  color: var(--text-color);

  &--total {
    border-bottom: none;
    color: var(--secondary-color);
    font-weight: 600;
    font-size: 1.2rem;
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

.btn--large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}
</style> 