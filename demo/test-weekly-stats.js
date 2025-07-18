/**
 * Script de prueba para el endpoint de estadísticas por período
 * Prueba el endpoint /api/text-mining/stats/{userId}/weekly
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const TEST_USER_ID = 123;

async function testWeeklyStats() {
  console.log('🧪 Probando endpoint de estadísticas por período...\n');

  try {
    // Primero, crear algunas preguntas de prueba para tener datos
    console.log('📝 Creando preguntas de prueba...');
    
    const testQuestions = [
      { question: "¿Qué debo comer antes de correr?", category: "nutricion" },
      { question: "¿Cómo mejorar mi resistencia?", category: "entrenamiento" },
      { question: "¿Cuánto tiempo debo descansar?", category: "recuperacion" },
      { question: "¿Cómo prevenir lesiones?", category: "prevencion" },
      { question: "¿Qué zapatillas debo usar?", category: "equipamiento" },
      { question: "¿Son buenos los suplementos?", category: "nutricion" },
      { question: "¿Cómo hacer sentadillas?", category: "entrenamiento" },
      { question: "¿Cómo estirar después del ejercicio?", category: "recuperacion" }
    ];

    for (const testQuestion of testQuestions) {
      try {
        await axios.post(`${BASE_URL}/api/text-mining/classify`, {
          question: testQuestion.question,
          userId: TEST_USER_ID
        });
        console.log(`✅ Pregunta creada: "${testQuestion.question}"`);
      } catch (error) {
        console.log(`⚠️ Error creando pregunta: ${error.response?.data?.message || error.message}`);
      }
    }

    console.log('\n📊 Probando estadísticas por período...\n');

    // Probar estadísticas de la última semana (7 días)
    console.log('1️⃣ Probando estadísticas de los últimos 7 días:');
    const weeklyStats = await axios.get(`${BASE_URL}/api/text-mining/stats/${TEST_USER_ID}/weekly`);
    console.log('✅ Respuesta recibida:');
    console.log(JSON.stringify(weeklyStats.data, null, 2));

    // Probar estadísticas de los últimos 3 días
    console.log('\n2️⃣ Probando estadísticas de los últimos 3 días:');
    const threeDayStats = await axios.get(`${BASE_URL}/api/text-mining/stats/${TEST_USER_ID}/weekly?days=3`);
    console.log('✅ Respuesta recibida:');
    console.log(JSON.stringify(threeDayStats.data, null, 2));

    // Probar estadísticas de los últimos 14 días
    console.log('\n3️⃣ Probando estadísticas de los últimos 14 días:');
    const twoWeekStats = await axios.get(`${BASE_URL}/api/text-mining/stats/${TEST_USER_ID}/weekly?days=14`);
    console.log('✅ Respuesta recibida:');
    console.log(JSON.stringify(twoWeekStats.data, null, 2));

    // Probar con parámetro inválido
    console.log('\n4️⃣ Probando con parámetro inválido (days=50):');
    try {
      await axios.get(`${BASE_URL}/api/text-mining/stats/${TEST_USER_ID}/weekly?days=50`);
    } catch (error) {
      console.log('✅ Error esperado recibido:');
      console.log(JSON.stringify(error.response.data, null, 2));
    }

    // Probar con usuario inexistente
    console.log('\n5️⃣ Probando con usuario inexistente (999):');
    const nonExistentUser = await axios.get(`${BASE_URL}/api/text-mining/stats/999/weekly`);
    console.log('✅ Respuesta recibida (usuario sin datos):');
    console.log(JSON.stringify(nonExistentUser.data, null, 2));

    console.log('\n🎉 Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Función para mostrar información sobre el endpoint
function showEndpointInfo() {
  console.log('📚 Información del Endpoint de Estadísticas por Período');
  console.log('======================================================');
  console.log('URL: GET /api/text-mining/stats/{userId}/weekly');
  console.log('Parámetros:');
  console.log('  - userId (path): ID del usuario');
  console.log('  - days (query): Número de días hacia atrás (1-30, por defecto 7)');
  console.log('');
  console.log('Respuesta incluye:');
  console.log('  - Periodo analizado (fechas de inicio y fin)');
  console.log('  - Estadísticas del período especificado');
  console.log('  - Preguntas por categoría');
  console.log('  - Score ponderado');
  console.log('  - Total de preguntas');
  console.log('');
}

// Ejecutar pruebas
if (require.main === module) {
  showEndpointInfo();
  testWeeklyStats();
}

module.exports = { testWeeklyStats }; 