# Database Schema - PostgreSQL

This document outlines the detailed schema for the PostgreSQL database used by the Kinternationals Estimate Software.

---

## 1. `users` Table

Manages user accounts for company sales executives and dealer staff, including authentication credentials and roles.

| Column Name     | Data Type                  | Constraints                               | Description                                                                 |
| :-------------- | :------------------------- | :---------------------------------------- | :-------------------------------------------------------------------------- |
| `id`            | `BIGINT`                   | `PRIMARY KEY`, `NOT NULL`, `GENERATED ALWAYS AS IDENTITY` | Unique identifier for each user.                                            |
| `username`      | `VARCHAR(255)`             | `NOT NULL`, `UNIQUE`                      | The user's unique login username.                                           |
| `password_hash` | `VARCHAR(255)`             | `NOT NULL`                                | Stores the **hashed** version of the user's password.                       |
| `role`          | `VARCHAR(50)`              | `NOT NULL`                                | Defines the user's role: 'company_executive' or 'dealer_staff'.             |
| `dealer_id`     | `BIGINT`                   | `NULLABLE`                                | If the user is a 'dealer_staff', this will link to their specific dealer's ID (via `dealers` table, to be defined). Can be NULL for 'company_executive'. |
| `is_active`     | `BOOLEAN`                  | `NOT NULL`, `DEFAULT TRUE`                | Flag to enable/disable user accounts.                                       |
| `created_at`    | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Automatically records when the user account was created.                    |
| `updated_at`    | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Automatically records the last time the user's details were updated.        |

---

## 2. `components` Table

Stores definitions for all kitchen components, including their categorization, descriptive details, and base pricing for different user roles.

| Column Name              | Data Type                  | Constraints                               | Description                                                                                             |
| :----------------------- | :------------------------- | :---------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| `id`                     | `BIGINT`                   | `PRIMARY KEY`, `NOT NULL`, `GENERATED ALWAYS AS IDENTITY` | Unique identifier for each component.                                                                   |
| `name`                   | `VARCHAR(255)`             | `NOT NULL`, `UNIQUE`                      | The descriptive name of the component (e.g., "Tall Carcass (HDHMR)", "PVC CUTLERY HAF (HAFELE)").      |
| `category`               | `VARCHAR(50)`              | `NOT NULL`                                | The broad category of the component (e.g., 'shutter', 'cabinet', 'accessory', 'hardware', 'endpanel'). |
| `description`            | `TEXT`                     | `NULLABLE`                                | Optional detailed description of the component.                                                         |
| `image_url`              | `VARCHAR(255)`             | `NULLABLE`                                | URL for an image of the component, if applicable.                                                       |
| `company_price_per_unit` | `NUMERIC(10, 2)`           | `NOT NULL`                                | The base price for this component for 'company_executive' users.                                        |
| `dealer_price_per_unit`  | `NUMERIC(10, 2)`           | `NOT NULL`                                | The base price for this component for 'dealer_staff' users.                                             |
| `price_unit_type`        | `VARCHAR(50)`              | `NOT NULL`                                | Defines how the price is applied (e.g., 'SQFT', 'PIECE', 'MM', 'METER').                                |
| `is_active`              | `BOOLEAN`                  | `NOT NULL`, `DEFAULT TRUE`                | Flag to easily enable/disable components without deleting them.                                         |
| `created_at`             | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Timestamp when the record was created.                                                                  |
| `updated_at`             | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Timestamp when the record was last updated.                                                             |

---

## 3. `features_and_finishes` Table

Stores details about additional cost-adding features or finishes that can be applied to components (e.g., glass openings, engravings, grooving).

| Column Name              | Data Type                  | Constraints                               | Description                                                                                             |
| :----------------------- | :------------------------- | :---------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| `id`                     | `BIGINT`                   | `PRIMARY KEY`, `NOT NULL`, `GENERATED ALWAYS AS IDENTITY` | Unique identifier for each feature/finish.                                                              |
| `name`                   | `VARCHAR(255)`             | `NOT NULL`, `UNIQUE`                      | The name of the feature or finish (e.g., "Glass Opening", "Engraving - Type A", "Grooving - Horizontal"). |
| `description`            | `TEXT`                     | `NULLABLE`                                | Optional detailed description of the feature.                                                           |
| `company_price_per_unit` | `NUMERIC(10, 2)`           | `NOT NULL`                                | The base price for this feature for 'company_executive' users.                                        |
| `dealer_price_per_unit`  | `NUMERIC(10, 2)`           | `NOT NULL`                                | The base price for this feature for 'dealer_staff' users.                                             |
| `price_unit_type`        | `VARCHAR(50)`              | `NOT NULL`                                | Defines how the price is applied (e.g., 'SQFT', 'PIECE', 'MM_LINEAR', 'PER_HOLE'). This is crucial.     |
| `is_active`              | `BOOLEAN`                  | `NOT NULL`, `DEFAULT TRUE`                | Flag to easily enable/disable features.                                                                 |
| `created_at`             | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Timestamp when the record was created.                                                                  |
| `updated_at`             | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Timestamp when the record was last updated.                                                             |

---

## 4. `orders` Table

Holds high-level information about each client quotation or estimate, including client details, total price, and status.

