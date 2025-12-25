class Logger {
  static info(message, data = {}) {
    console.log(`[INFO] ${message}`, data);
  }

  static error(message, data = {}) {
    console.error(`[ERROR] ${message}`, data);
  }
}

module.exports = { Logger };