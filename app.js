const express = require('express');
const mongoose = require('mongoose');
// connect JSON-file with configurations
const config = require('config');

const app = express();

app.use(express.json({extended: true}))

// connect api from frontend-side, in this string - api for authenfication
app.use('/api/auth', require('./routes/auth.routes'))

// connect from config-file string port, this doing for decomposition code
// || 5000 - default value
const PORT = config.get('port') || 5000;

// make a async connection to mongoose DB
async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(5000, () => console.log(`App has been started on port ${PORT}`));
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit( 1 );
    }
}

start();
