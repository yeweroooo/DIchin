# DiChin - Chinese Drama Streaming Platform

DiChin is a modern web application for streaming Chinese dramas. It features a responsive frontend built with React and a robust backend powered by Go.

## 🚀 Features

- **Streaming**: Watch your favorite Chinese dramas seamlessly.
- **Search**: Find dramas easily with a powerful search functionality.
- **Trending & Popular**: Stay updated with the latest and most popular dramas.
- **Responsive Design**: Optimized for both desktop and mobile viewing.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Language**: Go
- **Framework**: Gin
- **Configuration**: Godotenv

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Go (v1.21+)

### 1. Clone the Repository
```bash
git clone https://github.com/Start-Ho/Dichini.git
cd Dichini
```

### 2. Backend Setup
Navigate to the backend directory and start the server:

```bash
cd backend
# Create .env file based on example
cp .env.example .env

# Install dependencies
go mod download

# Run the server
go run main.go
```
The backend server will start on `http://localhost:8080`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the development server:

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

## 🔧 Configuration
Configure the `.env` file in the `backend` directory:

```env
ALLOWED_ORIGINS=http://localhost:5173
PORT=8080
RATE_LIMIT=20-S
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
