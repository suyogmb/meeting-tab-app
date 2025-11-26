/**
 * Network Service
 * Monitors network connectivity and provides network state information
 */

import NetInfo, {NetInfoState, NetInfoStateType} from '@react-native-community/netinfo';
import {logger} from '../../utils/SecureLogger';

export interface NetworkState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: NetInfoStateType;
  details: NetInfoState['details'];
}

type NetworkStateChangeCallback = (state: NetworkState) => void;

/**
 * Network Service class
 * Singleton pattern for managing network state
 */
class NetworkServiceClass {
  private listeners: Set<NetworkStateChangeCallback> = new Set();
  private unsubscribe: (() => void) | null = null;
  private currentState: NetworkState | null = null;

  /**
   * Initialize network monitoring
   */
  initialize(): void {
    if (this.unsubscribe) {
      // Already initialized
      return;
    }

    // Get initial state
    this.fetchCurrentState();

    // Subscribe to network state changes
    this.unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const networkState = this.mapNetInfoState(state);
      this.currentState = networkState;
      this.notifyListeners(networkState);
      
      logger.info('Network state changed', {
        isConnected: networkState.isConnected,
        type: networkState.type,
        isInternetReachable: networkState.isInternetReachable,
      });
    });

    logger.info('Network service initialized');
  }

  /**
   * Cleanup network monitoring
   */
  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.listeners.clear();
    logger.info('Network service cleaned up');
  }

  /**
   * Get current network state
   */
  async getCurrentState(): Promise<NetworkState> {
    if (this.currentState) {
      return this.currentState;
    }
    return this.fetchCurrentState();
  }

  /**
   * Fetch current network state from NetInfo
   */
  private async fetchCurrentState(): Promise<NetworkState> {
    try {
      const state = await NetInfo.fetch();
      const networkState = this.mapNetInfoState(state);
      this.currentState = networkState;
      return networkState;
    } catch (error) {
      logger.error('Failed to fetch network state', {error});
      // Return default offline state
      return {
        isConnected: false,
        isInternetReachable: false,
        type: NetInfoStateType.none,
        details: null,
      };
    }
  }

  /**
   * Check if device is currently connected
   */
  async isConnected(): Promise<boolean> {
    const state = await this.getCurrentState();
    return state.isConnected === true;
  }

  /**
   * Check if internet is reachable
   */
  async isInternetReachable(): Promise<boolean> {
    const state = await this.getCurrentState();
    return state.isInternetReachable === true;
  }

  /**
   * Get connection type (wifi, cellular, etc.)
   */
  async getConnectionType(): Promise<NetInfoStateType> {
    const state = await this.getCurrentState();
    return state.type;
  }

  /**
   * Subscribe to network state changes
   */
  subscribe(callback: NetworkStateChangeCallback): () => void {
    this.listeners.add(callback);

    // Immediately call with current state if available
    if (this.currentState) {
      callback(this.currentState);
    } else {
      this.getCurrentState().then(callback);
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of network state change
   */
  private notifyListeners(state: NetworkState): void {
    this.listeners.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        logger.error('Error in network state callback', {error});
      }
    });
  }

  /**
   * Map NetInfo state to our NetworkState interface
   */
  private mapNetInfoState(state: NetInfoState): NetworkState {
    return {
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      details: state.details,
    };
  }
}

// Export singleton instance
export default new NetworkServiceClass();

