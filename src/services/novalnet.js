'use strict';

const axios = require('axios');

module.exports = {
  async initiatePayment(orderData) {
    try {
      const payload = {
        merchant: {
          signature: process.env.NOVALNET_API_KEY,
        },
        customer: {
          first_name: orderData.firstName,
          last_name: orderData.lastName,
          email: orderData.email,
        },
        transaction: {
          amount: orderData.amount * 100, // in cents
          currency: 'EUR',
          payment_type: 'CREDITCARD', // or 'PAYPAL', 'INVOICE', etc.
          test_mode: 1,
        },
        custom: {
          lang: 'DE',
        },
      };

      const response = await axios.post(
        process.env.NOVALNET_PAYMENT_URL,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      return response.data;
    } catch (error) {
      console.error('Novalnet error:', error.response?.data || error.message);
      throw error;
    }
  },
};