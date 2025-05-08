// cypress/support/cypress.d.ts

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(): Chainable<void>;
  }
}

// This is needed to make the file a module and avoid global scope issues.
export {};
