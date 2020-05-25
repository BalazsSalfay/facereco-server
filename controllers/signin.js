const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("invalid form submission");
  }
  db.select("email", "hash")
    .from("login")
    .where({ email })
    .then((data) => {
      const isValidAuth = bcrypt.compareSync(password, data[0].hash);
      if (isValidAuth) {
        return db
          .select("*")
          .from("users")
          .where({ email })
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
}

module.exports = {
  handleSignIn
};