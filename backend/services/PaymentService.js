const midtransClient = require('midtrans-client');

class PaymentService {
  constructor() {
    this.snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY
    });

    this.core = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });
  }

  async createTransaction(parameter) {
    try {
      const transaction = await this.snap.createTransaction(parameter);
      return transaction.token;
    } catch (error) {
      console.error('Midtrans error:', error);
      throw error;
    }
  }

  async verifyNotification(notification) {
    try {
      const statusResponse = await this.core.transaction.notification(notification);
      return statusResponse;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  }
}

module.exports = {
  PaymentService: new PaymentService()
};