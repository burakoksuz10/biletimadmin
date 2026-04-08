# Biletix API Documentation

**Version:** 4.3.0  
**Last Updated:** 2026-04-07  
**Environment:** Laravel 12 / PHP 8.5+

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication](#authentication)
4. [Multi-Tenancy](#multi-tenancy)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [Enums](#enums)
8. [DTOs](#dtos)
9. [Services](#services)
10. [Observers](#observers)

---

## Overview

Biletix is a headless REST API for event ticketing management. The system provides:
- Event and venue management
- Multi-tenant organization support
- Seat-based ticketing with dynamic pricing
- Order and ticket management system
- Event favorites functionality
- Rating and review system
- Organization settings with audit logging
- Stage (salon) management with seating plan and image upload
- Showtime-based architecture with flexible stage assignment per showtime

### Base URL
```
https://api.biletix.com/api/v1
```

### Response Format

All API responses follow a standard JSON structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "per_page": 15,
    "current_page": 1,
    "last_page": 7,
    "from": 1,
    "to": 15
  }
}
```

---

## Architecture

### Design Patterns

**Service Layer Pattern**
- Controllers handle HTTP requests/responses only
- Business logic resides in [`app/Services`](app/Services)
- Data transfer via DTOs (Data Transfer Objects)

**Observer Pattern**
- Automatic cache updates via model observers
- Event-driven counter updates

**Multi-Tenancy**
- Row-level isolation per organization
- Global scope for tenant filtering via [`TenantScope`](app/Models/Scopes/TenantScope.php)

### Directory Structure

```
app/
├── Controllers/Api/V1/     # API Controllers
├── Services/V1/             # Business Logic
├── DTOs/                    # Data Transfer Objects
├── Enums/                   # PHP 8.1 Enums
├── Http/Requests/           # Form Request Validation
├── Http/Resources/V1/       # API Resources (Transformers)
├── Models/                  # Eloquent Models
├── Models/Scopes/           # Global Scopes (TenantScope)
├── Observers/               # Model Observers
└── Traits/                  # Reusable Traits
```

---

## Authentication

### Laravel Sanctum

Authentication is handled via Laravel Sanctum tokens.

### User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| `super_admin` | System administrator | All organizations |
| `co_admin` | Multi-organization admin | Assigned organizations |
| `org_admin` | Organization admin | Single organization |
| `operator` | Venue operator | Venues only |
| `customer` | Regular user | Public + authenticated |

### User Status

| Status | Description |
|--------|-------------|
| `active` | Can authenticate |
| `passive` | Cannot authenticate |
| `suspended` | Temporarily suspended |
| `banned` | Permanently banned |

### Auth Endpoints

#### Register
```http
POST /api/v1/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "organization_id": 1
}
```

#### Login
```http
POST /api/v1/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "1|abcdef123456..."
  }
}
```

#### Logout
```http
POST /api/v1/logout
Authorization: Bearer {token}
```

#### Current User
```http
GET /api/v1/me
Authorization: Bearer {token}
```

---

## Multi-Tenancy

### Organization-Based Isolation

All tenant-owned models use the [`BelongsToOrganization`](app/Traits/BelongsToOrganization.php) trait which automatically applies [`TenantScope`](app/Models/Scopes/TenantScope.php):

```php
use App\Traits\BelongsToOrganization;

class Event extends Model
{
    use BelongsToOrganization;
}
```

### Tenant Scope

Models are automatically filtered by `organization_id` based on the authenticated user's role:

| User Role | Scope Behavior |
|-----------|----------------|
| `super_admin` | No filtering (see all) |
| `co_admin` | Filter by assigned organizations (cached) |
| `org_admin` | Filter by own organization |
| `operator` | No organization filtering |
| `customer` | Filter by own organization |

### Bypassing Scope

```php
// Temporarily disable tenant scope
Model::withoutTenantScope()->get();
Model::withoutOrganizationScope()->get();
```

---

## API Endpoints

### Public Endpoints (No Authentication)

#### Health Check
```http
GET /api/ping
```

#### Event Categories (Public)
```http
GET /api/v1/public/event-categories
```

#### Venues (Public)
```http
GET /api/v1/public/venues
GET /api/v1/public/venues/{id}
```

#### Events (Public)
```http
GET /api/v1/public/events
GET /api/v1/public/events/{id}
GET /api/v1/public/events/slug/{slug}
```

#### Event Gallery (Public)
```http
GET /api/v1/public/events/{event}/gallery
```

### Rating & Review Endpoints

#### Ratings Summary (Public)
```http
GET /api/v1/events/{event}/ratings/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "average": 4.5,
    "count": 120,
    "distribution": {
      "5": 60,
      "4": 40,
      "3": 15,
      "2": 4,
      "1": 1
    }
  }
}
```

#### Reviews List (Public)
```http
GET /api/v1/events/{event}/reviews?per_page=15
```

#### Create/Update Rating (Auth Required)
```http
POST /api/v1/events/{event}/ratings
Authorization: Bearer {token}

