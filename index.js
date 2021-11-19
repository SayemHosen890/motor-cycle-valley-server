const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjjoy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('motor-bike');
        const bikeCollection = database.collection('bikes');
        const ordersCollection = database.collection('orders')
        // Query for a movie that has the title 'Back to the Future'
        //   const query = { title: 'Back to the Future' };
        //   const movie = await movies.findOne(query);
        //   console.log(movie);

        //get api bike
        app.get('/services', async (req, res) => {
            const cursor = bikeCollection.find({}).limit(6);
            const bike = await cursor.toArray();
            res.send(bike)
        })

        //get api for al bikes
        app.get('/services/all', async (req, res) => {
            const cursor = bikeCollection.find({});
            const bikes = await cursor.toArray();
            res.send(bikes)
        })

        //for get order
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const bikeOrders = await cursor.toArray();
            res.send(bikeOrders);
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result)
        })

        //post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the api', service);
            const result = await bikeCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })
    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Bikers!')
})

app.listen(port, () => {
    console.log(`Listening the bikers ${port}`)
})