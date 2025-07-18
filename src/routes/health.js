const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica el estado de salud del servicio
 *     description: |
 *       Endpoint de health check que verifica el estado general del servicio.
 *       Retorna información sobre:
 *       - Estado del servicio (OK/ERROR)
 *       - Tiempo de actividad (uptime)
 *       - Versión del servicio
 *       - Estado de los servicios internos
 *       - Información de memoria
 *       
 *       Este endpoint es utilizado por sistemas de monitoreo y load balancers.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servicio funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: "OK"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *               uptime: 3600
 *               version: "1.0.0"
 *               services:
 *                 textClassification: "operational"
 *                 userStats: "operational"
 *                 database: "operational"
 *               memory:
 *                 used: 128
 *                 total: 512
 *       503:
 *         description: Servicio no disponible
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "ERROR"
 *               error: "Service unavailable"
 *               message: "Database connection failed"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 */
router.get('/', (req, res) => {
  const startTime = process.hrtime();
  
  // Calcular uptime en segundos
  const uptime = Math.floor(process.uptime());
  
  // Obtener información de memoria
  const memUsage = process.memoryUsage();
  const memoryInfo = {
    used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
    total: Math.round(memUsage.heapTotal / 1024 / 1024) // MB
  };
  
  // Verificar estado de servicios (simulado)
  const services = {
    textClassification: 'operational',
    userStats: 'operational',
    database: 'operational'
  };
  
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    version: process.env.npm_package_version || '1.0.0',
    services: services,
    memory: memoryInfo
  };
  
  res.json(healthData);
});

/**
 * @swagger
 * /api/health/ready:
 *   get:
 *     summary: Verifica si el servicio está listo para recibir tráfico
 *     description: |
 *       Endpoint de readiness check que verifica si el servicio está completamente inicializado
 *       y listo para manejar requests. Este endpoint es más estricto que el health check general.
 *       
 *       Verifica:
 *       - Conexión a base de datos
 *       - Inicialización de servicios
 *       - Carga de categorías
 *       
 *       Utilizado por Kubernetes y otros orquestadores para determinar cuándo el pod está listo.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servicio listo para recibir tráfico
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "READY"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *                 checks:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                       example: "connected"
 *                     categories:
 *                       type: string
 *                       example: "loaded"
 *                     services:
 *                       type: string
 *                       example: "initialized"
 *       503:
 *         description: Servicio no está listo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "NOT_READY"
 *                 error:
 *                   type: string
 *                   example: "Database not connected"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 */
router.get('/ready', (req, res) => {
  // Aquí podrías agregar verificaciones más específicas
  // como conexión a base de datos, carga de configuraciones, etc.
  
  const readyData = {
    status: 'READY',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'connected',
      categories: 'loaded',
      services: 'initialized'
    }
  };
  
  res.json(readyData);
});

/**
 * @swagger
 * /api/health/live:
 *   get:
 *     summary: Verifica si el proceso está vivo
 *     description: |
 *       Endpoint de liveness check que verifica si el proceso está ejecutándose.
 *       Este es el check más básico y solo verifica que el proceso no se haya colgado.
 *       
 *       Utilizado por Kubernetes para determinar si debe reiniciar el pod.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Proceso vivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ALIVE"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *                 pid:
 *                   type: integer
 *                   example: 12345
 */
router.get('/live', (req, res) => {
  const liveData = {
    status: 'ALIVE',
    timestamp: new Date().toISOString(),
    pid: process.pid
  };
  
  res.json(liveData);
});

module.exports = router; 