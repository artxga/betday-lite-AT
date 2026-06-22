describe('Navigation Flow', () => {
  beforeEach(() => {
    cy.visit('/es');
  });

  it('navigates to login page via Navbar', () => {
    // Assuming the navbar has a link to /auth/signin
    // We can search for the href
    cy.get('a[href*="/auth/signin"]').first().click();
    cy.url().should('include', '/auth/signin');
  });

  it('navigates to home via Logo', () => {
    // Navigate to a subpage first
    cy.visit('/es/auth/signin');
    // Click the logo which should point to /
    cy.get('a').contains(/BetDay/i).first().click({ force: true });
    cy.url().should('match', /\/(es|en)$/);
  });
});
