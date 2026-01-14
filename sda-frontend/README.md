# SDA E-Commerce Frontend

A modern React-based frontend for the SDA e-commerce platform built with Vite.

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.css
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.css
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── Orders/
│   │   ├── Profile/
│   │   ├── OrderHistory/
│   │   ├── OrderDetail/
│   │   ├── EditProfile/
│   │   ├── Cart/
│   │   ├── About/
│   │   └── Wishlist/
│   ├── products/
│   │   ├── ProductList/
│   │   ├── ProductDetail/
│   │   ├── ProductCard/
│   │   ├── ProductReviews/
│   │   └── AddReview/
│   └── auth/
│       ├── Login/
│       └── Register/
├── services/
│   ├── AuthService.jsx
│   └── api.js
├── utils/
│   └── helpers.js
├── App.jsx
├── App.css
└── main.jsx
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will run on `http://localhost:5173`

### Build

```bash
npm run build
```

## Features

- Component-based architecture with scoped CSS
- React Router for navigation
- Context API for authentication
- API client for backend communication
- Responsive design

## Environment Variables

Create a `.env` file in the root:

```
VITE_API_BASE=http://localhost:8000
```
