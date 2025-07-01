/// <reference types="cypress" />

describe('Basic e-commerce navigation', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/')
  })

  it('should display products on the home page', () => {
    // Check if products are displayed
    cy.get('[data-cy="product-list"]').should('exist')
    cy.get('[data-cy="product-item"]').should('have.length.at.least', 1)
    
    // Check if product details are visible
    cy.get('[data-cy="product-name"]').first().should('be.visible')
    cy.get('[data-cy="product-price"]').first().should('be.visible')
  })

  it('should filter products by category', () => {
    // Click on category filter
    cy.get('[data-cy="category-filter"]').click()
    
    // Select first category
    cy.get('[data-cy="category-option"]').first().click()
    
    // Verify products are filtered
    cy.get('[data-cy="product-item"]').should('exist')
    cy.get('[data-cy="active-filter"]').should('be.visible')
  })
}) 