require("dotenv/config");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

function limitRequest(windowMs, max, message) {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    message: { message: message },
  });
}
function speedLimiter(windowMs, delayAfter, delayMs) {
  return slowDown({
    windowMs: windowMs,
    delayAfter: delayAfter,
    delayMs: delayMs,
  });
}

module.exports.limiterLogin = limitRequest(
  process.env.WINDOWMS_LIMIT_LOGIN,
  process.env.MAX_REQUEST_LOGIN,
  "please try again"
);
module.exports.speedLimiter = speedLimiter(
  process.env.WINDOWMS_LIMIT_SLOW,
  process.env.DELAYAFTER_SLOW,
  process.env.DELAYMS_SLOW
);
module.exports.limiterServer = limitRequest(
  process.env.WINDOWMS_LIMIT_SLOW,
  process.env.MAX_REQUEST_SERVER,
  "please try again"
);