{
  "rating": 5
}
```

#### Delete Rating (Auth Required)
```http
DELETE /api/v1/events/{event}/ratings
Authorization: Bearer {token}
```

#### Create Review (Auth Required)
```http
POST /api/v1/events/{event}/reviews
Authorization: Bearer {token}

{
  "review": "Harika bir etkinlikti!",
  "rating_id": 5
}
```

#### Update Review (Auth Required)
```http
PUT /api/v1/reviews/{review}
Authorization: Bearer {token}

{
  "review": "Güncellenmiş yorum içeriği..."
}
```

#### Delete Review (Auth Required)
```http
DELETE /api/v1/reviews/{review}
Authorization: Bearer {token}
```

#### Admin Reply (Admin Only)
```http
POST /api/v1/reviews/{review}/replies
Authorization: Bearer {admin_token}

{
  "review": "Teşekkür ederiz, değerli geri bildiriminiz için!"
}
```

#### Reactions (Auth Required)
```http
POST /api/v1/reviews/{review}/reactions
Authorization: Bearer {token}

{
  "reaction": "like"
}
```

```http
DELETE /api/v1/reviews/{review}/reactions
Authorization: Bearer {token}
```

### Admin Endpoints (Auth + Admin Role)

#### Organizations
```http
GET    /api/v1/organizations
POST   /api/v1/organizations
GET    /api/v1/organizations/{id}
PUT    /api/v1/organizations/{id}
DELETE /api/v1/organizations/{id}
POST   /api/v1/organizations/{id}/toggle-status
```

#### Organization Settings
```http
GET    /api/v1/organizations/{organization}/settings
PUT    /api/v1/organizations/{organization}/settings
POST   /api/v1/organizations/{organization}/settings/reset
GET    /api/v1/organizations/{organization}/settings/history
```

#### Event Categories
```http
GET    /api/v1/event-categories
POST   /api/v1/event-categories
GET    /api/v1/event-categories/{id}
PUT    /api/v1/event-categories/{id}
DELETE /api/v1/event-categories/{id}
POST   /api/v1/event-categories/{id}/toggle-status
```

#### Venues
```http
GET    /api/v1/venues
POST   /api/v1/venues
GET    /api/v1/venues/{id}
PUT    /api/v1/venues/{id}
DELETE /api/v1/venues/{id}
```

#### Stages (Nested under Venues)
```http
GET    /api/v1/venues/{venue}/stages
POST   /api/v1/venues/{venue}/stages
GET    /api/v1/venues/{venue}/stages/{stage}
PUT    /api/v1/venues/{venue}/stages/{stage}
DELETE /api/v1/venues/{venue}/stages/{stage}
PUT    /api/v1/venues/{venue}/stages/{stage}/seating-plan
```

#### Events
```http
GET    /api/v1/events
POST   /api/v1/events
GET    /api/v1/events/{id}
PUT    /api/v1/events/{id}
DELETE /api/v1/events/{id}
POST   /api/v1/events/{event}/publish
POST   /api/v1/events/{event}/cancel
POST   /api/v1/events/{event}/complete
```

#### Event Gallery
```http
GET    /api/v1/events/{event}/gallery
POST   /api/v1/events/{event}/gallery
GET    /api/v1/events/{event}/gallery/photos
GET    /api/v1/events/{event}/gallery/videos
GET    /api/v1/gallery-items/{item}
PUT    /api/v1/gallery-items/{item}
DELETE /api/v1/gallery-items/{item}
```

#### Seat Types
```http
GET    /api/v1/seat-types
POST   /api/v1/seat-types
GET    /api/v1/seat-types/{id}
PUT    /api/v1/seat-types/{id}
DELETE /api/v1/seat-types/{id}
POST   /api/v1/seat-types/{seat_type}/toggle-status
```

#### Stage Seats (Nested)
```http
GET    /api/v1/stages/{stage}/seats
POST   /api/v1/stages/{stage}/seats
POST   /api/v1/stages/{stage}/seats/bulk
GET    /api/v1/stages/{stage}/seats/{seat}
PUT    /api/v1/stages/{stage}/seats/{seat}
DELETE /api/v1/stages/{stage}/seats/{seat}
```

#### Event Showtime Seat Status (Admin)
```http
POST /api/v1/event-showtimes/{showtime}/seats/initialize
GET  /api/v1/event-showtimes/{showtime}/seats/summary
```

#### Users
```http
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}
GET    /api/v1/users/by-role/customers
GET    /api/v1/users/by-role/org-admins
GET    /api/v1/users/by-role/co-admins
GET    /api/v1/users/by-role/operators
POST   /api/v1/users/{id}/toggle-email-verification
```

### Customer Endpoints (Auth Required)

#### Event Favorites
```http
GET  /api/v1/favorites
GET  /api/v1/favorites/{event}
POST /api/v1/events/{event}/favorite
```

**Toggle Favorite Response:**
```json
{
  "success": true,
  "message": "Etkinlik favorilere eklendi.",
  "data": {
    "is_favorited": true,
    "event_id": 5
  }
}
```

#### Orders (Read-Only - Created via seat purchase)
```http
GET  /api/v1/orders
GET  /api/v1/orders/{order}
POST /api/v1/orders/{order}/cancel
```

**Order Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "BLT-20260407-ABC123",
    "status": "pending",
    "status_label": "Ödeme Bekleniyor",
    "total_amount": 250.00,
    "item_count": 2,
    "notes": null,
    "paid_at": null,
    "confirmed_at": null,
    "cancelled_at": null,
    "refunded_at": null,
    "created_at": "2026-04-07T10:00:00Z",
    "tickets": [...]
  }
}
```

