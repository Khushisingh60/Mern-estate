import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaDumbbell, FaCoffee, FaTree, FaDog, FaWifi, FaUtensils, FaShoppingCart, FaBus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function LifestyleMatch() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState({
    gyms: false,
    cafes: false,
    parks: false,
    petFriendly: false,
    quietArea: false,
    restaurants: false,
    shopping: false,
    publicTransport: false
  });
  
  const [matchedListings, setMatchedListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
    }
  }, [currentUser, navigate]);

  const preferenceOptions = [
    { key: 'gyms', label: 'Near Gyms & Fitness', icon: FaDumbbell, color: 'text-blue-500' },
    { key: 'cafes', label: 'Near Cafes & Coffee Shops', icon: FaCoffee, color: 'text-amber-600' },
    { key: 'parks', label: 'Green Areas & Parks', icon: FaTree, color: 'text-green-500' },
    { key: 'petFriendly', label: 'Pet-Friendly', icon: FaDog, color: 'text-purple-500' },
    { key: 'quietArea', label: 'Quiet for Remote Work', icon: FaWifi, color: 'text-indigo-500' },
    { key: 'restaurants', label: 'Near Restaurants', icon: FaUtensils, color: 'text-red-500' },
    { key: 'shopping', label: 'Near Shopping Centers', icon: FaShoppingCart, color: 'text-pink-500' },
    { key: 'publicTransport', label: 'Near Public Transport', icon: FaBus, color: 'text-cyan-500' }
  ];

  const handlePreferenceToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleFindMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const selectedPreferences = Object.keys(preferences).filter(key => preferences[key]);
      
      if (selectedPreferences.length === 0) {
        setError('Please select at least one lifestyle preference');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/lifestyle/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences: selectedPreferences })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch matches');
      }

      setMatchedListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLifestyleScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Find Your Perfect Lifestyle Match
        </h1>
        <p className="text-slate-600 mb-6">
          Select your lifestyle preferences and we'll find homes that match your way of living
        </p>

        {/* Preference Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {preferenceOptions.map(({ key, label, icon: Icon, color }) => (
            <div
              key={key}
              onClick={() => handlePreferenceToggle(key)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                preferences[key]
                  ? 'border-slate-700 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`text-2xl ${color}`} />
                <span className="text-sm font-medium text-slate-700">{label}</span>
              </div>
              <div className="mt-2">
                <input
                  type="checkbox"
                  checked={preferences[key]}
                  onChange={() => {}}
                  className="w-4 h-4"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Find Matches Button */}
        <button
          onClick={handleFindMatches}
          disabled={loading}
          className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:bg-slate-400 transition-colors"
        >
          {loading ? 'Finding Your Matches...' : 'Find Lifestyle Matches'}
        </button>

        {error && (
          <p className="text-red-600 mt-4 text-center">{error}</p>
        )}
      </div>

      {/* Matched Listings */}
      {matchedListings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Your Lifestyle Matches ({matchedListings.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/listing/${listing._id}`)}
              >
                <img
                  src={listing.imageUrls[0] || '/placeholder.jpg'}
                  alt={listing.name}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-slate-800 truncate">
                      {listing.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getLifestyleScoreColor(listing.lifestyleScore)}`}>
                      {listing.lifestyleScore}%
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-2">{listing.address}</p>
                  
                  <p className="text-slate-800 font-bold text-xl mb-3">
                    ${listing.regularPrice?.toLocaleString()}
                    {listing.type === 'rent' && '/month'}
                  </p>

                  {/* Matched Amenities */}
                  {listing.matchedAmenities && listing.matchedAmenities.length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs text-slate-500 mb-2">Nearby:</p>
                      <div className="flex flex-wrap gap-2">
                        {listing.matchedAmenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && matchedListings.length === 0 && error === null && (
        <div className="text-center py-12">
          <FaHeart className="text-6xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">
            Select your preferences and click "Find Lifestyle Matches" to discover homes perfect for you
          </p>
        </div>
      )}
    </div>
  );
}