const axios = require('axios');

async function test() {
    console.log('--- API DELETE TEST ---');
    try {
        // 1. Login
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token acquired.');

        // 2. Create Sweet
        const createRes = await axios.post('http://localhost:3000/api/sweets', {
            name: 'Delete Me Sweet',
            category: 'Test',
            price: 1.00,
            quantity: 10
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const sweetId = createRes.data.id;
        console.log(`Sweet created: ${sweetId}`);

        // 3. Delete Sweet
        await axios.delete(`http://localhost:3000/api/sweets/${sweetId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('SUCCESS: Sweet deleted via API.');

    } catch (e) {
        console.log('FAILURE: API Test Failed.');
        if (e.response) {
            console.log(`Status: ${e.response.status}`);
            console.log(`Data: ${JSON.stringify(e.response.data)}`);
        } else {
            console.error(e.message);
        }
    }
}

test();
