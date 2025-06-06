describe('BrainBytes Frontend', () => {
  it('visits the home page', () => {
    cy.visit('http://localhost:3000');
    cy.contains('BrainBytes');
  });
});