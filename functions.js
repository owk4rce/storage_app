const { Item, Tool, Material, User } = require('./schemas');

// Function to find all tools
async function listAllTools() {
    try {
        const tools = await Tool.find({}).populate({
            path: 'borrowedByUserIds',
            select: 'fullName age'
        });

        if (tools.length === 0) {
            console.log("\x1b[33m%s\x1b[0m", "No tools found in db.");
            return [];
        }

        console.log("Tools:");
        const toolsData = [];

        for (const tool of tools) {
            const item = await Item.findById(tool.parent);

            toolsData.push({
                "Name": tool.name,
                "Usage Purpose": tool.usagePurpose,
                "Amount": item.amount,
                "Cost": tool.cost,
                "Worth": item.getWorth(),
                "Condition": tool.condition,
                "Borrowed by": tool.borrowedByUserIds.map(user => user.fullName + ` (${user.age})`).join(', ')
            });
        }

        console.table(toolsData);
        return tools
    } catch (error) {
        console.error("Error displaying tools:", error.message);
        return []
    }
  }

// function to create tool and save to db (identification: )
async function addTool(name, amount, cost, usagePurpose) {
    const isFound = await Item.findOne({name, cost}) // checking if this tool already exists
    if(!isFound) {  //if not
        const newItem = new Item({ name, amount, cost })
        try {
            const savedItem = await newItem.save()
            const parent = savedItem._id
            for (let i = 0; i <= amount - 1; i++) {
                const newTool = new Tool ({ parent, name, amount: 1, cost, usagePurpose})
                const savedTool = await newTool.save()
            }
            console.log("\x1b[32m%s\x1b[0m", "Tools added successfully.")
            return savedItem
        } catch(error) {
            console.error("Error creating tools:", error.message)
            return null
        }
    }
    else{
        console.log("\x1b[33m%s\x1b[0m", "The amount of tool will be increased")
        try {
            const savedItem = await isFound.addNew(amount)
            const parent = savedItem._id
            for (let i = 0; i <= amount - 1; i++) {
                const newTool = new Tool ({ parent, name, amount: 1, cost, usagePurpose})
                const savedTool = await newTool.save()
            }
            console.log("\x1b[32m%s\x1b[0m", "The amount of the tool succesfully increased.")
            return savedItem
        } catch(error) {
            console.error("Error saving tool:", error.message)
            return null
        }
    
  }
}

async function deleteTool(indArray, allTools) {
    for (const index of indArray) {
        if (index >= 0 && index < allTools.length) {
            const toolToDelete = allTools[index];
            const parentId = toolToDelete.parent;
            try {
                console.log("\x1b[33m%s\x1b[0m",`Attempting to delete tool with ID: ${toolToDelete._id}`);

                await Tool.findByIdAndDelete(toolToDelete._id);
                const item = await Item.findById(parentId);
                if (item) {
                    item.amount -= 1; 
                    await item.save(); 
                    if(item.amount === 0) {
                        
                        await Item.findByIdAndDelete(item._id);
                    }
                }

                console.log("\x1b[32m%s\x1b[0m",`Tool deleted successfully.`);

            } catch(error) {
                console.error("Error deleting tool:", error.message)
                return null
            }
            
        } else {
            console.error(`Index ${index} is out of range.`);
        }
    }
}

async function fixTool(indArray, allTools) {
    for (const index of indArray) {
        if (index >= 0 && index < allTools.length) {
            const toolToFix = allTools[index];
            try {
                console.log(`Attempting to fix tool with ID: ${toolToFix._id}`);

                await toolToFix.fixTool()
                
                console.log(`Tool fixed successfully.`);

            } catch(error) {
                console.error("Error fixing tools:", error.message)
                return null
            }
            
        } else {
            console.error(`Index ${index} is out of range.`);
        }
    }
}

// Function to find all materials
async function listAllMaterials() {
    try {
      const materials = await Material.find({});
      if (materials.length === 0) {
        console.log("\x1b[33m%s\x1b[0m", "No materials found in db.");
        return []
      } else {    
        const materialsData = materials
        console.log("Materials:");
        console.table(materials.map(material => ({
            "Name": material.name,
            "Amount": material.amount,
            "Cost": material.cost,
            "Worth": material.getWorth(),
            "Quality": material.quality,
            "Supplier": material.supplier         
            
            
          })));
        
          return materialsData
        
      }
    } catch (error) {
      console.error("Error displaying materials:", error.message);
      return []
    }
  }

