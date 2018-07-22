const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: '🏪Add Store' });
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
  // 1. locate and update store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  // 2. Flash success msg and redirect to store page
  req.flash(
    'success',
    `Successfully updated <strong>${store.name}</strong>. <a href='/stores/${
      store.slug
    }'>View Store ➡</a>`
  );
  res.redirect(`/stores/${store.id}/edit`);
};
