import express, { json } from "express";
import {
  getUsers,
  getUserById,
  getUserByEmail,
  addUser,
  updateUserEntries,
} from "./helpers/databaseHelper.js";

import cors from "cors";

import * as passwordHelper from "./helpers/passwordHelper.js";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

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
  const user = await getUserByEmail(email);
  if (
    user &&
    user.email === email &&
    (await passwordHelper.compare(password, user.password))
  ) {
    res.json(user);
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
      password: await passwordHelper.hash(password),
      entries: 0,
      joinedDate: new Date(),
    };
    await addUser(newUser);
    res.json(newUser);
  }
});

app.put("/users/:id/image", async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;
  let user = await getUserById(id);
  if (user) {
    const PAT = "";
    const USER_ID = "z58166sfn3rxs";
    const APP_ID = "test";
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: imageUrl,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };
    let regions;
    try {
      const response = await fetch(
        "https://api.clarifai.com/v2/models/" +
          MODEL_ID +
          "/versions/" +
          MODEL_VERSION_ID +
          "/outputs",
        requestOptions
      );
      const result = await response.json();
      regions = result.outputs[0].data.regions;

      regions = regions.map((region) => {
        // Accessing and rounding the bounding box values
        const boundingBox = region.region_info.bounding_box;
        return {
          topRow: boundingBox.top_row.toFixed(3),
          leftCol: boundingBox.left_col.toFixed(3),
          bottomRow: boundingBox.bottom_row.toFixed(3),
          rightCol: boundingBox.right_col.toFixed(3),
        };
      });
    } catch (error) {
      return res.status(503).json(`something went wrong : ${error}`);
    }
    const newEntries = user.entries + 1;
    updateUserEntries(id, user.entries + 1);
    res.json({
      entries: newEntries,
      boundingBoxes: regions,
    });
  } else {
    return res.status(404).json("No such user");
  }
});
