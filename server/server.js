import express from "express";
import {
  getUsers,
  getUserById,
  getUserByEmail,
  addUser,
  updateUserEntries,
} from "./helpers/databaseHelper.js";

import bcrypt from "bcrypt";
import cors from "cors";

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

app.get("/users", async (req, res) => {
  res.json(await getUsers());
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json("No such user");
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (await isSignInValid(email, password)) {
    res.json("success");
  } else {
    res.status(400).json("invalid");
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (name === "" || email === "" || password === "") {
    res.status(400).json("all fields are mandatory");
  } else if (await getUserByEmail(email)) {
    res
      .status(400)
      .json("this email already registerd, please enter different one");
  } else {
    const newUser = {
      name: name,
      email: email,
      password: await hash(password),
      entries: 0,
      joinedDate: new Date(),
    };
    await addUser(newUser);
    res.json(newUser);
  }
});

app.put("/users/:id/image", async (req, res) => {
  const { id } = req.params;
  let user = await getUserById(id);
  if (user) {
    updateUserEntries(id, user.entries + 1);
    res.json(user);
  } else {
    res.status(404).json("No such user");
  }
});

async function hash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function compare(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result === true;
}

async function isSignInValid(email, password) {
  const user = await getUserByEmail(email);
  return (
    user && user.email === email && (await compare(password, user.password))
  );
}