#### Tickets
```http
GET /api/v1/tickets
GET /api/v1/tickets/{ticket}
```

**Ticket Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "unique_code": "550e8400-e29b-41d4-a716-446655440000",
    "status": "active",
    "status_label": "Geçerli",
    "price": 125.00,
    "attendee_name": "Ahmet Yılmaz",
    "attendee_phone": "+905551234567",
    "used_at": null,
    "cancelled_at": null,
    "refunded_at": null,
    "created_at": "2026-04-07T10:00:00Z",
    "order": {
      "id": 1,
      "order_number": "BLT-20260407-ABC123",
      "status": "pending"
    },
    "showtime": {
      "id": 5,
      "showtime": "2026-04-15T20:00:00Z",
      "event": {
        "id": 10,
        "title": "Sezen Aksu Konseri",
        "slug": "sezen-aksu-konseri"
      },
      "stage": {
        "id": 2,
        "name": "Ana Salon"
      }
    },
    "seat": {
      "id": 150,
      "row_label": "A",
      "seat_number": "15",
      "type": {
        "id": 1,
        "name": "VIP"
      }
    }
  }
}
```

#### Event Showtime Seat Status
```http
GET  /api/v1/event-showtimes/{showtime}/seats
PUT  /api/v1/event-showtimes/{showtime}/seats/{seat}
POST /api/v1/event-showtimes/{showtime}/seats/bulk-update
```

---

## Data Models

### Organization

```php
// app/Models/Organization.php
class Organization extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'logo_path',
        'description',
        'tax_number',
        'tax_administration',
        'city',
        'district',
        'address',
        'phone',
        'website',
        'is_active',
        'settings', // JSON
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];
}
```

**Settings Structure:**
```json
{
  "payment_gateway": "closed|iyzico|paytr|parampos",
  "review_permission": "registered_users|ticket_holders_only|closed"
}
```

### User

```php
// app/Models/User.php
class User extends Authenticatable
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'organization_id',
        'role',           // UserRole enum
        'status',         // UserStatus enum
        'user_group',     // UserGroup enum
        'avatar',
        'phone',
        'identity_number',
        'sms_permission',
        'call_permission',
        'mail_permission',
        'notification_permission',
        'email_verified_at',
    ];

    // Relationships
    public function favorites(): HasMany;
    public function favoriteEvents(): BelongsToMany;
    public function orders(): HasMany;
    public function tickets(): HasManyThrough;
}
```

### Event

```php
// app/Models/Event.php
class Event extends Model
{
    use Multitenantable;

    protected $fillable = [
        'organization_id',
        'event_category_id',
        'venue_id',
        'title',
        'slug',
        'description',
        'poster_image',
        'header_image',
        'mobile_image',
        'duration_minutes',
        'status',           // EventStatus enum
        'is_featured',
        'rating_average',   // decimal:1
        'rating_count',     // int
    ];

    // Relationships
    public function category(): BelongsTo;
    public function venue(): BelongsTo;
    public function showtimes(): HasMany;  // EventShowtime (includes stage_id)
    public function galleryItems(): HasMany;
    public function people(): HasMany;
    public function ratings(): HasMany;
    public function reviews(): HasMany;
}
```

### EventShowtime

```php
// app/Models/EventShowtime.php
class EventShowtime extends Model
{
    protected $fillable = [
        'event_id',
        'stage_id',        // Stage assigned per showtime
        'showtime',        // datetime
        'is_active',
        'sold_count',
        'reserved_count',
        'blocked_count',
    ];

    protected $casts = [
        'stage_id' => 'integer',
        'showtime' => 'datetime',
    ];

