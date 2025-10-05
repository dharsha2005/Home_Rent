const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';
const BASE_URL = 'https://maps.googleapis.com/maps/api';

async function testMapsAPI() {
  try {
    console.log('Testing Google Maps JavaScript API...');
    const mapsResponse = await axios.get(
      `${BASE_URL}/js?key=${API_KEY}&callback=initMap`
    );
    console.log('✅ Google Maps JavaScript API is accessible');
  } catch (error) {
    console.error('❌ Error accessing Google Maps JavaScript API:', error.response?.data || error.message);
  }

  try {
    console.log('\nTesting Geocoding API...');
    const geocodeResponse = await axios.get(
      `${BASE_URL}/geocode/json?address=Perundurai&key=${API_KEY}`
    );
    
    if (geocodeResponse.data.status === 'OK') {
      console.log('✅ Geocoding API is working');
      console.log('Sample location data:', {
        address: geocodeResponse.data.results[0]?.formatted_address,
        location: geocodeResponse.data.results[0]?.geometry.location
      });
    } else {
      console.error('❌ Geocoding API error:', geocodeResponse.data.error_message || geocodeResponse.data.status);
    }
  } catch (error) {
    console.error('❌ Error accessing Geocoding API:', error.response?.data || error.message);
  }
}

testMapsAPI();
