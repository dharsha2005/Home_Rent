import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Home, Bath, Maximize, ShoppingCart, Phone, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../context/AuthContext';

// Fix for default marker icons in Leaflet
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const PropertyDetails = ({ fetchCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMap, setShowMap] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/properties/${id}`);
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
        setMessage('Error loading property details');
      }
    };

    fetchProperty();
  }, [id]);

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const startMonth = parseInt(checkIn.split('-')[1]) - 1; // 0-indexed months
    const endMonth = parseInt(checkOut.split('-')[1]) - 1;
    const months = (endMonth - startMonth + 12) % 12 + 1; // Handle year wrap-around
    return months * property.price;
  };

  const addToCart = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!checkIn || !checkOut) {
      setMessage('Please select check-in and check-out dates');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setMessage('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property._id,
          checkIn,
          checkOut,
          totalPrice: calculateTotalPrice()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Property added to cart successfully!');
        await fetchCart();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error adding to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openGoogleEarth = () => {
    const { lat, lng } = property.coordinates;
    const googleEarthUrl = `https://earth.google.com/web/@${lat},${lng},100a,1000d,35y,0h,0t,0r`;
    window.open(googleEarthUrl, '_blank');
  };

  if (!property) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline flex items-center"
      >
        ← Back to Properties
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <img
            src={property.images[0] || 'https://via.placeholder.com/800x400?text=No+Image'}
            alt={property.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
            ₹{property.price.toLocaleString()}/month
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-5 h-5 mr-2" />
            {property.location}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Home className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">{property.bedrooms}</div>
              <div className="text-sm text-gray-600">Bedrooms</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Bath className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">{property.bathrooms}</div>
              <div className="text-sm text-gray-600">Bathrooms</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Maximize className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">{property.area}</div>
              <div className="text-sm text-gray-600">Sq Ft</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Description</h3>
            <p className="text-gray-700">{property.description}</p>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Owner Details</h3>
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-medium">{property.owner || 'N/A'}</p>
                <p className="text-gray-600 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {property.ownerPhone || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Location</h3>
            <div className="space-y-4">
              <p className="text-gray-700 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {property.location || 'Location not specified'}
              </p>
              
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Map className="w-4 h-4 mr-1" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>

              {showMap && property.coordinates && (
                <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer 
                    center={[property.coordinates.lat, property.coordinates.lng]} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker 
                      position={[property.coordinates.lat, property.coordinates.lng]} 
                      icon={defaultIcon}
                    >
                      <Popup>{property.title}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Book This Property</h3>
            
            {message && (
              <div className={`mb-4 p-3 rounded ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Check-in Month</label>
                <select
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select month</option>
                  {Array.from({length: 12}, (_, i) => {
                    const date = new Date(selectedYear, i, 1);
                    return (
                      <option key={i} value={`${selectedYear}-${String(i + 1).padStart(2, '0')}`}>
                        {date.toLocaleString('default', { month: 'long' })}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Check-out Month</label>
                <select
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  disabled={!checkIn}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="">Select month</option>
                  {checkIn && Array.from({length: 12}, (_, i) => {
                    const currentMonth = parseInt(checkIn.split('-')[1]);
                    if (i + 1 <= currentMonth) return null;
                    const date = new Date(selectedYear, i, 1);
                    return (
                      <option key={i} value={`${selectedYear}-${String(i + 1).padStart(2, '0')}`}>
                        {date.toLocaleString('default', { month: 'long' })}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Total Price</label>
                <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg font-semibold">
                  ₹{calculateTotalPrice().toLocaleString()}
                  {checkIn && checkOut && (
                    <span className="block text-sm font-normal text-gray-500">
                      ({Math.ceil(calculateTotalPrice() / property.price)} months)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={addToCart}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
