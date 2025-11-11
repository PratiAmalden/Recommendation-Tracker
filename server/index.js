import express from "express"

const app = express();

app.get("/", (res, req) => {
    res.send("ok");
})

const port = 3000;

app.listen(port, () => {
    console.log("App listening on: ", port)
})