// function to create material and save to db (identification: name, cost, supplier, quality; wood with the cost 100 is not the wood with the cost 200)
async function addMaterial(name, amount, cost, supplier, quality) {
    const isFound = await Material.findOne({name, cost, supplier, quality}) // checking if this material already exists
    if(!isFound) {  //if not
        const newMaterial = new Material({ name, amount, cost, supplier, quality })
        try {
            const savedMaterial = await newMaterial.save()
            console.log("\x1b[32m%s\x1b[0m", "Material added successfully.")
            return savedMaterial
        } catch(error) {
            console.error("Error creating material:", error.message)
            return null
        }
    }
    else{
        console.log("\x1b[33m%s\x1b[0m", "This material already exists. The amount will be increased")
        /*isFound.amount += amount
        try {
            const savedMaterial = await isFound.save()
            return savedMaterial
        } catch(error) {
            console.error("Error saving material:", error.message)
            return null
        }*/
        try {
            const savedMaterial = await isFound.addNew(amount)
            console.log("\x1b[32m%s\x1b[0m", "The amount of the material succesfully increased.")
            return savedMaterial
        } catch(error) {
            console.error("Error saving material:", error.message)
            return null
        }
            
        
      }    
    
  }

// function to delete material from db or decrease amount
/*async function deleteMaterial(name, cost, supplier, quality, quantity) {
    const isFound = await Material.findOne({name, cost, supplier, quality}) // checking if this material exists
    if(!isFound) {  
        console.error("The material not found.")
        return null
    }
    else if (quantity >= isFound.amount){
            try {
                const deletedMaterial = await Material.deleteOne(isFound._id)
                console.log("\x1b[32m%s\x1b[0m", "The material completely deleted from db.")
                return deletedMaterial
            } catch (error) {
                console.error("Error deleting material:", error.message);
                return null
            }  
        
        }
        else {
            isFound.amount -= quantity
            try {
                const decreasedMaterial = isFound.save()
                console.log("\x1b[33m%s\x1b[0m", "The amount of the material decreased")
                return decreasedMaterial
            }
            catch(error) {
                console.error("Error saving decreased amount of the material:", error.message);
                return null
            }
            

        }
    
  }*/

async function deleteMaterial(material, quantity) {
    if (quantity >= material.amount){
        try {
            const deletedMaterial = await Material.deleteOne(material._id)
            console.log("\x1b[32m%s\x1b[0m", "The material completely deleted from db.")
            return deletedMaterial
        } catch (error) {
            console.error("Error deleting material:", error.message);
            return null
        }    
    }
    else {
        material.amount -= quantity
        try {
            const decreasedMaterial = material.save()
            console.log("\x1b[33m%s\x1b[0m", "The amount of the material decreased")
            return decreasedMaterial
        }
        catch(error) {
            console.error("Error saving decreased amount of the material:", error.message);
            return null
        }
    
    }
}

// Function to find all users
async function listAllUsers() {
    try {
      const users = await User.find({});
      if (users.length === 0) {
        console.log("\x1b[33m%s\x1b[0m", "No users found in db.");
        return []
      } else {    
        const usersData = users
        console.log("Users:");
        console.table(users.map(user => ({
            "Full name": user.fullName,
            "Age": user.age
            // borrowed tools         
            
            
          })));
        
        return usersData
      }
    } catch (error) {
      console.error("Error displaying users:", error.message);
      return []
    }
  }

// function to create user and save to db (identification: fullName and age, John Carpenter 76 and 12 years - different people)
async function addUser(fullName, age) {
    const isFound = await User.findOne({fullName, age}) // checking if this user already exists
    if(!isFound) {  //if not
        const newUser = new User({ fullName, age })
        try {
            const savedUser = newUser.save()
            console.log("User added successfully.")
            return savedUser
        } catch(error) {
            console.error("Error creating user:", error.message)
            return null
        }
    }
    else{
        console.error("This user already exists")
        return null
      }    
    
  }

// function to delete user from db
async function deleteUser(user) {
    try {
        const deletedUser = await User.findByIdAndDelete(user._id);
        if (!deletedUser) {
            console.error("User not found");
            return null
        } else {
            console.log("User deleted successfully:", deletedUser);
            return deletedUser
        }
    } catch (error) {
        console.error("Error deleting user:", error.message);
        return null
    }
    
    }

// function to build something
async function buildSomething(user, toolsToBuild, materialsToBuild) {
    try {
        await user.buildSomething(toolsToBuild, materialsToBuild)
    } catch (error) {
        console.error("Error building something:", error.message);
        return null
    }
    
  }

  // function to list borrowed Tools
async function listBorrowedTools(user) {
    try {
        const borrowedTools = await user.getUsedTools()
        console.table(borrowedTools.map(tool => ({
            "Name": tool.name,
            "Cost": tool.cost,
            "Condition": tool.condition
        })))
    } catch (error) {
        console.error("Error listing borrowed tools:", error.message);
        return null
    }
    
  }

  module.exports = { listAllTools, addTool, deleteTool, fixTool,
    listAllMaterials, addMaterial, deleteMaterial,
    listAllUsers, addUser, deleteUser, buildSomething, listBorrowedTools  };