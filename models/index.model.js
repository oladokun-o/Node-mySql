const db = require("../config/db");

let model = {
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM vendors WHERE email = ?";
      db.query(sql, [email], (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM vendors WHERE id = ?";
      db.query(sql, [id], (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  findAndUpdateOTP: (email, otp) => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE vendors SET token = ? WHERE email = ?";
      db.query(sql, [otp, email], (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  createUser: (data) => {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO users SET ?";
      db.query(sql, [data], (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users";
      db.query(sql, [], (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  findAndUpdate: (data, id) => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE vendors SET ? WHERE id = ?";
      db.query(sql, [data, id], (err, rows, fields) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          console.log(rows, id);
          resolve(rows);
        }
      });
    });
  },
  findAndDelete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM users WHERE id = ?";
      db.query(sql, [id], (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    })
  },
};

module.exports = model;

