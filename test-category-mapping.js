const { classifyQuestion } = require('./src/services/textClassification');

async function testCategoryMapping() {
  console.log('🧪 Probando mapeo de categorías...\n');
  
  const testQuestions = [
    { question: "¿Qué debo comer antes de correr?", expected: "Nutrición" },
    { question: "¿Cómo mejorar mi resistencia?", expected: "Entrenamiento" },
    { question: "¿Cuánto tiempo debo descansar?", expected: "Recuperación" },
    { question: "¿Cómo prevenir lesiones?", expected: "Prevención" },
    { question: "¿Qué zapatillas me recomiendas?", expected: "Equipamiento" }
  ];
  
  for (const test of testQuestions) {
    try {
      console.log(`🔍 Probando: "${test.question}"`);
      const result = await classifyQuestion(test.question);
      console.log(`✅ Categoría obtenida: ${result.category}`);
      console.log(`📊 Confianza: ${result.confidence}%`);
      console.log(`🎯 Esperada: ${test.expected}`);
      console.log(`📈 Status: ${result.category === test.expected ? '✅ CORRECTO' : '❌ INCORRECTO'}\n`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}\n`);
    }
  }
  
  console.log('🏁 Prueba completada');
}

testCategoryMapping().catch(console.error); 