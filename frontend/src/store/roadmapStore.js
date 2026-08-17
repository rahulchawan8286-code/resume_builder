import { create } from 'zustand';
import { roadmapService } from '../api/roadmapService';

export const useRoadmapStore = create((set, get) => ({
  roadmap: null,
  isLoading: false,
  error: null,
  progress: 0,

  fetchRoadmap: async (targetCompanyId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await roadmapService.getRoadmap(targetCompanyId);
      set({ 
        roadmap: res.data, 
        progress: res.data?.overallProgress || 0,
        isLoading: false 
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch roadmap', isLoading: false });
    }
  },

  generateRoadmap: async (targetCompanyId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await roadmapService.generateRoadmap(targetCompanyId);
      set({ 
        roadmap: res.data,
        progress: res.data?.overallProgress || 0,
        isLoading: false 
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to generate roadmap', isLoading: false });
    }
  },

  toggleTaskStatus: async (taskId, currentStatus) => {
    const { roadmap } = get();
    if (!roadmap) return;

    // Optimistic update
    let newProgress = roadmap.overallProgress;
    const newRoadmap = { ...roadmap };
    
    let totalTasks = 0;
    let completedTasks = 0;

    newRoadmap.weeks.forEach(w => {
      w.tasks.forEach(t => {
        if (t._id === taskId) {
          t.isCompleted = !currentStatus;
        }
        totalTasks++;
        if (t.isCompleted) completedTasks++;
      });
    });

    if (totalTasks > 0) {
      newProgress = Math.round((completedTasks / totalTasks) * 100);
    }
    
    newRoadmap.overallProgress = newProgress;
    set({ roadmap: newRoadmap, progress: newProgress });

    try {
      const res = await roadmapService.updateTaskStatus(taskId, !currentStatus);
      // Sync exact progress from server
      set({ progress: res.data?.progress || newProgress });
    } catch (err) {
      // Revert on error
      console.error('Failed to update task', err);
      get().fetchRoadmap(roadmap.targetCompany?._id || null);
    }
  }
}));
