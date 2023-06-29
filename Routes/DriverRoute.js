const express = require('express');
const driver_Controllers = require('../Controller/DriverCtrl')

const router = express();

router.post('/sendotp', driver_Controllers.sendOtp);
router.post('/verify', driver_Controllers.accountVerificationOTP );
router.put('/update/:id', driver_Controllers.AddDeriverDetails);
router.post('/addOrder', driver_Controllers.AssignOrdertoDriver);
router.post('/accept/:id', driver_Controllers.DriverAccept);
router.post('/reject/:id', driver_Controllers.DriverReject);
router.get('/alldriver', driver_Controllers.AllDrivers);
router.get('/allorders/:id', driver_Controllers.DriverAllOrder )
router.delete('/delete/order/:id', driver_Controllers.DeleteAssignOrder);
router.get('/price/:driverId', driver_Controllers.GetPriceByDriverId);
router.post('/complete/:id',driver_Controllers.DeliveredOrder);
router.post('/logout', driver_Controllers.logout);
router.get('/delivered/:driverId', driver_Controllers.driverCompleted)
router.get('/pending/order/:id',driver_Controllers.PendingOrder )
router.get('/accept/order/:id', driver_Controllers.AcceptOrder)
router.delete('/:id', driver_Controllers.DeleteDriver);
router.post('/status/:id', driver_Controllers.ChangeStatus)



module.exports = router;