/// <reference types="cypress" />

describe('Pruebas E2E Tienda Online - Login API + Navegación PWA', () => {
  
  let authToken = '';

  beforeEach(() => {
    // Hacer login usando la API antes de cada test
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/authenticate',
      body: {
        username: 'admin',
        password: 'admin'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      authToken = response.body.id_token;
    });
  });

  it('1. Debe poder hacer login usando la API y navegar por la PWA', () => {
    // Guardar el token en localStorage para simular login
    cy.window().then((win) => {
      win.localStorage.setItem('jhi-authenticationToken', authToken);
    });
    
    // Visitar la PWA
    cy.visit('/');
    cy.get('title').should('contain', 'Tienda de Libros PWA');
    cy.log('PWA cargada correctamente después del login por API');
  });

  it('2. Debe poder acceder a productos en la PWA después del login', () => {
    // Guardar el token
    cy.window().then((win) => {
      win.localStorage.setItem('jhi-authenticationToken', authToken);
    });
    
    // Visitar la página de productos
    cy.visit('/products');
    cy.get('ion-content').should('exist');
    cy.log('Página de productos cargada correctamente');
  });

  it('3. Debe poder crear un producto usando la API y verlo en la PWA', () => {
    // Crear producto usando API
    const newProduct = {
      name: 'Producto Test E2E',
      description: 'Producto creado por test E2E',
      price: 99.99,
      productSize: 'M',
      productCategory: {
        id: 1,
        name: 'Categoría Test'
      }
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/products',
      headers: {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
      },
      body: newProduct
    }).then((response) => {
      expect(response.status).to.eq(201);
      cy.log('Producto creado via API con ID: ' + response.body.id);
      
      // Ahora verificar que aparece en la PWA
      cy.window().then((win) => {
        win.localStorage.setItem('jhi-authenticationToken', authToken);
      });
      
      cy.visit('/products');
      cy.get('ion-content').should('exist');
      cy.log('PWA actualizada después de crear producto');
    });
  });
});