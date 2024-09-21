const { Item, Tool, Material, User } = require('./schemas');

// Function to find all materials
async function listAllMaterials() {
    try {
      const materials = await Material.find({});
      if (materials.length === 0) {
        console.log("\x1b[33m%s\x1b[0m", "No materials found in db.");
      } else {    
        
        console.log("Materials:");
        console.table(materials.map(material => ({
            "Name": material.name,
            "Amount": material.amount,
            "Cost": material.cost,
            "Worth": material.getWorth(),
            "Quality": material.quality,
            "Supplier": material.supplier         
            
            
          })));
        
        
      }
    } catch (error) {
      console.error("Error displaying materials:", error.message);
    }
  }

// function to create material and save to db (identification: name, cost, supplier; wood with the cost 100 is not the wood with the cost 200)
async function addMaterial(name, amount, cost, supplier, quality) {
    const isFound = await Material.findOne({name, cost, supplier, quality}) // checking if this material already exists
    if(!isFound) {  //if not
        const newMaterial = new Material({ name, amount, cost, supplier, quality })
        try {
            const savedMaterial = await newMaterial.save()
            console.log("Material added successfully.")
            return savedMaterial
        } catch(error) {
            console.error("Error creating material:", error.message)
            return null
        }
    }
    else{
        console.log("\x1b[33m%s\x1b[0m", "This material already exists. The amount will be increased")
        isFound.amount += amount
        try {
            const savedMaterial = await isFound.save()
            return savedMaterial
        } catch(error) {
            console.error("Error saving material:", error.message)
            return null
        }
        
      }    
    
  }

// function to delete material from db or decrease amount
async function deleteMaterial(name, cost, supplier, quality, quantity) {
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
    
  }

// Function to find all users
async function listAllUsers() {
    try {
      const users = await User.find({});
      if (users.length === 0) {
        console.log("\x1b[33m%s\x1b[0m", "No users found in db.");
      } else {    
        
        console.log("Users:");
        console.table(users.map(user => ({
            "Full name": user.fullName,
            "Age": user.age
            // borrowed tools         
            
            
          })));
        
        
      }
    } catch (error) {
      console.error("Error displaying users:", error.message);
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
async function deleteUser(fullName, age) {
    try {
        const deletedUser = await User.findOneAndDelete({ fullName, age });
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

  module.exports = { listAllMaterials, addMaterial, deleteMaterial, listAllUsers, addUser, deleteUser  };