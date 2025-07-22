# Web Application Flow & Page Skeleton

This document describes the user journey and the main pages (views) of the Kinternationals Estimate Software frontend application.

---

## 1. User Authentication Flow

### 1.1. Login Page

* **URL:** `/login`
* **Primary Function:** Allows users to log into the application.
* **Key UI Elements:**
    * Username input field.
    * Password input field.
    * "Login" button.
* **API Interactions:**
    * `POST /api/auth/login` (on login button click)

---

## 2. Main Application Flow

### 2.1. Dashboard / Home Page

* **URL:** `/dashboard` or `/home` (e.g., `/`)
* **Primary Function:** Serves as the landing page after successful login, offering users the primary choices to proceed.
* **Key UI Elements:**
    * Welcome message (e.g., "Welcome, [Username]!").
    * "Create New Estimate" button/link.
    * "View Existing Estimates" button/link.
    * "Change Password" button/link (triggers an overlay modal).
    * "Logout" button.
* **API Interactions:**
    * (Initial fetch of user data from token if needed)
    * `PUT /api/users/:userId/password` (triggered by password change modal submission, followed by client-side logout).

### 2.2. View Existing Orders Page (Orders List)

* **URL:** `/orders`
* **Primary Function:** Displays a list of all estimates (draft and finalized) created by the logged-in user, with options to view, edit, or print. Also allows filtering the list.
* **Key UI Elements:**
    * Search/Filter bar (for client-side filtering by Quote No., Client Name, Status, etc.).
    * Table/List of Orders, displaying summary info for each:
        * Quote No.
        * Client Name
        * Quote Date
        * Grand Total
        * Status
        * Action buttons for each row: "View", "Edit", "Print", "Delete".
* **API Interactions:**
    * `GET /api/orders` (on page load to fetch the list of orders for the authenticated user)
    * `GET /api/orders/:orderId` (triggered by "View" or "Edit" buttons to fetch full order details)
    * `DELETE /api/orders/:orderId` (triggered by "Delete" button)
    * `GET /api/orders/:orderId/pdf` (triggered by "Print" button)

---

## 3. Order Creation & Detail Flow

### 3.1. Create New Estimate / Edit Estimate Page

* **URL:** `/orders/new` (for new estimate) or `/orders/:orderId/edit` (for editing existing)
* **Primary Function:** Allows users to build a new estimate by adding components and features, inputting dimensions/quantities, viewing the calculated total, and finally saving/finalizing the order. Used for both creating new and editing existing draft orders.
* **Key UI Elements:**
    * Client Information section (Name, Address, Phone - editable for new/draft orders).
    * **Category-based Component Addition Sections (e.g., Shutters, Cabinets, Accessories, Hardware):**
        * Dropdown/Search for `Components` within the specific category (filtered using `component.category` from `GET /api/components`).
        * Input fields for `Quantity`, `Length`, `Width`, `Height` (conditionally visible based on component's `price_unit_type`).
        * Dropdown/Multi-select for `FeaturesAndFinishes` (Add-ons for components like Cabinets, filtered from `GET /api/features`).
        * "Add to List" button for each component.
    * List of Added Components (Order Items):
        * Displays component name, quantity, dimensions, selected finish, and applied features.
        * Options to remove/edit individual items from the list.
    * "Calculated Total" display area.
    * "Calculate Price" button (to get updated total).
    * "Save Estimate" button (for saving as 'Draft' or 'Finalized').
    * (Optional: "Cancel" button to abandon changes).
* **API Interactions:**
    * `GET /api/components` (on page load for component selection dropdowns).
    * `GET /api/features` (on page load for add-on feature selection).
    * `GET /api/orders/:orderId` (on page load if editing an existing order).
    * `POST /api/orders` (on "Calculate Price" and "Save Estimate" button clicks for new orders).
    * `PUT /api/orders/:orderId` (on "Save Estimate" button click if editing an existing order).

### 3.2. View Order Details Page

* **URL:** `/orders/:orderId`
* **Primary Function:** Displays all comprehensive details of a specific, saved order. This is primarily a read-only view.
* **Key UI Elements:**
    * Order Summary (Quote No., Date, Client Info, Grand Total, Status, Notes).
    * Detailed list of all `OrderItems`:
        * Component Name, Category.
        * Quantity, Dimensions.
        * Selected Finish.
        * List of Applied Features/Add-ons.
    * "Edit Order" button (navigates to `/orders/:orderId/edit`).
    * "Print PDF" button.
* **API Interactions:**
    * `GET /api/orders/:orderId` (on page load to fetch all details).
    * `GET /api/orders/:orderId/pdf` (on "Print PDF" button click).

---

## 4. Web Application Flowchart

```mermaid
graph TD
    A[Start] --> B(Login Page);
    B --> |Successful Login| C(Dashboard / Home Page);
    C --> |Click "Create New Estimate"| D(Create New Estimate Page);
    C --> |Click "View Existing Estimates"| E(View Existing Orders Page);
    C --> |Click "Change Password"| F(Change Password Modal);

    D --> |Add Components, Calculate| D;
    D --> |Save Estimate (Draft/Final)| E;

    E --> |Select Order / Click "View"| G(View Order Details Page);
    E --> |Select Order / Click "Edit"| D_Edit(Edit Estimate Page);
    E --> |Select Order / Click "Print"| H(PDF Download);
    E --> |Select Order / Click "Delete"| E;

    D_Edit --> |Update Components, Recalculate| D_Edit;
    D_Edit --> |Save Estimate (Update)| E;

    G --> |Click "Edit Order"| D_Edit;
    G --> |Click "Print PDF"| H;

    F --> |Password Changed Successfully| B;

    C --> |Click "Logout"| B;
    G --> |Navigate back| E;
    D --> |Navigate back/Cancel| C;
    D_Edit --> |Navigate back/Cancel| E;