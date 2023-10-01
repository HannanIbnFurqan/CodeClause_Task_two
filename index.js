const express = require("express");
const path = require("path");
const app = express();
const PORT = 8000;
const URL = require("./models/url")
const urlRouter = require("./routes/url")
const { connectToMongoDB } = require("./connect")


// set views directory
const staticPath = path.join(__dirname, "public")
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");

// middleware
app.use(express.static(staticPath))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// connect with database
connectToMongoDB("mongodb://127.0.0.1:27017/shortUrl")
    .then(console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use("/url", urlRouter);

// app.get("/:shortId", async (req, res) => {
//     const shortId = req.params.shortId;
//     const entry = await URL.findOneAndUpdate({
//         shortId
//     },
//         {
//             $push: {
//                 VisitHistory: {
//                     timestamp: Date.now()
//                 }
//             }
//         }
//     );
//     // const resultUrl = entry.shortId;
//     // console.log(viewPath);
//     // res.redirect(entry.redirectURL);
//     console.log(entry.redirectURL);
//     // res.render("index", {resultUrl});
//     // res.send("Hello Hannan")
// })

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    VisitHistory: {
                        timestamp: Date.now()
                    }
                }
            }
        );

        if (!entry) {
            // Handle the case when the short URL is not found.
            return res.status(404).send("URL not found");
        }

        console.log(entry.redirectURL);
        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(PORT, () => {
    console.log("Server Start");
})

