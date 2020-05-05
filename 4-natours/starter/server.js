const mongoose = require('mongoose')
const dotenv = require('dotenv');
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


app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
