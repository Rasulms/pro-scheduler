// Import Mongoose for schema definition and model creation
const mongoose = require('mongoose');

// Define the Booking Schema
const BookingSchema = new mongoose.Schema(
  {
    // ID of the user who is booking (could be stored as a string for simplicity)
    userId: {
      type: String,
      required: true
    },

    // Reference to the provider who is being booked
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true
    },

    // Date of the booking (format: "YYYY-MM-DD" recommended)
    date: {
      type: String,
      required: true
    },

    // Time of the booking (format: "HH:mm" recommended)
    time: {
      type: String,
      required: true
    },

    // Status of the booking
    bookingStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'], // Enum restricts to these values only
      default: 'pending' 
    }

  },
  {
    // Automatically adds createdAt and updatedAt timestamps to each document
    timestamps: true
  }
);

// Export the Booking model to be used in routes/controllers
module.exports = mongoose.model('Booking', BookingSchema);
