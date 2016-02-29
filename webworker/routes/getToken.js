var authenticator = new (require('../../user/authenticator').DummyAuthenticator)();

module.exports = function(app, route) {

  app.get(route, function(req, res, next) {
    var username = req.query.username;
    if(!username) {
      var err = new Error('username parameter missing');
      err.status = 500;
      next(err);
    }

    authenticator.authenticate(username,authenticationCallback);
    function authenticationCallback(err, token) {
        if(err) {
          var err = new Error(err);
          err.status = 403;
          next(err);
        } else {
          res.send(token);
        }
    }

  });

  // Return middleware
  return function(req, res, next) {
    next();
  };
};
