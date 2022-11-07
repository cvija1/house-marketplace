import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const params = useParams();
  const auth = getAuth();
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return loading ? (
    <Spinner />
  ) : (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="swiperSlideDiv">
              <img src={url} className="swiperSlideImg" alt="c" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
        <ul className="listingDeatilsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : `1 Bedroom`}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bedrooms} Bathrooms`
              : `1 Bathroom`}
          </li>
          {listing.parking && <li>Parking Spot</li>}
          {listing.furnished && <li>Furnished</li>}
        </ul>

        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <Map
            mapboxAccessToken={process.env.REACT_APP_GEOCODE_API_KEY}
            initialViewState={{
              longitude: parseFloat(listing.geolocation.lng),
              latitude: parseFloat(listing.geolocation.lat),
              zoom: 14,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <Marker
              style={{ cursor: "pointer" }}
              longitude={listing.geolocation.lng}
              latitude={listing.geolocation.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setShowPopup(true);
                setTimeout(() => {
                  setShowPopup(false);
                }, 1000);
              }}
            />
            {showPopup && (
              <Popup
                longitude={listing.geolocation.lng + 0.0001}
                latitude={listing.geolocation.lat + 0.0001}
                anchor="bottom"
                onClose={() => setShowPopup(false)}
              >
                {listing.location}
              </Popup>
            )}
          </Map>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
