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