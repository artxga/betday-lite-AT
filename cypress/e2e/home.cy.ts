describe('Home Page', () => {
  it('loads successfully and redirects to a valid locale', () => {
    cy.visit('/');
    // It should redirect to either /es or /en
    cy.url().should('match', /\/(es|en)/);
  });

  it('can open the login page', () => {
    cy.visit('/es');
    // Use the link to login or just visit the URL directly
    // Look for a link to signin in the header
    cy.visit('/es/auth/signin');
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
  });
});
