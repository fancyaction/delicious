exports.myMiddleware = (req, res, next) => {
  req.name = 'Joy';
  if (req.name === 'Joy') {
    throw Error('That name is already taken.');
  }
  next();
};

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
};