    // Relationships
    public function event(): BelongsTo;
    public function stage(): BelongsTo;
    public function seatStatuses(): HasMany;
}
```

### Order

```php
// app/Models/Order.php
final class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'order_number',     // Auto-generated: BLT-YYYYMMDD-XXXXXX
        'status',           // OrderStatus enum
        'total_amount',     // decimal:2
        'item_count',
        'notes',
        'paid_at',
        'confirmed_at',
        'cancelled_at',
        'refunded_at',
    ];

    protected $casts = [
        'status' => OrderStatus::class,
        'total_amount' => 'decimal:2',
    ];

    // Relationships
    public function user(): BelongsTo;
    public function tickets(): HasMany;

    // Methods
    public function markAsPaid(): void;
    public function markAsConfirmed(): void;
    public function markAsCancelled(): void;
    public function markAsRefunded(): void;
    public function recalculateTotals(): void;
}
```

### Ticket

```php
// app/Models/Ticket.php
final class Ticket extends Model
{
    protected $fillable = [
        'order_id',
        'event_showtime_id',
        'seat_id',
        'unique_code',      // Auto-generated UUID
        'status',           // TicketStatus enum
        'price',            // decimal:2
        'attendee_name',
        'attendee_identity_number',
        'attendee_phone',
        'used_at',
        'cancelled_at',
        'refunded_at',
    ];

    protected $casts = [
        'status' => TicketStatus::class,
        'price' => 'decimal:2',
    ];

    // Relationships
    public function order(): BelongsTo;
    public function eventShowtime(): BelongsTo;
    public function seat(): BelongsTo;

    // Methods
    public function markAsUsed(): void;
    public function markAsCancelled(): void;
    public function markAsRefunded(): void;
}
```

### EventFavorite

```php
// app/Models/EventFavorite.php
final class EventFavorite extends Model
{
    protected $fillable = [
        'event_id',
        'user_id',
    ];

    // Unique constraint: ['event_id', 'user_id']

    public function event(): BelongsTo;
    public function user(): BelongsTo;
}
```

### EventSeatStatus

```php
// app/Models/EventSeatStatus.php
class EventSeatStatus extends Model
{
    protected $fillable = [
        'event_showtime_id',
        'seat_id',
        'status',               // SeatStatus enum
        'price',                // decimal:2
        'user_id',
        'order_id',             // NEW: Links to Order
        'attendee_name',
        'attendee_identity_number',
        'attendee_phone',
        'reserved_at',
        'sold_at',
    ];

    // Virtual Available Records
    // Records with status='available' are DELETED (implicit availability)
    // Only non-available seats exist in DB
}
```

### EventRating

```php
// app/Models/EventRating.php
final class EventRating extends Model
{
    protected $fillable = [
        'event_id',
        'user_id',
        'rating',    // int 1-5
    ];
}
```

### EventReview

```php
// app/Models/EventReview.php
final class EventReview extends Model
{
    protected $fillable = [
        'event_id',
        'user_id',
        'parent_id',      // For replies (null = main review)
        'rating_id',      // Optional link to rating
        'review',
        'like_count',
        'dislike_count',
        'is_approved',
    ];

    public function isReply(): bool
    {
        return $this->parent_id !== null;
    }
}
```

### EventReviewReaction

```php
// app/Models/EventReviewReaction.php
final class EventReviewReaction extends Model
{
    protected $fillable = [
        'review_id',
        'user_id',
        'reaction',    // 'like' | 'dislike'
    ];
}
```

### Venue

```php
// app/Models/Venue.php
class Venue extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'city',
        'district',
        'address',
        'map_url',
        'description',
        'is_active',
        'operator_id',
    ];

    public function stages(): HasMany;
    public function events(): HasMany;
}
```

### Stage

```php
// app/Models/Stage.php
class Stage extends Model
{
    protected $fillable = [
        'venue_id',
        'name',
        'capacity',
        'seating_type',   // SeatingType enum
        'gate_info',
        'stage_image',    // Image path
        'seating_plan',   // JSON array
    ];

    protected $casts = [
        'seating_type' => SeatingType::class,
        'seating_plan' => 'array',
    ];

    public function venue(): BelongsTo;
    public function showtimes(): HasMany;  // Direct relationship to EventShowtime
    public function seats(): HasMany;
}
```

### Seat

```php
// app/Models/Seat.php
class Seat extends Model
{
    protected $fillable = [
        'stage_id',
        'seat_type_id',
        'seat_number',
        'row_label',
        'is_active',
    ];

