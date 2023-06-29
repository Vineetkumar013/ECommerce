const User = require("../Model/userModel");


//////////////////////////////// ADD MONEY ////////////////////////////////

const addMoney = async (req, res) => {
  const { userId } = req.params;
  const { balance } = req.body;
  try {
    // Check if the user has a wallet
    const wallet = await User.findOne({ userId });
    if (!wallet) {
      throw new Error("User not found");
    }
    // Add money to the wallet
    wallet.balance += balance;
   await wallet.save();
    res.status(200).json({
    data: wallet,
    success: true,
    message: `${balance} added to wallet`,
    status:200
  });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//////////////////////////////// GET MONEY ////////////////////////////////

const getWallet = async (req, res) => {
  const { userId } = req.params;
  try {
    const wallet = await User.findOne({ userId}).select('balance');
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json(wallet);
  } catch (err) {
    console.error('Error retrieving wallet:', err);
    res.status(500).json({ error: 'Error retrieving wallet' });
  }
}

//////////////////////////////// DELETE MONEY ////////////////////////////////

const deleteWallet = async (req, res) => {
  const { userId } = req.params;

  try {
    const wallet = await User.findOneAndDelete({ userId }).select('balance');

    if (!wallet) {
      return res.status(404).json({ data:wallet, error: 'Wallet not found' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting wallet:', err);
    res.status(500).json({ error: 'Error deleting wallet' });
  }
};

module.exports = {
  addMoney,
  getWallet,
  deleteWallet
}