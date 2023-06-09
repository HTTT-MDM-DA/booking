const client = require("../../config/connect-to-cassandra");

async function getUserByEmail(email) {
  try {
    const query = "SELECT * FROM customer WHERE email=? ALLOW FILTERING";
    const params = [email];
    const result = await client.execute(query, params, { prepare: true });
    return result.rows[0] || null;
  } catch (err) {
    return "Error getting user's email:" + err;
  }
}

module.exports = { getUserByEmail };
