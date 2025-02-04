# UniTraffic-Backend Setup Guide

## 1. First, clone the repository from Github and navigate to the project directory:
```bash
git clone https://github.com/uni-traffic/uni-traffic-backend.git  
cd uni-traffic-backend  
```

## 2. Install Required Tools
Before proceeding, ensure you have the following tools installed:
• [Postman](https://www.postman.com/downloads/) (for API testing) - After installation, sign in using "Continue with Google".
• [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for containerized database)

If you encounter the following error in Docker:
```
WSL update failed: update failed: updating WSL: exit code: 1: running WSL command wsl.exe C:\WINDOWS\System32\wsl.exe --update --web-download: exit status 1
```
Resolve it by running the following command in Command Prompt (CMD): 
```
wsl --update
```
## 3. Verify Docker Installation
After installing Docker, open VS Code and check if Docker is installed correctly:
```
docker -v
```

## 4. Install Dependencies
Inside the project directory, install the required dependencies using pnpm:
```bash
pnpm install
```

## 5. Set Up the Database
Start the database using:
```bash
pnpm db:start  
```
To check the database status:
```bash
pnpm db:status  
```
To stop the database:
```
pnpm db:stop  
```

## 6. Set Up Environment Variables
You need to configure environment variables for the project.
Copy the example .env file:

`bash`
```bash
cp .env.example .env
```

`cmd`
```cmd
copy .env.example .env
```

Edit the .env file and update the required variables (e.g., API keys, database credentials).

## 7. Set Up Supabase PostgreSQL Database
1. Go to Supabase and sign in.
2. Create a new project.
3. Navigate to Database > Connect > URI and copy your database URL.
4. Update the .env file with your Supabase database credentials:
```
DATABASE_URL="postgresql://postgres:[USERNAME]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

## 8. Run the Development Server
Start the development server:
```
pnpm dev  
```

## 9. Test the API with Postman
1. Open Postman.
2. Click the send api request
3. Enter the following URL in the request bar:
```
http://localhost:3000/api/v1
```
4. Click Send to test the API.
