# Phelbo Logistics Route Management Integration

## Overview
Successfully integrated a complete logistics route management system into the phelbo phlebotomist app. This includes drop-off locations discovery, available pickups, in-transit tracking, and delivery completion workflows.

## New Screens Created

### 1. **DropOffLocationsScreen** (`drop_off_locations_screen`)
**Location**: `src/screen/ward/map/logistics/DropOffLocationsScreen.tsx`

**Purpose**: Main dashboard showing all available drop-off locations with samples waiting for pickup.

**Features**:
- Real-time fetch of drop-off locations via GraphQL query `GetDropOffLocationsByState`
- Location filtering by area/state
- Sample count tracking per location
- Urgent sample indicators (red/critical) vs. normal (green/calm)
- Stats cards showing total samples, locations, urgent count
- Error handling and retry mechanism
- Empty state when no locations available

**Data Flow**:
1. Fetches locations using `GetDropOffLocationsByState` GraphQL query
2. Requires `userId` (from `useGetUserDetails` hook as `patientIdPay`) and `activeOnly` boolean
3. Displays locations in a card-based layout with status indicators
4. Tap on any location to navigate to `sample_delivery_screen`

**Key Integration Points**:
- Uses `useGetUserDetails()` hook to get current phlebotomist ID
- Uses `useAuth()` hook to get authentication token
- Uses `useToast()` for user notifications
- Uses `axios` for GraphQL queries (consistent with rest of phelbo)

---

### 2. **SampleDeliveryScreen** (`sample_delivery_screen`)
**Location**: `src/screen/ward/map/logistics/SampleDeliveryScreen.tsx`

**Purpose**: Shows available pickup details with dispatcher assignment, route, and samples.

**Features**:
- Dispatcher profile card with contact button
- Delivery route visualization (pickup from phlebotomist → drop at facility)
- Sample details (location ID, sample count, requests)
- Estimated earnings calculation (per km rate × distance + service fee)
- Lab facilities summary
- "Confirm & Start pickup" or "Skip this delivery" actions

**Data Flow**:
1. Receives `location` object from previous screen via navigation params
2. Calculates distance, earnings, and delivery metrics
3. Shows samples for this delivery
4. On confirm → navigates to `logistics_in_transit_screen` with location, dispatcher data, and start time
5. On skip → returns to previous screen

**Key Features**:
- Mock dispatcher data (ready to connect to Redux/API)
- Real-time earning calculations
- Time-sensitive and dispatcher-assigned status badges
- Flexible sample list (uses location.requests or falls back to mock data)

---

### 3. **LogisticsInTransitScreen** (`logistics_in_transit_screen`)
**Location**: `src/screen/ward/map/logistics/LogisticsInTransitScreen.tsx`

**Purpose**: Real-time delivery tracking showing progress from pickup to lab drop-off.

**Features**:
- Live delivery progress bar (simulated with auto-increment)
- Multi-step timeline (Picked up → In transit → Delivered)
- Next stop information
- Samples on board list
- ETA updates (auto-calculated based on progress)
- "Mark Delivered" button (only enabled when progress ≥ 85%)
- Status alerts (on the way, estimated time remaining)

**Data Flow**:
1. Receives location, dispatcher data, and start time via navigation params
2. Simulates delivery progress with auto-incrementing percentage
3. Displays current status in timeline
4. When button pressed → navigates to `delivery_complete_screen` with completion data

**Key Features**:
- Realistic progress simulation (auto-increments every 3 seconds)
- Disabled button state with progress feedback
- Color-coded timeline steps (green completed, yellow active, gray pending)
- Safety feature: can't mark complete until 85% progress

---

### 4. **DeliveryCompleteScreen** (`delivery_complete_screen`)
**Location**: `src/screen/ward/map/logistics/DeliveryCompleteScreen.tsx`

**Purpose**: Delivery completion summary with earnings breakdown and performance metrics.

**Features**:
- Success alert with delivery summary
- Delivery summary table (distance, samples, facilities, times)
- Timeline of delivery stops
- Detailed earnings breakdown:
  - Per km calculation (distance × ₦50)
  - Service charge (₦320)
  - Total earned
- Performance metrics (delivery efficiency, time taken)
- "Back to locations" button to return to drop-off dashboard
- Next action suggestion card

**Data Flow**:
1. Receives location, dispatcher, and start time via navigation params
2. Displays completion summary with all delivery details
3. On "Back to locations" → navigates to `drop_off_locations_screen` to find next delivery

**Key Features**:
- Comprehensive earnings visibility
- Performance tracking ready for integration
- Success celebration UI with icon
- One-tap return to main logistics dashboard

---

## GraphQL Integration

### Query: `GetDropOffLocationsByState`
**Added to**: `src/schema/ApiSchema.tsx`

```graphql
query GetDropOffLocationsByState($userId: ID!, $activeOnly: Boolean) {
  getDropOffLocationsByState(userId: $userId, activeOnly: $activeOnly) {
    dropOffLocationsCount
    dropOffLocations {
      id
      name
      address
      isActive
      requestsCount
      samplesCount
      dropOffArea {
        id
        name
        state {
          id
          name
        }
      }
      requests {
        id
        requestStatus
        requestDate
        samplePickUpAddress
        total
        testRequests {
          id
          status
          test {
            id
            name
          }
        }
      }
    }
  }
}
```

