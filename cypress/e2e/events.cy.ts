describe("Events and Matches", () => {
  beforeEach(() => {
    cy.visit("/es");
  });

  it("should display event cards on the home page", () => {
    // The main container should have some text like VS or the teams
    cy.get("body").should("contain.text", "VS");
    cy.get("button").contains("1").should("exist");
    cy.get("button").contains("X").should("exist");
    cy.get("button").contains("2").should("exist");
  });

  it("shows an error when trying to place a bet while unauthenticated", () => {
    // Intercept sonner toast or just check if it appears in DOM
    // Assuming the user is not authenticated by default in the test
    cy.get("button").contains("1").first().click();
    // A toast should appear indicating they need to sign in
    cy.get("body").should("contain.text", "Inicia sesión"); // "Inicia sesión" or similar from translations
  });
});
