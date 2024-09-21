const mongoose = require("mongoose");
const readline = require("readline");   //import of readline
const { addMaterial, addUser, deleteUser } = require('./functions');

const interface = readline.createInterface({    //creating of interface
    input: process.stdin,
    output: process.stdout,
})

mongoose
  .connect(
    "mongodb+srv://owk4rce:G2GQo66ivmBrBEZE@cluster0.0u9wb.mongodb.net/storage_app?retryWrites=true&w=majority&appName=Cluster0"
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
  
  async function menu() {
    let fullName = ""
    let input = ""
    let age = 0
    const answer = await askQuestion("Choose your option:" +
        "\n1. List all tools." +
        "\n2. Add tool." +
        "\n3. List all materials." +
        "\n4. Add material." +
        "\n5. Add new user." +
        "\n6. Delete user." +
        "\n0. Exit. ")
        switch(answer) {
            case "1":
                
                break;
            case "2":
                
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

