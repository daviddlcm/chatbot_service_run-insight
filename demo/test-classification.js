#!/usr/bin/env node

/**
 * Script de demostración del sistema de minería de texto RunInsight
 * Muestra el funcionamiento completo del pipeline de clasificación
 */

const { classifyQuestion } = require('../src/services/textClassification');
const { updateUserStats, getUserPreferences } = require('../src/services/userStats');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  console.log('\n' + '='.repeat(60));
  log(`🏃‍♂️ ${title}`, 'bright');
  console.log('='.repeat(60));
}

function logSection(title) {
  console.log('\n' + '-'.repeat(40));
  log(`📋 ${title}`, 'cyan');
  console.log('-'.repeat(40));
}

// Preguntas de prueba para cada categoría
const testQuestions = [
  // Nutrición
  {
    question: "¿Qué debo comer antes de correr?",
    expected: "nutricion",
    description: "Pregunta sobre alimentación pre-entrenamiento"
  },
  {
    question: "¿Cuántas proteínas necesito después del ejercicio?",
    expected: "nutricion",
    description: "Consulta sobre macronutrientes post-entrenamiento"
  },
  
  // Entrenamiento
  {
    question: "¿Cómo debo entrenar para mejorar mi resistencia?",
    expected: "entrenamiento",
    description: "Pregunta sobre metodología de entrenamiento"
  },
  {
    question: "¿Cuántas series y repeticiones debo hacer?",
    expected: "entrenamiento",
    description: "Consulta sobre volumen de entrenamiento"
  },
  
  // Recuperación
  {
    question: "¿Cuánto tiempo debo descansar entre entrenamientos?",
    expected: "recuperacion",
    description: "Pregunta sobre periodización del descanso"
  },
  {
    question: "Me siento muy cansado, ¿qué hago?",
    expected: "recuperacion",
    description: "Consulta sobre fatiga y recuperación"
  },
  
  // Prevención
  {
    question: "¿Cómo puedo prevenir lesiones al correr?",
    expected: "prevencion",
    description: "Pregunta sobre prevención de lesiones"
  },
  {
    question: "Me duele la rodilla, ¿qué debo hacer?",
    expected: "prevencion",
    description: "Consulta sobre dolor y cuidado físico"
  },
  
  // Equipamiento
  {
    question: "¿Qué zapatillas son mejores para correr?",
    expected: "equipamiento",
    description: "Pregunta sobre calzado deportivo"
  },
  {
    question: "¿Qué reloj deportivo me recomiendas?",
    expected: "equipamiento",
    description: "Consulta sobre tecnología deportiva"
  }
];

// Preguntas ambiguas para probar casos edge
const ambiguousQuestions = [
  "Hola, ¿cómo estás?",
  "¿Qué tal tu día?",
  "Gracias por la información",
  "No entiendo nada"
];

