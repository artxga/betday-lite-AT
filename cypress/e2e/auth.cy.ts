describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/es/auth/signin');
  });

  it('displays the sign-in form correctly', () => {
    cy.get('input#email').should('be.visible').and('have.attr', 'required');
    cy.get('input#password').should('be.visible').and('have.attr', 'required');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('shows an error with invalid credentials', () => {
    cy.get('input#email').type('invalid@user.com');
    cy.get('input#password').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Check if error message appears in the DOM
    cy.get('p').contains(/credenciales|error/i).should('be.visible');
  });
});
