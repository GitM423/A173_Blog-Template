const express = require("express");
const app = express();
const port = 3003;
const nav = require("./nav.json");
// const data = require("./data.json");
const fs = require("fs");

let rawdata = fs.readFileSync("data.json");
let data = JSON.parse(rawdata);
console.log(data);

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static("public"));

app.listen(port, (req, res) => {
  console.log(`server listening at http://localhost:${port}`);
});

nav.forEach((obj) => {
  app.get(obj.url, (req, res) => {
    res.status(200).render(obj.file, {
      title: obj.name,
      data: data,
      obj: { id: null },
    });
  });
});

data.forEach((obj) => {
  app.get(`/article/${String(obj.id)}`, (req, res) => {
    res.render("article", {
      title: obj.title,
      data: data,
      obj: obj,
    });
  });
});

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

app.post("/new", (req, res) => {
  let published_at = `${
    monthNames[new Date().getMonth()]
  } ${new Date().getDate()}, ${new Date().getFullYear()}`;
  let duration = Math.ceil(req.body.body.length / 50);
  let url, author_bild;
  if (req.body.url === "") {
    url = "https://source.unsplash.com/random/304x176";
  } else {
    url = req.body.url;
  }
  if (req.body.author_bild === "") {
    author_bild = "https://source.unsplash.com/random/100x100";
  } else {
    author_bild = req.body.url;
  }

  console.log(req.body);
  console.log("id:", data.length);
  console.log("url:", url);
  console.log("title:", req.body.title);
  console.log("body:", req.body.body);
  console.log("published_at:", published_at);
  console.log("duration:", duration);
  console.log("author:", req.body.author);
  console.log("author_bild:", author_bild);
  let newData = {
    id: data.length,
    url: url,
    title: req.body.title,
    body: req.body.body,
    published_at: published_at,
    duration: duration,
    author: req.body.author,
    author_bild: author_bild,
  };
  data.push(newData);
  let newRawData = JSON.stringify(data);
  fs.writeFileSync("data.json", newRawData);
  res.status(201).redirect("/new-article");
});

app.use((req, res) => {
  res.render("404", { title: "404", data: data });
});
