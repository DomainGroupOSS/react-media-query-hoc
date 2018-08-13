/* eslint-disable no-undef */
describe('Media Queries', () => {
  context('Desktop', () => {
    it('should be in desktop mode on desktop viewport', () => {
      cy.viewport('macbook-15');
      cy.visit('/?width=1000px');
      cy.get('#content').should('be.visible');

      cy.get('h1')
        .should('contain', 'In Desktop View');
    });

    it('should be in desktop mode on desktop viewport if server detected wrong width', () => {
      cy.viewport('macbook-15');
      cy.visit('/?width=200px');
      cy.get('#content').should('be.visible');

      cy.get('h1')
        .should('contain', 'In Desktop View');
    });

    it('should trigger mobile mode on screen resize', () => {
      cy.viewport(320, 480);
      cy.get('#content').should('be.visible');

      cy.get('h1')
        .should('contain', 'In Mobile View');
    });
  });


  context('Tablet', () => {
    it('should be in tablet mode on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit('/?width=700px');
      cy.get('#content').should('be.visible');

      cy.get('h1')
        .should('contain', 'In Tablet View');
    });

    it('should be in tablet mode on tablet viewport if server detected wrong width', () => {
      cy.viewport('ipad-2');
      cy.visit('/?width=200px');
      cy.get('#content').should('be.visible');

      cy.get('h1')
        .should('contain', 'In Tablet View');
    });

    it('should trigger mobile mode on screen resize', () => {
      cy.viewport(320, 480);
      cy.get('#content').should('be.visible');

      cy.get('h1')
        .should('contain', 'In Mobile View');
    });
  });


  context('Mobile', () => {
    it('should be in mobile mode on mobile viewport', () => {
      cy.viewport('iphone-6');
      cy.visit('/?width=400px');
      cy.get('#content').should('be.visible');

      cy.get('h1')
        .should('contain', 'In Mobile View');
    });

    it('should be in mobile mode on mobile viewport if server detected wrong width', () => {
      cy.viewport('iphone-6');
      cy.visit('/?width=2000px');
      cy.get('#content').should('be.visible');

      cy.get('h1')
        .should('contain', 'In Mobile View');
    });

    it('should trigger desktop mode on screen resize', () => {
      cy.viewport(1280, 800);
      cy.get('#content').should('be.visible');

      cy.get('h1')
        .should('contain', 'In Desktop View');
    });
  });
});
