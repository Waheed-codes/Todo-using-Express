import fs from "fs/promises"
const dbPath="/home/waheed/Todo-using-Express/data.json"

async function readContent(){
    try {
        let userData=await fs.readFile(dbPath,"utf-8")
        return JSON.parse(userData)
    } catch (error) {
        console.error(error)
    }
}

async function writeContent(content){
    try {
        await fs.writeFile(dbPath,JSON.stringify(content,null,2))
    } catch (error) {
        console.error(error)
    }
}

export{readContent,writeContent};