const faker = require("faker");
faker.locale = "es";
require("../config/db.config");
const User = require("../models/User.model");

Promise.all([User.deleteMany()]).then(() => {
  for (let i = 0; i < 20; i++) {
    let genders = ['Male', 'Female', 'Other'];
    let preferences = ['Male', 'Female', 'All'];
    User.create({
      username: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      gender: genders[Math.floor(Math.random() * 3)],
      aboutMe: faker.lorem.paragraph(),
      preferences: preferences[Math.floor(Math.random() * 3)],
      location: { type: 'Point', coordinates: [faker.address.longitude(), faker.address.latitude()] },
      profilePictures: [faker.image.people()],
      email: faker.internet.email(),
      password: "Abcde1234",
      active: "true", 
    })
    .then((p) => console.log(`Created ${p.username} with address ${p.location}`))
    .catch(e => console.log(e));
    }
});