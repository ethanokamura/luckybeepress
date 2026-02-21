# Feature Specification: Repeat Customer Minimum Order Discount

**Feature Branch**: `001-repeat-customer-min`
**Created**: 2026-02-21
**Status**: Draft
**Input**: User description: "Define repeat customers as those with at least one completed/fulfilled order; reduce minimum order from $150 to $100 for repeat customers; dynamically display correct minimum in cart/checkout UI; add efficient customer status determination; handle edge cases including refunded orders and unpaid Net 30 orders."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Repeat Customer Sees Reduced Minimum at Checkout (Priority: P1)

A customer who has previously placed and completed at least one order logs into their account and begins shopping. When they view their cart and proceed to checkout, the displayed minimum order amount is $100 rather than $150. If their cart total meets the $100 threshold but not $150, they are able to proceed to payment without any blocking message.

**Why this priority**: This is the core value delivery of the feature — existing loyal customers receive a tangible benefit that rewards repeat business and reduces friction at checkout. Without this story, the feature provides no user value.

**Independent Test**: Log in as an account with one or more completed orders, add $110 worth of items to the cart, and verify the checkout proceeds without a minimum order warning.

**Acceptance Scenarios**:

1. **Given** a logged-in user with at least one completed/fulfilled order, **When** they view their cart with $100 or more in items, **Then** the cart displays "$100 minimum order met" and checkout is enabled.
2. **Given** a logged-in user with at least one completed/fulfilled order, **When** their cart total is below $100, **Then** the cart displays "Minimum order is $100 for your account" and checkout is blocked.
3. **Given** a logged-in user with at least one completed/fulfilled order, **When** they reach the checkout page, **Then** the minimum order threshold displayed is $100.

---

### User Story 2 - New Customer Sees Standard Minimum at Checkout (Priority: P1)

A customer who has never placed a completed order (first-time buyer or one whose only orders are pending, refunded, or unpaid Net 30) views their cart and checkout. The standard $150 minimum order is enforced and displayed.

**Why this priority**: Equally critical to P1 — the system must correctly gate new customers at the existing $150 threshold to preserve current business rules for non-repeat customers.

**Independent Test**: Log in as an account with no completed/fulfilled orders (or no orders at all), add $120 worth of items, and verify the checkout is blocked with a $150 minimum message.

**Acceptance Scenarios**:

1. **Given** a logged-in user with no completed/fulfilled orders, **When** they view their cart with $120 in items, **Then** the cart displays "Minimum order is $150" and checkout is blocked.
2. **Given** a logged-in user whose only completed order was later fully refunded, **When** they view their cart, **Then** they are treated as a new customer with a $150 minimum.
3. **Given** a logged-in user with only an unpaid Net 30 order (not yet completed), **When** they view their cart, **Then** they are treated as a new customer with a $150 minimum.

---

### User Story 3 - Customer Status Updates After Order Completion (Priority: P2)

When a customer's order transitions to a "completed" or "fulfilled" status for the first time, their account is automatically updated to reflect repeat customer status. On their next session, they will see the $100 minimum.

**Why this priority**: Required for the system to stay current without manual intervention. Without this, repeat status would never be granted to new customers as they complete their first orders.

**Independent Test**: Place a test order, manually transition its status to "completed", then log in again and verify the cart now shows the $100 minimum.

**Acceptance Scenarios**:

1. **Given** a customer completes their first-ever order (status changes to completed/fulfilled), **When** they next log in and view their cart, **Then** the minimum order shown is $100.
2. **Given** a customer's completed order is fully refunded and it was their only qualifying order, **When** they next view their cart, **Then** the minimum order reverts to $150.
3. **Given** a customer's completed order is partially refunded, **When** they view their cart, **Then** they retain repeat customer status and see a $100 minimum (partial refund does not remove status).

---

### User Story 4 - Admin or Operator Can Verify Customer Status (Priority: P3)

An admin user can view a customer's repeat status in the customer management area, confirming whether they qualify for the $100 minimum. This provides visibility into how the threshold is applied per account.

**Why this priority**: Operational transparency — support staff need to validate customer status when handling disputes or questions about minimum order thresholds.

**Independent Test**: Navigate to a customer's record in the admin panel and confirm repeat status is displayed.

**Acceptance Scenarios**:

1. **Given** an admin views a customer account with completed orders, **When** they see the customer profile, **Then** it shows repeat customer status as active.
2. **Given** an admin views a customer account with no qualifying completed orders, **When** they see the customer profile, **Then** it shows repeat customer status as inactive.

---

### Edge Cases

