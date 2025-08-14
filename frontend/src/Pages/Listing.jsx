
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import { MdLocationOn, MdLocationCity, MdCropSquare } from 'react-icons/md';
import axios from "axios";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaHeart,
} from "react-icons/fa";
import Contact from "../Components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [saved, setSaved] = useState(() => {
    // Retrieve saved listings from localStorage
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
    return new Set(savedPosts); // Use a Set for easy management
  });
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/listing/get/${params.listingId}`
        );
        if (!data || data.success === false) {
          console.error("API responded with an error:", data);
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const toggleSaveListing = async (listingId) => {
    try {
      if (saved.has(listingId)) {
        console.log("saved")
        const response = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/unsave/${currentUser._id}`,
          { data: { listingId } } // Pass the listingId in the request body
        );
  
        const updatedSavedPosts = response.data.savedPosts;
        setSaved(new Set(updatedSavedPosts));
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/save/${currentUser._id}`,
          { listingId }
        );
  
        const updatedSavedPosts = response.data.savedPosts;
        setSaved(new Set(updatedSavedPosts));
      }
    } catch (error) {
      
      console.error("Error toggling save state:", error);
    }
  };
  
  
  
  
  
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}

      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 flex items-center gap-4">
            {/* Share Icon */}
            <div className="border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
              <FaShare
                className="text-slate-500"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
           
            <div
              className="border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer"
              
            >
             
             <FaHeart
             className={saved.has(params.listingId) ? "text-red-500" : "text-slate-500"}
             onClick={() => toggleSaveListing(params.listingId)}
             />


            </div>

          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className='flex items-center gap-1'>
                        <MdLocationCity className='h-4 w-4 text-blue-700' />
                        <p className='text-sm text-gray-600 truncate'>
                          {listing.city}
                        </p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <MdCropSquare className='h-4 w-4 text-orange-700' />
                        <p className='text-sm text-gray-600 truncate'>
                          {listing.colony}
                        </p>
                      </div>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
