import { describe, it, expect, vi } from 'vitest';
import { useAppStore } from '../store';

describe('useAppStore', () => {
  it('should initialize with default state', () => {
    const state = useAppStore.getState();
    expect(state.courses.length).toBeGreaterThan(0);
    expect(state.completedCoursesByWallet).toBeDefined();
    expect(state.transactionsByWallet).toBeDefined();
    expect(state.withdrawnAmountByWallet).toBeDefined();
  });

  it('should mark a course as completed', () => {
    const address = 'G1234567890';
    useAppStore.getState().markCourseCompleted(address, 1);
    const state = useAppStore.getState();
    expect(state.completedCoursesByWallet[address]).toContain(1);
  });

  it('should add a transaction to the wallet history', () => {
    const address = 'G1234567890';
    useAppStore.getState().addTransaction(address, {
      hash: 'test-hash-123',
      type: 'COURSE_COMPLETION',
      courseId: 1,
      courseTitle: 'Test Course',
      status: 'success'
    });
    
    const txs = useAppStore.getState().getTransactions(address);
    expect(txs.length).toBeGreaterThan(0);
    expect(txs[0].hash).toBe('test-hash-123');
  });
});
