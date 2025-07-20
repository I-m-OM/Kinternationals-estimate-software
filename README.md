# 🏡 Kinternationals Estimate Software

## 🚀 Project Overview

The Kinternationals Estimate Software is an online tool designed to streamline and automate the process of generating kitchen estimates and sales agreements for clients. This application will allow company sales executives and dealer staff to quickly configure kitchen components, calculate total prices securely, and generate professional PDF sales agreements.

**Key Problems Solved:**
* Automates manual quotation procedures.
* Ensures accurate pricing based on component dimensions, quantities, and finishes.
* Provides role-based pricing (Company vs. Dealer rates).
* Generates comprehensive sales agreements in PDF format.
* Protects sensitive pricing data by keeping all calculations server-side.

## ✨ Core Features

* **User Authentication & Authorization:**
    * Secure login and sign-up for Company Sales Executives and Dealer Staff.
    * Role-based access to different pricing tiers.
* **Order Management:**
    * Create new kitchen estimates/orders.
    * View, edit, and search existing estimates.
    * Store client details associated with each order.
* **Dynamic Quotation Generation:**
    * Intuitive interface for selecting kitchen components (shutters, carcasses, accessories, hardware).
    * Input fields for component dimensions, quantities, and selected finishes.
    * **Backend-driven price calculation:** The system will fetch component prices based on the logged-in user's role (Company or Dealer), dimensions, and finishes.
    * **Only the total grand price will be displayed to the user.** Individual component prices will remain hidden for negotiation purposes and security.
* **PDF Sales Agreement Generation:**
    * Generate downloadable PDF documents of the final sales agreement.
    * PDFs will include ordered component details (without individual prices), the grand total price, and pre-defined Terms & Conditions.

## 🛠️ Tech Stack

This project will be built using a modern and highly relevant web development stack:

* **Frontend:** **React**
    * A JavaScript library for building interactive user interfaces.
    * Will handle all user interactions, forms, and display logic.
* **Backend:** **Node.js (with Express.js)**
    * Node.js allows JavaScript to be used on the server-side.
    * Express.js is a minimalist web framework for building RESTful APIs, handling business logic, database interactions, and secure price calculations.
* **Database:** **PostgreSQL**
    * A powerful, open-source relational database.
    * Ideal for securely storing structured data such as user accounts, component definitions, sensitive pricing data, and order details.
* **Authentication:** **JWT (JSON Web Tokens)**
    * For secure and stateless user authentication.
    * `bcrypt` for password hashing.
* **PDF Generation:** **Puppeteer** (or similar Node.js-based library)
    * Will be integrated into the backend to render dynamic HTML content into PDF sales agreements.

## 📋 Project Phases & Progress

This section will track our progress through the various stages of development.

### Phase 1: Planning & Setup (Initial Draft - **CURRENT FOCUS**)
-   [x] Define core project requirements and features.
-   [x] Establish GitHub repository.
-   [x] Initial brainstorming and high-level architecture planning.
-   [x] Decision on core tech stack (Node.js/Express, React, PostgreSQL).
-   [ ] **Detailed Database Schema Design.**
-   [ ] **API Endpoint Planning and Documentation.**
-   [ ] Basic project scaffolding (empty React app, empty Express server).

### Phase 2: Backend Core - User Management & Database Initialization
-   [ ] Set up PostgreSQL database and connect from Node.js.
-   [ ] Define and implement User model/schema.
-   [ ] Implement user registration (Company & Dealer).
-   [ ] Implement user login and JWT authentication.
-   [ ] Implement role-based authorization middleware.
-   [ ] Securely seed initial pricing data into the database (this might be a manual import or a simple script).

### Phase 3: Backend Core - Component & Pricing Logic
-   [ ] Design and implement Component model/schema.
-   [ ] Design and implement Pricing model/schema (ensuring secure storage and retrieval based on roles).
-   [ ] Implement API endpoints for fetching component definitions (without prices).
-   [ ] Implement core price calculation logic on the backend, considering dimensions, quantity, finish, and user role.

### Phase 4: Frontend - Authentication & Basic Dashboard
-   [ ] Set up React project structure and routing.
-   [ ] Build user login and signup forms.
-   [ ] Integrate frontend with backend authentication APIs.
-   [ ] Implement JWT storage and handling in the frontend.
-   [ ] Develop a basic dashboard/home page for authenticated users, showing their role.

### Phase 5: Frontend - Order Creation & Calculation Display
-   [ ] Build UI for creating a new order/estimate.
-   [ ] Implement dynamic forms for adding components (search/dropdown, dimension inputs, quantity, finish selection).
-   [ ] Integrate with backend APIs to send component details for calculation.
-   [ ] Display the grand total price returned from the backend (ensuring individual prices are never shown).
-   [ ] Implement saving the order as a draft.

### Phase 6: Frontend/Backend - Order Management & PDF Generation
-   [ ] Implement UI for viewing and editing existing orders.
-   [ ] Implement backend API for retrieving saved order details.
-   [ ] Implement backend PDF generation logic using Puppeteer (or similar) to create sales agreements.
-   [ ] Create API endpoint for downloading the generated PDF.
-   [ ] Build a button/feature in the frontend to trigger PDF generation and download.
-   [ ] Integrate the provided T&Cs from `127.pdf` into the PDF generation template.

### Phase 7: Polish, Testing & Deployment
-   [ ] Implement comprehensive error handling for both frontend and backend.
-   [ ] Add input validation on both frontend and backend.
-   [ ] Write unit and integration tests for critical backend logic (especially pricing).
-   [ ] Implement basic user interface improvements and responsiveness for laptops.
-   [ ] Prepare for deployment (e.g., set up environment variables, build scripts).
-   [ ] Deploy the application to a cloud platform (e.g., Render, Vercel for frontend, Render/Railway for backend).

## 📈 Current Status

*We are currently in **Phase 1: Planning & Setup**. The core project requirements are defined, the tech stack is chosen, and the GitHub repository is established. Our immediate focus is on **detailed database schema design** and **API endpoint planning**.*

## 🛣️ Next Steps

1.  **Detailed Database Schema Design:** Define exact tables, columns, data types, and relationships for Users, Components, Pricing, Orders, and Order Items in PostgreSQL.
2.  **API Endpoint Planning:** Document the specific HTTP methods, URLs, request bodies, and response structures for all necessary backend APIs.

---

## 🤝 Contribution Guidelines

This is a solo project for learning purposes.

## 📞 Contact

* **GitHub:** [I-m-OM](https://github.com/I-m-OM)
* (Add your LinkedIn or other preferred contact if you wish)

## License

[MIT License](LICENSE) - *You'll need to create a `LICENSE` file in your repo and add the MIT license text.*

---