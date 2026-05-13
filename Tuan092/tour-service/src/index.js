import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 8082);

app.use(cors());
app.use(express.json());

const tours = [
    {
        id: '1',
        name: 'Da Lat 3N2D',
        location: 'Da Lat',
        price: 1500000,
        duration: '3 days 2 nights',
        description: 'Fresh mountain air, waterfalls, and coffee farms.'
    },
    {
        id: '2',
        name: 'Phu Quoc Beach Escape',
        location: 'Phu Quoc',
        price: 3200000,
        duration: '4 days 3 nights',
        description: 'Island resort tour with seafood and sunset cruises.'
    },
    {
        id: '3',
        name: 'Ha Long Heritage Tour',
        location: 'Ha Long',
        price: 2800000,
        duration: '2 days 1 night',
        description: 'Cruise the bay and explore the limestone caves.'
    }
];

app.get('/health', (_, response) => {
    response.json({ service: 'tour-service', status: 'ok' });
});

app.get('/tours', (_, response) => {
    response.json({ success: true, tours });
});

app.get('/tours/:id', (request, response) => {
    const tour = tours.find((item) => item.id === request.params.id);

    if (!tour) {
        return response.status(404).json({ success: false, message: 'Tour not found' });
    }

    return response.json({ success: true, tour });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`tour-service listening on ${port}`);
});
