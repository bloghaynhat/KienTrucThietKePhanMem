import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 8080);

const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8081';
const tourServiceUrl = process.env.TOUR_SERVICE_URL || 'http://localhost:8082';
const bookingServiceUrl = process.env.BOOKING_SERVICE_URL || 'http://localhost:8083';
const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:8084';

app.use(cors());
app.use(express.json());

async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

app.get('/health', (_, response) => {
    response.json({ service: 'orchestrator-service', status: 'ok' });
});

app.post('/login', async (request, response) => {
    try {
        const data = await requestJson(`${userServiceUrl}/login`, {
            method: 'POST',
            body: JSON.stringify(request.body)
        });

        response.json(data);
    } catch (error) {
        response.status(error.status || 500).json({ success: false, message: error.message });
    }
});

app.get('/tours', async (_, response) => {
    try {
        const data = await requestJson(`${tourServiceUrl}/tours`);
        response.json(data);
    } catch (error) {
        response.status(error.status || 500).json({ success: false, message: error.message });
    }
});

app.get('/tours/:id', async (request, response) => {
    try {
        const data = await requestJson(`${tourServiceUrl}/tours/${request.params.id}`);
        response.json(data);
    } catch (error) {
        response.status(error.status || 500).json({ success: false, message: error.message });
    }
});

app.post('/book-tour', async (request, response) => {
    const { userId, tourId, travelDate, participants } = request.body;

    if (!userId || !tourId) {
        return response.status(400).json({ success: false, message: 'userId and tourId are required' });
    }

    try {
        const userResponse = await requestJson(`${userServiceUrl}/users/${userId}`);
        const tourResponse = await requestJson(`${tourServiceUrl}/tours/${tourId}`);

        const user = userResponse.user;
        const tour = tourResponse.tour;
        const bookingResponse = await requestJson(`${bookingServiceUrl}/bookings`, {
            method: 'POST',
            body: JSON.stringify({
                userId: user.id,
                userName: user.name,
                tourId: tour.id,
                tourName: tour.name,
                travelDate,
                participants,
                amount: tour.price * Number(participants || 1)
            })
        });

        const booking = bookingResponse.booking;
        const paymentResponse = await requestJson(`${paymentServiceUrl}/payments`, {
            method: 'POST',
            body: JSON.stringify({
                bookingId: booking.id,
                amount: booking.amount,
                userId: user.id,
                tourId: tour.id
            })
        }).catch((error) => ({ success: false, message: error.message, payment: null }));

        const success = Boolean(paymentResponse.success);

        response.status(success ? 200 : 200).json({
            success,
            message: success
                ? 'Tour booking completed successfully'
                : 'Booking created but payment failed',
            user,
            tour,
            booking,
            payment: paymentResponse.payment || null,
            paymentMessage: paymentResponse.message || null
        });
    } catch (error) {
        response.status(error.status || 500).json({ success: false, message: error.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`orchestrator-service listening on ${port}`);
});
