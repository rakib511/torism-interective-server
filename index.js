const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middlewere
app.use(cors());
app.use(express.json());

//connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qe1gc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();

        //------------------service collection---------------------------------
        const database1 = client.db('tour_service');
        const serviceCollection = database1.collection(('services'));

        //-----------------------order collection------------------------
        const database2 = client.db('tour_orders');
        const orderCollection = database2.collection(('orders'));

        //-----------------------giurd  collection------------------------

        const database3 = client.db('giurd_collec');
        const giurdCollection = database3.collection(('giurds'));

        //-----------------------blogs  collection------------------------

        const database4 = client.db('blogs_collec');
        const blogCollection = database4.collection(('blogs'));

        //--------------------------service part start---------------------------

        //post api
        app.post('/addService',async(req,res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result.insertedId);
        });
        //get al services
        app.get('/services',async(req,res)=>{
            const result = await serviceCollection.find({}).toArray();
            res.send(result)
        })
        //get delete api
        app.delete('/deleteService/:id',async(req,res)=>{
            const id =req.params.id;
            const result = await serviceCollection.deleteOne({_id:ObjectId(id)})
            res.send(result);
        })  
        //-----------------------service part end--------------------------------


        //-----------------------update part end--------------------------------

        //get Update data
        app.get('/singleService/:id',async(req,res)=>{
            const id = req.params.id;
            const result = await serviceCollection.findOne({_id:ObjectId(id)})
            // console.log(result);
            res.send(result)
        })
        app.put("/updateSingleService/:id",async(req,res)=>{
            const id = req.params.id;
            const updatedInfo = req.body;
            const result = await serviceCollection.updateOne({_id:ObjectId(id)},{
                $set:{
                    // name:updatedInfo.name,
                    price:updatedInfo.price,
                    duration:updatedInfo.duration,
                    
                }
            })
            // console.log(result);
            res.send(result);
        })
        //---------------------end update part-------------------------------


        //--------------------------start order part--------------------------

        //order api
        app.post('/addOrder',async(req,res)=>{
            const order =req.body;
            const result =await orderCollection.insertOne(order);
            res.send(result);
        })

        //get myOrder
        app.get('/myOrder/:email',async(req,res)=>{
            const email = req.params.email;
            const result = await orderCollection.find({email: email}).toArray();
            res.send(result)
        })

        // delete order
        app.delete('/deleteOrder/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:id}
            const result = await orderCollection.deleteOne(query)
            res.send(result);
            // console.log(result);
        })

        //----------------------------end order part----------------------------
        // torist giurd part
        app.post('/addGiurd',async(req,res)=>{
            const giurd= req.body;
            const result = await giurdCollection.insertOne(giurd);
            res.send(result.insertedId);
        })
        //get giurd
        app.get('/giurds',async(req,res)=>{
            const result = await giurdCollection.find({}).toArray();
            res.send(result)
        })
        //delete giurd
        app.delete('/deleteGiurd/:id',async(req,res)=>{
            const id = req.params.id;
            const result = await giurdCollection.deleteOne({_id:ObjectId(id)});
            res.send(result);
        })


        //------------------------blogs part ----------------------------------------
        //get blogs api
        app.get('/blogs',async(req,res)=>{
            const result = await blogCollection.find({}).toArray();
            res.send(result)
        })

    }   
    finally{
        // await client.close();
    }
};
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})