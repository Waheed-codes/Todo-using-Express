import express from "express"
import { readContent, writeContent } from "./utils/file.js"
const app = express()
const PORT = 3065
app.use(express.json())
//POST API to create a user
app.post("/create-user", async (req, res) => {
    try {
        let { id, name, email, password } = req.body;//for example:-{name:"waheed",email:"userwaheed@gmail.com",password:"132321"}
        if (!email || !password) {
            return res.status(400).json({
                Error: "Email ID and password are both required",
            });
        }
        let database = await readContent();
        if (database.find((item) => item.email == email)) {
            return res.status(400).json({
                message: "An account already exists with this email",
            });
        }
        let newUser = {
            id,
            name,
            email,
            password,
            todos: []

        }
        database.push(newUser);
        await writeContent(database);
        res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
})

//GET APIS to get all users
app.get("/users", async (req, res) => {
    try {
        let database = await readContent()
        return res.status(200).json(database)
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
})
// GET API to get single user
app.get("users/:userId", async (req, res) => {
    try {
        let userId = req.params.userId
        let database = await readContent()
        let existingUser = database.find((item) => item.id == userId)
        if (!existingUser) {
            return res.status(404).json({ Error: "User Not Found" })
        }
        res.status(200).json(existingUser)

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
})

//GET API TO GET A TODO BY id
app.get("/user/:userId/:todos", async (req, res) => {
    try {
        let userId = req.params.userId
        let database = await readContent()
        let existingUser = database.find((item) => item.id == userId)
        if (!existingUser) {
            return res.status(404).json({ Error: "User Not Found" })
        }
        res.status(200).json(existingUser.todos)
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
})

//GET API TO GET ALL TODOS
app.get("/get-all-todos/:id", async (req, res) => {
    try {
        let userID = req.params.id
        let database = await readContent()
        let existingUser = database.find((item) => item.id == userID)
        if (existingUser) {
            return res.status(200).json(existingUser.todos)
        }
        res.status(404).json({ "msg": "user not found" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "msg": "internal server error" })

    }
})



//DELETE APi to Delete a User
app.delete("/delete-user/:id", async (req, res) => {
    try {
        let userId = req.params.id;
        let database = await readContent()
        if (database.find((item) => item.id == userId)) {
            let newDatabase = database.filter((item) => item.id != userId)
            await writeContent(newDatabase)
            return res.status(200).json({ msg: "User deleted Successfully" })
        }
        return res.status(404).json({ msg: "User not found" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" })
    }
})
//POST API to create a Todo tasks
app.post("/create-todo/:id", async (req, res) => {
    try {
        let userID = req.params.id;
        let { id, task } = req.body;
        let newTodo = {
            id,
            task
        }
        let database = await readContent();
        let existingUser = database.find((item) => item.id == userID);
        if (existingUser) {
            existingUser.todos.push(newTodo);
            await writeContent(database);
            return res.status(201).json({ message: "Todo added successfully" });
        }
        res.status(404).json({ Error: "User not found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
});
//Delete API to delete all users
app.delete("/delete-users", async (req, res) => {
    try {
        let database = await readContent()
        if (database.length !== 0) {
            await writeContent([])
            return res.status(200).json({ msg: "All users deleted successfully" })
        }
        res.status(404).json({ msg: "No users found" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" })
    }
})

//DELETE API to delete a todo
app.delete("/delete-todo/:userId/:todoId", async (req, res) => {
    try {
        let userId = req.params.userId  //storing the parametr in userid
        let todoId = req.params.todoId  //storing the todoid paramter in todoId variable

        let database = await readContent()   //reading the content in data.json
        let existingUser = database.find((item) => item.id == userId)  //finding the user in existing database

        if (!existingUser) {
            return res.status(404).json({ Error: "User Not Found" })
        }
        let existingtodo = existingUser.todos.find((item) => item.id == todoId)
        if (!existingtodo) {
            return res.status(404).json({ Error: " Todo Not Found" })
        }
        existingUser.todos = existingUser.todos.filter((item) => item.id != todoId)
        await writeContent(database)
        return res.status(200).json({ Error: "Todo deleted successfully" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" })
    }
})

//DELETE API to delete All todos
app.delete("/delete-todos/:userId", async (req, res) => {
    try {
        let userId = req.params.userId
        let database = await readContent()
        let existingUser = database.find((item) => item.id == userId)

        if (!existingUser) {
            return res.status(404).json({ Error: "User Not Found" })
        }
        existingUser.todos = []
        await writeContent(database)
        return res.status(200).json({ msg: "All todos deleted successfully" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" })
    }
})
//PATCH- API to update name

app.patch("/update-user/:id", async (req, res) => {
    try {
        let userId = req.params.id
        let database = await readContent()
        let existingUser = database.find((item) => item.id == userId)
        let updatedUser = req.body
        if (!existingUser) {
            return res.status(404).json({ Error: "User not found" })
        }
        Object.assign(existingUser, updatedUser)
        await writeContent(database)
        res.status(202).json({ msg: "User Updated Successfully" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" })
    }
})

//PATCH API to update todo

app.patch("/update-todo/:id", async (req, res) => {
    try {
        let userId = req.params.id
        let todoId = req.body.id
        let database = await readContent()
        let updatedTodo=req.body
    
        let existingUser = database.find((item) => item.id == userId)
        if (!existingUser) {
            return res.status(404).json({ Error: "User not found" })
        }
        let existingTodo = existingUser.todos.find((item) => item.id == todoId)
        if (!existingTodo) {
            return res.status(404).json({ Error: "Todo doesnt Exists" })
        }
        Object.assign(existingTodo,updatedTodo)
        await writeContent(database)
        res.status(202).json({msg:"todo updated successfully"})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal Server Error" })
    }

})
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})