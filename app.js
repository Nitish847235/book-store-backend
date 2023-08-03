const express = require('express')
const path = require('path')
const routes = require('./routes')
const cors = require('cors')

const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const dbConnection = require('./config/db')
dbConnection();


const app = express();

const port = process.env.PORT || 7000;

app.use(require('./utils/response/responseHandler'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(routes);


app.listen(port,()=>{
    console.log(`Application is running on port no: ${port}`);
})
