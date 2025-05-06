<template>
  <div class="home">
    <section class="hero">
      <div class="hero__content">
        <h1>Des cookies artisanaux livrés chez vous</h1>
        <p class="hero__text">
          Découvrez nos délicieux cookies faits maison, préparés chaque jour avec des ingrédients soigneusement sélectionnés.
        </p>
        <div class="hero__cta">
          <RouterLink to="/boutique" class="btn btn--primary">Commander maintenant</RouterLink>
          <RouterLink to="/contact" class="btn btn--outline">Nous contacter</RouterLink>
        </div>
      </div>
      <div class="hero__image">
        <div class="hero__image-container">
          <span>🍪</span>
        </div>
      </div>
    </section>

    <section class="features">
      <h2 class="section-title">Pourquoi nous choisir ?</h2>
      <div class="features__grid">
        <div class="feature">
          <div class="feature__icon">🏠</div>
          <h3>Fait Maison</h3>
          <p>Tous nos cookies sont préparés à la main dans notre atelier parisien.</p>
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
    </section>

    <section class="bestsellers">
      <h2 class="section-title">Nos best-sellers</h2>
      <div class="bestsellers__grid">
        <div class="product-card">
          <div class="product-card__image">🍫</div>
          <h3>Cookie Chocolat Noir</h3>
          <p>Le grand classique revisité</p>
          <RouterLink to="/boutique" class="btn btn--small">Découvrir</RouterLink>
        </div>
        <div class="product-card">
          <div class="product-card__image">🥜</div>
          <h3>Cookie Caramel Pécan</h3>
          <p>Une explosion de saveurs</p>
          <RouterLink to="/boutique" class="btn btn--small">Découvrir</RouterLink>
        </div>
        <div class="product-card">
          <div class="product-card__image">🍪</div>
          <h3>Cookie Vanille Macadamia</h3>
          <p>La douceur à l'état pur</p>
          <RouterLink to="/boutique" class="btn btn--small">Découvrir</RouterLink>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="cta-section__content">
        <h2>Envie de cookies ?</h2>
        <p>Commandez maintenant et recevez vos cookies frais du jour.</p>
        <RouterLink to="/boutique" class="btn btn--primary btn--large">Voir notre sélection</RouterLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
@use "sass:color";

.home {
  padding-bottom: 4rem;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 4rem 0;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
    gap: 2rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;

    h1 {
      font-size: 3.5rem;
      line-height: 1.2;
      color: var(--secondary-color);
      font-weight: 700;

      @media (max-width: 768px) {
        font-size: 2.5rem;
        text-align: center;
      }
    }
  }

  &__text {
    font-size: 1.2rem;
    line-height: 1.8;
    color: #666;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      text-align: center;
    }
  }

  &__cta {
    display: flex;
    gap: 1rem;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  &__image {
    display: flex;
    align-items: center;
    justify-content: center;

    &-container {
      width: 100%;
      height: 400px;
      background: linear-gradient(135deg, #42b983, #2c3e50);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 150%;
        height: 150%;
        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
        animation: rotate 20s linear infinite;
      }

      span {
        font-size: 8rem;
        position: relative;
        z-index: 1;
        animation: float 3s ease-in-out infinite;
      }
    }
  }
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--secondary-color);
  margin-bottom: 3rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background-color: var(--primary-color);
    border-radius: 2px;
  }
}

.features {
  padding: 6rem 0;
  background-color: white;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
}

.feature {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &__icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--secondary-color);
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
}

.bestsellers {
  padding: 6rem 0;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
}

.product-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &__image {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
  }
}

.cta-section {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  padding: 6rem 0;
  margin-top: 4rem;
  color: white;
  text-align: center;

  &__content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;

    h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
  }
}

.btn {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &--primary {
    background-color: var(--primary-color);
    color: white;

    &:hover {
      background-color: darken(#f59e0b, 10%);
    }
  }

  &--outline {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: transparent;

    &:hover {
      background-color: var(--primary-color);
      color: white;
    }
  }

  &--small {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  &--large {
    padding: 1.2rem 2.5rem;
    font-size: 1.1rem;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 