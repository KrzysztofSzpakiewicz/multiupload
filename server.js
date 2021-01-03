var express = require("express")
var app = express()
var path = require("path")
const formidable = require("formidable")
var hbs = require("express-handlebars")
const PORT = process.env.PORT || 3000
var tab = []
var indexes = 0

app.listen(PORT, function(){
    console.log("Serwer rusza na porcie " + PORT)
})

app.use(express.static("static"));
app.set("views", path.join(__dirname, "views"))
app.engine("hbs", hbs({
    defaultLayout: "main.hbs",
    extname: ".hbs",
    partialsDir: "views/partials"
}));
app.set("view engine", "hbs")

app.get("/", function(req, res){
    res.redirect("/upload")
})

app.get("/upload", function(req, res){
    res.render("upload.hbs")
})

app.get("/deleteEvth", function(req, res){
    indexes = 0
    tab = []
    res.redirect('back')
})

app.get("/filemanager", function(req, res){
    var info = {files: tab}
    res.render("filemanager.hbs", info)
})

app.get("/delete", function(req, res){
    for(let i = 0; i<tab.length; i++){
        if(tab[i].id == req.query.id){
            tab.splice(i, 1)
        }
    }
    res.redirect('back')
})

app.get("/info", function(req, res){
    var toinfo = {build: false}
        for(let i = 0; i<tab.length; i++){
            if(tab[i].id == req.query.id){
                toinfo = tab[i]
            }
        }
    
    res.render("info.hbs", toinfo)
})

app.post('/handleUpload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'
    form.keepExtensions = true
    form.multiples = true                    
    form.parse(req, function (err, fields, files) { 
        if(Array.isArray(files.imagetoupload)){
            for(let i = 0; i<files.imagetoupload.length; i++){
                newFile(files.imagetoupload[i])
            }
        } 
        else {
            newFile(files.imagetoupload)
        }
        res.redirect('back')
    })
})

function newFile(params){
    indexes=indexes+1
    var today = new Date()
    var download = "upload/" + params.path.substr(params.path.indexOf("upload") + 7)

    tab.push({
        id: indexes,
        name: params.name,
        size: params.size,
        type: params.type,
        download: download,
        path: params.path,
        savedate: today,
        build: true
    })
}