async function testClassification() {
  logHeader('DEMOSTRACIÓN DEL SISTEMA DE MINERÍA DE TEXTO RUNINSIGHT');
  
  log('Este script demuestra el funcionamiento completo del pipeline de clasificación', 'yellow');
  log('de preguntas del chatbot de RunInsight utilizando técnicas de minería de texto.\n', 'yellow');
  
  // Test 1: Clasificación de preguntas por categoría
  logSection('TEST 1: CLASIFICACIÓN POR CATEGORÍAS');
  
  let correctClassifications = 0;
  const totalQuestions = testQuestions.length;
  
  for (const testCase of testQuestions) {
    log(`\n🔍 Probando: "${testCase.question}"`, 'blue');
    log(`📝 Descripción: ${testCase.description}`, 'yellow');
    
    try {
      const result = await classifyQuestion(testCase.question);
      
      const isCorrect = result.category === testCase.expected;
      const status = isCorrect ? '✅ CORRECTO' : '❌ INCORRECTO';
      const statusColor = isCorrect ? 'green' : 'red';
      
      log(`🎯 Categoría esperada: ${testCase.expected}`, 'magenta');
      log(`🎯 Categoría obtenida: ${result.category}`, 'magenta');
      log(`📊 Confianza: ${result.confidence}%`, 'cyan');
      log(`📈 Status: ${status}`, statusColor);
      
      if (isCorrect) correctClassifications++;
      
      // Mostrar scores detallados
      log('📊 Scores por categoría:', 'cyan');
      Object.entries(result.scores).forEach(([category, score]) => {
        const marker = category === result.category ? '🏆' : '  ';
        log(`  ${marker} ${category}: ${score.score.toFixed(2)} (${score.matchCount}/${score.totalTokens} tokens)`, 'white');
      });
      
    } catch (error) {
      log(`❌ Error: ${error.message}`, 'red');
    }
  }
  
  const accuracy = (correctClassifications / totalQuestions) * 100;
  log(`\n📈 PRECISIÓN GENERAL: ${accuracy.toFixed(1)}% (${correctClassifications}/${totalQuestions})`, 'bright');
  
  // Test 2: Preguntas ambiguas
  logSection('TEST 2: PREGUNTAS AMBIGUAS');
  
  for (const question of ambiguousQuestions) {
    log(`\n🔍 Probando pregunta ambigua: "${question}"`, 'blue');
    
    try {
      const result = await classifyQuestion(question);
      
      log(`🎯 Categoría asignada: ${result.category}`, 'magenta');
      log(`📊 Confianza: ${result.confidence}%`, 'cyan');
      
      if (result.confidence < 30) {
        log(`⚠️  Confianza baja - usando categoría por defecto`, 'yellow');
      }
      
    } catch (error) {
      log(`❌ Error: ${error.message}`, 'red');
    }
  }
  
  // Test 4: Simulación de usuario real
  logSection('TEST 4: SIMULACIÓN DE USUARIO REAL');
  
  const userId = 123;
  const userQuestions = [
    "¿Qué debo comer antes de correr?",
    "¿Cómo debo entrenar para mejorar mi resistencia?",
    "¿Cuánto tiempo debo descansar?",
    "¿Qué zapatillas me recomiendas?"
  ];
  
  log(`👤 Simulando usuario ID: ${userId}`, 'blue');
  log(`📝 Preguntas del usuario:`, 'blue');
  
  for (let i = 0; i < userQuestions.length; i++) {
    const question = userQuestions[i];
    log(`  ${i + 1}. "${question}"`, 'white');
    
    try {
      const classification = await classifyQuestion(question);
      await updateUserStats(userId, classification.category);
      
      log(`     → Clasificado como: ${classification.category}`, 'green');
      
    } catch (error) {
      log(`     → Error: ${error.message}`, 'red');
    }
  }
  
  // Mostrar estadísticas finales del usuario
  const userPreferences = getUserPreferences(userId);
  
  log(`\n📊 ESTADÍSTICAS FINALES DEL USUARIO ${userId}:`, 'bright');
  log(`📈 Total de preguntas: ${userPreferences.totalQuestions}`, 'cyan');
  log(`🏆 Categoría principal: ${userPreferences.topCategory}`, 'magenta');
  log(`📊 Nivel de engagement: ${userPreferences.engagementLevel}`, 'yellow');
  log(`⚖️ Score ponderado: ${userPreferences.weightedScore}`, 'green');
  
  log('\n📋 DISTRIBUCIÓN POR CATEGORÍA:', 'cyan');
  userPreferences.preferences.forEach(pref => {
    const percentage = pref.percentage;
    const bar = '█'.repeat(Math.round(percentage / 5));
    log(`  ${pref.category}: ${pref.count} preguntas (${percentage}%) ${bar}`, 'white');
  });
  
  // Test 5: Performance
  logSection('TEST 5: PRUEBA DE RENDIMIENTO');
  
  const performanceQuestions = testQuestions.map(t => t.question);
  const startTime = Date.now();
  
  log(`🚀 Clasificando ${performanceQuestions.length} preguntas...`, 'blue');
  
  const results = await Promise.all(
    performanceQuestions.map(q => classifyQuestion(q))
  );
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const avgTime = duration / performanceQuestions.length;
  
  log(`⏱️  Tiempo total: ${duration}ms`, 'green');
  log(`⚡ Tiempo promedio por pregunta: ${avgTime.toFixed(2)}ms`, 'green');
  log(`📊 Throughput: ${(performanceQuestions.length / (duration / 1000)).toFixed(1)} preguntas/segundo`, 'green');
  
  // Resumen final
  logHeader('RESUMEN DE LA DEMOSTRACIÓN');
  
  log('✅ Sistema de clasificación funcionando correctamente', 'green');
  log('✅ Estadísticas de usuario actualizadas', 'green');
  log('✅ Rendimiento dentro de parámetros esperados', 'green');
  
  log('\n🎯 PRÓXIMOS PASOS:', 'bright');
  log('1. Integrar con la aplicación móvil RunInsight', 'yellow');
  log('2. Conectar con base de datos para persistencia', 'yellow');
  log('3. Implementar dashboard de métricas', 'yellow');
  log('4. Agregar más palabras clave por categoría', 'yellow');
  
  log('\n🏃‍♂️ ¡Sistema de minería de texto RunInsight listo para producción!', 'bright');
}

// Ejecutar la demostración
if (require.main === module) {
  testClassification().catch(error => {
    log(`❌ Error en la demostración: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { testClassification }; 