- **Refunded orders**: A fully refunded order does NOT count toward repeat customer qualification. If a customer's only completed order is subsequently fully refunded, they revert to new customer status with a $150 minimum.
- **Partially refunded orders**: A partially refunded order still counts as completed/fulfilled. Repeat customer status is retained.
- **Net 30 / unpaid orders**: An order that is pending payment (Net 30 terms, invoice sent but not paid) does NOT qualify toward repeat status. Only orders with a final completed or fulfilled status count.
- **Cancelled orders**: A cancelled order does not count toward repeat status.
- **Status already set**: If a customer already has repeat status and places another order, their status remains unchanged (no double-counting or regression).
- **Real-time vs. session-based status**: Repeat status is evaluated at login/session start. A status change mid-session (e.g., order completes while customer is actively shopping) takes effect on the next page load or session refresh, not instantly mid-flow.
- **Guest checkouts**: Guest (unauthenticated) orders are not associated with a customer account and do not contribute to repeat status for any user.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST identify a customer as a "repeat customer" if and only if they have at least one order with a status of "completed" or "fulfilled" that has not been fully refunded.
- **FR-002**: System MUST enforce a $100 minimum order total for repeat customers.
- **FR-003**: System MUST enforce a $150 minimum order total for customers who do not meet the repeat customer criteria.
- **FR-004**: The cart page MUST display the applicable minimum order amount based on the current customer's repeat status.
- **FR-005**: The checkout page MUST validate the cart total against the customer's applicable minimum before allowing payment to proceed.
- **FR-006**: System MUST store or derive each customer's repeat status in a way that can be efficiently retrieved at cart/checkout load time without scanning all orders on every page view.
- **FR-007**: System MUST automatically update a customer's repeat status when an order transitions to "completed" or "fulfilled" status.
- **FR-008**: System MUST automatically re-evaluate and update a customer's repeat status when a full refund is issued on an order.
- **FR-009**: Orders with a status of "pending payment", "awaiting invoice payment" (Net 30), or "cancelled" MUST NOT contribute to repeat customer qualification.
- **FR-010**: Guest (unauthenticated) orders MUST NOT contribute to any user's repeat customer status.
- **FR-011**: Admin customer records MUST display each customer's current repeat status (active or inactive).

### Key Entities

- **Customer**: A registered user account. Gains a repeat status attribute that is either active (qualifies for $100 minimum) or inactive (standard $150 minimum applies). Repeat status is derived from their order history.
- **Order**: A purchase record associated with a customer. Has a lifecycle status (e.g., pending, completed, fulfilled, cancelled, refunded). Only orders in "completed" or "fulfilled" states that have not been fully refunded contribute to repeat status.
- **Order Minimum Rule**: A business rule that maps a customer type (repeat vs. new) to a minimum cart value ($100 vs. $150). Applied at cart display and checkout validation.
- **Repeat Status Record**: A stored or derived marker on a customer's account indicating whether they currently qualify as a repeat customer. Updated when qualifying order statuses change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of repeat customers (those with at least one completed, non-refunded order) see a $100 minimum in their cart and checkout — zero exceptions.
- **SC-002**: 100% of non-repeat customers see the $150 minimum — no new customers are incorrectly granted the reduced threshold.
- **SC-003**: Repeat customer status is reflected within one session login of the qualifying order reaching "completed" or "fulfilled" status — customers do not wait more than one login cycle.
- **SC-004**: Full refund processing correctly reverts repeat status within the same session or on the customer's next login — no customer retains the $100 minimum after losing all qualifying orders.
- **SC-005**: Cart and checkout minimum display loads within the same time as the existing cart/checkout pages — no measurable increase in page load time for users.
- **SC-006**: Zero manual admin interventions are required to maintain customer repeat status — the system self-updates based on order lifecycle events.

## Assumptions

- The existing order data in Firestore has a clear, consistent status field with values that include "completed" and "fulfilled" as terminal successful states.
- "Fully refunded" is distinguishable from "partially refunded" in the current order data model (e.g., via a refund amount field or a distinct status value).
- Net 30 / invoice orders have a distinct status (e.g., "pending payment" or similar) that is separate from "completed" or "fulfilled".
- The current $150 minimum is enforced in both the cart UI and at checkout validation — this feature modifies both of those enforcement points.
- Customers are always authenticated before reaching the cart or checkout — guest checkout, if it exists, does not need to show a dynamic minimum.
- The admin customer management area already displays customer-level attributes and can be extended to show repeat status.
- Partial refunds do not change an order's status to "refunded" — only full refunds do.

## Dependencies

- Existing order status lifecycle and the set of valid status values must be documented and stable.
- Existing cart minimum enforcement logic must be located and understood before modification.
- Admin customer view must be accessible and extensible for displaying the new status field.
