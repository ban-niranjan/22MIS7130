# Notification System Design

## Stage 1 — API Design

The notification system should provide simple and scalable APIs that allow applications to send and retrieve notifications efficiently.

### 1. Send Notification

This API is responsible for creating and processing a notification request.

**Endpoint**

```http
POST /api/notifications
```

**Sample Request**

```json
{
  "userId": "U101",
  "notificationType": "email",
  "message": "Your service request has been approved"
}
```

**Sample Response**

```json
{
  "success": true,
  "notificationId": "N9001",
  "message": "Notification queued successfully"
}
```

---

### 2. Retrieve User Notifications

This API fetches all notifications associated with a particular user.

**Endpoint**

```http
GET /api/notifications/:userId
```

**Sample Response**

```json
{
  "userId": "U101",
  "notifications": [
    {
      "id": "N9001",
      "type": "email",
      "message": "Your service request has been approved",
      "status": "sent"
    }
  ]
}
```

These APIs are lightweight, easy to maintain, and can be extended later for push notifications or SMS support.

---

# Stage 2 — Database Schema Design

The database structure should support fast retrieval and reliable storage of notifications.

## Users Table

| Field Name | Data Type | Description                |
| ---------- | --------- | -------------------------- |
| id         | UUID      | Unique identifier for user |
| name       | VARCHAR   | User name                  |
| email      | VARCHAR   | Registered email           |

---

## Notifications Table

| Field Name | Data Type | Description                |
| ---------- | --------- | -------------------------- |
| id         | UUID      | Notification identifier    |
| userId     | UUID      | Linked user ID             |
| type       | VARCHAR   | Email/SMS/Push             |
| message    | TEXT      | Notification content       |
| status     | VARCHAR   | sent, failed, pending      |
| createdAt  | TIMESTAMP | Notification creation time |

This schema keeps the structure normalized and easy to scale for future requirements.

---

# Stage 3 — Query Optimization

As the number of notifications increases, efficient querying becomes important.

To improve database performance:

* Indexes should be created on frequently searched fields like `userId`
* Pagination should be applied while fetching large notification lists
* Only required columns should be selected instead of full table scans
* Expensive joins should be minimized whenever possible

### Example Index

```sql
CREATE INDEX idx_notifications_userId
ON notifications(userId);
```

This improves retrieval speed significantly when millions of records are present.

---

# Stage 4 — Handling High Traffic Efficiently

A notification system may need to process a very large number of requests during peak usage.

To maintain performance under heavy traffic:

* Redis can be used for caching recently accessed notifications
* Load balancers can distribute requests across multiple servers
* Horizontal scaling can be implemented by adding more application instances
* Asynchronous processing can reduce API response time
* Frequently accessed data should be cached to reduce database load

These techniques improve scalability, responsiveness, and reliability.

---

# Stage 5 — Reliable Notification Delivery

A queue-based architecture is useful for ensuring reliable notification processing.

## Queue System

Message brokers such as:

* RabbitMQ
* Apache Kafka

can be used for handling notification tasks asynchronously.

### Advantages

* Failed notifications can be retried automatically
* The system becomes more fault tolerant
* Notification delivery becomes scalable
* Traffic spikes can be handled efficiently

---

## Retry Strategy

If notification delivery fails temporarily, retry mechanisms with exponential backoff can be applied.

Example:

* 1st retry → after 5 seconds
* 2nd retry → after 30 seconds
* 3rd retry → after 2 minutes

This prevents server overload while improving delivery success rate.

---

# Stage 6 — Top Priority Inbox Design

Some notifications are more important than others.
For example:

* security alerts
* payment failures
* account warnings

should appear before promotional messages.

To achieve this, a Priority Queue or Max Heap data structure can be used.

## Working Principle

Each notification is assigned a priority score:

* High priority → urgent notifications
* Medium priority → transactional updates
* Low priority → advertisements or promotions

The system always processes higher-priority notifications first.

---

## Time Complexity

| Operation                 | Complexity |
| ------------------------- | ---------- |
| Insert Notification       | O(log n)   |
| Retrieve Highest Priority | O(log n)   |

This approach ensures efficient and fast handling of priority-based notifications even at scale.