    public function stage(): BelongsTo;
    public function seatType(): BelongsTo;
    public function eventSeatStatuses(): HasMany;
}
```

### SeatType

```php
// app/Models/SeatType.php
class SeatType extends Model
{
    protected $fillable = [
        'name',
        'description',
        'is_active',
        'sort_order',
    ];
}
```

### OrganizationSettingLog

```php
// app/Models/OrganizationSettingLog.php
final class OrganizationSettingLog extends Model
{
    protected $fillable = [
        'organization_id',
        'user_id',
        'changes',     // JSON array of {old, new}
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'changes' => 'array',
    ];
}
```

---

## Enums

### UserRole

```php
enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case CO_ADMIN = 'co_admin';
    case ORG_ADMIN = 'org_admin';
    case OPERATOR = 'operator';
    case CUSTOMER = 'customer';
}
```

### UserStatus

```php
enum UserStatus: string
{
    case ACTIVE = 'active';
    case PASSIVE = 'passive';
    case SUSPENDED = 'suspended';
    case BANNED = 'banned';
}
```

### UserGroup

```php
enum UserGroup: string
{
    case NEW = 'new';
    case NORMAL = 'normal';
    case VIP = 'vip';
}
```

### EventStatus

```php
enum EventStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Cancelled = 'cancelled';
    case Completed = 'completed';

    public function label(): string;
    public function color(): string;
}
```

### OrderStatus

```php
enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';
    case Refunded = 'refunded';

    public function label(): string;
    public static function options(): array;
}
```

### TicketStatus

```php
enum TicketStatus: string
{
    case Active = 'active';
    case Used = 'used';
    case Cancelled = 'cancelled';
    case Refunded = 'refunded';

    public function label(): string;
    public static function options(): array;
}
```

### SeatStatus

```php
enum SeatStatus: string
{
    case Available = 'available';
    case Reserved = 'reserved';
    case Sold = 'sold';
    case Blocked = 'blocked';
    case Maintenance = 'maintenance';

    public function label(): string;
    public function isOccupied(): bool;
}
```

### SeatingType

```php
enum SeatingType: string
{
    case SEATED = 'seated';
    case STANDING = 'standing';
    case MIXED = 'mixed';

    public function label(): string;
}
```

### GalleryItemType

```php
enum GalleryItemType: string
{
    case Photo = 'photo';
    case Video = 'video';

    public function label(): string;
    public function icon(): string;
}
```

### EventPersonType

```php
enum EventPersonType: string
{
    case Author = 'author';
    case Director = 'director';
    case Cast = 'cast';

    public function label(): string;
    public function color(): string;
}
```

### PaymentGateway

```php
enum PaymentGateway: string
{
    case Closed = 'closed';
    case Iyzico = 'iyzico';
    case PayTR = 'paytr';
    case Parampos = 'parampos';

    public function label(): string;
    public static function options(): array;
}
```

### ReviewPermission

```php
enum ReviewPermission: string
{
    case RegisteredUsers = 'registered_users';
    case TicketHoldersOnly = 'ticket_holders_only';
    case Closed = 'closed';

    public function label(): string;
    public static function options(): array;
}
```

---

## DTOs

### StageDTO

```php
// app/DTOs/StageDTO.php
final readonly class StageDTO
{
    public function __construct(
        public string $name,
        public int $capacity,
        SeatingType|string $seatingType,
        public ?string $gateInfo = null,
        public ?array $seatingPlan = null,
    ) {}

    public static function fromArray(array $data): self;
    public function toArray(): array;
}
```

### OrganizationSettingsDTO

```php
// app/DTOs/OrganizationSettingsDTO.php
final readonly class OrganizationSettingsDTO
{
    public function __construct(
        public ?PaymentGateway $paymentGateway = null,
        public ?ReviewPermission $reviewPermission = null,
    ) {}

    public static function fromArray(array $data): self;
    public function toSettingsArray(): array;
    public static function defaults(): array;
}
```

---

## Services

### StageService

```php
// app/Services/V1/StageService.php
final readonly class StageService
{
    public function getStagesByVenue(Venue $venue, array $filters = []): Collection;
    public function getStage(int $id): Stage;
    public function create(Venue $venue, StageDTO $dto, ?UploadedFile $stageImage = null): Stage;
    public function update(Stage $stage, StageDTO $dto, ?UploadedFile $stageImage = null): Stage;
    public function delete(Stage $stage): bool;
    public function updateSeatingPlan(Stage $stage, array $seatingPlan): Stage;
}
```

### EventFavoriteService

```php
// app/Services/V1/EventFavoriteService.php
final readonly class EventFavoriteService
{
    public function toggle(Event $event, User $user): array;
    public function index(User $user, int $perPage = 15): LengthAwarePaginator;
    public function isFavorited(Event $event, User $user): bool;
}
```

### OrderService

```php
// app/Services/V1/OrderService.php
final readonly class OrderService
{
    public function index(User $user, int $perPage = 15): LengthAwarePaginator;
    public function show(Order $order, User $user): Order;
    public function cancel(Order $order, User $user): Order;
    public function getTickets(User $user, int $perPage = 15): LengthAwarePaginator;
    public function showTicket(Ticket $ticket, User $user): Ticket;
}
```

### EventRatingService

```php
// app/Services/V1/EventRatingService.php
final readonly class EventRatingService
{
    public function storeOrUpdate(Event $event, User $user, int $rating): EventRating;
    public function delete(Event $event, User $user): bool;
    public function getSummary(Event $event): array; // average, count, distribution
}
```

### EventReviewService

```php
// app/Services/V1/EventReviewService.php
final readonly class EventReviewService
{
    public function getReviews(Event $event, int $perPage = 15): LengthAwarePaginator;
    public function storeReview(Event $event, User $user, string $review, ?int $ratingId): EventReview;
    public function storeReply(EventReview $review, User $admin, string $reply): EventReview;
    public function updateReview(EventReview $review, User $user, string $newReview): EventReview;
    public function deleteReview(EventReview $review, User $user): bool;
}
```

### EventReviewReactionService

```php
// app/Services/V1/EventReviewReactionService.php
final readonly class EventReviewReactionService
{
    public function storeOrUpdate(EventReview $review, User $user, string $reaction): EventReviewReaction;
    public function delete(EventReview $review, User $user): bool;
}
```

### EventReviewPermissionService

```php
// app/Services/V1/EventReviewPermissionService.php
final readonly class EventReviewPermissionService
{
    public function canRate(Event $event, ?User $user): bool;
    public function canReview(Event $event, ?User $user): bool;
    public function canReply(?User $user): bool;
    public function isEventReviewable(Event $event): bool;
    public function getPermissionStatus(Event $event): array;
    public function getDetailedPermissionStatus(Event $event, ?User $user): array;
}
```

### OrganizationSettingsService

```php
// app/Services/V1/OrganizationSettingsService.php
final readonly class OrganizationSettingsService
{
    public function getSettings(Organization $organization): array;
    public function getSetting(Organization $organization, string $key, mixed $default = null): mixed;
    public function updateSettings(Organization $organization, OrganizationSettingsDTO $dto, ?int $userId, ?string $ipAddress, ?string $userAgent): Organization;
    public function resetToDefaults(Organization $organization, ?int $userId, ?string $ipAddress, ?string $userAgent): Organization;
    public function getHistory(Organization $organization, int $perPage = 20): LengthAwarePaginator;
}
```

---

## Observers

### EventRatingObserver

Automatically updates event rating cache when ratings change.

```php
// app/Observers/EventRatingObserver.php
final class EventRatingObserver
{
    public function created(EventRating $rating): void;
    public function updated(EventRating $rating): void;
    public function deleted(EventRating $rating): void;

