const express = require("express");
const app = express();
const {Musician} = require("./Musician")
const {sequelize} = require("./db")

const port = 3000;

//TODO
app.listen(port, () => {
    sequelize.sync();
    console.log(`Listening on port ${port}`)
})

app.get("/musicians", async (req, res) => {
    const AllMusicians = await Musician.findAll();
    res.json(AllMusicians);
})

app.get("/musicians/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const musicians = await Musician.findByPk(id);

            if (!musicians) {
                throw new Error("Musicians not found");
            }
            res.send(musicians);
    }   catch(error) {
        res.status(404).send({error: error.message})
    }
})

app.post("/musicians", async (req, res) => {
    const body = req.body;
    console.log(req.body);
    await Musician.create(req.body);

        res.send("Musician has been created");
})

app.put("/musicians/:id", async (req, res) => {
    const {id} = req.params;
    const musician = await Musician.findByPk(id);
    const {name, instrument} = req.body;
        if(name && instrument) {
            await musician.update({name: name, instrument: instrument});
        } else if (name) {
            await musician.update({name: name});
        } else if (instrument) {
            await musician.update({instrument: instrument});
        }
        res.send("Updated Musician");
})

app.delete("/musicians/:id", async (req, res) => {
    const {id} = req.params;
    Musician.destroy({where: { id: id}});
    res.send("Deleted Musician");
})