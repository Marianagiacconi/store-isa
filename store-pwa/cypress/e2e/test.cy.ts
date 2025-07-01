describe('Tienda E-commerce Tests', () => {
  it('Debe cargar la página principal de la tienda', () => {
    cy.visit('/')
    cy.get('body').should('contain', 'Tienda')
  })

  it('Debe mostrar productos en la página de productos', () => {
    cy.visit('/products')
    cy.get('[data-testid="product-list"]').should('exist')
  })

  it('Debe permitir agregar productos al carrito', () => {
    cy.visit('/products')
    cy.get('[data-testid="add-to-cart"]').first().click()
    cy.get('[data-testid="cart-count"]').should('contain', '1')
  })
})