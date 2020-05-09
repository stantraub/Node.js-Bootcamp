const mongoose = require('mongoose')
const dotenv = require('dotenv');


process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);

});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE

const app = require('./app')

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => console.log('MongoDB connected!'))

const port = process.env.PORT || 3000;


const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  console.log('UNHANDLED REJECTION Shutting down...')
  server.close(() => {
    process.exit(1);
  })
})
