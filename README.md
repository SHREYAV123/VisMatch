# VisMatch

A visual product matching application that allows users to upload images and find similar products using AI-powered image recognition and feature matching.

## Overview

VisMatch is a full-stack web application that combines computer vision with e-commerce functionality. Users can upload product images to find visually similar items from a database of products. The application uses TensorFlow.js for client-side image processing and MongoDB for data storage.

## Features

- **Visual Search**: Upload images to find similar products
- **AI-Powered Matching**: Uses TensorFlow.js for image feature extraction
- **Smart Filtering**: Filter results by category, price range, brand, and similarity threshold
- **Real-time Search**: Fast image processing and matching
- **Responsive Design**: Works on desktop and mobile devices
- **RESTful API**: Clean backend API for product management

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **TensorFlow.js** for image processing
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Multer** for file uploads
- **CORS** enabled for cross-origin requests

## Project Structure

```
vismatch/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   ├── scripts/        # Database scripts
│   │   └── server.ts       # Main server file
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   └── package.json
└── package.json           # Root package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vismatch
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Seed the database (optional)**
   ```bash
   npm run dev:backend
   # In another terminal:
   cd backend && npm run seed
   ```

### Development

**Start both frontend and backend in development mode:**
```bash
npm run start:dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:5173

**Or run them separately:**

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production servers:**
```bash
npm run start
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Search
- `POST /api/search/image` - Upload image and find similar products
- `GET /api/search/similar/:id` - Find products similar to a specific product

### Health
- `GET /api/health` - Health check endpoint

## Available Scripts

### Root Level
- `npm run install:all` - Install dependencies for all packages
- `npm run start:dev` - Start both frontend and backend in development
- `npm run build` - Build both frontend and backend
- `npm start` - Start production servers

### Backend
- `npm run dev` - Start backend in development mode
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run check` - Check database connection

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Visual Search
- Upload images through drag-and-drop interface
- Real-time image processing using TensorFlow.js
- Feature extraction and similarity matching
- Results ranked by visual similarity

### Smart Filtering
- Filter by product category
- Price range slider
- Brand selection
- Minimum similarity threshold
- Maximum number of results

### Image Processing
- Client-side image preprocessing
- Feature vector extraction
- Similarity calculation using cosine distance
- Optimized for performance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.