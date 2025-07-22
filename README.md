# Proscheduler

FolderStructure:
pro-scheduler/
├── Backend/               # Express server
├── Frontend_Scheduler/   # React frontend using Vite
└── README.md

🖥️ Prerequisites
Make sure you have installed:

1.Node.js (v16 or later)
2.MongoDB (local or Atlas)
3.npm (comes with Node.js)

**Instruction to run backend Server**

1.Open CMD from Backend Directory 
2.Install dependencies: - npm install
3.Start your Backend server: - npm start
The backend server will run at:
👉 http://localhost:5000

**💻 Running the Frontend (React + Vite)**

1.Open CMD from Frontend Directory 
2.Install dependencies: - npm install
3.Start your Frontend server: - npm run dev
The Frontend will run at:
👉 http://localhost:5173

**🧱 Architectural Choices**
This section outlines the key frameworks, libraries, and architectural design decisions made for both the frontend and backend of the Pro Scheduler booking system.

🔹 **Frontend**
> Framework: React with Vite
> UI Library: Toast Library
> Routing: React Router DOM
> HTTP Client: Axios
> State Management: React hooks (useState, useEffect)

✅ Why These Choices?
> React was chosen for its component-based architecture and ease of building dynamic, interactive UIs.
> Vite was used over Create React App due to its faster development and build time.
> Axios offers promise-based, cleaner API request handling than native fetch.
> React Router DOM enables client-side navigation between routes like home, booking, and provider dashboard.

🔹 **Backend**
> Framework: Express.js
> Database: MongoDB with Mongoose
> Environment Variables: dotenv

Other Libraries:

> cors – Handle cross-origin requests
> nodemon – Dev server auto-reloading

✅ Why These Choices?

> Express.js provides a minimal, unopinionated web framework that’s perfect for building RESTful APIs.
> MongoDB allows for flexible, document-oriented storage of appointment, provider, and user data.
> Mongoose offers schema definitions and validations that simplify interaction with MongoDB.

📅 **Booking Flow Design**
This section outlines the logic and API interactions behind the slot booking system, including how we handle booking state , payment flow (mock/extendable), and abandoned slot cleanup.

🧩 **High-Level Booking Flow**

1. User selects a provider:
> From the frontend interface, the user begins by selecting a provider from a dropdown menu.

2. Real-time slot availability:
> Once a provider is selected, the system fetches and displays all currently available slots for that provider, ensuring up-to-date availability.

3. Slot selection and booking modal:
> When the user selects a desired slot, a modal appears prompting them to enter their username (or required booking details).

4. Booking initiation ("Proceed to Pay"):
> On clicking “Proceed to Pay”, a POST request is made to the backend to create a booking.
> If the slot is still available (not already booked), a booking is created with status pending, and the user is redirected to the payment page.
> If the slot has already been booked (race condition), a toast notification informs the user: "Slot already booked. Please select another slot."

5. Payment processing:
On the payment page:
> If the payment succeeds, the booking is updated to confirmed, and the user is shown a toast notification confirming the successful payment.
> If the payment fails, the booking status is updated to failed, and the slot remains unavailable until it is released.

6. Handling inactivity / abandoned bookings:
> If no payment or user confirmation is received within a predefined timeout (e.g. 3 minutes), a background cleanup job automatically marks the booking as cancelled, freeing the slot for others to book.

🔐 **Slot Locking Strategy**
To prevent race conditions and ensure fair, atomic booking:

1. Slot marked as pending on booking creation:
> When a booking is initiated via /api/bookings, the selected slot is immediately marked with status pending in the database. This effectively locks the slot for the duration of the payment window.

2. Slot remains locked during pending or confirmed state:
> A slot is treated as unavailable while its status is either:
  > pending (awaiting payment or confirmation)
  > confirmed (successfully booked)

3. Slot release mechanism:
> If the status transitions to cancelled (due to timeout) or failed (payment error), the slot becomes available again.
> This auto-release ensures maximum slot utilization while avoiding overbooking.

4. Concurrency handling:
> The system checks for real-time availability before creating a booking. If a slot is already locked by another user, the backend prevents double-booking and responds with an appropriate error message.
