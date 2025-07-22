// Import mongoose to define schema and create model
const mongoose = require('mongoose');

// Define the Provider schema
const ProviderSchema = new mongoose.Schema({
  // Name of the service provider
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Array of available time windows (repeats weekly based on day of the week)
  availableTimeWindows: [
    {
      // Day of the week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      dayOfWeek: {
        type: Number,
        required: true,
        min: 0,
        max: 6
      },

      // Start time of availability (e.g., "09:00")
      startTime: {
        type: String,
        required: true
      },

      // End time of availability (e.g., "17:00")
      endTime: {
        type: String,
        required: true
      }
    }
  ]
});

// Export the Provider model so it can be used in routes/controllers
module.exports = mongoose.model('Provider', ProviderSchema);
