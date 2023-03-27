import express from "express"
const router = express.Router()
import {v4 as uuidv4} from "uuid"


//user login
router.post("/login", async(req, res, next) => {
    try{
        const {name} = req.body
    } catch(error){
        next(error)
    }
})