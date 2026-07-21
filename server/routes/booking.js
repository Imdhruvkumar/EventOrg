const express = require('express');
const router = express.router();
const {protect,admin} = require('../middlewere/auth');
const {bookEvent,getMyBookings,cancelBooking,confirmBooking,sendBookingOtp} =  require('../controllers/bookingController');


router.post('/',protect,bookEvent);
router.post('/send-otp',protect,sendBookingOtp);
router.get('/my',protect,getMyBookings);
router.put('/:id/confirm',protect,admin,confirmBooking);
router.delete('/:id',protect,cancelBooking);

module.exports = router;