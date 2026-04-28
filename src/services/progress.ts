// Progress tracking service — saves module results to localStorage per user

export interface ModuleResult {
    moduleId: string;
    moduleName: string;
    score: number;
    result: 'SUCCESS' | 'GAMEOVER';
    completedAt: string; // ISO date
}

export interface UserProgress {
    totalScore: number;
    modulesCompleted: number;
    modulesPassed: number;
    results: ModuleResult[];
}

const STORAGE_KEY = 'pulse_progress_';

const getKey = (uid: string) => `${STORAGE_KEY}${uid}`;

export const getProgress = (uid: string): UserProgress => {
    try {
        const data = localStorage.getItem(getKey(uid));
        if (data) return JSON.parse(data);
    } catch { /* ignore */ }
    return { totalScore: 0, modulesCompleted: 0, modulesPassed: 0, results: [] };
};

export const saveModuleResult = (uid: string, result: ModuleResult): void => {
    const progress = getProgress(uid);
    progress.results.push(result);
    progress.modulesCompleted = progress.results.length;
    progress.modulesPassed = progress.results.filter(r => r.result === 'SUCCESS').length;
    progress.totalScore = progress.results.reduce((sum, r) => sum + Math.max(0, r.score), 0);
    localStorage.setItem(getKey(uid), JSON.stringify(progress));
};

export const getBestScore = (uid: string, moduleId: string): number => {
    const progress = getProgress(uid);
    const results = progress.results.filter(r => r.moduleId === moduleId);
    if (results.length === 0) return -1;
    return Math.max(...results.map(r => r.score));
};
