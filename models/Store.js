const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name.'
  },
  slug: String,
  desc: {
    type: String,
    trim: true
  },
  tags: [String]
});

// pregenerate slug name BEFORE save occurs
storeSchema.pre('save', function(next) {
  // if store name isn't modified, skip and stop function
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);
  next();
});

module.exports = mongoose.model('Store', storeSchema);
