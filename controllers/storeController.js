const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

// set uploads to memory, allow only images for uploads
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "That file type isn't allowed" }, false);
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index');
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) return next();
  console.log(store);

  res.render('store', { store });
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: '🏪Add Store' });
};

// save image, record file name and pass along
exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if file is new, skip if not
  if (!req.file) {
    next();
    return;
  }
  // seperate upload mimetype/extension from file name
  const extension = req.file.mimetype.split('/')[1];
  // generate upload name via uuid plugin, reattach mimetype
  req.body.photo = `${uuid.v4()}.${extension}`;
  // resize photo
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // move to next middleware step
  next();
};

exports.createStore = async (req, res) => {
  const store = await new Store(req.body).save();
  req.flash(
    'success',
    `Successfully created ${store.name}. Care to leave a review?`
  );
  res.redirect(`/stores/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // 1. Query db for list of all stores
  const stores = await Store.find();
  // 2. Pass data to template
  res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
  // 1. Locate store from id
  const store = await Store.findOne({ _id: req.params.id });
  // 2. confirm store owner
  // 3. Render edit form so user can update
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // 1. Make point from location data
  req.body.location.type = 'Point';
  // 2. locate and update store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  // 3. Flash success msg and redirect to store page
  req.flash(
    'success',
    `Successfully updated <strong>${store.name}</strong>. <a href='/stores/${
      store.slug
    }'>View Store ➡</a>`
  );
  res.redirect(`/stores/${store.id}/edit`);
};

exports.getStoresByTag = async (req, res) => {
  const tags = await Store.getTagsList();
  const tag = req.params.tag;
  res.render('tag', { tags, title: 'Tags', tag });
};
