const express = require("express")
const hbs = require('express-handlebars');
const app = express()
const fs = require("fs")
const fsPromises = require("fs").promises
app.use(express.static("static"))
const PORT = 3000;
const path = require("path")
app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');

const root = "./uploads/"


async function get_list() {
    const files = await fsPromises.readdir(root)
    const ls = []
    for (file of files) {
        const isDir = await (await fsPromises.lstat(root + file)).isDirectory()
        ls.push({ name: file, isDir: isDir })
    }
    return ls;
}

async function create_dir() {
    if (!fs.existsSync(root + "newdir")) {
        await fsPromises.mkdir(root + "newdir")
        console.log("chleb")

    }
}

async function create_file(name) {
    console.log(name)
    if (!fs.existsSync(root + name)) {
        await fsPromises.appendFile(root + name, "")
        console.log("chleb")

    }
}


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})





app.get("/", async function (req, res) {
    const list = await get_list()
    const context = { lista: list }
    res.render('index.hbs', context);   // nie podajemy ścieżki tylko nazwę pliku
})
app.get("/create", async function (req, res) {
    create_dir()
    res.redirect("/")
})

app.get("/create-file", async function (req, res) {

    create_file(req.query.name)
    console.log("A")
    res.redirect("/")
})

