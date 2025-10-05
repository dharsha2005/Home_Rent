# Perundurai Home Rentals

A modern property rental platform built with React, Tailwind CSS, and React Router. This application allows users to browse, book, and manage property rentals in Perundurai.

## Features

- Browse available properties with filters
- View property details with high-quality images and descriptions
- User authentication (login/register)
- Add properties to cart and proceed to checkout
- View booking history
- Responsive design for all devices

## Technologies Used

- React 18
- React Router v6
- Tailwind CSS for styling
- Lucide Icons
- Axios for API requests
- React Context API for state management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/perundurai-rentals.git
   cd perundurai-rentals
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
  ├── components/       # Reusable UI components
  ├── context/         # React context providers
  ├── pages/           # Page components
  ├── styles/          # Global styles and Tailwind CSS
  ├── App.js           # Main application component
  ├── index.js         # Application entry point
  └── index.css        # Global styles
```

## Available Scripts

- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build the application for production
- `npm run eject` - Eject from Create React App (one-way operation)

## Backend API

This application requires a backend API to function properly. The backend should provide the following endpoints:

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get a single property
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `POST /api/payment/process` - Process payment
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings/from-cart` - Create bookings from cart

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
