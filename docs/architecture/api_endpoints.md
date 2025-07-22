# API Endpoints - Kinternationals Estimate Software

This document outlines the API endpoints that the React frontend will use to interact with the Express.js backend.

---

## 1. User Management & Authentication

These endpoints handle user login and password management. User creation and password resets will be handled manually by an administrator.

### 1.1. User Login

- **Purpose:** Authenticates an existing user (Company Executive or Dealer Staff) against credentials stored in the database.
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Request Body (JSON):**
  ```json
  {
    "username": "user_provided_username",
    "password": "user_provided_password"
  }
  ```
- **Success Response (Status: 200 OK - JSON):**
  ```json
  {
    "message": "Login successful!",
    "token": "jwt_token_string", // A JSON Web Token for subsequent authenticated requests
    "user": {
      "id": 1,
      "username": "example_user",
      "role": "company_executive" // Or "dealer_staff"
    }
  }
  ```
- **Error Response (Status: 401 Unauthorized or 400 Bad Request - JSON):**
  ```json
  {
    "message": "Invalid credentials"
  }
  ```
  _(Example 400 response for missing fields: `{"message": "Missing username/password"}`)_
- **Authentication/Authorization:** No prior authentication required.

### 1.2. Change Password

- **Purpose:** Allows a logged-in user to change their own password.
- **Method:** `PUT`
- **URL:** `/api/users/:userId/password` (Note: `:userId` will be a dynamic placeholder for the actual user's ID)
- **Request Body (JSON):**
  ```json
  {
    "oldPassword": "user_current_password",
    "newPassword": "user_new_password"
  }
  ```
- **Success Response (Status: 200 OK - JSON):**
  ```json
  {
    "message": "Password changed successfully!"
  }
  ```
- **Error Response (Status: 401 Unauthorized, 403 Forbidden, 400 Bad Request - JSON):**
  ```json
  {
    "message": "Invalid old password"
  }
  ```
  _(Example 403 response if user tries to change another's password: `{"message": "User not authorized to change this password"}`)_
  _(Example 400 response for requirements: `{"message": "New password does not meet requirements"}`)_
- **Authentication/Authorization:** **Requires Authentication.** Only the logged-in user can change their _own_ password.

---

## 2. Components, Features, and Pricing

These endpoints allow the frontend to fetch data needed to build an estimate and handle secure pricing calculations.

### 2.1. Get All Components

- **Purpose:** Retrieves a list of all active kitchen components (shutters, cabinets, accessories, hardware) that can be added to an estimate.
- **Method:** `GET`
- **URL:** `/api/components`
- **Request Body:** None.
- **Success Response (Status: 200 OK - JSON):**
  ```json
  [
    {
      "id": 1,
      "name": "Tall Carcass (HDHMR)",
      "category": "cabinet",
      "description": "Standard tall carcass unit.",
      "image_url": null,
      "price_unit_type": "PIECE"
    },
    {
      "id": 2,
      "name": "LAMINATE MR+ HDHMR",
      "category": "shutter",
      "description": "A laminate finish is a decorative coating made by pressing thin sheets of paper and resins together...",
      "image_url": null,
      "price_unit_type": "SQFT"
    },
    {
      "id": 3,
      "name": "PVC CUTLERY HAF (HAFELE)",
      "category": "accessory",
      "description": "High-quality cutlery organizer.",
      "image_url": "[https://example.com/cutlery-haf.jpg](https://example.com/cutlery-haf.jpg)",
      "price_unit_type": "PIECE"
    }
    // ... more components
  ]
  ```
  - **Crucial Note:** The `company_price_per_unit` and `dealer_price_per_unit` will **NOT** be included in this response. The frontend should never see these raw prices.
- **Error Response (Status: 500 Internal Server Error - JSON):**
  ```json
  {
    "message": "Error fetching components"
  }
  ```
- **Authentication/Authorization:** Requires Authentication.

### 2.2. Get All Features & Finishes (Add-ons)

- **Purpose:** Retrieves a list of all active add-on features and finishes (e.g., glass openings, engravings) that can be applied to components.
- **Method:** `GET`
- **URL:** `/api/features`
- **Request Body:** None.
- **Success Response (Status: 200 OK - JSON):**
  ```json
  [
    {
      "id": 101,
      "name": "Glass Opening",
      "description": "Standard glass opening for cabinet doors.",
      "price_unit_type": "PIECE"
    },
    {
      "id": 102,
      "name": "Grooving - Horizontal",
      "description": "Decorative horizontal grooves.",
      "price_unit_type": "METER_LINEAR"
    }
    // ... more features
  ]
  ```
  - **Crucial Note:** Similar to components, the `company_price_per_unit` and `dealer_price_per_unit` for features will **NOT** be included in this response.
- **Error Response (Status: 500 Internal Server Error - JSON):**
  ```json
  {
    "message": "Error fetching features"
  }
  ```
- **Authentication/Authorization:** Requires Authentication.

### 2.3. Create New Order / Calculate Estimate

- **Purpose:** Creates a new quotation/estimate or calculates its total price. This endpoint handles the secure server-side calculation of the `grand_total_inr` based on provided components, dimensions, quantities, applied features, and the logged-in user's role.
- **Method:** `POST`
- **URL:** `/api/orders`
- **Request Body (JSON):**
  ```json
  {
    "tempOrderId": "optional_if_editing_draft_order", // Only if updating a previously saved draft
    "components": [
      {
        "componentId": 1,
        "quantity": 1,
        "length_mm": 450.0, // Optional, based on price_unit_type
        "width_mm": 2020.0, // Optional
        "height_mm": 560.0, // Optional
        "selected_finish": "matt laminate", // String name of the finish
        "features": [
          // Array for add-on features
          {
            "featureId": 101, // ID from features_and_finishes table
            "quantity": 1
          }
        ]
      },
      {
        "componentId": 2,
        "quantity": 81,
        "length_mm": 1000.0,
        "width_mm": 1000.0,
        "height_mm": null,
        "selected_finish": "Laminate MR+ HDHMR",
        "features": []
      }
      // ... more components
    ],
    "clientInfo": {
      // Only required when saving the order, otherwise can be omitted or empty
      "clientName": "Mr. Sanjay & Family",
      "clientAddress": "GMS Road",
      "clientPhone": "..."
    },
    "additionalNotes": "Some extra details for this quote.", // Only required when saving
    "status": "Draft" // Or "Finalized", depending on action. Required when saving.
  }
  ```
  - **Note:** The backend will derive the pricing rule (company vs. dealer) from the authenticated user's JWT token, not from the request body.
- **Success Response (Status: 200 OK - JSON):**
  - **For Calculation Only (e.g., frontend "Calculate Price" button click):**
    ```json
    {
      "calculatedGrandTotal": 314705.0
    }
    ```
  - **For Saving/Finalizing the Order (e.g., frontend "Save Order" button click):**
    ```json
    {
      "message": "Order saved successfully!",
      "orderId": 123, // The ID of the newly created/updated order
      "calculatedGrandTotal": 314705.0, // Still return the total for confirmation
      "quoteNo": "D11-127" // The generated quote number
    }
    ```
- **Error Response (Status: 400 Bad Request or 500 Internal Server Error - JSON):**
  - **400 Bad Request (Client-side validation errors):**
    ```json
    {
      "message": "Validation error: Quantity for component X is missing or invalid.",
      "errors": [
        {
          "field": "components[0].quantity",
          "message": "Quantity cannot be empty."
        },
        {
          "field": "clientInfo.clientName",
          "message": "Client name is required for saving."
        }
      ]
    }
    ```
  - **500 Internal Server Error (Backend issues):**
    ```json
    {
      "message": "An unexpected error occurred. Please try again later."
    }
    ```
- **Authentication/Authorization:** Requires Authentication.

---

## 3. Order Management & PDF Generation

These endpoints allow users to interact with their saved orders.

### 3.1. Get All Orders for User

- **Purpose:** Retrieves a list of all orders (draft or finalized) associated with the currently authenticated user. This will power the "View Existing Orders" page.
- **Method:** `GET`
- **URL:** `/api/orders`
- **Request Body:** None.
- **Success Response (Status: 200 OK - JSON):**
  ```json
  [
    {
      "id": 123,
      "quote_no": "D11-127",
      "client_name": "Mr. Sanjay & Family",
      "quote_date": "2024-10-11",
      "grand_total_inr": 314705.0,
      "status": "Finalized",
      "created_at": "2024-10-11T10:00:00Z"
    },
    {
      "id": 124,
      "quote_no": "D11-128",
      "client_name": "Ms. Pooja Singh",
      "quote_date": "2024-10-15",
      "grand_total_inr": 150000.0,
      "status": "Draft",
      "created_at": "2024-10-15T11:30:00Z"
    }
    // ... more orders
  ]
  ```
- **Error Response (Status: 500 Internal Server Error - JSON):**
  ```json
  {
    "message": "Error fetching orders."
  }
  ```
- **Authentication/Authorization:** Requires Authentication. User can only see their own orders.

### 3.2. Get Single Order Details

- **Purpose:** Retrieves all comprehensive details for a specific order, including all its associated `order_items` and `order_item_features`. This will power the individual "View Order" page.
- **Method:** `GET`
- **URL:** `/api/orders/:orderId`
- **Request Body:** None.
- **Success Response (Status: 200 OK - JSON):**
  ```json
  {
    "id": 123,
    "user_id": 1,
    "quote_date": "2024-10-11",
    "quote_no": "D11-127",
    "client_name": "Mr. Sanjay & Family",
    "client_address": "GMS Road",
    "client_phone": "123-456-7890",
    "project_type": "Kitchen",
    "grand_total_inr": 314705.0,
    "status": "Finalized",
    "additional_notes": "All pictures shown here are for illustration purpose only. Actual product may vary.",
    "created_at": "2024-10-11T10:00:00Z",
    "updated_at": "2024-10-11T10:05:00Z",
    "items": [
      {
        "id": 201,
        "component_id": 1,
        "component_name": "Tall Carcass (HDHMR)",
        "component_category": "cabinet",
        "quantity": 1,
        "length_mm": 450.0,
        "width_mm": 2020.0,
        "height_mm": 560.0,
        "selected_finish": "matt laminate",
        "calculated_line_item_price": 150000.0,
        "features": [
          {
            "id": 301,
            "feature_id": 101,
            "feature_name": "Glass Opening",
            "quantity": 1,
            "calculated_feature_price": 5000.0
          }
        ]
      },
      {
        "id": 202,
        "component_id": 2,
        "component_name": "LAMINATE MR+ HDHMR",
        "component_category": "shutter",
        "quantity": 81,
        "length_mm": 1000.0,
        "width_mm": 1000.0,
        "height_mm": null,
        "selected_finish": "Laminate MR+ HDHMR",
        "calculated_line_item_price": 100000.0,
        "features": []
      }
    ]
  }
  ```
- **Error Response (Status: 404 Not Found or 500 Internal Server Error - JSON):**
  ```json
  {
    "message": "Order not found or not accessible."
  }
  ```
- **Authentication/Authorization:** Requires Authentication. User can only view orders they created (or if an admin, any order).

### 3.3. Update Existing Order

- **Purpose:** Allows a user to modify an existing order (e.g., change client details, update components, change status).
- **Method:** `PUT`
- **URL:** `/api/orders/:orderId`
- **Request Body (JSON):**
  ```json
  {
    "clientInfo": {
      "clientName": "Mr. Sanjay & Family (Updated)",
      "clientAddress": "New Address, City",
      "clientPhone": "987-654-3210"
    },
    "additionalNotes": "Updated notes for the quote.",
    "status": "Finalized",
    "components": [
      {
        "componentId": 1,
        "quantity": 2,
        "length_mm": 450.0,
        "width_mm": 2020.0,
        "height_mm": 560.0,
        "selected_finish": "matt laminate",
        "features": []
      }
    ]
  }
  ```
- **Success Response (Status: 200 OK - JSON):**
  ```json
  {
    "message": "Order updated successfully!",
    "orderId": 123,
    "calculatedGrandTotal": 320000.0
  }
  ```
- **Error Response (Status: 400 Bad Request, 403 Forbidden, 404 Not Found, 500 Internal Server Error - JSON):**
  ```json
  {
    "message": "Validation error: Invalid component details."
  }
  ```
- **Authentication/Authorization:** Requires Authentication. User can only update orders they created (or an admin any order).

### 3.4. Delete Order

- **Purpose:** Allows a user to delete an existing order. (Consider implementing "soft delete" by changing `status` to 'Cancelled' instead of permanent deletion).
- **Method:** `DELETE`
- **URL:** `/api/orders/:orderId`
- **Request Body:** None.
- **Success Response (Status: 204 No Content or 200 OK - JSON):**
  - `204 No Content` is standard for successful deletion where no content is returned.
  - Alternatively, `200 OK` with a message:
    ```json
    {
      "message": "Order deleted successfully!"
    }
    ```
- **Error Response (Status: 403 Forbidden, 404 Not Found, 500 Internal Server Error - JSON):**
  ```json
  {
    "message": "Order not found or you are not authorized to delete it."
  }
  ```
- **Authentication/Authorization:** Requires Authentication. User can only delete orders they created (or an admin any order).

### 3.5. Generate PDF Sales Agreement

- **Purpose:** Generates a downloadable PDF of the sales agreement for a specific order.
- **Method:** `GET`
- **URL:** `/api/orders/:orderId/pdf`
- **Request Body:** None.
- **Success Response (Status: 200 OK - File Download):**
  - The backend will send the PDF file directly. The `Content-Type` header will be `application/pdf`. The frontend will trigger a file download in the browser.
- **Error Response (Status: 404 Not Found, 500 Internal Server Error - JSON):**
  ```json
  {
    "message": "Error generating PDF or order not found."
  }
  ```
- **Authentication/Authorization:** Requires Authentication. User can only generate PDFs for orders they created (or an admin any order).

---
