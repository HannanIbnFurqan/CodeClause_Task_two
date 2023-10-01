const shortid = require("shortid");
const URL = require("../models/url");
async function handleGenerateNewShortURL(req,res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error:"url is required"})
    const shortID = shortid();

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        VisitHistory:[],
    });

    // return res.json({id:shortID});
    // return res.send(`<h1>your given url is ${body.url} and your short id is ${shortID}</h1>`)
    return res.render("index", {body, shortID})
}

module.exports = {
    handleGenerateNewShortURL,
};