**Variables**:
```json
{
  "userId": "[Current phlebotomist ID]",
  "activeOnly": true
}
```

**Response**: Full drop-off locations with nested requests and test details.

---

## Navigation Flow

```
Drop-off Locations (dashboard)
    ↓ [Tap location card]
Sample Delivery (available pickup)
    ↓ [Confirm & Start]
Logistics In Transit (real-time tracking)
    ↓ [Mark Delivered]
Delivery Complete (summary & earnings)
    ↓ [Back to locations]
Drop-off Locations (repeat cycle)
```

### Routes Registered in `App.tsx`:
- `drop_off_locations_screen` → `DropOffLocationsScreen`
- `sample_delivery_screen` → `SampleDeliveryScreen`
- `logistics_in_transit_screen` → `LogisticsInTransitScreen`
- `delivery_complete_screen` → `DeliveryCompleteScreen`

---

## Theme Consistency

All screens follow phelbo design system:
- **Dark headers** (#0A111F, #0F172A, #101828) with white text
- **Light content areas** (#F5F5F5, #F1F1F1, #F5F7F9)
- **NativeWind styling** for responsive UI
- **Emerald primary color** (#10B981) for CTAs and active states
- **Status badges** with contextual colors (red for urgent, orange for warning, green for normal)
- **Rounded cards** (2xl radius) with subtle shadows
- **Consistent typography** (bold headers, muted labels)

---

## Hook Dependencies

### `useAuth()`
- Returns: `{ token, ... }`
- Used for: Authorization headers in GraphQL requests

### `useGetUserDetails()`
- Returns: `{ userData, loadingUserDetails, errorUserDetails, patientIdPay, reloadUserDetails }`
- Used for: Getting current phlebotomist ID (`patientIdPay`)

### `useToast()`
- Returns: `{ showToast }`
- Used for: User notifications (success, error, info)

### `useNavigation()`
- Returns: Navigation object
- Used for: Screen transitions with params

---

## Ready for Enhancement

### Next Steps (When Backend is Ready):
1. **Replace mock data** in SampleDeliveryScreen with real dispatcher assignment
2. **Wire delivery progress** to real GPS tracking
3. **Add real-time updates** via WebSocket (similar to consultation feature)
4. **Integrate earnings** into main earnings dashboard
5. **Add delivery notifications** (system notifications when delivery complete)
6. **Implement acceptance/rejection** flow for dispatcher-assigned deliveries
7. **Add performance tracking** to user dashboard

### Backend Expectations:
1. `GetDropOffLocationsByState` query returns active drop-off locations for phlebotomist
2. Each location has associated requests and test details
3. Dispatcher assignment data (profile, contact, assignments)
4. Real-time delivery status updates
5. Delivery completion confirmation mutations

---

## Files Modified/Created

**Created**:
- ✅ `src/screen/ward/map/logistics/DropOffLocationsScreen.tsx`
- ✅ `src/screen/ward/map/logistics/SampleDeliveryScreen.tsx`
- ✅ `src/screen/ward/map/logistics/LogisticsInTransitScreen.tsx`
- ✅ `src/screen/ward/map/logistics/DeliveryCompleteScreen.tsx`

**Updated**:
- ✅ `src/schema/ApiSchema.tsx` - Added `GET_DROP_OFF_LOCATIONS_BY_STATE` query
- ✅ `App.tsx` - Imported all 4 new screens and registered routes

**No changes to**:
- Redux store (screens use existing hooks)
- Apollo/Axios config (already compatible)
- Navigation structure (added as normal stack screens)
- Existing screens (no breaking changes)

---

## Testing Checklist

- [ ] Navigate to `drop_off_locations_screen` route
- [ ] Locations load correctly with GraphQL data
- [ ] Area filtering works
- [ ] Tap location → navigates to `sample_delivery_screen`
- [ ] Confirm pickup → navigates to `logistics_in_transit_screen`
- [ ] Progress bar increments (simulated)
- [ ] Mark delivered (button enabled at 85%) → `delivery_complete_screen`
- [ ] Earnings displayed correctly
- [ ] Back to locations → returns to drop-off dashboard
- [ ] Error states show with retry option
- [ ] Loading states display appropriately
- [ ] All styling matches existing theme
- [ ] No TypeScript errors

---

## Troubleshooting

**Issue**: Query returns empty locations
- **Check**: `userId` variable is correct (from `patientIdPay`)
- **Check**: Backend has active locations for this user
- **Check**: `activeOnly` filter is set appropriately

**Issue**: Navigation params not passing
- **Check**: Route names match exactly (case-sensitive)
- **Check**: Navigation stack has all routes registered
- **Check**: Params match expected interface

**Issue**: Styling looks off
- **Check**: NativeWind CSS is loaded (`global.css`)
- **Check**: Tailwind config has custom colors defined
- **Check**: `styled()` components from nativewind are used

---

## Performance Notes

- Locations fetched once on mount, cached in local state
- Pagination ready (can add `limit`/`offset` to query)
- Progress simulation uses interval (could optimize with animation)
- No real-time updates yet (WebSocket ready for future enhancement)

---

**Integration Complete! ✅**

All four logistics screens are ready to use. The app now has a complete route management workflow from discovery to completion with earnings tracking.
