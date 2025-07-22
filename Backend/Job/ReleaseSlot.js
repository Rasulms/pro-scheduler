const cron = require('node-cron');
const BookingSchema = require('../Models/Booking.js');

// Run every minute
cron.schedule('* * * * *', async () => {
  const expiryTime = new Date(Date.now() - 3 * 60 * 1000); 

  try {
    const bookings = await BookingSchema.find({
      bookingStatus: { $in: ['pending', 'failed'] },
      createdAt: { $lte: expiryTime }
    });

    for (const booking of bookings) {        
      await BookingSchema.findByIdAndDelete(booking._id);
     
    //   console.log(`Auto-released slot ${booking.userId} from expired booking ${booking._id}`);
    }

  } catch (err) {
    console.error('Error during auto-release cron job:', err.message);
  }
});

module.exports = () => console.log('Auto-release job scheduled');
