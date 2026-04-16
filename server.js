import app from "./src/app.js";
import dotenv from "dotenv";
import { connectToDB } from "./src/config/database.js";

dotenv.config()
connectToDB()

const port = process.env.PORT

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})