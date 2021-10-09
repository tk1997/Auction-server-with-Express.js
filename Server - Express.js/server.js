const express = require("express");
const dbJson = require("./items-db.json");

const app = express();

// serve static files
app.use("/images", express.static("public"));

// allows cross origin access
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    next();
});

app.listen(3000,
    () => {
        setInterval(virtualBid, 5000);
        console.log("Server started and listening on port 3000...");
    }
);

app.get("/list", (req, res) => {
    // res.send("<h1>Hello from North Pole!</h1>");
    console.log("GET: /list received @ " + (new Date(Date.now())).toISOString());
    res.send(dbJson);
});

app.post("/bid", (req, res) => {
    console.log("POST: /bid received @ " + (new Date(Date.now())).toISOString());

    const id = req.query.id;
    console.log("id = " + id);

    const newBid = req.query.newbid;
    console.log("newBid = " + newBid);

    const newBidUser = req.query.newbiduser;
    console.log("newBidUser = " + newBidUser);

    if (newBid === undefined || newBid == "undefined" || newBid == "null") {
        console.log("new bid is missing");
        res.status(400).send("new bid is missing");
        return;     
    }

    if (newBidUser === undefined || newBidUser == "undefined" || newBidUser == "null") {
        console.log("new bid user is missing");
        res.status(400).send("new bid user is missing");
        return;
    }

    const match = dbJson.find(item => item.id == id);

    if (match == undefined)  {
        console.log("invalid or missing item ID");
        res.status(400).send("invalid or missing item ID");
        return;
    }

    if (match.lastBid >= newBid) {
        console.log("Bid is not high enough");
        res.status(400).send("Bid is not high enough");
        return;
    }

    match.lastBid = newBid;
    match.lastBidUser = newBidUser;

    res.send("OK");
});

// virtual bidder

function virtualBid() {

    dbJson.forEach((item) => {

        // generate a random percentage from 1 to 2
        const increase = Math.random() * 2;

        item.lastBid *= Number(1.0 + (increase / 100));
        item.lastBidUser = "anonymous";
    })

}