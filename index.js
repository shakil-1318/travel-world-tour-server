const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;



const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssi7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("online_ticket");
        const serviceCollection = database.collection('services');
        const bookingCollection = database.collection('bookings');

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result)
        })
        // GET SERVICES API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // single get product
        app.get('/singleService/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })

        // confirm order post api
        app.post('/confirmOrder', async (req, res) => {
            const result = await bookingCollection.insertOne(req.body)
            res.send(result)
        })

        // myOrder get api
        app.get('/myOrders/:email', async (req, res) => {
            const result = await bookingCollection.find({ email: req.params.email }).toArray();
            res.send(result);

        })

        // deleteorder api
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })


        // myOrder get api
        app.get('/allOrders', async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);

        })

        // update status api
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body.status;
            const filter = { _id: ObjectId(id) };
            const result = await bookingCollection.updateOne(filter, {
                $set: { status: updateStatus }
            })
            res.send(result);
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('travel side server');
})
app.listen(port, () => {
    console.log('server running at port', port);
})