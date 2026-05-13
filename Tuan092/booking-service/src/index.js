import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 8083);

app.use(cors());
app.use(express.json());

const bookings = [];

app.get('/health', (_, response) => {
    response.json({ service: 'booking-service', status: 'ok' });
});

app.post('/bookings', (request, response) => {
    const { userId, userName, tourId, tourName, travelDate, participants, amount } = request.body;

    if (!userId || !tourId || !tourName) {
        return response.status(400).json({ success: false, message: 'Missing booking data' });
    }

    const booking = {
        id: `BK-${Date.now()}`,
        userId,
        userName,
        tourId,
        tourName,
        travelDate: travelDate || null,
        participants: Number(participants || 1),
        amount: Number(amount || 0),
        status: 'PENDING_PAYMENT',
        createdAt: new Date().toISOString()
    };

    bookings.push(booking);
    return response.status(201).json({ success: true, booking });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`booking-service listening on ${port}`);
});
