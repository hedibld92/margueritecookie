import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

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
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/cart`, { withCredentials: true })
        console.log('Réponse fetchCart:', response.data)
        this.items = response.data.items || []
        this.total = response.data.total || 0
      } catch (error) {
        console.error('Erreur fetchCart:', error)
        this.error = "Erreur lors du chargement du panier"
      } finally {
        this.loading = false
      }
    },

    async addToCart(cookieId, quantity = 1) {
      if (!cookieId) {
        console.error('ID du cookie manquant')
        throw new Error('ID du cookie manquant')
      }

      this.loading = true
      this.error = null
      try {
        console.log('Ajout au panier:', { cookieId, quantity })
        const response = await axios.post(`${API_URL}/cart/add`, {
          cookieId,
          quantity
        }, { withCredentials: true })
        
        console.log('Réponse addToCart:', response.data)
        this.items = response.data.items || []
        this.total = response.data.total || 0
      } catch (error) {
        console.error('Erreur addToCart:', error)
        this.error = "Erreur lors de l'ajout au panier"
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateQuantity(cookieId, quantity) {
      if (!cookieId) {
        console.error('ID du cookie manquant')
        throw new Error('ID du cookie manquant')
      }

      if (quantity < 1) {
        console.error('Quantité invalide')
        throw new Error('Quantité invalide')
      }

      this.loading = true
      this.error = null
      try {
        console.log('Mise à jour quantité:', { cookieId, quantity })
        const response = await axios.put(`${API_URL}/cart/update/${cookieId}`, {
          quantity
        }, { withCredentials: true })
        
        console.log('Réponse updateQuantity:', response.data)
        this.items = response.data.items || []
        this.total = response.data.total || 0
      } catch (error) {
        console.error('Erreur updateQuantity:', error)
        this.error = "Erreur lors de la mise à jour du panier"
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeFromCart(cookieId) {
      if (!cookieId) {
        console.error('ID du cookie manquant')
        throw new Error('ID du cookie manquant')
      }

      this.loading = true
      this.error = null
      try {
        console.log('Suppression du panier:', cookieId)
        const response = await axios.delete(`${API_URL}/cart/remove/${cookieId}`, {
          withCredentials: true
        })
        
        console.log('Réponse removeFromCart:', response.data)
        this.items = response.data.items || []
        this.total = response.data.total || 0
      } catch (error) {
        console.error('Erreur removeFromCart:', error)
        this.error = "Erreur lors de la suppression du panier"
        throw error
      } finally {
        this.loading = false
      }
    },

    async clearCart() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/cart/clear`, {}, {
          withCredentials: true
        })
        
        console.log('Réponse clearCart:', response.data)
        this.items = response.data.items || []
        this.total = response.data.total || 0
      } catch (error) {
        console.error('Erreur clearCart:', error)
        this.error = "Erreur lors de la réinitialisation du panier"
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 