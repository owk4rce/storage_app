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
    
    Update the values in the .env file, including your MongoDB connection string.

5. **Run the project:**

    ```bash
    node main.js