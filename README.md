# 📸 Memento - Travel Journal App

A modern web app for creating and organizing travel memories with beautiful UI design.

## ✨ Features

- Create and edit travel memories
- Upload and store photos
- Add locations and dates
- Search and filter memories
- Mark favorites
- Responsive design
- User authentication
- Image optimization

## 🚀 Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd Memento
   
   # Server
   cd server && npm install
   
   # Client  
   cd ../client && npm install
   ```

2. **Environment variables**

   Server (.env):
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-journal
   SECRET_KEY=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PORT=3000
   CLIENT_URL=http://localhost:5173
   ```

   Client (.env):
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Run the app**
   ```bash
   # Terminal 1 - Server
   cd server && npm start
   
   # Terminal 2 - Client
   cd client && npm run dev
   ```

4. Open `http://localhost:5173`

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS
**Backend:** Node.js, Express, MongoDB Atlas, JWT, Cloudinary

## 📱 Usage

1. Sign up/login
2. Click "+" to add memories
3. Upload photos and add details
4. Use search and filters to organize
5. Mark favorites

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 Scripts

```bash
# Client
npm run dev    # Development
npm run build  # Production build

# Server  
npm start      # Production
``` 