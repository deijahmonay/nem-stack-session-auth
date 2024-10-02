const mongoose = require('mongoose')

const userSchema = new mongoose.SchemaTypes({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
})