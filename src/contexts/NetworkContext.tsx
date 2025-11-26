/**
 * Network Context
 * Provides network connectivity state to the entire app
 */

import React, {createContext, useContext, useEffect, useState, useCallback} from 'react';
import {NetworkState} from '../services/network/NetworkService';
import NetworkService from '../services/network/NetworkService';
import RequestQueueService from '../services/queue/RequestQueueService';
import SyncService from '../services/sync/SyncService';
import FCMService from '../services/fcm/FCMService';
import {logger} from '../utils/SecureLogger';

interface NetworkContextType {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  connectionType: string;
  isOnline: boolean;
  networkState: NetworkState | null;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: React.ReactNode;
}

/**
 * Network Provider Component
 * Wraps the app and provides network state
 */
export const NetworkProvider: React.FC<NetworkProviderProps> = ({children}) => {
  const [networkState, setNetworkState] = useState<NetworkState | null>(null);

  useEffect(() => {
    // Initialize network service
    NetworkService.initialize();
    
    // Initialize request queue service
    RequestQueueService.initialize();

    // Track previous online state to detect when connectivity is restored
    let wasOnline = false;

    // Subscribe to network state changes
    const unsubscribe = NetworkService.subscribe((state: NetworkState) => {
      const isOnline = state.isConnected === true && state.isInternetReachable === true;
      
      setNetworkState(state);
      logger.info('Network context state updated', {
        isConnected: state.isConnected,
        type: state.type,
        isOnline,
      });

      // Process queue and sync when connectivity is restored
      if (isOnline && !wasOnline) {
        logger.info('Connectivity restored, processing request queue, syncing, and retrying FCM registration');
        
        // Process queued requests
        RequestQueueService.processQueue().catch((error) => {
          logger.error('Failed to process request queue', {error});
        });
        
        // Attempt to sync meetings
        SyncService.syncOnConnectivityRestore().catch((error) => {
          logger.error('Failed to sync on connectivity restore', {error});
        });
        
        // Retry FCM token registration
        FCMService.retryTokenRegistration().catch((error) => {
          logger.error('Failed to retry FCM token registration', {error});
        });
      }

      wasOnline = isOnline;
    });

    // Get initial state
    NetworkService.getCurrentState().then((state) => {
      setNetworkState(state);
      const isOnline = state.isConnected === true && state.isInternetReachable === true;
      wasOnline = isOnline;
      
      // Process queue and sync if already online
      if (isOnline) {
        RequestQueueService.processQueue().catch((error) => {
          logger.error('Failed to process request queue on init', {error});
        });
        
        // Check if sync is needed and attempt sync
        SyncService.shouldSync().then((shouldSync) => {
          if (shouldSync) {
            SyncService.syncMeetings().catch((error) => {
              logger.error('Failed to sync on init', {error});
            });
          }
        }).catch((error) => {
          logger.error('Failed to check if sync is needed', {error});
        });
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      NetworkService.cleanup();
    };
  }, []);

  // Computed values
  const isConnected = networkState?.isConnected ?? null;
  const isInternetReachable = networkState?.isInternetReachable ?? null;
  const connectionType = networkState?.type ?? 'unknown';
  const isOnline = isConnected === true && isInternetReachable === true;

  const value: NetworkContextType = {
    isConnected,
    isInternetReachable,
    connectionType,
    isOnline,
    networkState,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};

/**
 * Hook to access network context
 * @throws Error if used outside NetworkProvider
 */
export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

export default NetworkContext;