| Column Name        | Data Type                  | Constraints                               | Description                                                                 |
| :----------------- | :------------------------- | :---------------------------------------- | :-------------------------------------------------------------------------- |
| `id`               | `BIGINT`                   | `PRIMARY KEY`, `NOT NULL`, `GENERATED ALWAYS AS IDENTITY` | Unique identifier for each order/quotation.                                 |
| `user_id`          | `BIGINT`                   | `NOT NULL`, `FOREIGN KEY` references `users(id)` | The ID of the user (sales executive/dealer staff) who created this order.   |
| `quote_date`       | `DATE`                     | `NOT NULL`, `DEFAULT CURRENT_DATE`        | The date the quotation was created.                                         |
| `quote_no`         | `VARCHAR(50)`              | `NOT NULL`, `UNIQUE`                      | The unique quotation number.                                                |
| `client_name`      | `VARCHAR(255)`             | `NOT NULL`                                | The name of the client (e.g., "Mr. Sanjay & Family").                       |
| `client_address`   | `TEXT`                     | `NULLABLE`                                | The client's address.                                                       |
| `client_phone`     | `VARCHAR(50)`              | `NULLABLE`                                | The client's phone number.                                                  |
| `project_type`     | `VARCHAR(100)`             | `NOT NULL`, `DEFAULT 'Kitchen'`           | The type of project, defaults to 'Kitchen'.                                 |
| `grand_total_inr`  | `NUMERIC(15, 2)`           | `NOT NULL`, `DEFAULT 0.00`                | The final calculated grand total price in INR.                              |
| `status`           | `VARCHAR(50)`              | `NOT NULL`, `DEFAULT 'Draft'`             | The current status of the order (e.g., 'Draft', 'Finalized', 'Cancelled', 'Accepted'). |
| `additional_notes` | `TEXT`                     | `NULLABLE`                                | Any additional notes or remarks for the specific quotation.                 |
| `created_at`       | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Timestamp when the order record was created.                                |
| `updated_at`       | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Timestamp when the order record was last updated.                           |

---

## 5. `order_items` Table

Stores the details of each individual component included within a specific order. Each row represents one component instance in an order.

| Column Name              | Data Type                  | Constraints                               | Description                                                                                             |
| :----------------------- | :------------------------- | :---------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| `id`                     | `BIGINT`                   | `PRIMARY KEY`, `NOT NULL`, `GENERATED ALWAYS AS IDENTITY` | Unique identifier for each individual item within an order.                                             |
| `order_id`               | `BIGINT`                   | `NOT NULL`, `FOREIGN KEY` references `orders(id)` | The ID of the parent order this item belongs to.                                                        |
| `component_id`           | `BIGINT`                   | `NOT NULL`, `FOREIGN KEY` references `components(id)` | The ID of the specific component (e.g., 'Tall Carcass', 'HINGE SOFT HAF') from the `components` table. |
| `quantity`               | `INTEGER`                  | `NOT NULL`, `DEFAULT 1`                   | The number of units for this component.                                                                 |
| `length_mm`              | `NUMERIC(10, 2)`           | `NULLABLE`                                | The specified length for this component in millimeters, if applicable.                                  |
| `width_mm`               | `NUMERIC(10, 2)`           | `NULLABLE`                                | The specified width for this component in millimeters, if applicable.                                   |
| `height_mm`              | `NUMERIC(10, 2)`           | `NULLABLE`                                | The specified height for this component in millimeters, if applicable.                                  |
| `selected_finish`        | `VARCHAR(255)`             | `NULLABLE`                                | The specific primary finish selected for this component instance (e.g., 'matt laminate'), if applicable. |
| `calculated_line_item_price` | `NUMERIC(15, 2)`           | `NOT NULL`, `DEFAULT 0.00`                | The calculated total price for this specific line item (quantity * unit price * dimensions, etc.).    |
| `created_at`             | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Timestamp when the order item record was created.                                                       |
| `updated_at`             | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Timestamp when the order item record was last updated.                                                  |

---

## 6. `order_item_features` Table

This table links specific `order_items` to the `features_and_finishes` (add-ons) applied to them, enabling a many-to-many relationship.

| Column Name              | Data Type                  | Constraints                               | Description                                                                 |
| :----------------------- | :------------------------- | :---------------------------------------- | :-------------------------------------------------------------------------- |
| `id`                     | `BIGINT`                   | `PRIMARY KEY`, `NOT NULL`, `GENERATED ALWAYS AS IDENTITY` | Unique identifier for each applied feature instance.                        |
| `order_item_id`          | `BIGINT`                   | `NOT NULL`, `FOREIGN KEY` references `order_items(id)` | The ID of the specific order item this feature is applied to.               |
| `feature_id`             | `BIGINT`                   | `NOT NULL`, `FOREIGN KEY` references `features_and_finishes(id)` | The ID of the specific feature/finish from the `features_and_finishes` table. |
| `quantity`               | `INTEGER`                  | `NOT NULL`, `DEFAULT 1`                   | The quantity of this feature applied (e.g., 2 glass openings).              |
| `calculated_feature_price` | `NUMERIC(15, 2)`           | `NOT NULL`, `DEFAULT 0.00`                | The calculated price for *this specific feature instance* applied to the order item. |
| `created_at`             | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Timestamp when the record was created.                                      |
| `updated_at`             | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | Timestamp when the record was last updated.                                 |

---