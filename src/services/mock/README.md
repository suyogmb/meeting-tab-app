# Mock Data Service

This directory contains mock data services for development and testing before the backend API is available.

## Files

- `MockDataService.ts` - Provides mock meeting and room data

## Usage

The mock data service is automatically used when:
1. No meetings exist in the local database
2. During initial app setup

## Replacing with Real API

When your backend API is ready:

1. **Update `SyncService.ts`**:
   - Replace `MockDataService.fetchMeetings()` calls with real API calls
   - Uncomment the `fetchMeetingsFromAPI()` method
   - Update `HTTPService` calls to use your actual endpoints

2. **Update `useMeetings.ts` hook**:
   - Remove the mock data loading logic
   - Ensure sync service handles data loading

3. **Update API Endpoints**:
   - Configure `Endpoints.ts` with your actual API URLs
   - Update `HttpServices.ts` with proper authentication if needed

## Example: Real API Integration

```typescript
// In SyncService.ts
private async fetchMeetingsFromAPI(roomId: string): Promise<Meeting[]> {
  const response = await HTTPService.get<MeetingResponse[]>(
    Endpoints.meetingsByRoom(roomId),
  );
  return response.data.map((m) => this.mapAPIResponseToMeeting(m, roomId));
}
```

## Mock Data Structure

The mock data generates:
- 5 meetings throughout the day (9 AM - 5 PM)
- Realistic meeting titles and descriptions
- Proper time formatting
- Current/next meeting status based on current time

