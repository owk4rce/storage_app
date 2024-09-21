require('dotenv').config();
const mongoose = require("mongoose");
const readline = require("readline");   //import of readline
const { listAllMaterials, addMaterial, deleteMaterial, 
    listAllUsers, addUser, deleteUser } = require('./functions');

const interface = readline.createInterface({    //creating of interface
    input: process.stdin,
    output: process.stdout,
})

mongoose
  .connect(
    process.env.DB_CONNECT  // look at .env.sample
  )
  .then(() => {
    console.log("\x1b[32m%s\x1b[0m","MongoDB connected successfully");  // "\x1b[32m%s\x1b[0m" - green colour
    menu()
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// generic question
const askQuestion = (query) => {
    return new Promise((resolve) => interface.question(query, resolve));
  };
  
async function toolsMenu() {
    const answer = await askQuestion("=== Tools ===\nChoose your option:" +
        "\n1. List tools." +
        "\n2. Add tool." +
        "\n3. Delete tool." +
        "\n0. Back. ")
        switch(answer) {
            case "1":
                // list
                break;
            case "2":
                // add
                break;
            case "3":
                // delete
                break;
            case "0":
                return
            default:
                console.error("Wrong choice.")
                break
        }

        await toolsMenu()
}

async function materialsMenu() {
    const answer = await askQuestion("=== Materials ===\nChoose your option:" +
        "\n1. List materials." +
        "\n2. Add material." +
        "\n3. Delete material." +
        "\n0. Back. ")
        switch(answer) {
            case "1":
                await listAllMaterials()
                break;
            case "2": {
                const name = await askQuestion("Type the name of the material: ")
                const amount = parseInt(await askQuestion("Amount: "), 10)
                if(isNaN(amount) || !Number.isInteger(amount) || amount < 0) {
                    console.error("Invalid input.")
                    break;
                }
                const cost = parseFloat(await askQuestion("Cost: "))
                if(typeof cost !== "number" || isNaN(cost))
                {
                    console.error("Invalid input.")
                    break;
                }
                const supplier = await askQuestion("Supplier: ")
                const quality = await askQuestion("Choose the quality: \n1. Excellent.\n2. Normal.\n3. Poor. ")
                switch(quality) {
                    case "1":
                        await addMaterial(name, amount, cost, supplier, "excellent")
                        break;
                    case "2":
                        await addMaterial(name, amount, cost, supplier, "normal")
                        break
                    case "3":
                        await addMaterial(name, amount, cost, supplier, "poor")
                        break
                    default:
                        console.error("Wrong choice.")
                }
                break;
            }
                
            case "3":
                {
                    const name = await askQuestion("You are going to delete material. Type the name: ")
                    const quantity = parseInt(await askQuestion("How much do you want to delete? "), 10)
                    if(isNaN(quantity) || !Number.isInteger(quantity) || quantity < 0) {
                        console.error("Invalid input.")
                        break;
                    }
                    const cost = parseFloat(await askQuestion("More details to identify particular material. Cost: "))
                    if(typeof cost !== "number" || isNaN(cost))
                    {
                        console.error("Invalid input.")
                        break;
                    }
                    const supplier = await askQuestion("Supplier: ")
                    const quality = await askQuestion("Choose the quality: \n1. Excellent.\n2. Normal.\n3. Poor. ")
                    switch(quality) {
                        case "1":
                            await deleteMaterial(name, cost, supplier, "excellent", quantity)
                            break;
                        case "2":
                            await deleteMaterial(name, cost, supplier, "normal", quantity)
                            break
                        case "3":
                            await deleteMaterial(name, cost, supplier, "poor", quantity)
                            break
                        default:
                            console.error("Wrong choice.")
                    }
                    break;
                }
            case "0":
                return
            default:
                console.error("Wrong choice.")
                break
        }

        await materialsMenu()
}

async function usersMenu() {
    const answer = await askQuestion("=== Users ===\nChoose your option:" +
        "\n1. List users." +
        "\n2. Add user." +
        "\n3. Delete user." +
        "\n0. Back. ")
        switch(answer) {
            case "1":
                await listAllUsers()
                break;
            case "2": {
                const fullName = await askQuestion("Type the full name of the user: ")
                
                const age = parseInt(await askQuestion("His age (>= 12): "), 10)

                if(Number.isInteger(age) && age >= 12)
                {
                    const newUser = await addUser(fullName, age)
                    
                }
                else {
                    console.error("Invalid age.")
                }               
                
                break;
            }                
            case "3": {
                const fullName = await askQuestion("Type the full name of the user: ")
                
                const age = parseInt(await askQuestion("His age (>= 12): "), 10)
    
                if(Number.isInteger(age) && age >= 12)
                {
                    await deleteUser(fullName, age)
                        
                }
                else {
                    console.error("Invalid age.")
                }               
                break;
            }
            case "0":
                return
            default:
                console.error("Wrong choice.")
                break
        }

        await usersMenu()
}

async function menu() {
    let fullName = ""
    let input = ""
    let age = 0
    const answer = await askQuestion("=== Main menu ===\nChoose your option:" +
        "\n1. Tools." +
        "\n2. Materials." +
        "\n3. Users." +
        "\n0. Exit. ")
        switch(answer) {
            case "1":
                await toolsMenu()
                break;
            case "2":
                await materialsMenu()
                break;
            case "3":
                await usersMenu()
                break;
            case "4":
                const name = await askQuestion("Type the name of the material: ")
                const amount = parseInt(await askQuestion("Amount: "), 10)
                if(isNaN(amount) || !Number.isInteger(amount) || amount < 0) {
                    console.error("Invalid input.")
                    break;
                }
                const cost = parseFloat(await askQuestion("Cost: "))
                if(typeof cost !== "number" || isNaN(cost))
                {
                    console.error("Invalid input.")
                    break;
                }
                const supplier = await askQuestion("Supplier: ")
                const quality = await askQuestion("Choose the quality: \n1. Excellent.\n2. Normal.\n3. Poor. ")
                switch(quality) {
                    case "1":
                        await addMaterial(name, amount, cost, supplier, "excellent")
                        break;
                    case "2":
                        await addMaterial(name, amount, cost, supplier, "normal")
                        break
                    case "3":
                        await addMaterial(name, amount, cost, supplier, "poor")
                        break
                    default:
                        console.error("Wrong choice.")
                }
                break;           
            case "5":
                fullName = await askQuestion("Type the full name of the user: ")
                
                age = parseInt(await askQuestion("His age (>= 12): "), 10)

                if(Number.isInteger(age) && age >= 12)
                {
                    const newUser = await addUser(fullName, age)
                    
                }
                else {
                    console.error("Invalid age.")
                }               
                
                break;
            case "6":
                fullName = await askQuestion("You are going to delete the user. His full name: ")
                    
                input = await askQuestion("His age (>= 12): ")
                age = parseInt(input)
    
                if(Number.isInteger(age) && age >= 12)
                {
                    await deleteUser(fullName, age)
                        
                }
                else {
                    console.error("Invalid age.")
                }               
                    
                break;
            case "0":
                interface.close()
                mongoose.connection.close();
                return;
            default:
                console.log("wrong input. Try again.") 
                
        }
  
        await menu()
    
  }

