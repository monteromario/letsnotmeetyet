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