import React from "react";

interface GoogleMapProps {
  address: string;
  propertyName: string;
}

const GoogleMap = ({ address, propertyName }: GoogleMapProps) => {
  // Create the Google Maps embed URL
  const createMapUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`;
  };

  // Create a fallback URL for direct Google Maps link
  const createDirectMapUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Location</h2>
      <div className="space-y-4">
        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
          <iframe
            src={createMapUrl(address)}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map location for ${propertyName}`}
            className="rounded-lg"
          />
        </div>

        {/* Direct Link to Google Maps */}
        <div className="text-center">
          <a
            href={createDirectMapUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;
