const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("./keys").secretOrKey;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys
};
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      console.log(jwt_payload);
      const user = await User.findById(jwt_payload.id);
      if (user) {
        // 下面的东西return到users.js中
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  );
};
