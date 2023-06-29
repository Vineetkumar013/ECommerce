// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   transactionId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   type: {
//     type: String,
//     enum: ['credit', 'debit'],
//     required: true,
//   },
// }, { timestamps: true });

// const walletSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     unique: true,
//   },
//   balance: {
//     type: Number,
//     default: 0,
//   },
//   // transactions: [transactionSchema],
// }, { timestamps: true });

// const Wallet = mongoose.model('Wallet', walletSchema);

// module.exports = Wallet;