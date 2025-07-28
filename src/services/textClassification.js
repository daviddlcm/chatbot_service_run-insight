const natural = require('natural');
const nlp = require('compromise');

/**
 * Servicio de clasificación de texto para preguntas de fitness
 * Implementa minería de texto con múltiples enfoques
 */
class TextClassificationService {
  constructor() {
    this.categories = {
      nutricion: {
        keywords: [
          // Alimentos básicos
          'comer', 'alimentación', 'dieta', 'nutrición', 'comida', 'alimento', 'alimentos',
          // Macronutrientes
          'proteína', 'proteínas', 'carbohidratos', 'grasas', 'lípidos', 'fibra', 'azúcar',
          // Micronutrientes
          'vitaminas', 'minerales', 'calcio', 'hierro', 'magnesio', 'potasio', 'sodio',
          // Hidratación
          'hidratación', 'hidratar', 'agua', 'bebida', 'bebidas', 'líquido', 'líquidos',
          // Suplementos
          'suplementos', 'suplemento', 'proteína en polvo', 'creatina', 'bcaa', 'omega 3',
          // Comidas del día
          'desayuno', 'almuerzo', 'cena', 'snack', 'merienda', 'colación',
          // Tiempos de alimentación
          'antes', 'después', 'durante', 'pre-entrenamiento', 'post-entrenamiento',
          // Bebidas específicas
          'bebida isotónica', 'batido', 'smoothie', 'jugo', 'té', 'café',
          // Conceptos nutricionales
          'calorías', 'macronutrientes', 'micronutrientes', 'metabolismo', 'digestión',
          // Alimentos específicos
          'pollo', 'pescado', 'huevos', 'leche', 'yogur', 'queso', 'frutas', 'verduras',
          'arroz', 'pasta', 'pan', 'avena', 'nueces', 'almendras', 'semillas'
        ],
        weight: 2
      },
      entrenamiento: {
        keywords: [
          // Conceptos generales
          'entrenar', 'ejercicio', 'ejercicios', 'rutina', 'rutinas', 'entrenamiento',
          // Series y repeticiones
          'series', 'repeticiones', 'reps', 'sets', 'circuitos', 'superseries',
          // Intensidad y volumen
          'intensidad', 'frecuencia', 'volumen', 'progresión', 'sobrecarga',
          // Planificación
          'plan', 'programa', 'sesión', 'periodización', 'ciclos', 'fases',
          // Calentamiento y enfriamiento
          'calentamiento', 'enfriamiento', 'warm up', 'cool down',
          // Técnica
          'técnica', 'forma', 'postura', 'ejecución', 'movimiento', 'gesto',
          // Resistencia y cardio
          'resistencia', 'cardio', 'aeróbico', 'anaeróbico', 'endurance',
          // Correr específicamente
          'correr', 'carrera', 'running', 'jogging', 'trotar', 'sprint',
          // Mejoras específicas
          'correr más rápido', 'mejorar resistencia', 'aumentar velocidad',
          // Planes de entrenamiento
          'plan de entrenamiento', 'programa de entrenamiento', 'rutina semanal',
          // Métricas
          'velocidad', 'distancia', 'kilómetros', 'km', 'minutos', 'tiempo',
          'ritmo', 'paso', 'cadencia', 'frecuencia cardíaca', 'fc',
          // Objetivos
          'objetivo', 'meta', 'lograr', 'alcanzar', 'conseguir',
          // Tipos de entrenamiento
          'entrenamiento cruzado', 'intervalos', 'fartlek', 'fuerza', 'hiit',
          'entrenamientos', 'workout', 'gimnasio', 'pesas', 'mancuernas',
          // Ejercicios específicos
          'sentadillas', 'peso muerto', 'press banca', 'dominadas', 'flexiones',
          'plancha', 'burpees', 'mountain climbers', 'jumping jacks'
        ],
        weight: 3
      },
      recuperacion: {
        keywords: [
          // Conceptos básicos
          'recuperación', 'recuperar', 'descanso', 'descansar', 'reposo', 'pausa',
          // Sueño
          'sueño', 'dormir', 'dormir bien', 'calidad del sueño', 'horas de sueño',
          // Fatiga y cansancio
          'fatiga', 'cansancio', 'cansado', 'agotado', 'exhausto', 'tired',
          // Relajación
          'relajar', 'relajación', 'relajarse', 'tranquilidad', 'paz',
          // Recuperación muscular
          'recuperación muscular', 'regeneración', 'regenerar', 'reparación',
          // Tipos de recuperación
          'recuperación activa', 'recuperación pasiva', 'recuperación entre entrenamientos',
          // Estiramientos (ampliado significativamente)
          'estiramiento', 'estirar', 'estiramientos', 'flexibilidad', 'mobilidad',
          'elongación', 'elongar', 'stretching', 'yoga', 'pilates',
          // Técnicas de recuperación
          'masaje', 'masajear', 'automasaje', 'foam roller', 'rodillo', 'pelota',
          'hielo', 'calor', 'compresión', 'elevación', 'rice', 'crioterapia',
          // Terapias
          'fisioterapia', 'terapia física', 'terapia manual', 'osteopatía',
          'quiropraxia', 'acupuntura', 'reflexología',
          // Periodización
          'periodización', 'ciclos de descanso', 'días de descanso',
          // Recuperación mental
          'recuperación mental', 'estrés', 'ansiedad', 'meditación', 'mindfulness',
          // Técnicas específicas
          'contraste', 'sauna', 'baño turco', 'hidroterapia', 'electroestimulación',
          'compresión graduada', 'vendaje neuromuscular', 'kinesiotape'
        ],
        weight: 2
      },
      prevencion: {
        keywords: [
          // Lesiones
          'lesión', 'lesiones', 'lesionado', 'lesionarse', 'daño', 'trauma',
          // Prevención
          'prevención', 'prevenir', 'evitar', 'proteger', 'cuidar', 'cuidado',
          // Dolor y molestias
          'dolor', 'dolores', 'molestia', 'molestias', 'incomodidad', 'malestar',
          // Problemas
          'problema', 'problemas', 'inconveniente', 'dificultad', 'obstáculo',
          // Seguridad
          'seguridad', 'seguro', 'protección', 'precaución', 'cautela',
          // Riesgo
          'riesgo', 'peligro', 'amenaza', 'vulnerable', 'susceptible',
          // Tratamiento
          'tratamiento', 'tratar', 'cura', 'sanar', 'curar', 'reparar',
          // Rehabilitación
          'rehabilitación', 'rehabilitar', 'recuperación de lesiones',
          // Terapias
          'fisioterapia', 'terapia física', 'terapia ocupacional',
          // Vendajes y soportes
          'vendaje', 'venda', 'vendajes', 'soporte', 'férula', 'ortesis',
          // Fortalecimiento
          'fortalecimiento', 'fortalecer', 'fortalecido', 'resistencia',
          // Estiramientos preventivos
          'estiramiento', 'estirar', 'flexibilidad', 'mobilidad',
          // Calentamiento preventivo
          'calentar', 'calentamiento', 'preparación', 'preparar',
          // Enfriamiento
          'enfriamiento', 'enfriar', 'relajar músculos',
          // Técnicas específicas
          'propiocepción', 'equilibrio', 'estabilidad', 'coordinación',
          'control motor', 'patrón de movimiento'
        ],
        weight: 2
      },
      equipamiento: {
        keywords: [
          // Calzado (ampliado)
          'zapatillas', 'tenis', 'calzado', 'zapatos', 'botas', 'sandalias',
          'zapatillas running', 'zapatillas trail', 'zapatillas gym',
          'zapatillas crossfit', 'zapatillas minimalistas', 'zapatillas maximalistas',
          // Ropa (ampliado)
          'ropa', 'camiseta', 'pantalón', 'short', 'calcetas', 'calcetines',
          'leggings', 'mallas', 'top', 'sujetador deportivo', 'brasier deportivo',
          'chaqueta', 'sudaderas', 'hoodie', 'polo', 'camisa', 'falda deportiva',
          // Accesorios de cabeza
          'gorra', 'sombrero', 'bandana', 'banda', 'diadema', 'visor',
          'gafas', 'lentes', 'gafas de sol', 'gafas deportivas',
          // Tecnología (ampliado)
          'reloj', 'smartwatch', 'pulsómetro', 'banda cardíaca', 'monitor cardíaco',
          'gps', 'podómetro', 'contador de pasos', 'fitness tracker',
          'app', 'aplicación', 'tecnología', 'gadget', 'dispositivo',
          // Hidratación
          'botella', 'botella de agua', 'termo', 'cantimplora', 'hidratación',
          // Bolsos y mochilas
          'mochila', 'bolsa', 'bolso', 'riñonera', 'fanny pack', 'cartera',
          // Cinturones y soportes
          'cinturón', 'cinturón de levantamiento', 'faja', 'soporte lumbar',
          'rodilleras', 'coderas', 'muñequeras', 'tobilleras',
          // Audio
          'auriculares', 'audífonos', 'headphones', 'bluetooth', 'inalámbricos',
          'cableados', 'earbuds', 'airpods',
          // Equipamiento de entrenamiento
          'pesas', 'mancuernas', 'barras', 'discos', 'kettlebells', 'pelotas',
          'bandas elásticas', 'resistance bands', 'cuerdas', 'cuerda de saltar',
          'mat', 'colchoneta', 'yoga mat', 'foam roller', 'rodillo',
          // Equipamiento específico
          'bicicleta', 'bici', 'spinning', 'treadmill', 'cinta', 'eliptica',
          'stepper', 'escaladora', 'remadora', 'rowing machine',
          // Accesorios varios
          'accesorio', 'accesorios', 'herramienta', 'herramientas', 'material',
          'materiales', 'instrumento', 'instrumentos', 'aparato', 'aparatos',
          // Términos de búsqueda
          'mejores', 'usar', 'recomiendas', 'recomendación', 'opción',
          'deportivo', 'deportivos', 'fitness', 'gym', 'entrenamiento',
          // Marcas populares
          'nike', 'adidas', 'puma', 'reebok', 'under armour', 'lululemon',
          'garmin', 'polar', 'suunto', 'fitbit', 'apple watch'
        ],
        weight: 1
      }
    };
    
    // Inicializar tokenizer
    this.tokenizer = new natural.WordTokenizer();
  }

