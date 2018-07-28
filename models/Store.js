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
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [
      {
        type: Number,
        required: 'You must supply coordinates!'
      }
    ],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  },
  photo: String
});

// pregenerate slug name BEFORE save occurs
storeSchema.pre('save', async function(next) {
  // if store name isn't modified, skip and stop function
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);
  // check for duplicates
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  console.log(this);
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  // if duplicates exist, add number to slug name.
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
});

storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    // '$tags' tells mongo that tags is a field on schema model
    // unwind makes list of new entries for each tag
    // group by tag input from unwind array
    // create count field in each group, adds up w/ $sum
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model('Store', storeSchema);
