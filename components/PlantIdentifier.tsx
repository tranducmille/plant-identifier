// components/PlantIdentifier.tsx
import React, { useState, useRef } from "react";
import { Upload, Leaf, Info, Camera, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface PlantInfo {
  name: string;
  scientificName: string;
  family: string;
  nativeRegion: string;
  growthHabit: string;
  flowerColor: string;
  leafType: string;
  description: string;
}

const PlantIdentifier: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [urlImage, setUrlImage] = useState<string>(""); 
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlImageSubmit = async () => {
    if (urlImage) {
      try {
        const response = await fetch(`/api/fetch-image?url=${encodeURIComponent(urlImage)}`);
        if (!response.ok) {
          throw new Error('Error fetching image');
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setImage(base64data);
          identifyPlant(base64data); // Call identifyPlant with the Base64 string
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        setError("Error fetching image. Please check the URL.");
        console.error(error);
      }
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        identifyPlant(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const identifyPlant = async (imageData: string) => {
    setLoading(true); // Set loading to true
    try {
      const response = await fetch("/api/identify-plant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error("Failed to identify plant");
      }

      const data = await response.json();
      setPlantInfo(data);
      setError(null);
    } catch (err) {
      setError("Error identifying plant. Please try again.");
      console.error(err);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="bg-green-700 min-h-screen flex flex-col text-white">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold"></h1>
        <nav>
          <a href="#" className="hover:underline px-4">
            Home
          </a>
          <a href="#" className="hover:underline px-4">
            About
          </a>
          <a href="#" className="hover:underline px-4">
            Contact
          </a>
          <a href="#" className="hover:underline px-4">
            Gallery
          </a>
        </nav>
      </header>

      <main className="px-4 py-1 text-center flex-grow">
        <h2 className="text-4xl font-bold mb-4">My Plant Identifier</h2>
        <p className="mb-8">
          Discover the wonders of nature! Upload an image of a plant, and let
          our AI identify it for you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center transition duration-300"
          >
            <Upload className="mr-2" /> Upload Image
          </button>
          <button
            onClick={handleCameraCapture}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center transition duration-300"
          >
            <Camera className="mr-2" /> Capture Image
          </button>
        </div>
        <div className="flex flex-row items-center text-center justify-center mb-2">
            Or
         </div>
        <div className="flex flex-row items-center text-center justify-center mb-8">
          <input
            type="text"
            placeholder="Enter image URL"
            value={urlImage}
            onChange={(e) => setUrlImage(e.target.value)} // Update URL state
            className="border rounded p-2 w-1/3 text-black"
          />
          <button
            onClick={handleUrlImageSubmit}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center transition duration-300 ml-5"
          >
            <Send className="mr-2" /> Identify Plant
          </button>
          
        </div>
        {error && (
          <Alert variant="destructive" className="mb-8  mx-auto max-w-screen-md text-red-500">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading && ( // Show loading spinner when loading
          <div className="flex justify-center mb-4">
            <div className="loader"></div>
          </div>
        )}
        {plantInfo && !loading && (
          <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-8 mb-2 mx-auto max-w-screen-lg">
          
            <div className="flex flex-col md:flex-row">
              {image && (
                <div className="mb-12 ">
                  <Image
                    src={image}
                    alt="Uploaded plant"
                    width={600} // Set width
                    height={600} // Set height
                    className="py-1 px-1 object-cover mx-auto shadow-lg rounded-lg overflow-hidden border-2 border-white" // Added border styles
                  />
                </div>
              )}
              <div>
              <h2 className="text-3xl font-semibold mb-2 text-green-700  text-left pl-10 ">
                {plantInfo.name}
                </h2>
                <p className="text-gray-600 mb-8 text-left pl-10">
                  {plantInfo.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg p-4 bg-green-700 text-white">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Basic Information
                </h3>
                <table className="w-full border-collapse text-left">
                  <tbody className="w-full border-collapse text-left">
                    {[
                      {
                        label: "Scientific Name",
                        value: plantInfo.scientificName,
                      },
                      { label: "Family", value: plantInfo.family },
                      { label: "Native Region", value: plantInfo.nativeRegion },
                    ].map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-400 last:border-b-0 text-left"
                      >
                        <td className="py-1 px-1 w-1/3 font-semibold text-left">
                          {item.label}:
                        </td>
                        <td className="py-1 px-1 text-left">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-green-700 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4 text-white text-center">
                  Characteristics
                </h3>
                <table className="w-full border-collapse text-left">
                  <tbody  className="w-full border-collapse text-left">
                    {[
                      { label: "Growth Habit", value: plantInfo.growthHabit },
                      { label: "Flower Color", value: plantInfo.flowerColor },
                      { label: "Leaf Type", value: plantInfo.leafType },
                    ].map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-400 last:border-b-0  text-left"
                      >
                        <td className="py-1 px-1 w-1/3 font-semibold  text-left">
                          {item.label}:
                        </td>
                        <td className="py-1 px-1  text-left">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        <h3 className="text-2xl font-semibold mb-6 mt-6 text-center">
          How It Works
        </h3>{" "}
        {/* Centered title */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-screen-xl mx-auto">
          <Card className="bg-gray-800 text-white">
            <CardContent className="flex flex-col items-center p-6">
              <div className="bg-green-500 rounded-full p-4 mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Upload Image</h4>
              <p className="text-sm">
                Take a photo or upload an existing image of a plant you want to
                identify.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 text-white">
            <CardContent className="flex flex-col items-center p-6">
              <div className="bg-green-500 rounded-full p-4 mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">AI Analysis</h4>
              <p className="text-sm">
                Our advanced AI analyzes the image to identify the plant
                species.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 text-white">
            <CardContent className="flex flex-col items-center p-6">
              <div className="bg-green-500 rounded-full p-4 mb-4">
                <Info className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Get Information</h4>
              <p className="text-sm">
                Receive detailed information about the plant, including its
                name, scientific name, and characteristics.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-green-800 p-8 mt-12 mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="font-semibold mb-2 text-lg text-white">
              About My Plant Identifier
            </h5>
            <p className="text-gray-200">
              My Plant Identifier is an AI-powered plant identification tool
              that helps you discover and learn about plants in your
              surroundings.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2 text-lg text-white">
              Quick Links
            </h5>
            <ul className="text-gray-200">
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2 text-lg text-white">
              Contact Us
            </h5>
            <p className="text-gray-200">Email: info@myplantidentifier.com</p>
          </div>
        </div>
        <div className="mt-4 text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} My Plant Identifier. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default PlantIdentifier;
