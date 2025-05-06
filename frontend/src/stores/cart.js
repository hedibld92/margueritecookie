import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0,
    loading: false,
    error: null
  }),

  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    formattedTotal: (state) => new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(state.total)
  },

  actions: {
    async fetchCart() {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/cart`, { withCredentials: true })
        this.items = response.data.items
        this.total = response.data.total
      } catch (error) {
        this.error = "Erreur lors du chargement du panier"
        console.error('Erreur fetchCart:', error)
      } finally {
        this.loading = false
      }
    },

    async addToCart(cookieId, quantity = 1) {
      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/cart/add`, {
          cookieId,
          quantity
        }, { withCredentials: true })
        
        this.items = response.data.items
        this.total = response.data.total
      } catch (error) {
        this.error = "Erreur lors de l'ajout au panier"
        console.error('Erreur addToCart:', error)
      } finally {
        this.loading = false
      }
    },

    async updateQuantity(cookieId, quantity) {
      this.loading = true
      try {
        const response = await axios.put(`${API_URL}/cart/update/${cookieId}`, {
          quantity
        }, { withCredentials: true })
        
        this.items = response.data.items
        this.total = response.data.total
      } catch (error) {
        this.error = "Erreur lors de la mise à jour du panier"
        console.error('Erreur updateQuantity:', error)
      } finally {
        this.loading = false
      }
    },

    async removeFromCart(cookieId) {
      this.loading = true
      try {
        const response = await axios.delete(`${API_URL}/cart/remove/${cookieId}`, {
          withCredentials: true
        })
        
        this.items = response.data.items
        this.total = response.data.total
      } catch (error) {
        this.error = "Erreur lors de la suppression du panier"
        console.error('Erreur removeFromCart:', error)
      } finally {
        this.loading = false
      }
    },

    async clearCart() {
      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/cart/clear`, {}, {
          withCredentials: true
        })
        
        this.items = response.data.items
        this.total = response.data.total
      } catch (error) {
        this.error = "Erreur lors de la réinitialisation du panier"
        console.error('Erreur clearCart:', error)
      } finally {
        this.loading = false
      }
    }
  }
}) 