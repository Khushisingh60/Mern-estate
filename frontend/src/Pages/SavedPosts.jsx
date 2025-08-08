import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import ListingItem from "../components/ListingItem.jsx";

export default function SavedPosts() {
  const { currentUser } = useSelector((state) => state.user); // Access current user from Redux
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
      axios
        .get(`http://localhost:3000/api/user/saved/${currentUser._id}`)
        .then((response) => {
          setSavedListings(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching saved listings");
          setLoading(false);
        });
    }
  }, [currentUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Saved Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {savedListings.length === 0 ? (
          <p>You have no saved listings.</p>
        ) : (
          savedListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))
        )}
      </div>
    </div>
  );
}
