

// This would be in a server-side store like Redis in a real app
const jobStore: { [key: string]: boolean } = {};

export const requestDataDeletion = (jobId: string): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
        jobStore[jobId] = true; // Mark as deleted
        setTimeout(() => resolve({ success: true }), 1000);
    });
};
