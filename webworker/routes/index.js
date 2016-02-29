module.exports = function(app, route) {

  app.get(route, function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  // Return middleware
  return function(req, res, next) {
    next();
  };
};
