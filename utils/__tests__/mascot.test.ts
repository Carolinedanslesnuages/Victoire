/**
 * Unit tests for mascot utilities
 */

import {
  calculateResteAVivrePercentage,
  getMascotMood,
  getMascotZone,
  getMascotState,
} from '../mascot';

describe('mascot utilities', () => {
  describe('calculateResteAVivrePercentage', () => {
    it('should calculate correct percentage with no spending', () => {
      const percentage = calculateResteAVivrePercentage(2500, 1200, 300, 0);
      expect(percentage).toBe(100); // (1000 - 0) / 1000 * 100
    });

    it('should calculate correct percentage with partial spending', () => {
      const percentage = calculateResteAVivrePercentage(2500, 1200, 300, 500);
      expect(percentage).toBe(50); // (1000 - 500) / 1000 * 100
    });

    it('should return negative percentage when overspent', () => {
      const percentage = calculateResteAVivrePercentage(2500, 1200, 300, 1500);
      expect(percentage).toBe(-50); // (1000 - 1500) / 1000 * 100
    });

    it('should handle zero reste à vivre', () => {
      const percentage = calculateResteAVivrePercentage(1500, 1200, 300, 0);
      expect(percentage).toBe(0);
    });

    it('should factor in additional income', () => {
      const percentage = calculateResteAVivrePercentage(2500, 1200, 300, 500, 200);
      expect(percentage).toBe(70); // (1000 - 500 + 200) / 1000 * 100
    });
  });

  describe('getMascotMood', () => {
    it('should return serein for >75%', () => {
      expect(getMascotMood(80)).toBe('serein');
      expect(getMascotMood(76)).toBe('serein');
    });

    it('should return joyeux for 60-75%', () => {
      expect(getMascotMood(75)).toBe('joyeux');
      expect(getMascotMood(61)).toBe('joyeux');
    });

    it('should return optimiste for 50-60%', () => {
      expect(getMascotMood(60)).toBe('optimiste');
      expect(getMascotMood(51)).toBe('optimiste');
    });

    it('should return determine for 40-50%', () => {
      expect(getMascotMood(50)).toBe('determine');
      expect(getMascotMood(41)).toBe('determine');
    });

    it('should return vigilant for 25-40%', () => {
      expect(getMascotMood(40)).toBe('vigilant');
      expect(getMascotMood(26)).toBe('vigilant');
    });

    it('should return inquiet for 15-25%', () => {
      expect(getMascotMood(25)).toBe('inquiet');
      expect(getMascotMood(16)).toBe('inquiet');
    });

    it('should return nerveux for 10-15%', () => {
      expect(getMascotMood(15)).toBe('nerveux');
      expect(getMascotMood(11)).toBe('nerveux');
    });

    it('should return fatigue for 5-10%', () => {
      expect(getMascotMood(10)).toBe('fatigue');
      expect(getMascotMood(6)).toBe('fatigue');
    });

    it('should return panique for 0-5%', () => {
      expect(getMascotMood(5)).toBe('panique');
      expect(getMascotMood(1)).toBe('panique');
    });

    it('should return detresse for <0%', () => {
      expect(getMascotMood(0)).toBe('detresse');
      expect(getMascotMood(-10)).toBe('detresse');
    });
  });

  describe('getMascotZone', () => {
    it('should return green for >50%', () => {
      expect(getMascotZone(100)).toBe('green');
      expect(getMascotZone(51)).toBe('green');
    });

    it('should return yellow for 10-50%', () => {
      expect(getMascotZone(50)).toBe('yellow');
      expect(getMascotZone(11)).toBe('yellow');
    });

    it('should return red for ≤10%', () => {
      expect(getMascotZone(10)).toBe('red');
      expect(getMascotZone(0)).toBe('red');
      expect(getMascotZone(-10)).toBe('red');
    });
  });

  describe('getMascotState', () => {
    it('should return complete state with correct mood and zone', () => {
      const state = getMascotState(2500, 1200, 300, 300);
      
      expect(state.mood).toBe('joyeux'); // 70% remaining
      expect(state.zone).toBe('green');
      expect(state.imageSource).toBeDefined();
      expect(state.description).toBe('mascot.moods.joyeux');
    });

    it('should handle yellow zone state', () => {
      const state = getMascotState(2500, 1200, 300, 700);
      
      expect(state.mood).toBe('vigilant'); // 30% remaining
      expect(state.zone).toBe('yellow');
      expect(state.imageSource).toBeDefined();
    });

    it('should handle red zone state', () => {
      const state = getMascotState(2500, 1200, 300, 950);
      
      expect(state.mood).toBe('panique'); // 5% remaining
      expect(state.zone).toBe('red');
      expect(state.imageSource).toBeDefined();
    });

    it('should handle overspent budget', () => {
      const state = getMascotState(2500, 1200, 300, 1500);
      
      expect(state.mood).toBe('detresse'); // -50% remaining
      expect(state.zone).toBe('red');
      expect(state.imageSource).toBeDefined();
    });

    it('should handle additional income correctly', () => {
      const state = getMascotState(2500, 1200, 300, 500, 300);
      
      expect(state.mood).toBe('serein'); // 80% remaining with income
      expect(state.zone).toBe('green');
    });
  });
});
