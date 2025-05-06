<template>
  <footer class="footer">
    <div class="container footer__content">
      <div class="footer__section">
        <h3>Marguerite Cookie</h3>
        <p>Des cookies artisanaux faits avec amour à Paris</p>
      </div>

      <div class="footer__section">
        <h4>Navigation</h4>
        <RouterLink to="/" class="footer__link">Accueil</RouterLink>
        <RouterLink to="/boutique" class="footer__link">Boutique</RouterLink>
        <RouterLink to="/contact" class="footer__link">Contact</RouterLink>
      </div>

      <div class="footer__section">
        <h4>Contact</h4>
        <p>Email: contact@margueritecookie.fr</p>
        <p>Tél: 01 23 45 67 89</p>
        <p>Paris, France</p>
      </div>

      <div class="footer__section">
        <h4>Suivez-nous</h4>
        <div class="footer__social">
          <a href="#" target="_blank" rel="noopener">Instagram</a>
          <a href="#" target="_blank" rel="noopener">Facebook</a>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Marguerite Cookie. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
@use "sass:color";

.footer {
  background-color: var(--background-color);
  padding: 3rem 0 0;
  margin-top: auto;

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  &__section {
    h3, h4 {
      color: var(--secondary-color);
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 0.5rem;
    }
  }

  &__link {
    display: block;
    color: var(--text-color);
    text-decoration: none;
    margin-bottom: 0.5rem;
    transition: color 0.3s ease;

    &:hover {
      color: var(--primary-color);
    }
  }

  &__social {
    display: flex;
    gap: 1rem;

    a {
      color: var(--text-color);
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  &__bottom {
    background-color: color.adjust(#f8f9fa, $lightness: -5%);
    padding: 1rem 0;
    text-align: center;
    font-size: 0.9rem;
  }
}
</style> 