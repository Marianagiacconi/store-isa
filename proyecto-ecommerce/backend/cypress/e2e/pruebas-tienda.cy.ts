/// <reference types="cypress" />

describe('Pruebas E2E Tienda Online - JHipster', () => {
  
  it('1. Debe poder acceder a la página principal', () => {
    cy.visit('/');
    cy.get('body').should('contain', 'Welcome');
  });

  it('2. Debe poder hacer login como administrador', () => {
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.get('button[type="submit"]').click();
    
    // Verificar que el login fue exitoso
    cy.url().should('not.include', '/login');
    cy.get('body').should('contain', 'admin');
  });

  it('3. Debe poder acceder a la gestión de productos', () => {
    // Hacer login primero
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.get('button[type="submit"]').click();
    
    // Navegar a productos
    cy.visit('/product');
    cy.get('body').should('contain', 'Products');
  });

  it('4. Debe poder acceder a la gestión de carritos', () => {
    // Hacer login primero
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.get('button[type="submit"]').click();
    
    // Navegar a carritos
    cy.visit('/shopping-cart');
    cy.get('body').should('contain', 'Shopping Carts');
  });

  it('5. Debe poder acceder a la gestión de órdenes', () => {
    // Hacer login primero
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.get('button[type="submit"]').click();
    
    // Navegar a órdenes
    cy.visit('/product-order');
    cy.get('body').should('contain', 'Product Orders');
  });
}); 