# Storage App

This educational project is an inventory management system built with Node.js and Mongoose. It allows users to manage tools and materials, track their condition, and handle borrowing records. The system also supports virtually building something using specific tools and materials.

## Features

- Manage inventory of tools and materials
- Track borrowed tools and their condition
- Build something using specified tools and materials
- Manage users

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v12 or higher)
- [MongoDB](https://www.mongodb.com/) (Make sure MongoDB is running locally or accessible via connection string)
- [Mongoose](https://mongoosejs.com/) (ODM for MongoDB and Node.js)
- [dotenv](https://www.npmjs.com/package/dotenv) (for managing environment variables)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/owk4rce/storage_app.git

2. **Navigate into the project directory:**

    ```bash
    cd storage_app

3. **Install the necessary dependencies, including dotenv:**

    ```bash
    npm install

4. **Configure environment variables:**

    Copy the contents of .env.sample into a new file called .env:

    ```bash
    cp .env.sample .env
    ```

    Update the value of your MongoDB connection string in the .env file.

5. **Run the project:**

    ```bash
    node main.js

## How It Works

This project is built using **4 Mongoose schemas**: `Item`, `Material`, `Tool`, and `User`. The `Item` schema serves as the base schema, with `Material` and `Tool` inheriting from it through discriminators. Below is an overview of the attributes and methods for each schema.

### 1. **Item Schema**
- **Attributes:**
  - `name` (String): The name of the item.
  - `amount` (Number): The quantity in stock.
  - `cost` (Number): The cost of the item.
- **Methods:**
  - `getWorth()`: Calculates the total worth of the item by multiplying the `amount` by the `cost`.
  - `addNew(quantity)`: Adds a specified quantity to the existing `amount`.

### 2. **Tool Schema** (inherits from Item)
- **Attributes:**
  - `condition` (Number): Condition of the tool (from 1 to 100). Every new tool added to the database has an initial `condition` of 100.
  - `usagePurpose` (String): The purpose for which the tool is used.
  - `borrowedByUserIds` (Array): List of user IDs who borrowed the tool.
- **Methods:**
  - `useBy(userId)`: Decreases the `condition` of the tool by 10 if its current `condition` is greater than 15, and records which user borrowed it.
  - `fixTool()`: Increases the `condition` of the tool by 20, up to a maximum of 100.

### 3. **Material Schema** (inherits from Item)
- **Attributes:**
  - `supplier` (String): The supplier of the material.
  - `quality` (String): The quality of the material (values: excellent, normal, poor).
- **Methods:**
  - `use(quantity)`: Decreases the `amount` of the material based on the quantity used.

Materials are uniquely identified not only by their `name` and `cost`, but also by their `supplier` and `quality`.

### 4. **User Schema**
- **Attributes:**
  - `fullName` (String): The full name of the user.
  - `age` (Number): The age of the user. For example, "David Lynch (78)" and "David Lynch (16)" are considered different individuals.
- **Methods:**
  - `useTool(toolId)`: Allows the user to borrow a tool.
  - `getUsedTools()`: Retrieves a list of tools that the user has borrowed.
  - `buildSomething(toolsToBuild, materialsToBuild)`: Allows the user to build an item using a set of tools and materials.

### Tools vs. Materials Storage Approach
The project uses a non-standard approach to storing tools due to the presence of the `condition` attribute. Unlike materials, each tool is stored as a separate document with an `amount` of 1. The total number of tools of the same type is stored in the parent `Item`. This allows for individual tracking of the condition of each tool.

### Intuitive Console Menu
The project features an intuitive console menu that allows users to select various functions of the application. The application is split logically across different files for better organization:
- **`schemas.js`**: Contains all Mongoose schemas.
- **`main.js`**: Handles user input and menu interactions.
- **`functions.js`**: Contains the logic for processing user data.

The entire project is written in English for clarity and consistency.