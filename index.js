import express from 'express'
import cors from 'cors'
import { configDB } from './configDB.js'
import mysql from 'mysql2/promise'

const app=express()
app.use(express.json())
app.use(cors())
const port = 8000
let connection


try {
    connection=await mysql.createConnection(configDB)
} catch (error) {
    console.log(error);
    
}

app.get("/todos",async (req,res)=>{
        try {
            const sql="SELECT * FROM todolist order by timestamp DESC;"
            const [rows,fields] = await connection.execute(sql)
            console.log(rows);
            console.log(fields);
            res.status(200).send(rows)
            
            
        } catch (error) {
            console.log(error);
            
        }
})

app.post("/todos",async (req,res)=>{
    if(!req.body) return res.json({msg:"Hiányos adat!"})
    const {task} = req.body
    if(!task ) return res.json({msg:"Hiányos adat!"})
    try {
        const sql = "insert into todolist (task) values (?)"
        const values=[task]
        const [result] = await connection.execute(sql,values)
        console.log(result);
        res.status(201).json({msg:"Sikeres hozzáadás"})
        
    } catch (error) {
        console.log(error);
    }  
})

app.delete("/todos/:id", async (req,res)=>{
    const {id} = req.params
    try {
        const sql = "DELETE from todolist where id=?"
        const values = [id]
        const [rows] = await connection.execute(sql,values)
        return res.status(200).json({msg:"sikeres törlés"})
        
    } catch (error) {
        console.log(error);
        
    }
})

app.patch("/todos/:id", async (req, res)=>{
    const {id} = req.params
    try {
        const sql = "update todolist set completed= NOT completed where id=?"
        const values = [id]
        const [rows] = await connection.execute(sql,values)
        return res.status(200).json({msg:"Sikeres frissítés"})
    } catch (error) {
        console.log(error);
        
    }
})

app.listen(port,()=> console.log(`server listening on port ${port}`)
)

