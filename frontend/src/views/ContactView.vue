<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref(null)

const submitForm = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Simulation d'envoi (à remplacer par un vrai appel API)
    await new Promise(resolve => setTimeout(resolve, 1000))
    success.value = true
    formData.value = { name: '', email: '', subject: '', message: '' }
  } catch (err) {
    error.value = "Une erreur est survenue lors de l'envoi du message"
    console.error('Erreur submitForm:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="contact">
    <h1>Contactez-nous</h1>
    
    <div class="contact-info">
      <div class="info-item">
        <h3>Adresse</h3>
        <p>123 Rue des Cookies</p>
        <p>75000 Paris</p>
      </div>
      
      <div class="info-item">
        <h3>Téléphone</h3>
        <p>01 23 45 67 89</p>
      </div>
      
      <div class="info-item">
        <h3>Email</h3>
        <p>contact@margueritecookie.fr</p>
      </div>
    </div>

    <div class="contact-form">
      <h2>Envoyez-nous un message</h2>
      
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Nom</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            required
          >
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            required
          >
        </div>

        <div class="form-group">
          <label for="subject">Sujet</label>
          <input 
            type="text" 
            id="subject" 
            v-model="formData.subject" 
            required
          >
        </div>

        <div class="form-group">
          <label for="message">Message</label>
          <textarea 
            id="message" 
            v-model="formData.message" 
            rows="5" 
            required
          ></textarea>
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <div v-if="success" class="success">
          Message envoyé avec succès !
        </div>

        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? 'Envoi en cours...' : 'Envoyer' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contact {
  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--secondary-color);
  }

  h2 {
    color: var(--secondary-color);
    margin-bottom: 1.5rem;
  }
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  text-align: center;

  .info-item {
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);

    h3 {
      color: var(--primary-color);
      margin-bottom: 1rem;
    }

    p {
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }
  }
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--secondary-color);
    }

    input,
    textarea {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: var(--border-radius);
      font-size: 1rem;
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
    }
  }

  .error {
    color: red;
    margin-bottom: 1rem;
  }

  .success {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  .btn {
    width: 100%;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}
</style> 