import express from 'express';
import connectToMongoDB from './src/config/db.js'
import dotenv from 'dotenv';
import router from './src/router/routes.js';
import cors from 'cors'; 

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());



app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.use('/api/admin',router)

app.listen(port,()=>{
    connectToMongoDB();
    console.log(`Server running on port ${port}`)
})

