require('dotenv').config();
const mongoose = require("mongoose");
const readline = require("readline");   //import of readline
const { listAllTools, addTool, deleteTool, fixTool,
    listAllMaterials, addMaterial, deleteMaterial, 
    listAllUsers, addUser, deleteUser, buildSomething, listBorrowedTools } = require('./functions');

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
        "\n4. Fix tool." +
        "\n0. Back. ")
        switch(answer) {
            case "1":
                await listAllTools()
                break;
            case "2":
                const name = await askQuestion("Type the name of the tool: ")
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
                const usagePurpose = await askQuestion("Usage purpose: ")

                await addTool(name, amount, cost, usagePurpose)

                break;
            case "3": {
                const allTools = await listAllTools()
                if (allTools.length === 0) {
                    console.log("\x1b[33m%s\x1b[0m", "No tools available to delete.");
                    return;
                }
            
                const indexes = await askQuestion("Type indexes of tools to delete, use ',' to separate: ")
                const indArray = indexes.split(',').map(index => parseInt(index, 10));
                await deleteTool(indArray, allTools)
                break;
            }
            case "4": {
                const allTools = await listAllTools()
                if (allTools.length === 0) {
                        console.log("\x1b[33m%s\x1b[0m", "No tools available to fix.");
                        return;
                    }
                
                    const indexes = await askQuestion("Type indexes of tools to fix, use ',' to separate: ")
                    const indArray = indexes.split(',').map(index => parseInt(index, 10));
                    await fixTool(indArray, allTools)
                    break;
                }
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
                
            case "3": {
                    const allMaterials = await listAllMaterials()
                    if (allMaterials.length === 0) {
                        console.log("\x1b[33m%s\x1b[0m", "No materials in db.");
                        break;
                    }
                
                    const matIndex = parseInt(await askQuestion("Type index of the material to delete: "), 10)
    
                    if(isNaN(matIndex) || !Number.isInteger(matIndex) || matIndex < 0) {
                        console.error("Invalid input.")
                        break
                    }
    
                    if (matIndex < allMaterials.length) {
                        const quantity = parseInt(await askQuestion("How much do you want to delete? "), 10)
                        if(isNaN(quantity) || !Number.isInteger(quantity) || quantity < 0) {
                            console.error("Invalid input.")
                            break;
                        } 
                        await deleteMaterial(allMaterials[matIndex], quantity)     
                    } else {
                            console.error(`Index ${matIndex} is out of range.`);
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
        "\n4. Build something." +
        "\n5. List borrowed tools." +
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
                const allUsers = await listAllUsers()
                if (allUsers.length === 0) {
                    console.log("\x1b[33m%s\x1b[0m", "No users in db.");
                    break;
                }
            
                const userIndex = parseInt(await askQuestion("Type index of the user to delete: "), 10)

                if(isNaN(userIndex) || !Number.isInteger(userIndex) || userIndex < 0) {
                    console.error("Invalid input.")
                    break
                }

                if (userIndex < allUsers.length) { 
                    await deleteUser(allUsers[userIndex])     
                } else {
                        console.error(`Index ${userIndex} is out of range.`);
                    }
                    break;
                }
            case "4": {
                const allUsers = await listAllUsers()
                if (allUsers.length === 0) {
                    console.log("\x1b[33m%s\x1b[0m", "No users available to build.");
                    break;
                }
            
                const userIndex = parseInt(await askQuestion("Type index of the user who will build something: "), 10)

                if(isNaN(userIndex) || !Number.isInteger(userIndex) || userIndex < 0) {
                    console.error("Invalid input.")
                    break
                }

                if (userIndex >= 0 && userIndex < allUsers.length) { 
                    const allTools = await listAllTools()
                    if (allTools.length === 0) {
                        console.log("\x1b[33m%s\x1b[0m", "No tools available to build.");
                        break;
                    }
            
                    const toolsIndexes = await askQuestion("Type indexes of tools to use, ',' to separate: ")
                    const toolsIndArray = toolsIndexes.split(',').map(toolIndex => parseInt(toolIndex, 10));
                    const toolsToBuild = []
                    for (const ind of toolsIndArray) {
                        if (ind >= 0 && ind < allTools.length) {
                            toolsToBuild.push(allTools[ind])
                        } else {
                            console.error(`Index ${ind} is out of range.`);
                        }
                    }
                    
                    const allMaterials = await listAllMaterials()
                    if (allMaterials.length === 0) {
                        console.log("\x1b[33m%s\x1b[0m", "No materials available to build.");
                        break;
                    }

                    const materialsIndexes = await askQuestion("Type indexes of materials to use, ',' to separate: ");
                    const materialsIndArray = materialsIndexes.split(',').map(materialIndex => parseInt(materialIndex, 10));
                    const materialsToBuild = [];
        
                    for (const ind of materialsIndArray) {
                        if (ind >= 0 && ind < allMaterials.length) {
                            const material = allMaterials[ind];
                            const quantity = parseInt(await askQuestion(`Specify quantity for ${material.name}, cost: ${material.cost}, quality: ${material.quality}, supplier: ${material.supplier} (Available: ${material.amount}) `), 10)
                            
                            if (!isNaN(quantity) && Number.isInteger(quantity) && quantity > 0 && quantity <= material.amount) {
                                materialsToBuild.push({ material, quantity });
                            } else {
                                console.error("Invalid quantity for material.");
                            }
                        } else {
                            console.error(`Index ${ind} is out of range.`);
                        }
                    }
                    
                    await buildSomething(allUsers[userIndex], toolsToBuild, materialsToBuild)
                }
                else {
                    console.error(`Index ${index} is out of range.`);
                }                
                break;
            }
            case "5": {
                const allUsers = await listAllUsers()
                if (allUsers.length === 0) {
                    console.log("\x1b[33m%s\x1b[0m", "No users in db.");
                    break;
                }
            
                const userIndex = parseInt(await askQuestion("Type index of the user to list borrowed tools: "), 10)

                if(isNaN(userIndex) || !Number.isInteger(userIndex) || userIndex < 0) {
                    console.error("Invalid input.")
                    break
                }

                if (userIndex < allUsers.length) { 
                    await listBorrowedTools(allUsers[userIndex])     
                } else {
                        console.error(`Index ${ind} is out of range.`);
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
            case "0":
                interface.close()
                mongoose.connection.close();
                return;
            default:
                console.error("Wrong input. Try again.") 
                
        }
  
        await menu()
    
  }