    // Updates:
    // - event.rating_average (decimal:1)
    // - event.rating_count (int)
}
```

### EventReviewReactionObserver

Automatically updates review reaction counts.

```php
// app/Observers/EventReviewReactionObserver.php
final class EventReviewReactionObserver
{
    public function created(EventReviewReaction $reaction): void;
    public function updated(EventReviewReaction $reaction): void;
    public function deleted(EventReviewReaction $reaction): void;

    // Updates:
    // - review.like_count (int)
    // - review.dislike_count (int)
}
```

### EventSeatStatusObserver

Automatically updates showtime seat counters.

```php
// app/Observers/EventSeatStatusObserver.php
final class EventSeatStatusObserver
{
    public function created(EventSeatStatus $seatStatus): void;
    public function updated(EventSeatStatus $seatStatus): void;
    public function deleted(EventSeatStatus $seatStatus): void;
    public function restored(EventSeatStatus $seatStatus): void;

    // Updates:
    // - showtime.sold_count (int)
    // - showtime.reserved_count (int)
    // - showtime.blocked_count (int)
}
```

### EventShowtimeObserver

Clears event cache for computed start/end dates.

```php
// app/Observers/EventShowtimeObserver.php
final class EventShowtimeObserver
{
    public function saved(EventShowtime $showtime): void;
    public function deleted(EventShowtime $showtime): void;
    public function restored(EventShowtime $showtime): void;
}
```

---

## Key Features

### Virtual Available Records

The system uses "virtual available records" for seat statuses:
- Seats with `status='available'` are **deleted** from the database
- Only non-available seats (reserved, sold, blocked, maintenance) exist as records
- This optimizes storage and query performance

### Showtime-Based Architecture

- Events have multiple showtimes ([`EventShowtime`](app/Models/EventShowtime.php))
- **Each showtime can be assigned to a different stage** (flexible venue/stage selection per showtime)
- Each showtime has its own seat statuses
- Seat statuses are linked to showtimes, not events directly
- Stages have direct relationship to showtimes for efficient querying

### Order & Ticket System

**Order Workflow:**
1. Customer selects seats (EventSeatStatus)
2. System automatically creates Order with unique order number (e.g., `BLT-20260407-ABC123`)
3. Tickets are generated for each seat with UUID unique codes
4. Order status flows: `pending` → `paid` → `confirmed`
5. Orders can be cancelled (releases seats, marks tickets as cancelled)

**Key Features:**
- Orders link to EventSeatStatus via `order_id` field
- Automatic order number generation on creation
- Soft delete support for orders
- Order totals auto-calculated from tickets
- Ticket QR codes via UUID unique_code field

### Event Favorites System

- Users can favorite/unfavorite events via toggle endpoint
- Favorites stored in pivot table with unique constraint
- Paginated favorites list with event details
- Check favorite status for specific events

### Rating & Review System

- Users can rate events 1-5 stars
- Users can write reviews (optional link to rating)
- Admins can reply to reviews
- Other users can like/dislike reviews
- All actions update cached counters automatically via observers

### Organization Settings

- Settings stored as JSON in [`Organization.settings`](app/Models/Organization.php)
- Changes logged to [`OrganizationSettingLog`](app/Models/OrganizationSettingLog.php)
- Cached for performance
- Supports payment gateway and review permission configuration

### Multi-Tenancy

- Automatic row-level filtering via [`TenantScope`](app/Models/Scopes/TenantScope.php)
- Applied through [`BelongsToOrganization`](app/Traits/BelongsToOrganization.php) trait
- Role-based access control
- Co-admins can manage multiple organizations (with caching)

### Stage Management

- Venues can have multiple stages (salons)
- Each stage has its own capacity and seating type
- Nested resource routing: `/api/v1/venues/{venue}/stages`
- Supports filtering by search term and seating type
- Stage image upload (stored in `public/uploads/stages/seating_plans/`)
- Seating plan as JSON (flexible structure for UI visualization)
- Dedicated seating plan update endpoint

---

## Database Migrations (Summary)

### Core Tables

| Migration | Description |
|-----------|-------------|
| `create_organizations_table` | Organizations |
| `create_users_table` | Users with roles |
| `create_personal_access_tokens_table` | Sanctum tokens |
| `create_venues_table` | Venues |
| `create_stages_table` | Venue stages (with stage_image, seating_plan) |
| `create_event_categories_table` | Event categories |
| `create_events_table` | Events (stage_id removed in v4.2.0) |
| `create_event_showtimes_table` | Event showtimes (stage_id added in v4.2.0) |
| `create_event_seat_statuses_table` | Seat statuses |
| `create_event_ratings_table` | Event ratings |
| `create_event_reviews_table` | Event reviews |
| `create_event_review_reactions_table` | Review reactions |
| `create_organization_setting_logs_table` | Settings audit log |
| `move_stage_id_from_events_to_event_showtimes` | Migrates stage_id to showtimes (v4.2.0) |
| `recreate_event_favorites_table` | **Event favorites pivot table (v4.3.0)** |
| `create_orders_table` | **Orders table (v4.3.0)** |
| `create_tickets_table` | **Tickets table (v4.3.0)** |
| `add_order_id_to_event_seat_statuses_table` | **Links seats to orders (v4.3.0)** |

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate review) |
| 422 | Validation Error |
| 500 | Server Error |

---

## Seeders

### Available Seeders

```bash
# Super admin user
php artisan db:seed --class=SuperAdminSeeder

