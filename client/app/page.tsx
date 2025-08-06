"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Property {
  id?: number;
  name: string;
  address?: string | null;
  city?: string | null;
  county?: string | null;
  zipcode?: string | null;
  state?: string | null;
  phone?: string | null;
  type?: string | null;
  capacity?: number | null;
  mainImage?: string | null;
  images?: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    // Filter properties based on search term
    if (searchTerm.trim() === "") {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter((property) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          property.name.toLowerCase().includes(searchLower) ||
          (property.city &&
            property.city.toLowerCase().includes(searchLower)) ||
          (property.state && property.state.toLowerCase().includes(searchLower))
        );
      });
      setFilteredProperties(filtered);
    }
  }, [searchTerm, properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/properties");
      setProperties(response.data.data);
      setFilteredProperties(response.data.data);
    } catch (err) {
      setError("Failed to fetch properties");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    try {
      setScraping(true);
      setError("");

      const response = await axios.get(
        "http://localhost:3001/api/scrape/scrape"
      );

      if (response.data.success) {
        // Refresh the properties list after successful scraping
        await fetchProperties();
        alert(
          `Successfully scraped ${response.data.data.totalScraped} properties!`
        );
      } else {
        setError("Scraping failed");
      }
    } catch (err) {
      setError("Failed to scrape properties");
      console.error("Error scraping properties:", err);
    } finally {
      setScraping(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/properties/${id}`);
      fetchProperties();
    } catch (err) {
      setError("Failed to delete property");
      console.error("Error deleting property:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BoomersHub Property Management
          </h1>
          <p className="text-xl text-gray-600">
            Property Management System with Web Scraping
          </p>
        </header>

        {/* Scrape Button */}
        <div className="mb-8 text-center">
          <button
            onClick={handleScrape}
            disabled={scraping}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scraping ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto mb-2"></div>
                Scraping Properties...
              </>
            ) : (
              "🚀 Scrape Properties from CSV"
            )}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            This will scrape property data from the CSV file and populate the
            database
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by property name, city, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Properties ({filteredProperties.length})
            {searchTerm && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                - Filtered by "{searchTerm}"
              </span>
            )}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? (
                <p className="text-lg mb-4">
                  No properties found matching "{searchTerm}".
                </p>
              ) : (
                <>
                  <p className="text-lg mb-4">No properties found.</p>
                  <p className="text-sm">
                    Click the "Scrape Properties" button above to populate the
                    database with property data from the CSV file.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        {property.mainImage && (
                          <div className="flex-shrink-0">
                            <img
                              src={property.mainImage}
                              alt={property.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/property/${property.id}`}
                            className="block hover:text-primary-600 transition-colors"
                          >
                            <h3 className="font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                              {property.name}
                            </h3>
                          </Link>
                          {property.address && (
                            <p className="text-gray-600">{property.address}</p>
                          )}
                          <div className="text-sm text-gray-500 mt-1">
                            {property.city && <span>{property.city}</span>}
                            {property.city && property.state && <span>, </span>}
                            {property.state && <span>{property.state}</span>}
                            {(property.city || property.state) &&
                              property.zipcode && <span> </span>}
                            {property.zipcode && (
                              <span>{property.zipcode}</span>
                            )}
                          </div>
                          {property.county && (
                            <p className="text-xs text-gray-400">
                              County: {property.county}
                            </p>
                          )}
                          {property.phone && (
                            <p className="text-xs text-gray-400">
                              Phone: {property.phone}
                            </p>
                          )}
                          {property.type && (
                            <p className="text-xs text-gray-400">
                              Type: {property.type}
                            </p>
                          )}
                          {property.capacity && (
                            <p className="text-xs text-gray-400">
                              Capacity: {property.capacity}
                            </p>
                          )}
                          {property.created_at && (
                            <p className="text-xs text-gray-400">
                              Created:{" "}
                              {new Date(
                                property.created_at
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(property.id!)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
