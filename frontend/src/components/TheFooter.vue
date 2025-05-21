<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__content">
        <div class="footer__section">
          <div class="footer__logo">
            <span class="footer__logo-icon">🍪</span>
            <h3>Marguerite Cookie</h3>
          </div>
          <p>Des cookies artisanaux faits avec amour à Paris</p>
          <div class="footer__social">
            <a href="#" target="_blank" rel="noopener" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" target="_blank" rel="noopener" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>

        <div class="footer__section">
          <h4>Navigation</h4>
          <div class="footer__links">
            <RouterLink to="/" class="footer__link">Accueil</RouterLink>
            <RouterLink to="/boutique" class="footer__link">Boutique</RouterLink>
            <RouterLink to="/contact" class="footer__link">Contact</RouterLink>
          </div>
        </div>

        <div class="footer__section">
          <h4>Contact</h4>
          <div class="footer__contact">
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              01 23 45 67 89
            </p>
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              contact@margueritecookie.fr
            </p>
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Paris, France
            </p>
          </div>
        </div>

        <div class="footer__section">
          <h4>Newsletter</h4>
          <p>Inscrivez-vous pour recevoir nos offres</p>
          <form class="footer__form" @submit.prevent>
            <input type="email" placeholder="Votre email" aria-label="Email pour newsletter">
            <button type="submit" class="btn btn--primary">S'inscrire</button>
          </form>
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

<style lang="scss" scoped>
.footer {
  background-color: white;
  padding-top: 4rem;
  margin-top: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    margin-bottom: 4rem;
  }

  &__section {
    h4 {
      font-family: var(--font-family);
      color: var(--secondary-color);
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
    }

    p {
      color: var(--text-color);
      margin-bottom: 1rem;
      line-height: 1.6;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;

    &-icon {
      font-size: 2rem;
    }

    h3 {
      font-family: var(--font-family);
      color: var(--secondary-color);
      font-size: 1.5rem;
      margin: 0;
    }
  }

  &__social {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;

    a {
      color: var(--secondary-color);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        color: var(--primary-color);
      }
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__link {
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;

    &:hover {
      color: var(--secondary-color);
      transform: translateX(5px);
    }
  }

  &__contact {
    p {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;

      svg {
        flex-shrink: 0;
        color: var(--secondary-color);
      }
    }
  }

  &__form {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;

    input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: var(--border-radius);
      font-family: inherit;
      font-size: 0.9rem;

      &:focus {
        outline: none;
        border-color: var(--secondary-color);
      }
    }

    button {
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
    }
  }

  &__bottom {
    background-color: var(--background-color);
    padding: 1.5rem 0;
    text-align: center;
    font-size: 0.9rem;
    color: var(--text-color);
  }
}

@media (max-width: 768px) {
  .footer {
    padding-top: 3rem;

    &__content {
      gap: 2rem;
    }

    &__form {
      flex-direction: column;

      button {
        width: 100%;
      }
    }
  }
}
</style> 