  /**
   * Preprocesa el texto para mejorar la clasificación
   * @param {string} text - Texto a preprocesar
   * @returns {string} - Texto preprocesado
   */
  preprocessText(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('El texto debe ser una cadena válida');
    }

    // Normalizar texto
    let processedText = text.toLowerCase();
    
    // Remover caracteres especiales pero mantener acentos
    processedText = processedText.replace(/[^\w\sáéíóúñü]/g, ' ');
    
    // Normalizar espacios
    processedText = processedText.replace(/\s+/g, ' ').trim();
    
    // Lematización básica (reducir palabras a su forma base)
    const doc = nlp(processedText);
    processedText = doc.normalize().text();
    
    return processedText;
  }

  /**
   * Calcula la similitud entre el texto y una categoría usando TF-IDF
   * @param {string} text - Texto a clasificar
   * @param {string} category - Categoría a evaluar
   * @returns {number} - Score de similitud
   */
  calculateSimilarity(text, category) {
    const categoryKeywords = this.categories[category].keywords;
    const tokens = this.tokenizer.tokenize(text);
    
    if (!tokens || tokens.length === 0) return 0;
    
    let matchCount = 0;
    let totalScore = 0;
    
    // Contar coincidencias de palabras clave
    tokens.forEach(token => {
      if (categoryKeywords.includes(token)) {
        matchCount++;
        // Dar más peso a palabras más específicas
        totalScore += 1;
      }
    });
    
    // Calcular score basado en coincidencias y peso de la categoría
    const baseScore = (matchCount / tokens.length) * 100;
    const weightedScore = baseScore * this.categories[category].weight;
    
    return {
      score: weightedScore,
      matchCount,
      totalTokens: tokens.length,
      matchRatio: matchCount / tokens.length
    };
  }

  /**
   * Clasifica una pregunta usando múltiples algoritmos
   * @param {string} question - Pregunta a clasificar
   * @returns {Object} - Resultado de la clasificación
   */
  async classifyQuestion(question) {
    try {
      console.log(`🔍 Iniciando clasificación de: "${question}"`);
      
      // Preprocesar texto
      const processedText = this.preprocessText(question);
      console.log(`📝 Texto preprocesado: "${processedText}"`);
      
      // Calcular scores para todas las categorías
      const scores = {};
      let maxScore = 0;
      let bestCategory = null;
      let bestMatchCount = 0;
      
      for (const category of Object.keys(this.categories)) {
        const similarity = this.calculateSimilarity(processedText, category);
        scores[category] = similarity;
        
        if (
          similarity.score > maxScore ||
          (similarity.score === maxScore && similarity.matchCount > bestMatchCount)
        ) {
          maxScore = similarity.score;
          bestCategory = category;
          bestMatchCount = similarity.matchCount;
        }
      }
      
      // Reglas especiales para mejorar la clasificación
      
      // 1. Palabras clave fuertes de recuperación
      const recoveryStrongWords = [
        'estiramiento', 'estirar', 'estiramientos', 'flexibilidad', 'yoga', 'pilates',
        'foam roller', 'rodillo', 'masaje', 'relajación', 'relajar', 'dormir', 'sueño',
        'descanso', 'descansar', 'recuperación', 'recuperar', 'fatiga', 'cansancio'
      ];
      
      // 2. Palabras clave fuertes de equipamiento
      const equipStrongWords = [
        'zapatillas', 'tenis', 'calzado', 'ropa', 'camiseta', 'pantalón', 'short',
        'reloj', 'smartwatch', 'pulsómetro', 'auriculares', 'audífonos', 'mochila',
        'botella', 'cinturón', 'bandas elásticas', 'pesas', 'mancuernas',
        'nike', 'adidas', 'garmin', 'fitbit', 'under armour'
      ];
      
      // 3. Palabras clave fuertes de nutrición
      const nutritionStrongWords = [
        'comer', 'alimentación', 'dieta', 'nutrición', 'proteína', 'proteínas',
        'calorías', 'suplementos', 'desayuno', 'almuerzo', 'cena', 'batido',
        'agua', 'hidratación', 'creatina', 'bcaa'
      ];
      
      // 4. Palabras clave fuertes de prevención
      const preventionStrongWords = [
        'lesión', 'lesiones', 'prevención', 'prevenir', 'dolor', 'molestia',
        'vendaje', 'fortalecimiento', 'estabilidad', 'propiocepción'
      ];
      
      // Aplicar reglas de prioridad
      const strongWordsMap = {
        'recuperacion': recoveryStrongWords,
        'equipamiento': equipStrongWords,
        'nutricion': nutritionStrongWords,
        'prevencion': preventionStrongWords
      };
      
      // Si hay palabras clave fuertes, dar prioridad a esa categoría
      for (const [category, strongWords] of Object.entries(strongWordsMap)) {
        const hasStrongWords = strongWords.some(word => processedText.includes(word));
        if (hasStrongWords && scores[category].matchCount > 0) {
          // Si la categoría tiene palabras fuertes y al menos una coincidencia,
          // aumentar su score significativamente
          scores[category].score *= 2;
          
          // Si ahora es la mejor categoría, actualizar
          if (scores[category].score > maxScore) {
            maxScore = scores[category].score;
            bestCategory = category;
            bestMatchCount = scores[category].matchCount;
          }
        }
      }
      
      // Calcular confianza
      const totalScore = Object.values(scores).reduce((sum, s) => sum + s.score, 0);
      const confidence = totalScore > 0 ? (maxScore / totalScore) * 100 : 0;
      
      // Si la confianza es muy baja, usar categoría por defecto
      if (confidence < 20) {
        bestCategory = 'entrenamiento'; // Categoría por defecto
        console.log(`⚠️ Confianza baja (${confidence.toFixed(2)}%), usando categoría por defecto`);
      }
      
      // Agregar mapeo de categorías internas a nombres de BD
      const categoryMapping = {
        'nutricion': 'Nutrición',
        'entrenamiento': 'Entrenamiento',
        'recuperacion': 'Recuperación',
        'prevencion': 'Prevención',
        'equipamiento': 'Equipamiento'
      };

      const dbCategoryName = categoryMapping[bestCategory] || bestCategory;

      const result = {
        category: dbCategoryName, // Usar nombre de BD
        confidence: Math.round(confidence * 100) / 100,
        scores: scores,
        processedText: processedText,
        originalText: question
      };
      
      console.log(`✅ Clasificación completada: ${dbCategoryName} (confianza: ${confidence.toFixed(2)}%)`);
      console.log(`📊 Scores por categoría:`, scores);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error en clasificación:', error);
      throw new Error(`Error al clasificar la pregunta: ${error.message}`);
    }
  }
}

// Instancia singleton del servicio
const textClassificationService = new TextClassificationService();

// Exportar funciones
module.exports = {
  classifyQuestion: (question) => textClassificationService.classifyQuestion(question),
  preprocessText: (text) => textClassificationService.preprocessText(text)
}; 