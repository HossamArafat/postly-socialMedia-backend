import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import { inngest, functions } from "./inngest/index.js"
import {serve} from "inngest/express"

await connectDB()
const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => res.send("Server is running"))
app.use("/api/inngest", serve({ client: inngest, functions }));
const PORT = process.env.PORT || 400
app.listen(PORT, ()=>console.log(`Server is running on http://localhost:${PORT}`))