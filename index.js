const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const { error } = require("console");
const app = express();
const PORT = 8000;

//Middleware -Plugin
app.use(express.urlencoded({ extended: false }));

//Routes
app.get("/users", (req, res) => {
  const html = `
    <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>`;
  res.send(html);
});

//REST API
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    try {
      const user = users.find((user) => user && user.id === id);
      user.first_name = req.body.first_name ?? user.first_name;
      user.last_name = req.body.last_name ?? user.last_name;
      user.email = req.body.email ?? user.email;
      user.gender = req.body.gender ?? user.gender;
      user.job_title = req.body.job_title ?? user.job_title;
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({ status: "success", user });
      });
    } catch (error) {
      return res.json({
        status: "failed",
        Reason: `Either user with id:${id} already deleted or doesn't exist.`,
      });
    }
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    try {
      const index = users.findIndex((user) => user.id === id);
      const user = users.find((user) => user.id === id);
      delete users[index];
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({ status: "success", index, user });
      });
    } catch (error) {
      return res.json({
        status: "failed",
        Reason: `Either user with id:${id} already deleted or doesn't exist.`,
      });
    }
  });

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: users.length });
  });
});

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
