// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Mongoose Schemas and Cron Job
const BookingSchema = require('./Models/Booking.js');
const ProviderSchema = require('./Models/Provider.js');
const startAutoReleaseJob = require('./Job/ReleaseSlot.js');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

const MONGOURL = process.env.MONGO_URL;
const PORT = process.env.PORT;


// Utility Function: Generate time slots between start and end time
function generateTimeSlots(start, end) {
  const slots = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);

  const current = new Date();
  current.setHours(sh, sm, 0, 0);
  const endTime = new Date();
  endTime.setHours(eh, em, 0, 0);

  while (current < endTime) {
    const hours = current.getHours();
    const minutes = current.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const displayMinute = minutes.toString().padStart(2, '0');
    const formatted = `${displayHour}:${displayMinute} ${ampm}`;

    slots.push(formatted);
    current.setMinutes(current.getMinutes() + 60);
  }

  return slots;
}

// ========================= ROUTES ============================= //

// Get provider name by ID
app.get('/providerInfo/:providerId', async (req, res) => {
  try {
    const providerData = await ProviderSchema.findById(req.params.providerId);
    if (!providerData) return res.status(404).json({ message: "Provider not found" });

    res.json({ name: providerData.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all available time slots for the next 6 days for a provider
app.get('/providers/:providerId/slots', async (req, res) => {
  try {
    const provider = await ProviderSchema.findById(req.params.providerId);
    if (!provider) return res.status(404).json({ error: "Provider not found" });

    const bookings = await BookingSchema.find({
      providerId: req.params.providerId,
      bookingStatus: 'completed',
    });

    const bookedMap = new Map(
      bookings.map((b) => [`${b.date}_${b.time}`, true])
    );

    const result = [];
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + i);

      const day = targetDate.getDay();
      const match = provider.availableTimeWindows.find(w => w.dayOfWeek === day);
      if (!match) continue;

      const dateStr = targetDate.toISOString().split('T')[0];
      const slots = generateTimeSlots(match.startTime, match.endTime);

      slots.forEach((time) => {
        const key = `${dateStr}_${time}`;

        // Skip past slots for today
        if (i === 0) {
          const [slotHour, slotMinutePart] = time.split(':');
          const [slotMinute, ampm] = slotMinutePart.split(' ');
          let hour = parseInt(slotHour, 10);
          let minute = parseInt(slotMinute, 10);

          if (ampm === 'PM' && hour !== 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;

          const slotDate = new Date(dateStr);
          slotDate.setHours(hour, minute, 0, 0);

          if (slotDate < new Date()) return;
        }

        if (!bookedMap.has(key)) {
          result.push({
            date: dateStr,
            time,
            providerId: provider._id,
          });
        }
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Initiate a booking if not already booked
app.post("/bookings/initiate", async (req, res) => {
  try {
    const { userName, providerId, date, time, bookingStatus } = req.body;

    // Check if slot already booked for provider at date/time
    const alreadyBooked = await BookingSchema.findOne({
      providerId,
      date,
      time
    });

    if (alreadyBooked) {
      return res.status(400).json({
        message: "Slot already booked for this provider at the selected time."
      });
    }

    // Create booking
    const savedBooking = await BookingSchema.create({
      userId: userName,
      providerId,
      date,
      time,
      bookingStatus
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update booking status after payment
app.post("/bookings/payment", async (req, res) => {
  const { bookingId, Payment_Status } = req.body;

  try {
    const updatedBooking = await BookingSchema.findByIdAndUpdate(
      bookingId,
      { bookingStatus: Payment_Status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Booking status updated successfully',
      updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========================= SERVER START ============================= //

mongoose.connect(MONGOURL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    startAutoReleaseJob(); // Cron job to release expired bookings
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
