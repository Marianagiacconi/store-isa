package com.jhipster.demo.store.domain;

import static org.assertj.core.api.Assertions.assertThat;
import com.jhipster.demo.store.domain.enumeration.Size;
import com.jhipster.demo.store.web.rest.TestUtil;  
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

/**
 * TEST DE UNIDAD PERSONALIZADO - REQUERIMIENTO 2
 * 
 * Este test valida la funcionalidad de la entidad Product (Producto)
 * Incluye pruebas de creación, validaciones y comparaciones de objetos
 */ 
public class TestdeProductos {
    /**
     * Test que verifica la funcionalidad de comparación entre productos
     * Valida que dos productos con el mismo ID sean iguales
     * Valida que productos con diferentes IDs sean diferentes
     */
    @Test
    void verificarComparacionEntreProductos() throws Exception {
        TestUtil.equalsVerifier(Product.class);
        Product producto1 = new Product();
        producto1.setId(1L);
        Product producto2 = new Product();
        producto2.setId(producto1.getId());
        assertThat(producto1).isEqualTo(producto2);
        producto2.setId(2L);
        assertThat(producto1).isNotEqualTo(producto2);
        producto1.setId(null);
        assertThat(producto1).isNotEqualTo(producto2);
    }

    /**
     * Test que valida la creación correcta de un producto
     * Verifica que todos los campos se establezcan correctamente:
     * - Nombre del producto
     * - Descripción
     * - Precio (con validación de BigDecimal)
     * - Tamaño del producto (enum Size)
     */
    @Test
    void testCreacionDeProducto() {
        Product producto = new Product();
        producto.setName("Producto de Prueba");
        producto.setDescription("Descripción del producto de prueba");
        producto.setPrice(new BigDecimal("99.99"));
        producto.setProductSize(Size.M);

        // Verificar que todos los campos se establecieron correctamente
        assertThat(producto.getName()).isEqualTo("Producto de Prueba");
        assertThat(producto.getDescription()).isEqualTo("Descripción del producto de prueba");
        assertThat(producto.getPrice()).isEqualTo(new BigDecimal("99.99"));
        assertThat(producto.getProductSize()).isEqualTo(Size.M);
    }

    /**
     * Test que valida las reglas de negocio de un producto
     * Verifica que los campos requeridos estén presentes:
     * - Nombre (obligatorio)
     * - Precio (obligatorio y debe ser mayor a 0)
     * - Tamaño (obligatorio)
     * 
     * También valida que los campos opcionales puedan ser nulos
     */
    @Test
    void testValidacionDeCamposRequeridos() {
        Product producto = new Product();
        
        // Verificar que los campos requeridos estén inicialmente vacíos
        assertThat(producto.getName()).isNull();
        assertThat(producto.getPrice()).isNull();
        assertThat(producto.getProductSize()).isNull();
        
        // Establecer los campos requeridos
        producto.setName("Producto Válido");
        producto.setPrice(new BigDecimal("50.00"));
        producto.setProductSize(Size.L);
        
        // Verificar que los campos requeridos ahora tengan valores
        assertThat(producto.getName()).isNotNull();
        assertThat(producto.getPrice()).isNotNull();
        assertThat(producto.getProductSize()).isNotNull();
        
        // Verificar que el precio sea mayor a 0
        assertThat(producto.getPrice().compareTo(BigDecimal.ZERO)).isGreaterThan(0);
        
        // Verificar que el tamaño sea uno de los valores válidos del enum
        assertThat(producto.getProductSize()).isIn((Object[]) Size.values());
    }
} 