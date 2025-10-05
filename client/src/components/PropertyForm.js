import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
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

// Component to handle map click events
const LocationMarker = ({ position, setPosition, setAddress }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      
      // Simple reverse geocoding using OpenStreetMap's Nominatim
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
          if (data.display_name) {
            setAddress(data.display_name);
          }
        })
        .catch(error => console.error('Error fetching address:', error));
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={defaultIcon}>
      <Popup>Property Location</Popup>
    </Marker>
  );
};

const center = [11.2742, 77.5887]; // Perundurai coordinates

const PropertyForm = ({ onSubmit, isSubmitting }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  
  // Set initial position when component mounts
  useEffect(() => {
    setPosition(center);
  }, []);

  const onFormSubmit = (data) => {
    if (!position) {
      alert('Please select a location on the map');
      return;
    }
    
    const propertyData = {
      ...data,
      coordinates: {
        lat: position.lat,
        lng: position.lng
      },
      location: address || 'Perundurai, Erode',
      amenities: data.amenities ? data.amenities.split(',').map(item => item.trim()) : [],
      images: data.images ? data.images.split(',').map(item => item.trim()) : [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      ],
      price: Number(data.price),
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      area: Number(data.area),
      available: data.available === 'true'
    };
    
    onSubmit(propertyData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₹/month)</label>
            <input
              type="number"
              {...register('price', { required: 'Price is required', min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <input
              type="number"
              {...register('bedrooms', { required: 'Number of bedrooms is required', min: 1 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.bedrooms && <p className="text-red-500 text-sm">{errors.bedrooms.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
            <input
              type="number"
              {...register('bathrooms', { required: 'Number of bathrooms is required', min: 1 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.bathrooms && <p className="text-red-500 text-sm">{errors.bathrooms.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Area (sq ft)</label>
            <input
              type="number"
              {...register('area', { required: 'Area is required', min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.area && <p className="text-red-500 text-sm">{errors.area.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location (click on the map to select)</label>
          <input
            type="text"
            value={address}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
            placeholder="Click on the map to select location"
          />
          <div className="mt-2 h-96 w-full rounded-md overflow-hidden border border-gray-300">
            {position && (
              <MapContainer 
                center={position} 
                zoom={14} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker 
                  position={position} 
                  setPosition={setPosition} 
                  setAddress={setAddress} 
                />
              </MapContainer>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amenities (comma separated)</label>
          <input
            type="text"
            {...register('amenities')}
            placeholder="e.g., Swimming Pool, Gym, Parking"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URLs (comma separated)</label>
          <input
            type="text"
            {...register('images')}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Owner Name</label>
          <input
            type="text"
            {...register('owner', { required: 'Owner name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.owner && <p className="text-red-500 text-sm">{errors.owner.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Owner Phone</label>
          <input
            type="tel"
            {...register('ownerPhone', { 
              required: 'Owner phone is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit phone number'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.ownerPhone && <p className="text-red-500 text-sm">{errors.ownerPhone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Available</label>
          <select
            {...register('available', { required: 'Please select availability' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          {errors.available && <p className="text-red-500 text-sm">{errors.available.message}</p>}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSubmitting ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
