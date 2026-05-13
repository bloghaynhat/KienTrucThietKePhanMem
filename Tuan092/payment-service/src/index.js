import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 8084);

app.use(cors());
app.use(express.json());

const payments = [];

function isPaymentSuccessful() {
    return Math.random() >= 0.35;
}

app.get('/health', (_, response) => {
    response.json({ service: 'payment-service', status: 'ok' });
});

app.post('/payments', (request, response) => {
    const { bookingId, amount, userId, tourId } = request.body;

    if (!bookingId || !amount || !userId || !tourId) {
        return response.status(400).json({ success: false, message: 'Missing payment data' });
    }

    const success = isPaymentSuccessful();
    const payment = {
        id: `PAY-${Date.now()}`,
        bookingId,
        amount: Number(amount),
        userId,
        tourId,
        status: success ? 'SUCCESS' : 'FAILED',
        transactionId: success ? `TX-${Math.random().toString(36).slice(2, 10).toUpperCase()}` : null,
        paidAt: new Date().toISOString()
    };

    payments.push(payment);

    if (!success) {
        return response.status(200).json({ success: false, payment, message: 'Payment failed. Please try again.' });
    }

    return response.status(201).json({ success: true, payment, message: 'Payment completed successfully' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`payment-service listening on ${port}`);
});
