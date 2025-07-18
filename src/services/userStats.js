const { ChatbotQuestion, ChatbotCategory } = require('../models');

/**
 * Servicio para manejar estadísticas de usuario y métricas ponderadas
 * Implementa la lógica de contadores y cálculos de características usando MySQL
 * Diseñado para microservicios - no requiere verificación de usuario
 */

class UserStatsService {
  constructor() {
    // Pesos de las categorías según la especificación
    this.categoryWeights = {
      entrenamiento: 3,
      nutricion: 2,
      recuperacion: 2,
      prevencion: 2,
      equipamiento: 1
    };
  }

  /**
   * Obtiene las estadísticas actuales de un usuario desde la base de datos
   * @param {number} userId - ID del usuario (referencia externa)
   * @returns {Object} - Estadísticas del usuario
   */
  async getUserStats(userId) {
    try {
      console.log(`📊 Obteniendo estadísticas para usuario ${userId}`);
      
      // Obtener conteo de preguntas por categoría
      const questionStats = await ChatbotQuestion.findAll({
        where: { user_id: userId },
        include: [{
          model: ChatbotCategory,
          attributes: ['name']
        }],
        attributes: [
          [ChatbotQuestion.sequelize.fn('COUNT', ChatbotQuestion.sequelize.col('ChatbotQuestion.id')), 'count'],
          'category_id'
        ],
        group: ['category_id', 'ChatbotCategory.name']
      });

      // Inicializar contadores
      const stats = {
        preguntas_nutricion: 0,
        preguntas_entrenamiento: 0,
        preguntas_recuperacion: 0,
        preguntas_prevencion_lesiones: 0,
        preguntas_equipamiento: 0,
        ultima_actualizacion: new Date().toISOString()
      };

      // Mapear resultados de la consulta
      const categoryMapping = {
        'nutricion': 'preguntas_nutricion',
        'entrenamiento': 'preguntas_entrenamiento',
        'recuperacion': 'preguntas_recuperacion',
        'prevencion': 'preguntas_prevencion_lesiones',
        'equipamiento': 'preguntas_equipamiento'
      };

      questionStats.forEach(stat => {
        const categoryName = stat.ChatbotCategory.name;
        const fieldName = categoryMapping[categoryName];
        if (fieldName) {
          stats[fieldName] = parseInt(stat.dataValues.count);
        }
      });

      // Calcular score ponderado
      const weightedScore = this.calculateWeightedScore(stats);
      stats.score_ponderado = weightedScore;

      console.log(`✅ Estadísticas obtenidas para usuario ${userId}:`, stats);
      return stats;

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Actualiza las estadísticas de un usuario después de una clasificación
   * @param {number} userId - ID del usuario (referencia externa)
   * @param {string} category - Categoría de la pregunta
   * @returns {Object} - Estadísticas actualizadas
   */
  async updateUserStats(userId, category) {
    try {
      console.log(`📊 Actualizando estadísticas para usuario ${userId}, categoría: ${category}`);
      
      // Obtener el ID de la categoría
      const categoryRecord = await ChatbotCategory.findOne({
        where: { name: category }
      });

      if (!categoryRecord) {
        throw new Error(`Categoría no encontrada: ${category}`);
      }

      // Obtener estadísticas actuales
      const stats = await this.getUserStats(userId);
      
      console.log(`✅ Estadísticas actualizadas para usuario ${userId}`);
      return stats;

    } catch (error) {
      console.error('❌ Error actualizando estadísticas:', error);
      throw new Error(`Error al actualizar estadísticas: ${error.message}`);
    }
  }

  /**
   * Guarda una pregunta clasificada en la base de datos
   * @param {number} userId - ID del usuario (referencia externa)
   * @param {string} question - Pregunta del usuario
   * @param {string} category - Categoría clasificada
   * @returns {Object} - Pregunta guardada
   */
  async saveQuestion(userId, question, category) {
    try {
      console.log(`💾 Guardando pregunta para usuario ${userId}, categoría: ${category}`);
      
      // Obtener el ID de la categoría
      const categoryRecord = await ChatbotCategory.findOne({
        where: { name: category }
      });

      if (!categoryRecord) {
        throw new Error(`Categoría no encontrada: ${category}`);
      }

      // Guardar la pregunta en la base de datos
      const savedQuestion = await ChatbotQuestion.create({
        user_id: userId,
        question: question,
        category_id: categoryRecord.id,
        created_at: new Date()
      });

      console.log(`✅ Pregunta guardada con ID: ${savedQuestion.id}`);
      return savedQuestion;

    } catch (error) {
      console.error('❌ Error guardando pregunta:', error);
      throw new Error(`Error al guardar pregunta: ${error.message}`);
    }
  }

  /**
   * Calcula el score ponderado basado en las estadísticas del usuario
   * @param {Object} stats - Estadísticas del usuario
   * @returns {number} - Score ponderado
   */
  calculateWeightedScore(stats) {
    let totalScore = 0;
    
    // Calcular score para cada categoría
    totalScore += stats.preguntas_entrenamiento * this.categoryWeights.entrenamiento;
    totalScore += stats.preguntas_nutricion * this.categoryWeights.nutricion;
    totalScore += stats.preguntas_recuperacion * this.categoryWeights.recuperacion;
    totalScore += stats.preguntas_prevencion_lesiones * this.categoryWeights.prevencion;
    totalScore += stats.preguntas_equipamiento * this.categoryWeights.equipamiento;
    
    return Math.round(totalScore * 100) / 100;
  }

  /**
   * Obtiene las preferencias del usuario basadas en sus preguntas
   * @param {number} userId - ID del usuario (referencia externa)
   * @returns {Object} - Preferencias del usuario
   */
  async getUserPreferences(userId) {
    try {
      const stats = await this.getUserStats(userId);
      
      // Encontrar la categoría con más preguntas
      const categories = [
        { name: 'entrenamiento', count: stats.preguntas_entrenamiento },
        { name: 'nutricion', count: stats.preguntas_nutricion },
        { name: 'recuperacion', count: stats.preguntas_recuperacion },
        { name: 'prevencion', count: stats.preguntas_prevencion_lesiones },
        { name: 'equipamiento', count: stats.preguntas_equipamiento }
      ];

      const maxCategory = categories.reduce((max, current) => 
        current.count > max.count ? current : max
      );

      return {
        primaryInterest: maxCategory.name,
        totalQuestions: Object.values(stats).filter(val => typeof val === 'number' && val > 0).reduce((a, b) => a + b, 0),
        categoryDistribution: categories,
        weightedScore: stats.score_ponderado
      };

    } catch (error) {
      console.error('❌ Error obteniendo preferencias:', error);
      throw new Error(`Error al obtener preferencias: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas agregadas de todos los usuarios
   * @returns {Object} - Estadísticas globales
   */
  async getGlobalStats() {
    try {
      const globalStats = {
        totalUsers: 0,
        totalQuestions: 0,
        categoryDistribution: {
          entrenamiento: 0,
          nutricion: 0,
          recuperacion: 0,
          prevencion: 0,
          equipamiento: 0
        },
        averageWeightedScore: 0
      };

      // Obtener estadísticas globales desde la base de datos
      const questionStats = await ChatbotQuestion.findAll({
        include: [{
          model: ChatbotCategory,
          attributes: ['name']
        }],
        attributes: [
          [ChatbotQuestion.sequelize.fn('COUNT', ChatbotQuestion.sequelize.col('ChatbotQuestion.id')), 'count'],
          'category_id'
        ],
        group: ['category_id', 'ChatbotCategory.name']
      });

      // Contar usuarios únicos
      const uniqueUsers = await ChatbotQuestion.count({
        distinct: true,
        col: 'user_id'
      });

      globalStats.totalUsers = uniqueUsers;

      // Mapear resultados
      const categoryMapping = {
        'nutricion': 'nutricion',
        'entrenamiento': 'entrenamiento',
        'recuperacion': 'recuperacion',
        'prevencion': 'prevencion',
        'equipamiento': 'equipamiento'
      };

      questionStats.forEach(stat => {
        const categoryName = stat.ChatbotCategory.name;
        const fieldName = categoryMapping[categoryName];
        if (fieldName) {
          const count = parseInt(stat.dataValues.count);
          globalStats.categoryDistribution[fieldName] = count;
          globalStats.totalQuestions += count;
        }
      });

      return globalStats;

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas globales:', error);
      throw new Error(`Error al obtener estadísticas globales: ${error.message}`);
    }
  }
}

// Instancia singleton del servicio
const userStatsService = new UserStatsService();

/**
 * Inicializa las categorías del chatbot en la base de datos
 */
async function initializeCategories() {
  try {
    console.log('📋 Inicializando categorías del chatbot...');
    
    const categories = [
      { name: 'entrenamiento', weight: 3, description: 'Preguntas sobre rutinas, ejercicios, técnicas' },
      { name: 'nutricion', weight: 2, description: 'Preguntas sobre alimentación, suplementos' },
      { name: 'recuperacion', weight: 2, description: 'Preguntas sobre descanso, recuperación' },
      { name: 'prevencion', weight: 2, description: 'Preguntas sobre prevención de lesiones' },
      { name: 'equipamiento', weight: 1, description: 'Preguntas sobre ropa, calzado, tecnología' }
    ];

    for (const category of categories) {
      await ChatbotCategory.findOrCreate({
        where: { name: category.name },
        defaults: category
      });
    }

    console.log('✅ Categorías inicializadas correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando categorías:', error);
    throw error;
  }
}

// Exportar funciones
module.exports = {
  updateUserStats: (userId, category) => userStatsService.updateUserStats(userId, category),
  getUserStats: (userId) => userStatsService.getUserStats(userId),
  getUserPreferences: (userId) => userStatsService.getUserPreferences(userId),
  getGlobalStats: () => userStatsService.getGlobalStats(),
  saveQuestion: (userId, question, category) => userStatsService.saveQuestion(userId, question, category),
  calculateWeightedScore: (stats) => userStatsService.calculateWeightedScore(stats),
  initializeCategories
}; 