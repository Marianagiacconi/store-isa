package com.jhipster.demo.store.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.jhipster.demo.store.domain.enumeration.Gender;
import com.jhipster.demo.store.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

/**
 * TEST DE UNIDAD PERSONALIZADO - REQUERIMIENTO 2
 * 
 * Este test valida la funcionalidad de la entidad CustomerDetails (Detalles del Cliente)
 * Incluye pruebas de creación, validaciones y comparaciones de objetos
 */
class CustomerDetailsUnitTest {

    /**
     * Test que verifica la funcionalidad de comparación entre detalles de cliente
     * Valida que dos clientes con el mismo ID sean iguales
     * Valida que clientes con diferentes IDs sean diferentes
     */
    @Test
    void verificarComparacionEntreClientes() throws Exception {
        TestUtil.equalsVerifier(CustomerDetails.class);
        CustomerDetails cliente1 = new CustomerDetails();
        cliente1.setId(1L);
        CustomerDetails cliente2 = new CustomerDetails();
        cliente2.setId(cliente1.getId());
        assertThat(cliente1).isEqualTo(cliente2);
        cliente2.setId(2L);
        assertThat(cliente1).isNotEqualTo(cliente2);
        cliente1.setId(null);
        assertThat(cliente1).isNotEqualTo(cliente2);
    }

    /**
     * Test que valida la creación correcta de los detalles de un cliente
     * Verifica que todos los campos se establezcan correctamente:
     * - Género del cliente (enum Gender)
     * - Número de teléfono
     * - Dirección principal (obligatoria)
     * - Dirección secundaria (opcional)
     * - Ciudad
     * - País
     */
    @Test
    void testCreacionDeDetallesCliente() {
        CustomerDetails detallesCliente = new CustomerDetails();
        detallesCliente.setGender(Gender.MALE);
        detallesCliente.setPhone("+1234567890");
        detallesCliente.setAddressLine1("Calle Principal 123");
        detallesCliente.setAddressLine2("Apartamento 4B");
        detallesCliente.setCity("Nueva York");
        detallesCliente.setCountry("US");

        // Verificar que todos los campos se establecieron correctamente
        assertThat(detallesCliente.getGender()).isEqualTo(Gender.MALE);
        assertThat(detallesCliente.getPhone()).isEqualTo("+1234567890");
        assertThat(detallesCliente.getAddressLine1()).isEqualTo("Calle Principal 123");
        assertThat(detallesCliente.getAddressLine2()).isEqualTo("Apartamento 4B");
        assertThat(detallesCliente.getCity()).isEqualTo("Nueva York");
        assertThat(detallesCliente.getCountry()).isEqualTo("US");
    }

    /**
     * Test que valida las reglas de negocio de los detalles del cliente
     * Verifica que los campos requeridos estén presentes:
     * - Género (obligatorio)
     * - Teléfono (obligatorio)
     * - Dirección principal (obligatoria)
     * - Ciudad (obligatoria)
     * - País (obligatorio)
     * 
     * También valida que los campos opcionales puedan ser nulos
     */
    @Test
    void testValidacionDeCamposRequeridos() {
        CustomerDetails detallesCliente = new CustomerDetails();
        
        // Verificar que los campos requeridos estén inicialmente vacíos
        assertThat(detallesCliente.getGender()).isNull();
        assertThat(detallesCliente.getPhone()).isNull();
        assertThat(detallesCliente.getAddressLine1()).isNull();
        assertThat(detallesCliente.getCity()).isNull();
        assertThat(detallesCliente.getCountry()).isNull();
        
        // Establecer los campos requeridos
        detallesCliente.setGender(Gender.FEMALE);
        detallesCliente.setPhone("9876543210");
        detallesCliente.setAddressLine1("Avenida Roble 456");
        detallesCliente.setCity("Los Ángeles");
        detallesCliente.setCountry("CA");
        
        // Verificar que los campos requeridos ahora tengan valores
        assertThat(detallesCliente.getGender()).isNotNull();
        assertThat(detallesCliente.getPhone()).isNotNull();
        assertThat(detallesCliente.getAddressLine1()).isNotNull();
        assertThat(detallesCliente.getCity()).isNotNull();
        assertThat(detallesCliente.getCountry()).isNotNull();
        
        // Verificar que el campo opcional (dirección secundaria) pueda ser nulo
        assertThat(detallesCliente.getAddressLine2()).isNull();
        detallesCliente.setAddressLine2("Suite 100");
        assertThat(detallesCliente.getAddressLine2()).isEqualTo("Suite 100");
        
        // Verificar que el género sea uno de los valores válidos del enum
        assertThat(detallesCliente.getGender()).isIn((Object[]) Gender.values());
    }
} 