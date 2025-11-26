/**
 * Room API Service
 * Handles all room-related API calls
 */

import HTTPService from '../../networkConfig/HttpServices';
import {Endpoints} from '../../networkConfig/Endpoints';
import {RoomDetails, RoomDetailsApiResponse} from '../../types/meeting';
import {logger} from '../../utils/SecureLogger';

/**
 * Room API Service
 */
class RoomApiServiceClass {
  /**
   * Fetch room details for a specific room code
   * @param roomCode - 4-digit room code (e.g., "7218")
   * @returns Promise with room details
   */
  async fetchRoomDetailsByRoomCode(roomCode: string): Promise<RoomDetails> {
    try {
      logger.info('Fetching room details from API', {roomCode});

      const url = Endpoints.roomDetailsByRoomCode(roomCode);
      
      // Console log URL and payload
      console.log('=== ROOM DETAILS API CALL ===');
      console.log('URL:', url);
      console.log('Method: GET');
      console.log('Payload: None (GET request)');
      console.log('Room Code:', roomCode);

      let response;
      try {
        response = await HTTPService.get<RoomDetailsApiResponse>(url);
      } catch (error) {
        console.error('=== ROOM DETAILS API ERROR ===');
        console.error('Error:', error);
        console.error('Error Type:', typeof error);
        console.error('Error Message:', error instanceof Error ? error.message : String(error));
        throw error;
      }

      // Console log response - safely handle undefined/null
      console.log('=== ROOM DETAILS API RESPONSE ===');
      console.log('Response:', response);
      console.log('Response Type:', typeof response);
      console.log('Response is null:', response === null);
      console.log('Response is undefined:', response === undefined);
      
      if (response) {
        try {
          console.log('Full Response (stringified):', JSON.stringify(response, null, 2));
          console.log('Response Keys:', Object.keys(response));
        } catch (stringifyError) {
          console.error('Error stringifying response:', stringifyError);
          console.log('Response (direct):', response);
        }
      } else {
        console.warn('Response is null or undefined!');
      }

      // HTTPService.get returns ApiResponse<T>, but the actual implementation
      // returns axios response.data directly, which is the API response body
      // The API returns { message, code, data, timestamp }
      // So we need to access response.data to get the actual API response
      // However, TypeScript thinks response.data is RoomDetailsApiResponse (which is correct)
      // but the runtime might have it nested, so we check both structures
      const apiResponse: RoomDetailsApiResponse = 
        'code' in response && response.code !== undefined
          ? (response as any)
          : (response as any).data || response;

      console.log('=== PARSED API RESPONSE ===');
      if (apiResponse) {
        try {
          console.log('Parsed Response (stringified):', JSON.stringify(apiResponse, null, 2));
        } catch (stringifyError) {
          console.error('Error stringifying parsed response:', stringifyError);
          console.log('Parsed Response (direct):', apiResponse);
        }
      } else {
        console.warn('Parsed response is null or undefined!');
      }
      console.log('Response Code:', apiResponse?.code);
      console.log('Response Message:', apiResponse?.message);
      if (apiResponse?.data) {
        try {
          console.log('Room Data:', JSON.stringify(apiResponse.data, null, 2));
        } catch (stringifyError) {
          console.error('Error stringifying room data:', stringifyError);
          console.log('Room Data (direct):', apiResponse.data);
        }
      } else {
        console.log('Room Data: No data');
      }

      // Check if the response is successful
      if (!apiResponse || apiResponse.code !== 200 || !apiResponse.data) {
        let responseString = 'Unable to stringify';
        try {
          responseString = JSON.stringify(response);
        } catch (stringifyError) {
          console.error('Error stringifying response in error handler:', stringifyError);
          responseString = String(response);
        }
        
        logger.error('API returned unsuccessful response', {
          message: apiResponse?.message,
          code: apiResponse?.code,
          response: responseString,
        });
        throw new Error(apiResponse?.message || 'Failed to fetch room details');
      }

      logger.info('Room details fetched successfully', {
        roomCode: apiResponse.data.roomCode,
        name: apiResponse.data.name,
      });

      return apiResponse.data;
    } catch (error) {
      logger.error('Failed to fetch room details', {
        error,
        roomCode,
      });
      throw error;
    }
  }

  /**
   * Register device token with room code
   * @param roomCode - 4-digit room code as string (e.g., "7218") - will be converted to number
   * @param deviceToken - FCM device token
   * @returns Promise<void>
   */
  async registerDeviceToken(roomCode: string, deviceToken: string): Promise<void> {
    try {
      // Convert roomCode to number as API expects number
      const roomCodeNumber = parseInt(roomCode, 10);
      
      if (isNaN(roomCodeNumber)) {
        throw new Error(`Invalid room code: ${roomCode}`);
      }

      logger.info('Registering device token with room code', {
        roomCode: roomCodeNumber,
        tokenLength: deviceToken.length,
      });

      const url = Endpoints.registerDeviceToken();
      
      // Console log URL and payload
      console.log('=== DEVICE TOKEN REGISTRATION API CALL ===');
      console.log('URL:', url);
      console.log('Method: POST');
      
      const payload = {
        roomCode: roomCodeNumber, // Send as number
        deviceToken,
      };
      
      console.log('Payload:', JSON.stringify(payload, null, 2));

      let response;
      try {
        response = await HTTPService.post(url, payload);
      } catch (error) {
        console.error('=== DEVICE TOKEN REGISTRATION API ERROR ===');
        console.error('Error:', error);
        console.error('Error Type:', typeof error);
        console.error('Error Message:', error instanceof Error ? error.message : String(error));
        throw error;
      }

      // Console log response
      console.log('=== DEVICE TOKEN REGISTRATION API RESPONSE ===');
      console.log('Response:', response);
      console.log('Response Type:', typeof response);
      
      if (response) {
        try {
          console.log('Full Response (stringified):', JSON.stringify(response, null, 2));
          console.log('Response Keys:', Object.keys(response));
        } catch (stringifyError) {
          console.error('Error stringifying response:', stringifyError);
          console.log('Response (direct):', response);
        }
      }

      // Handle API response structure: { message, code, data, timestamp }
      const apiResponse = 
        'code' in response && response.code !== undefined
          ? (response as any)
          : (response as any).data || response;

      console.log('=== PARSED API RESPONSE ===');
      console.log('Response Code:', apiResponse?.code);
      console.log('Response Message:', apiResponse?.message);
      if (apiResponse?.data) {
        try {
          console.log('Response Data:', JSON.stringify(apiResponse.data, null, 2));
        } catch (stringifyError) {
          console.error('Error stringifying response data:', stringifyError);
          console.log('Response Data (direct):', apiResponse.data);
        }
      }

      // Check if the response is successful
      if (!apiResponse || apiResponse.code !== 200) {
        let responseString = 'Unable to stringify';
        try {
          responseString = JSON.stringify(response);
        } catch (stringifyError) {
          console.error('Error stringifying response in error handler:', stringifyError);
          responseString = String(response);
        }
        
        logger.error('API returned unsuccessful response', {
          message: apiResponse?.message,
          code: apiResponse?.code,
          response: responseString,
        });
        throw new Error(apiResponse?.message || 'Failed to register device token');
      }

      logger.info('Device token registered successfully', {
        roomCode: roomCodeNumber,
        deviceId: apiResponse?.data?.id,
      });
    } catch (error) {
      logger.error('Failed to register device token', {
        error,
        roomCode,
      });
      throw error;
    }
  }
}

// Export singleton instance
const RoomApiService = new RoomApiServiceClass();
export default RoomApiService;

