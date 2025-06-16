import express from "express";
import fs from "node:fs/promises";

// import passwordHelper from "./helpers/passwordHelper.js";

import bcrypt from "bcrypt";
import cors from "cors";

let database;
async function readDatabase() {
  try {
    database = JSON.parse(
      await fs.readFile("./database.json", { encoding: "utf8" })
    );
  } catch (err) {
    console.error(err.message);
  }
}

async function saveDatabase() {
  try {
    await fs.writeFile("./database.json", JSON.stringify(database));
    await readDatabase();
  } catch (err) {
    console.error(err.message, "20");
  }
}

await readDatabase();

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  res.json(database.users);
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = database.users.find((user) => user.id === id);
  if (user === undefined) {
    res.status(404).json("No such user");
  }
  res.json(user);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserFromDb(email, password);
  if (user !== null) {
    res.json(user);
  } else {
    res.status(400).json("invalid");
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (name === "" || email === "" || password === "") {
    res.status(400).json("all fields are mandatory");
  } else if (database.users.some((user) => user.email === email)) {
    res
      .status(400)
      .json("this email already registerd, please enter different one");
  } else {
    const newUser = {
      id: getNextId().toString(),
      name: name,
      email: email,
      password: await hash(password),
      entries: 0,
      joinedData: new Date(),
    };
    database.users.push(newUser);
    await saveDatabase();
    res.json(newUser);
  }
});

app.put("/users/:id/image", (req, res) => {
  const { id } = req.params;
  let user = database.users.find((user) => user.id === id);
  if (user === undefined) {
    res.status(404).json("No such user");
  }
  user.entries++;
  saveDatabase();
  res.json(user);
});
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

function getNextId() {
  const ids = database.users.map((user) => Number(user.id));
  if (ids.length > 0) {
    return Math.max(...ids) + 1;
  } else {
    return 1;
  }
}

async function hash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function compare(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result === true;
}

async function getUserFromDb(email, password) {
  for (let user of database.users) {
    if (user.email === email && (await compare(password, user.password))) {
      return user;
    }
  }
  return null;
}
