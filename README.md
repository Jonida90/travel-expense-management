# Front-End Angular Application with Angular Material

This is a front-end application built using Angular and Angular Material. It simulates an expense management system with mock data served by JSON Server. 

## Features
- User login functionality with mock users.
- A responsive UI with Angular Material components.
- Mock data served via a local JSON Server.


## Setting Up the Project

1. **Clone the Repository**
   First, clone this repository to your local machine.

   ```bash
   git clone https://github.com/Jonida90/travel-expense-management.git
   cd your-project

3. **Setting Up the JSON Server**


   1. **Install JSON Server Globally**

      Run the following command:

      ```bash
      npm install -g json-server
      ```

   2. **Created a `db.json` File**

      I have create a file called `db.json`. This file will hold the mock data that the JSON Server will serve. Have used below users for as already users registered of the system.

      ```json
      
      {
        "users": [
          { "id": 1, "username": "enduser", "password": "u1234", "role": "END_USER" },
          { "id": 2, "username": "userapprover", "password": "u1234", "role": "APPROVER" },
          { "id": 3, "username": "userfinance", "password": "u1234", "role": "FINANCE" },
          { "id": 4, "username": "enduser1", "password": "u1234", "role": "END_USER" },
          { "id": 5, "username": "enduser2", "password": "u1234", "role": "END_USER" }
        ]
      }
      ```

      This example contains some mock users with usernames and passwords.

   3. **Start the JSON Server**

     You need to start the JSON Server to serve the data from `db.json`. 

      ```bash
      json-server --watch db.json --port 3000
      ```

      This command will start the JSON Server and watch the `db.json` file for any changes. The server will be available at `http://localhost:3000`.




