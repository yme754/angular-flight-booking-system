package com.flightapp.kafka;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.test.util.ReflectionTestUtils;

class KafkaProducerConfigTest {

    private final KafkaProducerConfig config = new KafkaProducerConfig();

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(config, "bootstrapServers", "localhost:9092");
    }

    @Test
    void testProducerFactory() {
        ProducerFactory<String, Object> factory = config.producerFactory();
        assertNotNull(factory, "ProducerFactory should not be null");
        assertTrue(factory instanceof DefaultKafkaProducerFactory, "Should be instance of DefaultKafkaProducerFactory");        
        Map<String, Object> configMap = ((DefaultKafkaProducerFactory<String, Object>) factory).getConfigurationProperties();
        assertTrue(configMap.containsKey(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG));
    }

    @Test
    void testKafkaTemplate() {
        KafkaTemplate<String, Object> template = config.kafkaTemplate();
        assertNotNull(template, "KafkaTemplate should not be null");
    }
}