const Schedule = require("../Model/myScheduleModel");
// const User = require

/////////////////////////////////////// ORDER SCHEDULE //////////////////////////////////

const orderSchedule = async (req, res) => {
  const userId = req.params.userId;
  const { date } = req.body;

  const existingOrder = await Schedule.findOne({ userId, date });
  if (existingOrder) {
    return res.status(409).json({ error: 'An order already exists for this user and date.' });
  }

  const newScheduleOrder = new Schedule({
    userId,
    date
  });

  try {
    await newScheduleOrder.save();
    res.status(201).json({
      data: newScheduleOrder,
      message: 'Order Schedule Successfully Created',
      status: 200
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to schedule the order.' });
  }
}

//////////////////////////////////////////// GET SCHEDULE //////////////////////////////////

const getSchedule = async (req, res) => {
  const id = req.params.id;
  try {
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }
    res.status(200).json({
      data: schedule,
      message: 'Schedule successfully retrieved.',
      status: 200
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve schedule order.' });
  }
};

module.exports = {
  orderSchedule,
  getSchedule
}