# Organizations and users
php artisan db:seed --class=OrganizationAndUserSeeder

# Event categories
php artisan db:seed --class=EventCategorySeeder

# Quick event for testing
php artisan db:seed --class=QuickEventSeeder

# Reviews and ratings for an event
php artisan db:seed --class=EventReviewSeeder
```

---

## Changelog

### v4.3.0 (2026-04-07)
- **NEW**: Order & Ticket Management System
  - **NEW**: [`Order`](app/Models/Order.php) model with auto-generated order numbers (BLT-YYYYMMDD-XXXXXX)
  - **NEW**: [`Ticket`](app/Models/Ticket.php) model with UUID unique codes for QR generation
  - **NEW**: [`OrderStatus`](app/Enums/OrderStatus.php) enum (pending, paid, confirmed, cancelled, refunded)
  - **NEW**: [`TicketStatus`](app/Enums/TicketStatus.php) enum (active, used, cancelled, refunded)
  - **NEW**: [`OrderController`](app/Http/Controllers/Api/V1/OrderController.php) — View and cancel orders
  - **NEW**: [`TicketController`](app/Http/Controllers/Api/V1/TicketController.php) — View tickets
  - **NEW**: [`OrderService`](app/Services/V1/OrderService.php) — Business logic for orders/tickets
  - **NEW**: [`OrderResource`](app/Http/Resources/V1/OrderResource.php), [`TicketResource`](app/Http/Resources/V1/TicketResource.php)
  - **CHANGED**: [`EventSeatStatus`](app/Models/EventSeatStatus.php:28) — Added `order_id` field to link seats to orders
  - **CHANGED**: [`User`](app/Models/User.php:279) — Added `orders()` and `tickets()` relationships

- **NEW**: Event Favorites System
  - **NEW**: [`EventFavorite`](app/Models/EventFavorite.php) model with unique constraint on (event_id, user_id)
  - **NEW**: [`EventFavoriteController`](app/Http/Controllers/Api/V1/EventFavoriteController.php) — Toggle, list, check favorites
  - **NEW**: [`EventFavoriteService`](app/Services/V1/EventFavoriteService.php) — Favorite management logic
  - **NEW**: [`EventFavoriteResource`](app/Http/Resources/V1/EventFavoriteResource.php)
  - **CHANGED**: [`User`](app/Models/User.php:261) — Added `favorites()` and `favoriteEvents()` relationships
  - **NEW**: Routes: `GET /favorites`, `GET /favorites/{event}`, `POST /events/{event}/favorite`

- **NEW**: Multi-Tenancy Enhancement
  - **NEW**: [`TenantScope`](app/Models/Scopes/TenantScope.php) — Centralized global scope for organization filtering
  - **CHANGED**: Co-admin organization filtering now uses cache for performance
  - **CHANGED**: Public API requests no longer filtered by tenant scope (unauthenticated users)

- **CHANGED**: API Routes reorganization
  - Customer endpoints now clearly separated from admin endpoints
  - Added favorites, orders, tickets routes to customer section

### v4.2.0 (2026-04-04)
- **BREAKING CHANGE**: [`Event`](app/Models/Event.php) model — `stage_id` field removed from events table
- **NEW**: [`EventShowtime`](app/Models/EventShowtime.php) model — `stage_id` field added (each showtime can now have different stage)
- **NEW**: Migration [`move_stage_id_from_events_to_event_showtimes`](database/migrations/2026_04_04_163355_move_stage_id_from_events_to_event_showtimes.php) — Data migration with rollback support
- **CHANGED**: [`EventShowtime`](app/Models/EventShowtime.php:42) — Added `stage()` relationship (BelongsTo)
- **CHANGED**: [`EventShowtime`](app/Models/EventShowtime.php:72) — `getCapacity()` now uses `stage_id` from showtime instead of event
- **CHANGED**: [`EventShowtimeResource`](app/Http/Resources/V1/EventShowtimeResource.php:26) — Includes stage data in response
- **CHANGED**: [`EventRequest`](app/Http/Requests/EventRequest.php) — Removed `stage_id` validation
- **CHANGED**: [`EventDTO`](app/DTOs/EventDTO.php) — Removed `stageId` property
- **ARCHITECTURE**: Enables flexible stage assignment per showtime (same event can use different stages for different showtimes)

### v4.1.1 (2026-04-04)
- **CHANGED**: [`Stage`](app/Models/Stage.php:59) model — `events()` relationship replaced with `showtimes()` for direct access to EventShowtime

### v4.1.0 (2026-04-04)
- **NEW**: Stage image upload support (`stage_image` field)
- **NEW**: Stage seating plan as JSON (`seating_plan` field)
- **NEW**: Dedicated seating plan update endpoint: `PUT /venues/{venue}/stages/{stage}/seating-plan`
- **NEW**: [`UpdateSeatingPlanRequest`](app/Http/Requests/UpdateSeatingPlanRequest.php) for seating plan validation
- **CHANGED**: [`StageController`](app/Http/Controllers/Api/V1/StageController.php) — Added `updateSeatingPlan` method
- **CHANGED**: [`StageService`](app/Services/V1/StageService.php) — Image upload/delete, seating plan update methods
- **CHANGED**: [`StageRequest`](app/Http/Requests/StageRequest.php) — Added `stage_image` and `seating_plan` validation
- **CHANGED**: [`StageDTO`](app/DTOs/StageDTO.php) — Added `seatingPlan` property
- **CHANGED**: [`StageResource`](app/Http/Resources/V1/StageResource.php) — Returns `stage_image` (asset URL) and `seating_plan` (array)
- **CHANGED**: [`Stage`](app/Models/Stage.php) model — Added `stage_image` and `seating_plan` columns

### v4.0.1 (2026-04-04)
- **MAINTENANCE**: Documentation regenerated (no API changes)

### v4.0.0 (2026-04-04)
- **NEW**: Stage CRUD endpoints (nested under venues)
- **NEW**: [`StageController`](app/Http/Controllers/Api/V1/StageController.php) with full CRUD operations
- **NEW**: [`StageService`](app/Services/V1/StageService.php) for business logic
- **NEW**: [`StageRequest`](app/Http/Requests/StageRequest.php) with validation rules
- **NEW**: [`StageResource`](app/Http/Resources/V1/StageResource.php) for API responses
- **NEW**: [`StageDTO`](app/DTOs/StageDTO.php) for data transfer
- **CHANGED**: Routes updated to include `venues.stages` nested resource

### v3.1.0 (2026-03-30)
- **NEW**: Rating & Review system
- **NEW**: Organization Settings with audit logging
- **NEW**: Public resource endpoints
- **NEW**: Multiple observers for cache management

---

## License

© 2026 Biletix. All rights reserved.
