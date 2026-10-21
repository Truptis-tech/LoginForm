LoginForm — My First Login Portal

A full-stack login portal built using React.js and Python Flask, with a focus on frontend-backend integration, database management, and API testing.

📌 About the Project
LoginForm is a web development project designed to demonstrate how a React frontend communicates with a Flask backend to support login-related functionality.
The project separates the frontend and backend to make the application easier to develop, test, and maintain.

✨ Features
- React.js-based frontend
- Python Flask backend
- Frontend-backend API integration
- Database schema managed through SQL
- API testing
- Git and GitHub version control
- User registration
- Login validation
- Password hashing

🛠️ Technologies Used
Technology          |               Purpose
React.js            |           Building the frontend user interface
JavaScript          |           Frontend functionality and interactions
HTML & CSS          |           Page structure and styling
Python              |           Backend programming
Flask               |           Backend web framework and API development 
SQLite              |           Database for storing application data
SQL                 |           Database queries and operations
npm                 |           Frontend package management
Git and GitHub      |           Version control and project hosting

📂 Project Structure

LoginForm/
├── Backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── schema.sql
│   ├── users.db
│   ├── venv/              # Local virtual environment
│   └── __pycache__/       # Generated Python cache
│
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/      # Installed dependencies
│
├── api testing/
├── .gitignore
└── README.md

The "venv", "__pycache__", and "node_modules" directories are generated locally and should not normally be committed to GitHub.

⚙️ Prerequisites
Install the following software:

- "Python" (https://www.python.org/downloads/)
- "Node.js and npm" (https://nodejs.org/)
- "Git" (https://git-scm.com/)

🚀 Installation and Setup

Follow these instructions to run the project locally on Windows.
Step 1: Clone the repository
Open PowerShell or a terminal and run:

git clone https://github.com/Truptis-tech/LoginForm.git
cd LoginForm

Step 2: Set up the backend
Open the first terminal:

cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Start the Flask application:
python app.py

Keep this terminal open while running the application.

The backend address and port depend on the configuration in "app.py". Check the terminal output for the actual URL.

Step 3: Set up the frontend
Open a second terminal from the project root:

cd Frontend
npm install

Start the React development server:
npm start

The application will normally open at:
http://localhost:3000

If it does not open automatically, enter the URL in your browser. If port 3000 is already in use, React may suggest another port.

Step 4: Configure the database
The backend contains "schema.sql" and "users.db".

If the application requires database initialization, follow the SQL setup implemented in the project. Do not assume that an existing database is automatically recreated when someone clones the repository.

Step 5: Connect the frontend and backend
Ensure the React application sends API requests to the correct Flask backend URL and port.

If the backend requires environment variables, configure them locally using the variable names expected by the application. Do not publish actual passwords, API keys, or other secrets.

🧪 API Testing
The repository includes an "api testing" directory.
Use the tests or API collection provided there to verify the available endpoints.

Recommended checks:
- Confirm the Flask server starts successfully.
- Test the implemented login endpoint.
- Check how the application handles valid and invalid inputs.
- Verify that frontend requests reach the backend.
- Confirm the expected database behavior.

Document the actual API endpoints, test tool, and commands once verified.



Add screenshots of the working application here.

Screenshots attached:
1. Login page
2. Login validation or error messages
3. Successful login flow
<img width="1600" height="832" alt="Image 3" src="https://github.com/user-attachments/assets/daaa1689-a13e-417a-90a3-9df044b3aef3" />
<img width="1600" height="832" alt="Image 1" src="https://github.com/user-attachments/assets/8a47b3d0-d694-4193-bea7-78d3dd108540" />
<img width="1568" height="788" alt="Image 2" src="https://github.com/user-attachments/assets/ec687778-bc57-41cb-b8ce-02fe861f32fe" />


🔐 Security
- Never commit passwords, API keys, access tokens, or private credentials.
- Keep local environment files out of version control.
- Do not include real user credentials or sensitive personal information in screenshots or database files.
- Store passwords securely using a suitable password-hashing method if authentication is implemented.
- Use appropriate security settings before deploying the application publicly.

🔮 Future Improvements
Potential improvements, depending on the current implementation:

- Improve form validation and error handling.
- Expand API test coverage.
- Improve the user interface and accessibility.
- Deploy the frontend and backend for online access.

👩‍💻 Author:
Truptis-tech

GitHub: "https://github.com/Truptis-tech" (https://github.com/Truptis-tech)

📄 License
No license has been specified for this.

This project is intended for learning and development. Verify the setup instructions and security practices before using it in production.
