const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RunInsight Chatbot Mining Service API',
      version: '1.0.0',
      description: 'API para clasificación automática de preguntas del chatbot RunInsight usando minería de texto',
      contact: {
        name: 'RunInsight Team',
        email: 'support@runinsight.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.runinsight.com',
        description: 'Servidor de producción'
      }
    ],
    tags: [
      {
        name: 'Text Mining',
        description: 'Endpoints para clasificación de preguntas'
      },
      {
        name: 'Health',
        description: 'Endpoints para monitoreo de salud del servicio'
      }
    ],
    components: {
      schemas: {
        QuestionRequest: {
          type: 'object',
          required: ['question', 'userId'],
          properties: {
            question: {
              type: 'string',
              description: 'Pregunta del usuario a clasificar',
              example: '¿Qué debo comer antes de correr?',
              minLength: 3,
              maxLength: 1000
            },
            userId: {
              type: 'integer',
              description: 'ID del usuario (referencia externa)',
              example: 123,
              minimum: 1
            }
          }
        },
        ClassificationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica si la clasificación fue exitosa',
              example: true
            },
            category: {
              type: 'string',
              description: 'Categoría clasificada',
              enum: ['nutricion', 'entrenamiento', 'recuperacion', 'prevencion', 'equipamiento'],
              example: 'nutricion'
            },
            confidence: {
              type: 'number',
              format: 'float',
              description: 'Nivel de confianza de la clasificación (0-100)',
              example: 85.5,
              minimum: 0,
              maximum: 100
            },
            userStats: {
              type: 'object',
              description: 'Estadísticas actualizadas del usuario',
              properties: {
                preguntas_nutricion: {
                  type: 'integer',
                  description: 'Número de preguntas sobre nutrición',
                  example: 5
                },
                preguntas_entrenamiento: {
                  type: 'integer',
                  description: 'Número de preguntas sobre entrenamiento',
                  example: 12
                },
                preguntas_recuperacion: {
                  type: 'integer',
                  description: 'Número de preguntas sobre recuperación',
                  example: 3
                },
                preguntas_prevencion_lesiones: {
                  type: 'integer',
                  description: 'Número de preguntas sobre prevención',
                  example: 2
                },
                preguntas_equipamiento: {
                  type: 'integer',
                  description: 'Número de preguntas sobre equipamiento',
                  example: 1
                },
                score_ponderado: {
                  type: 'number',
                  format: 'float',
                  description: 'Score ponderado del usuario',
                  example: 45.5
                },
                ultima_actualizacion: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Fecha de última actualización',
                  example: '2024-01-15T10:30:00.000Z'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp de la clasificación',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        UserStatsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica si la operación fue exitosa',
              example: true
            },
            stats: {
              type: 'object',
              description: 'Estadísticas del usuario',
              properties: {
                userId: {
                  type: 'integer',
                  description: 'ID del usuario',
                  example: 123
                },
                preguntas_nutricion: {
                  type: 'integer',
                  description: 'Número de preguntas sobre nutrición',
                  example: 5
                },
                preguntas_entrenamiento: {
                  type: 'integer',
                  description: 'Número de preguntas sobre entrenamiento',
                  example: 12
                },
                preguntas_recuperacion: {
                  type: 'integer',
                  description: 'Número de preguntas sobre recuperación',
                  example: 3
                },
                preguntas_prevencion_lesiones: {
                  type: 'integer',
                  description: 'Número de preguntas sobre prevención',
                  example: 2
                },
                preguntas_equipamiento: {
                  type: 'integer',
                  description: 'Número de preguntas sobre equipamiento',
                  example: 1
                },
                score_ponderado: {
                  type: 'number',
                  format: 'float',
                  description: 'Score ponderado del usuario',
                  example: 45.5
                },
                ultima_actualizacion: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Fecha de última actualización',
                  example: '2024-01-15T10:30:00.000Z'
                }
              }
            }
          }
        },
        CategoriesResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica si la operación fue exitosa',
              example: true
            },
            categories: {
              type: 'array',
              description: 'Lista de categorías disponibles',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Nombre de la categoría',
                    example: 'entrenamiento'
                  },
                  weight: {
                    type: 'integer',
                    description: 'Peso de la categoría',
                    example: 3
                  },
                  description: {
                    type: 'string',
                    description: 'Descripción de la categoría',
                    example: 'Preguntas sobre rutinas, ejercicios, técnicas'
                  }
                }
              }
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Estado del servicio',
              example: 'OK'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp del health check',
              example: '2024-01-15T10:30:00.000Z'
            },
            uptime: {
              type: 'number',
              description: 'Tiempo de actividad del servicio en segundos',
              example: 3600
            },
            version: {
              type: 'string',
              description: 'Versión del servicio',
              example: '1.0.0'
            },
            services: {
              type: 'object',
              description: 'Estado de los servicios internos',
              properties: {
                textClassification: {
                  type: 'string',
                  description: 'Estado del servicio de clasificación',
                  example: 'operational'
                },
                userStats: {
                  type: 'string',
                  description: 'Estado del servicio de estadísticas',
                  example: 'operational'
                },
                database: {
                  type: 'string',
                  description: 'Estado de la base de datos',
                  example: 'operational'
                }
              }
            },
            memory: {
              type: 'object',
              description: 'Información de memoria del servicio',
              properties: {
                used: {
                  type: 'integer',
                  description: 'Memoria utilizada en MB',
                  example: 128
                },
                total: {
                  type: 'integer',
                  description: 'Memoria total en MB',
                  example: 512
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica que la operación falló',
              example: false
            },
            error: {
              type: 'string',
              description: 'Descripción del error',
              example: 'Error al clasificar la pregunta'
            },
            message: {
              type: 'string',
              description: 'Mensaje detallado del error',
              example: 'La pregunta debe tener al menos 3 caracteres'
            }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/app.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs; 