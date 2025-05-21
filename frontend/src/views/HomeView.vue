<template>
  <div class="home">
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__title">Découvrez nos cookies artisanaux</h1>
        <p class="hero__subtitle">
          Des cookies faits maison avec amour, livrés directement chez vous
        </p>
        <div class="hero__cta">
          <RouterLink to="/boutique" class="btn btn--primary">
            Commander maintenant
          </RouterLink>
          <RouterLink to="/contact" class="btn btn--outline">
            Nous contacter
          </RouterLink>
        </div>
      </div>
      <div class="hero__image">
        <div class="hero__cookie-container">
          <span class="hero__cookie">🍪</span>
          <div class="hero__cookie-shadow"></div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="section-title">Pourquoi nous choisir ?</h2>
        <div class="features__grid">
          <div class="feature">
            <div class="feature__icon">🏠</div>
            <h3>Fait Maison</h3>
            <p>Préparés chaque jour dans notre atelier parisien avec des ingrédients sélectionnés.</p>
          </div>
          <div class="feature">
            <div class="feature__icon">🌟</div>
            <h3>Qualité Premium</h3>
            <p>Des ingrédients de première qualité pour un goût exceptionnel.</p>
          </div>
          <div class="feature">
            <div class="feature__icon">🚚</div>
            <h3>Livraison Rapide</h3>
            <p>Livraison le jour même dans Paris et sa région.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bestsellers">
      <div class="container">
        <h2 class="section-title">Nos best-sellers</h2>
        <div class="bestsellers__grid">
          <div class="product-card" v-for="cookie in bestSellers" :key="cookie.id">
            <div class="product-card__image">
              <span class="product-card__emoji">{{ cookie.emoji }}</span>
            </div>
            <h3>{{ cookie.name }}</h3>
            <p>{{ cookie.description }}</p>
            <RouterLink :to="'/boutique'" class="btn btn--outline btn--small">
              Découvrir
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <div class="container">
        <h2 class="section-title">Ce que disent nos clients</h2>
        <div class="testimonials__grid">
          <div class="testimonial" v-for="testimonial in testimonials" :key="testimonial.id">
            <div class="testimonial__content">
              <p>"{{ testimonial.text }}"</p>
            </div>
            <div class="testimonial__author">
              <span class="testimonial__name">{{ testimonial.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-section__content">
          <h2>Envie de cookies ?</h2>
          <p>Commandez maintenant et recevez vos cookies frais du jour.</p>
          <RouterLink to="/boutique" class="btn btn--primary btn--large">
            Voir notre sélection
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const bestSellers = [
  {
    id: 1,
    name: 'Cookie Chocolat Noir',
    description: 'Le grand classique revisité',
    emoji: '🍫'
  },
  {
    id: 2,
    name: 'Cookie Caramel Pécan',
    description: 'Une explosion de saveurs',
    emoji: '🥜'
  },
  {
    id: 3,
    name: 'Cookie Vanille Macadamia',
    description: 'La douceur à l\'état pur',
    emoji: '🍪'
  }
]

const testimonials = [
  {
    id: 1,
    text: 'Les meilleurs cookies que j\'ai jamais goûtés ! La livraison était rapide et le packaging très soigné.',
    name: 'Sophie L.'
  },
  {
    id: 2,
    text: 'Un vrai délice ! Les cookies sont toujours frais et délicieux. Je recommande vivement !',
    name: 'Thomas M.'
  },
  {
    id: 3,
    text: 'Service client excellent et cookies divins. Je suis fan !',
    name: 'Marie P.'
  }
]
</script>

<style lang="scss" scoped>
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 6rem 0;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    padding: 4rem 1rem;
    gap: 2rem;
    text-align: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
  }

  &__title {
    font-size: 4rem;
    line-height: 1.1;
    color: var(--secondary-color);
    font-weight: 700;
    
    @media (max-width: 968px) {
      font-size: 2.5rem;
    }
  }

  &__subtitle {
    font-size: 1.25rem;
    line-height: 1.6;
    color: var(--text-color);
    opacity: 0.9;
  }

  &__cta {
    display: flex;
    gap: 1rem;
    
    @media (max-width: 968px) {
      justify-content: center;
    }
  }

  &__cookie-container {
    position: relative;
    width: 100%;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__cookie {
    font-size: 8rem;
    animation: float 3s ease-in-out infinite;
    position: relative;
    z-index: 2;
  }

  &__cookie-shadow {
    position: absolute;
    bottom: 20%;
    width: 60px;
    height: 20px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    filter: blur(8px);
    animation: shadow 3s ease-in-out infinite;
  }
}

.features {
  padding: 6rem 0;
  background-color: white;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }
}

.feature {
  text-align: center;
  padding: 2rem;
  border-radius: var(--border-radius);
  background-color: var(--background-color);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &__icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }

  h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: var(--text-color);
    line-height: 1.6;
  }
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: var(--secondary-color);
    border-radius: 2px;
  }
}

.bestsellers {
  padding: 6rem 0;
  background-color: var(--background-color);

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }
}

.product-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  &__image {
    width: 120px;
    height: 120px;
    margin: 0 auto 1.5rem;
    background: var(--background-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__emoji {
    font-size: 4rem;
  }

  h3 {
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }

  p {
    color: var(--text-color);
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }
}

.testimonials {
  padding: 6rem 0;
  background-color: white;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }
}

.testimonial {
  background: var(--background-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  
  &__content {
    font-style: italic;
    margin-bottom: 1.5rem;
    color: var(--text-color);
    line-height: 1.6;
  }

  &__author {
    font-weight: 600;
    color: var(--secondary-color);
  }
}

.cta-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, var(--secondary-color), #6b4831);
  color: white;
  text-align: center;

  &__content {
    max-width: 800px;
    margin: 0 auto;

    h2 {
      color: white;
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes shadow {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(0.8); opacity: 0.2; }
}
</style> 