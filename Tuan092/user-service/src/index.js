import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 8081);

app.use(cors());
app.use(express.json());

const users = [
    { id: '1', username: 'admin', password: '123456', name: 'Admin User', email: 'admin@gmail.com' },
    { id: '2', username: 'minhduc', password: '123456', name: 'Minh Duc', email: 'minhduc@gmail.com' },
    { id: '3', username: 'linhtran', password: '123456', name: 'Linh Tran', email: 'linhtran@gmail.com' }
];

function withoutPassword(user) {
    if (!user) {
        return null;
    }

    const { password, ...safeUser } = user;
    return safeUser;
}

app.get('/health', (_, response) => {
    response.json({ service: 'user-service', status: 'ok' });
});

app.post('/login', (request, response) => {
    const { username, password } = request.body;
    const user = users.find((item) => item.username === username && item.password === password);

    if (!user) {
        return response.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    return response.json({ success: true, user: withoutPassword(user) });
});

app.get('/users/:id', (request, response) => {
    const user = users.find((item) => item.id === request.params.id);

    if (!user) {
        return response.status(404).json({ success: false, message: 'User not found' });
    }

    return response.json({ success: true, user: withoutPassword(user) });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`user-service listening on ${port}`);
});
