// borrowed from
// https://github.com/AmitXShukla/GPS-Mobile-Tracking-App/blob/master/server/app.js

const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

// **** allowed cross-origin requests code START ***** //
app.use(cors());

const allowedOrigins = process.env.allowedOrigins.split(',');

// app routes go here
app.use('/', (req, res) => res.send("Welcome NOSES app user!"));
app.listen(process.env.PORT,
           () => console.log('ROCKTOTHORPE SERVER is ready on localhost:' +
                             process.env.PORT));
