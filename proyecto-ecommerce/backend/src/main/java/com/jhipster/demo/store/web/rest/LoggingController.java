package com.jhipster.demo.store.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para demostrar diferentes niveles de logging
 * Según la documentación de ELK Stack
 */
@RestController
@RequestMapping("/api/logging")
public class LoggingController {

    private final Logger logger = LoggerFactory.getLogger(LoggingController.class);

    @GetMapping("/test")
    public String testLogging() {
        logger.trace("A TRACE Message - Nivel más detallado");
        logger.debug("A DEBUG Message - Información de depuración");
        logger.info("An INFO Message - Información general de la aplicación");
        logger.warn("A WARN Message - Advertencia del sistema");
        logger.error("An ERROR Message - Error en la aplicación");
        
        return "Logs generados exitosamente. Revisa Kibana en http://localhost:5601 para ver los logs.";
    }

    @GetMapping("/ecommerce")
    public String ecommerceLogs() {
        logger.info("Usuario accedió a la página de productos");
        logger.debug("Buscando productos en la base de datos");
        logger.info("Producto agregado al carrito: ID=123, Nombre=iPhone");
        logger.warn("Stock bajo para producto ID=456");
        logger.error("Error al procesar pago: Tarjeta rechazada");
        
        return "Logs de e-commerce generados. Revisa el dashboard de Kibana.";
    }

    @GetMapping("/performance")
    public String performanceLogs() {
        logger.info("Tiempo de respuesta de la API: 150ms");
        logger.debug("Consulta SQL ejecutada en 45ms");
        logger.warn("Tiempo de respuesta lento: 2.5s");
        logger.error("Timeout en la conexión a la base de datos");
        
        return "Logs de rendimiento generados.";
    }
} 