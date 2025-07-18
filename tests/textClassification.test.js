const { classifyQuestion, preprocessText } = require('../src/services/textClassification');

describe('Text Classification Service', () => {
  describe('preprocessText', () => {
    test('should normalize text correctly', () => {
      const input = "¿Qué DEBO comer ANTES de correr?";
      const expected = "que debo comer antes de correr";
      expect(preprocessText(input)).toBe(expected);
    });

    test('should handle special characters', () => {
      const input = "¡Hola! ¿Cómo estás?";
      const expected = "hola como estas";
      expect(preprocessText(input)).toBe(expected);
    });

    test('should handle empty string', () => {
      expect(() => preprocessText('')).toThrow('El texto debe ser una cadena válida');
    });

    test('should handle null input', () => {
      expect(() => preprocessText(null)).toThrow('El texto debe ser una cadena válida');
    });
  });

  describe('classifyQuestion', () => {
    test('should classify nutrition question correctly', async () => {
      const question = "¿Qué debo comer antes de correr?";
      const result = await classifyQuestion(question);
      
      expect(result.success).toBeUndefined(); // No success field in result
      expect(result.category).toBe('nutricion');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(result.originalText).toBe(question);
    });

    test('should classify training question correctly', async () => {
      const question = "¿Cómo debo entrenar para mejorar mi resistencia?";
      const result = await classifyQuestion(question);
      
      expect(result.category).toBe('entrenamiento');
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should classify recovery question correctly', async () => {
      const question = "¿Cuánto tiempo debo descansar entre entrenamientos?";
      const result = await classifyQuestion(question);
      
      expect(result.category).toBe('recuperacion');
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should classify prevention question correctly', async () => {
      const question = "¿Cómo puedo prevenir lesiones al correr?";
      const result = await classifyQuestion(question);
      
      expect(result.category).toBe('prevencion');
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should classify equipment question correctly', async () => {
      const question = "¿Qué zapatillas son mejores para correr?";
      const result = await classifyQuestion(question);
      
      expect(result.category).toBe('equipamiento');
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should handle ambiguous questions', async () => {
      const question = "Hola, ¿cómo estás?";
      const result = await classifyQuestion(question);
      
      expect(result.category).toBe('entrenamiento'); // Default category
      expect(result.confidence).toBeLessThan(30);
    });

    test('should return scores for all categories', async () => {
      const question = "¿Qué debo comer antes de correr?";
      const result = await classifyQuestion(question);
      
      expect(result.scores).toBeDefined();
      expect(result.scores.nutricion).toBeDefined();
      expect(result.scores.entrenamiento).toBeDefined();
      expect(result.scores.recuperacion).toBeDefined();
      expect(result.scores.prevencion).toBeDefined();
      expect(result.scores.equipamiento).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle very long questions', async () => {
      const longQuestion = "¿Qué debo comer antes de correr? ".repeat(50);
      const result = await classifyQuestion(longQuestion);
      
      expect(result.category).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should handle questions with numbers', async () => {
      const question = "¿Cuántos kilómetros debo correr en 30 minutos?";
      const result = await classifyQuestion(question);
      
      expect(result.category).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should handle questions with emojis', async () => {
      const question = "¿Qué debo comer antes de correr? 🏃‍♂️";
      const result = await classifyQuestion(question);
      
      expect(result.category).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    test('should classify multiple questions quickly', async () => {
      const questions = [
        "¿Qué debo comer antes de correr?",
        "¿Cómo debo entrenar?",
        "¿Cuánto descansar?",
        "¿Cómo prevenir lesiones?",
        "¿Qué zapatillas usar?"
      ];

      const startTime = Date.now();
      
      const results = await Promise.all(
        questions.map(q => classifyQuestion(q))
      );
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(results).toHaveLength(5);
      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
      
      // Verify all questions were classified
      results.forEach(result => {
        expect(result.category).toBeDefined();
        expect(result.confidence).toBeGreaterThan(0);
      });
    });
  });
}); 