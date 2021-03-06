const mongoose = require('mongoose')
require("dotenv").config();

mongoose
  .connect(process.env.DB_URI || 'mongodb://localhost:27017/letsnotmeetyet')
  .then(() => console.log('Succesfully conected to the DB'))
  .catch((e) => console.error('Error conectiong to the DB', e))

process.on('SIGINT', () => {
  mongoose.connection
    .close()
    .then(() => console.log('Succesfully disconnected from the DB'))
    .catch((e) => console.error('Error disconnecting from the DB', e))
    .finally(() => process.exit())
})

