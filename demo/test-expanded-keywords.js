const { classifyQuestion } = require('../src/services/textClassification');

/**
 * Script de prueba para verificar las palabras clave expandidas
 */
async function testExpandedKeywords() {
  try {
    console.log('🧪 Probando palabras clave expandidas...\n');

    // Preguntas de prueba para cada categoría
    const testQuestions = {
      nutricion: [
        "¿Qué debo comer antes de correr?",
        "¿Cuántas calorías necesito?",
        "¿Qué proteínas son mejores?",
        "¿Necesito suplementos de creatina?",
        "¿Qué comer en el desayuno?",
        "¿Es bueno tomar batidos de proteína?"
      ],
      entrenamiento: [
        "¿Cómo mejorar mi resistencia?",
        "¿Cuántas series debo hacer?",
        "¿Qué ejercicios para fuerza?",
        "¿Cómo correr más rápido?",
        "¿Cuál es la mejor rutina?",
        "¿Qué es el entrenamiento HIIT?"
      ],
      recuperacion: [
        "¿Cómo estirar después del ejercicio?",
        "¿Cuánto tiempo debo descansar?",
        "¿Qué ejercicios de flexibilidad?",
        "¿Es bueno usar foam roller?",
        "¿Cómo mejorar mi recuperación?",
        "¿Qué técnicas de relajación?",
        "¿Cuántas horas debo dormir?",
        "¿Es bueno hacer yoga para recuperar?"
      ],
      prevencion: [
        "¿Cómo prevenir lesiones?",
        "¿Qué ejercicios de fortalecimiento?",
        "¿Cómo evitar el dolor de rodilla?",
        "¿Qué vendajes usar?",
        "¿Cómo mejorar la estabilidad?",
        "¿Qué ejercicios de propiocepción?"
      ],
      equipamiento: [
        "¿Qué zapatillas debo usar?",
        "¿Cuál es el mejor smartwatch?",
        "¿Qué ropa deportiva recomiendas?",
        "¿Es bueno usar bandas elásticas?",
        "¿Qué mochila para el gym?",
        "¿Cuál es la mejor botella de agua?",
        "¿Qué auriculares para correr?",
        "¿Es bueno usar cinturón de levantamiento?",
        "¿Qué marca de zapatillas es mejor?"
      ]
    };

    // Probar cada categoría
    for (const [category, questions] of Object.entries(testQuestions)) {
      console.log(`\n📋 Probando categoría: ${category.toUpperCase()}`);
      console.log('─'.repeat(50));
      
      for (const question of questions) {
        try {
          const result = await classifyQuestion(question);
          const isCorrect = result.category === category;
          const emoji = isCorrect ? '✅' : '❌';
          
          console.log(`${emoji} "${question}"`);
          console.log(`   → Clasificado como: ${result.category} (confianza: ${result.confidence}%)`);
          
          if (!isCorrect) {
            console.log(`   ⚠️  Esperado: ${category}, Obtenido: ${result.category}`);
          }
          
        } catch (error) {
          console.error(`❌ Error clasificando: "${question}"`, error.message);
        }
      }
    }

    // Pruebas específicas para palabras nuevas
    console.log('\n\n🔍 Pruebas específicas de palabras nuevas...');
    console.log('─'.repeat(50));

    const specificTests = [
      {
        question: "¿Cómo estirar los músculos después del entrenamiento?",
        expected: "recuperacion",
        keywords: ["estirar", "estiramiento"]
      },
      {
        question: "¿Qué zapatillas Nike son mejores para correr?",
        expected: "equipamiento",
        keywords: ["zapatillas", "nike"]
      },
      {
        question: "¿Es bueno usar foam roller para la recuperación?",
        expected: "recuperacion",
        keywords: ["foam roller", "recuperación"]
      },
      {
        question: "¿Qué ropa deportiva Under Armour recomiendas?",
        expected: "equipamiento",
        keywords: ["ropa", "under armour"]
      },
      {
        question: "¿Cómo mejorar la flexibilidad con yoga?",
        expected: "recuperacion",
        keywords: ["flexibilidad", "yoga"]
      },
      {
        question: "¿Cuál es el mejor Garmin para entrenar?",
        expected: "equipamiento",
        keywords: ["garmin"]
      }
    ];

    for (const test of specificTests) {
      try {
        const result = await classifyQuestion(test.question);
        const isCorrect = result.category === test.expected;
        const emoji = isCorrect ? '✅' : '❌';
        
        console.log(`${emoji} "${test.question}"`);
        console.log(`   → Clasificado como: ${result.category} (confianza: ${result.confidence}%)`);
        console.log(`   → Palabras clave detectadas: ${test.keywords.join(', ')}`);
        
        if (!isCorrect) {
          console.log(`   ⚠️  Esperado: ${test.expected}, Obtenido: ${result.category}`);
        }
        
      } catch (error) {
        console.error(`❌ Error en prueba específica: "${test.question}"`, error.message);
      }
    }

    console.log('\n🎉 Pruebas completadas!');
    console.log('💡 Revisa los resultados para verificar que las palabras expandidas funcionan correctamente.');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    process.exit(0);
  }
}

// Ejecutar pruebas
testExpandedKeywords(); 