import Razorpay from 'razorpay';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Payment from '../models/payment.model.js';
import Listing from '../models/listing.model.js'; // Ensure this is the correct path for your Listing model

// Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_eeEFhBGZty1HYQ', // Replace with your Razorpay Key ID
  key_secret: 'Z5BSyEojBc4sj4l4itArw1yc',    // Replace with your Razorpay Key Secret
});

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { amount, plan } = req.body;

    if (!amount  || !plan) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const options = {
      amount, // Amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,

    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};



// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const {  plan, paymentId, orderId, signature } = req.body;

    // Decode the JWT token to get the userId
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, 'secretkeyofrealestateapp123@#'); // Use environment variable for the secret key
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing userId in the token.' });
    }

    // Validate request body
    if ( !plan || !paymentId || !orderId || !signature) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Verify the Razorpay signature
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', 'Z5BSyEojBc4sj4l4itArw1yc') // Use environment variable
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Check if the listing exists
    // const listing = await Listing.findById(listingId);
    // if (!listing) {
    //   return res.status(404).json({ message: 'Listing not found' });
    // }

    // Calculate the amount based on the plan
    const planPrices = {
      '1 Month': 499,
      '2 Months': 799,
      '3 Months': 999,
    };

    const amount = planPrices[plan];
    if (!amount) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    // Check if the payment already exists
    const existingPayment = await Payment.findOne({ paymentId });
    if (existingPayment) {
      return res.status(409).json({ message: 'Payment already recorded.' });
    }

    // Create the payment entry
    const payment = new Payment({
      userId,
      //listingId,
      plan,
      amount,
      paymentId,
      orderId,
      signature,
    });

    await payment.save();

    res.status(200).json({ 
      message: 'Payment verified and recorded successfully', 
      payment 
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const { listingId, plan, paymentId, orderId, amount } = req.body;

    // Validate request body
    if (!listingId || !plan || !paymentId || !orderId || !amount) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Check if the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check for duplicate payment
    const existingPayment = await Payment.findOne({ paymentId });
    if (existingPayment) {
      return res.status(409).json({ message: 'Payment already recorded.' });
    }

    // Create the payment entry
    const payment = new Payment({
      listingId,
      plan,
      amount,
      paymentId,
      orderId,
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment,
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ message: 'Failed to record payment', error: error.message });
  }
};
