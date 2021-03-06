const hbs = require("hbs");
const path = require('path')

hbs.registerPartials(path.join(__dirname, "../views/partials"));

hbs.registerHelper('checkRole', (user, role, options) => {
  if (user && user.role === role) {
    return options.fn()
  } else {
    return options.inverse()
  }
})

hbs.registerHelper('json', function (context) {
  return JSON.stringify(context);
});

hbs.registerHelper('ifeq', function (a, b, options) {
    if (a.toString() == b.toString()) { return options.fn(this); }
    return options.inverse(this);
});

hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});