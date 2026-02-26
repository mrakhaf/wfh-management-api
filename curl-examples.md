# Attendance Service API Examples

## 1. Get Attendance Today

```bash
curl -X GET "http://localhost:3000/attendance/today?user_id=123" \
  -H "Authorization: Bearer your-jwt-token"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx123",
    "userId": "123",
    "tapIn": "2024-01-15T08:00:00.000Z",
    "tapOut": null,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

**If no attendance:**
```json
{
  "success": true,
  "data": null,
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## 2. Absence (Tap In / Tap Out)

```bash
curl -X POST "http://localhost:3000/attendance/absence" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "123"}'
```

**Response (Tap In):**
```json
{
  "success": true,
  "data": {
    "id": "clx123",
    "userId": "123",
    "tapIn": "2024-01-15T08:00:00.000Z",
    "tapOut": null,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

**Response (Tap Out):**
```json
{
  "success": true,
  "data": {
    "id": "clx123",
    "userId": "123",
    "tapIn": "2024-01-15T08:00:00.000Z",
    "tapOut": "2024-01-15T17:00:00.000Z",
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T17:00:00.000Z"
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2024-01-15T10:00:00.000Z",
  "path": "/attendance/absence",
  "message": "Already completed attendance today"
}
```

## 3. Get Attendances by User

```bash
curl -X GET "http://localhost:3000/attendance/user/123?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer your-jwt-token"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123",
      "userId": "123",
      "tapIn": "2024-01-15T08:00:00.000Z",
      "tapOut": "2024-01-15T17:00:00.000Z",
      "createdAt": "2024-01-15T08:00:00.000Z",
      "updatedAt": "2024-01-15T17:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## 4. Dashboard Attendance

```bash
curl -X GET "http://localhost:3000/attendance/dashboard?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer your-jwt-token"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsersAttended": 50,
    "totalTapIn": 1200,
    "totalCompleted": 1150,
    "attendances": [
      {
        "id": "clx123",
        "userId": "123",
        "tapIn": "2024-01-15T08:00:00.000Z",
        "tapOut": "2024-01-15T17:00:00.000Z",
        "createdAt": "2024-01-15T08:00:00.000Z",
        "updatedAt": "2024-01-15T17:00:00.000Z"
      }
    ]
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## 5. Error Responses

**Invalid Token:**
```bash
curl -X GET "http://localhost:3000/attendance/today?user_id=123" \
  -H "Authorization: Bearer invalid-token"
```

```json
{
  "success": false,
  "statusCode": 401,
  "timestamp": "2024-01-15T10:00:00.000Z",
  "path": "/attendance/today?user_id=123",
  "message": "Invalid token"
}
```

**Missing Token:**
```bash
curl -X GET "http://localhost:3000/attendance/today?user_id=123"
```

```json
{
  "success": false,
  "statusCode": 401,
  "timestamp": "2024-01-15T10:00:00.000Z",
  "path": "/attendance/today?user_id=123",
  "message": "Missing or invalid token"
}