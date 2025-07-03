import { useState, useEffect, useCallback } from 'react';

interface OfflineAction {
  id: string;
  type: 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  timestamp: number;
}

interface UseOfflineStorageReturn {
  isOnline: boolean;
  pendingActions: OfflineAction[];
  addOfflineAction: (action: Omit<OfflineAction, 'id' | 'timestamp'>) => void;
  clearPendingActions: () => void;
  syncOfflineData: () => Promise<void>;
}

const OFFLINE_ACTIONS_KEY = 'offline_actions';
const OFFLINE_DATA_KEY = 'offline_data';

export const useOfflineStorage = (): UseOfflineStorageReturn => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);

  // Load pending actions from localStorage on mount
  useEffect(() => {
    const savedActions = localStorage.getItem(OFFLINE_ACTIONS_KEY);
    if (savedActions) {
      try {
        setPendingActions(JSON.parse(savedActions));
      } catch (error) {
        console.error('Error loading offline actions:', error);
      }
    }
  }, []);

  // Save pending actions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(OFFLINE_ACTIONS_KEY, JSON.stringify(pendingActions));
  }, [pendingActions]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Connection restored, syncing offline data...');
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('Connection lost, switching to offline mode');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add an action to the offline queue
  const addOfflineAction = useCallback((action: Omit<OfflineAction, 'id' | 'timestamp'>) => {
    const newAction: OfflineAction = {
      ...action,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    };

    setPendingActions(prev => [...prev, newAction]);
    console.log('Added offline action:', newAction);
  }, []);

  // Clear all pending actions
  const clearPendingActions = useCallback(() => {
    setPendingActions([]);
    localStorage.removeItem(OFFLINE_ACTIONS_KEY);
    console.log('Cleared all pending offline actions');
  }, []);

  // Sync offline data when connection is restored
  const syncOfflineData = useCallback(async () => {
    if (!isOnline || pendingActions.length === 0) {
      return;
    }

    console.log(`Syncing ${pendingActions.length} offline actions...`);

    const successfulActions: string[] = [];
    const failedActions: OfflineAction[] = [];

    for (const action of pendingActions) {
      try {
        const response = await fetch(action.url, {
          method: action.type,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: action.data ? JSON.stringify(action.data) : undefined
        });

        if (response.ok) {
          successfulActions.push(action.id);
          console.log(`Successfully synced action: ${action.type} ${action.url}`);
        } else {
          failedActions.push(action);
          console.error(`Failed to sync action: ${action.type} ${action.url}`, response.status);
        }
      } catch (error) {
        failedActions.push(action);
        console.error(`Error syncing action: ${action.type} ${action.url}`, error);
      }
    }

    // Remove successful actions and keep failed ones for retry
    setPendingActions(failedActions);

    if (successfulActions.length > 0) {
      console.log(`Successfully synced ${successfulActions.length} actions`);
    }

    if (failedActions.length > 0) {
      console.log(`${failedActions.length} actions failed to sync and will be retried`);
    }
  }, [isOnline, pendingActions]);

  return {
    isOnline,
    pendingActions,
    addOfflineAction,
    clearPendingActions,
    syncOfflineData
  };
};

// Utility functions for offline data storage
export const saveOfflineData = (key: string, data: any) => {
  try {
    const offlineData = JSON.parse(localStorage.getItem(OFFLINE_DATA_KEY) || '{}');
    offlineData[key] = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(offlineData));
  } catch (error) {
    console.error('Error saving offline data:', error);
  }
};

export const getOfflineData = (key: string) => {
  try {
    const offlineData = JSON.parse(localStorage.getItem(OFFLINE_DATA_KEY) || '{}');
    return offlineData[key]?.data || null;
  } catch (error) {
    console.error('Error getting offline data:', error);
    return null;
  }
};

export const clearOfflineData = (key?: string) => {
  try {
    if (key) {
      const offlineData = JSON.parse(localStorage.getItem(OFFLINE_DATA_KEY) || '{}');
      delete offlineData[key];
      localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(offlineData));
    } else {
      localStorage.removeItem(OFFLINE_DATA_KEY);
    }
  } catch (error) {
    console.error('Error clearing offline data:', error);
  }
}; 