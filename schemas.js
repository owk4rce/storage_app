const mongoose = require("mongoose");

/* The base schema for "Item" with
------------
attributes:  
------------
name (String): Name of the item.
amount (Number): Quantity of the item in storage.
cost (Number): Cost of the item.
------------
methods:
------------
getWorth(): Return the worth of this item (amount * cost).
addNew(quantity): Add to the amount. */

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0,     //amount should be >= 0
        trim: true
    }, 
    cost: {
        type: Number,
        required: true,
        min: 0,     //cost should be >= 0
        trim: true
    }
},
    {
        collation: { locale: 'en', strength: 2 }  // TeXt = text
    }
  );

itemSchema.methods.getWorth = function() {
    return this.amount * this.cost;
};

itemSchema.methods.addNew = async function(quantity) {
    if (Number.isInteger(quantity) && quantity > 0) {  //check if the variable is correct
        this.amount += quantity
        try {
            const savedItem = await this.save()
            return savedItem
        } catch (error) {
            console.error("Something went wrong while saving new info: ", error)
            return null
        }        
    }
    
    return null
};

const Item = mongoose.model("Item", itemSchema);

/* The schema for "Tool" (inherits "Item") with additional
------------
attributes:  
------------
parent: link to the parent Item that stores cost and amount of all identical tools with different conditions
usagePurpose (String): The purpose of using the tool.
borrowedByUserIds (Array of objectIds): List of user objectIds who borrowed the tool.
condition (Number): from 1 - 100 the state of it.
------------
methods:
------------
useBy(userId): If it's condition is more than 15, use it and remove 10. Otherwise you can’t, also receives a user who used it
fixTool(): Add 20 to condition but not more than 100 in total*/

const toolSchema = new mongoose.Schema({
    parent: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Item'
    },
    usagePurpose: {
        type: String,
        default: "Build something",
        trim: true
    },
    borrowedByUserIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }], 
    condition: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
        default: 100
    }

});

toolSchema.methods.useBy = async function(userId) {
    if(this.condition > 15) {
        this.condition -= 10
        if (!this.borrowedByUserIds.includes(userId)) {
            this.borrowedByUserIds.push(userId)
        }
        
        try{
            await this.save()
            return true
        } catch(error){
            console.error("Something went wrong while saving new info: ", error)
            return false
        }
    }
    console.error(`The condition of ${this.name} doesn't allow to use this tool.`)
    return false

};

toolSchema.methods.fixTool = async function() {
    console.log(this.condition)
    this.condition = Math.min(this.condition + 20, 100)
    try{
        const savedTool = await this.save()
        return savedTool
    } catch{
        console.error("Something went wrong while saving new info: ", error)
        return null
    }
}

const Tool = Item.discriminator('Tool', toolSchema);        //inheritance

/* The schema for "Material" (inherits "Item") with additional
------------
attributes:  
------------
supplier (String): Name of the supplier.
quality (String): Quality rating of the material.
------------
methods:
------------
use(quantity): Remove how much we are using */

const materialSchema = new mongoose.Schema({
    supplier: {
        type: String,
        required: true,
        trim: true
    },
    quality: {
        type: String,
        required: true,
        enum: ["excellent", "normal", "poor"],
        lowercase: true,
        trim: true
    }
}
);

materialSchema.methods.use = async function(quantity) {
    if(Number.isInteger(quantity) && this.amount >= quantity) {
        this.amount -= quantity
        try{
            await this.save()
            return true
        } catch{
            console.error("Something went wrong while saving new info: ", error)
            return false
        }
    }

    return false
    
}

const Material = Item.discriminator('Material', materialSchema);    //inheritance

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 12
    }
},
    {
        collation: { locale: 'en', strength: 2 }  // TeXt = text
    }
    
);

userSchema.methods.useTool = async function(toolId) {
    const isFound = await Tool.findById(toolId)

    if(!isFound) {
        console.error("The tool is not found. Try again or add a new tool.")
        return false
    }

    const check = await isFound.useBy(this._id)

    return (check) ? true : false

}

userSchema.methods.getUsedTools = async function() {
    const tools = await Tool.find({ borrowedByUserIds: this._id });
    return tools
}

userSchema.methods.buildSomething = async function(toolsToBuild, materialsToBuild) {
    for (let tool of toolsToBuild) {
        await this.useTool(tool._id)
    }

    for (let material of materialsToBuild) {
         
        material.material.use(material.quantity)
    }

    
    return true
}

const User = mongoose.model("User", userSchema);

module.exports = { Item, Tool, Material, User };
