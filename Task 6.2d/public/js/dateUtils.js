/**
 * Checks if the given date string represents a future date.
 * @param {string} dateStr - A string representing a date.
 * @returns {boolean} - True if the date is in the future, false otherwise.
 */
function isFutureDate(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    // Return false if the date is invalid
    if (isNaN(date.getTime())) return false;
    return date > now;
  }
  
  module.exports = { isFutureDate };
  