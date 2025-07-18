const { testConnection } = require('../src/config/database');
const { initializeCategories, ChatbotQuestion, ChatbotCategory } = require('../src/models');
const { saveQuestion, getUserStats } = require('../src/services/userStats');
const { classifyQuestion } = require('../src/services/textClassification');

/**
 * Script de prueba para verificar la funcionalidad de la base de datos
 * Diseñado para microservicios - no requiere verificación de usuario
 */
async function testDatabaseFunctionality() {
  try {
    console.log('🧪 Iniciando pruebas de base de datos (Microservicio)...\n');

    // 1. Probar conexión
    console.log('1️⃣ Probando conexión a la base de datos...');
    await testConnection();
    console.log('✅ Conexión exitosa\n');

    // 2. Inicializar categorías
    console.log('2️⃣ Inicializando categorías...');
    await initializeCategories();
    console.log('✅ Categorías inicializadas\n');

    // 3. Verificar categorías existentes
    console.log('3️⃣ Verificando categorías en la base de datos...');
    const categories = await ChatbotCategory.findAll();
    console.log('📋 Categorías encontradas:');
    categories.forEach(cat => {
      console.log(`   - ${cat.id}: ${cat.name}`);
    });
    console.log('');

    // 4. Probar clasificación y guardado
    console.log('4️⃣ Probando clasificación y guardado de pregunta...');
    const testQuestion = "¿Qué debo comer antes de correr?";
    const userId = 1; // ID de referencia externa (no verificado)

    // Clasificar pregunta
    const classification = await classifyQuestion(testQuestion);
    console.log(`🔍 Pregunta clasificada como: ${classification.category} (confianza: ${classification.confidence}%)`);

    // Guardar en base de datos
    const savedQuestion = await saveQuestion(userId, testQuestion, classification.category);
    console.log(`💾 Pregunta guardada con ID: ${savedQuestion.id}`);

    // 5. Obtener estadísticas
    console.log('\n5️⃣ Obteniendo estadísticas del usuario...');
    const stats = await getUserStats(userId);
    console.log('📊 Estadísticas del usuario:');
    console.log(`   - Preguntas nutrición: ${stats.preguntas_nutricion}`);
    console.log(`   - Preguntas entrenamiento: ${stats.preguntas_entrenamiento}`);
    console.log(`   - Preguntas recuperación: ${stats.preguntas_recuperacion}`);
    console.log(`   - Preguntas prevención: ${stats.preguntas_prevencion_lesiones}`);
    console.log(`   - Preguntas equipamiento: ${stats.preguntas_equipamiento}`);
    console.log(`   - Score ponderado: ${stats.score_ponderado}`);

    // 6. Verificar preguntas guardadas
    console.log('\n6️⃣ Verificando preguntas guardadas...');
    const questions = await ChatbotQuestion.findAll({
      include: [{
        model: ChatbotCategory,
        attributes: ['name']
      }],
      where: { user_id: userId }
    });

    console.log(`📝 Preguntas encontradas para usuario ${userId}:`);
    questions.forEach(q => {
      console.log(`   - ID: ${q.id} | Categoría: ${q.ChatbotCategory.name} | Pregunta: "${q.question.substring(0, 50)}..."`);
    });

    // 7. Probar con usuario inexistente (debería funcionar)
    console.log('\n7️⃣ Probando con usuario inexistente (microservicio)...');
    const nonExistentUserId = 999;
    const statsNonExistent = await getUserStats(nonExistentUserId);
    console.log(`📊 Estadísticas para usuario ${nonExistentUserId}:`, statsNonExistent);

    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
    console.log('✅ El microservicio está listo para usar con tu base de datos MySQL');
    console.log('💡 Nota: No se verifica la existencia del usuario (arquitectura de microservicios)');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    console.error('💡 Asegúrate de que:');
    console.error('   1. MySQL esté ejecutándose');
    console.error('   2. Las credenciales en .env sean correctas');
    console.error('   3. El script database/schema.sql se haya ejecutado');
  } finally {
    process.exit(0);
  }
}

// Ejecutar pruebas
testDatabaseFunctionality(); 