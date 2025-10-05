import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Bath, Maximize } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const PropertyCard = ({ property, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ₹{property.price.toLocaleString()}/month
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {property.location}
        </div>
        
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <Home className="w-4 h-4 mr-1" />
            {property.bedrooms} Beds
          </span>
          <span className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {property.bathrooms} Baths
          </span>
          <span className="flex items-center">
            <Maximize className="w-4 h-4 mr-1" />
            {property.area} sqft
          </span>
        </div>
        
        <button
          onClick={() => onView(property)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const HomePage = ({ properties, setSelectedProperty }) => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedPropertyLocal] = useState(null);
  const [mapCenter, setMapCenter] = useState([11.2742, 77.5887]); // Perundurai coordinates

  const viewProperty = (property) => {
    setSelectedProperty(property);
    setSelectedPropertyLocal(property);
    if (property.coordinates) {
      setMapCenter([property.coordinates.lat, property.coordinates.lng]);
    }
    navigate(`/property/${property._id}`);
  };

  // Set initial selected property if properties exist
  useEffect(() => {
    if (properties.length > 0 && !selectedProperty) {
      setSelectedPropertyLocal(properties[0]);
      if (properties[0].coordinates) {
        setMapCenter([properties[0].coordinates.lat, properties[0].coordinates.lng]);
      }
    }
  }, [properties, selectedProperty]);

  return (
    <div className="space-y-8">
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-4">
          Find Your Perfect Home in Perundurai
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Discover comfortable and affordable rental properties in Perundurai. 
          From budget apartments to luxury villas, find your ideal home today.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px] rounded-lg overflow-hidden border border-gray-200">
          <MapContainer 
            center={mapCenter} 
            zoom={14} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {properties.map((property) => (
              <Marker 
                key={property._id} 
                position={[property.coordinates?.lat || 0, property.coordinates?.lng || 0]}
                icon={defaultIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedPropertyLocal(property);
                  },
                }}
              >
                <Popup>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{property.title}</h4>
                    <p className="text-sm">₹{property.price.toLocaleString()}/month</p>
                    <button 
                      onClick={() => viewProperty(property)}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div 
                key={property._id} 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedProperty?._id === property._id 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => {
                  setSelectedPropertyLocal(property);
                  if (property.coordinates) {
                    setMapCenter([property.coordinates.lat, property.coordinates.lng]);
                  }
                }}
              >
                <PropertyCard 
                  property={property} 
                  onView={viewProperty}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No properties found. Be the first to list a property!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
