"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import GoogleMap from "@/components/GoogleMap";
import { Property } from "@/types/property";

export default function PropertyDetails() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id]);

  const fetchProperty = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`
      );
      const propertyData = response.data.data;
      setProperty(propertyData);
    } catch (err) {
      setError("Failed to fetch property details");
      console.error("Error fetching property:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === property.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images!.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || "Property not found"}
          </div>
          <Link href="/" className="btn-primary">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const hasMultipleImages = property.images && property.images.length > 1;

  // Construct full address for Google Maps
  const constructFullAddress = () => {
    const addressParts = [
      property.address,
      property.city,
      property.state,
      property.zipcode,
    ].filter(Boolean);

    return addressParts.join(", ");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Properties
          </Link>
        </div>

        {/* Property Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {property.name}
          </h1>
          {property.address && (
            <p className="text-lg text-gray-600">{property.address}</p>
          )}
          <div className="text-gray-500">
            {property.city && <span>{property.city}</span>}
            {property.city && property.state && <span>, </span>}
            {property.state && <span>{property.state}</span>}
            {(property.city || property.state) && property.zipcode && (
              <span> </span>
            )}
            {property.zipcode && <span>{property.zipcode}</span>}
          </div>
        </div>

        {/* Image Gallery */}
        {property.images && property.images.length > 0 && (
          <div className="mb-8">
            <div className="relative">
              <img
                src={property.images[currentImageIndex]}
                alt={property.name}
                className="w-full h-96 object-cover rounded-lg cursor-pointer"
                onClick={hasMultipleImages ? nextImage : undefined}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />

              {/* Image Navigation */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} of {property.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            {hasMultipleImages && (
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.name} - Image ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-primary-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Property Details and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Property Information
            </h2>
            <div className="space-y-3">
              {property.county && (
                <div>
                  <span className="font-medium text-gray-700">County:</span>
                  <span className="ml-2 text-gray-600">{property.county}</span>
                </div>
              )}
              {property.phone && (
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <a
                    href={`tel:${property.phone}`}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    {property.phone}
                  </a>
                </div>
              )}
              {property.type && (
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-2 text-gray-600">{property.type}</span>
                </div>
              )}
              {property.capacity && (
                <div>
                  <span className="font-medium text-gray-700">Capacity:</span>
                  <span className="ml-2 text-gray-600">
                    {property.capacity} beds
                  </span>
                </div>
              )}
              {property.created_at && (
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(property.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Google Maps */}
          {constructFullAddress() && (
            <div className="lg:col-span-2">
              <GoogleMap
                address={constructFullAddress()}
                propertyName={property.name}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
