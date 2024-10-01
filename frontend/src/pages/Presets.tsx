import React, { useState } from 'react';

interface ClothingItem {
  id: number;
  name: string;
  occasion: string;
  culture: string;
  gender: string;
  imageUrl: string;
}

const clothingItems: ClothingItem[] = [
  { id: 1, name: 'Suit', occasion: 'Formal', culture: 'Western', gender: 'Male', imageUrl: 'https://sfycdn.speedsize.com/2780c694-3419-4266-9652-d242439affeb/https://stateandliberty.com/cdn/shop/files/HGrey.jpg?v=1714483382' },
  { id: 2, name: 'Kimono', occasion: 'Formal', culture: 'Japanese', gender: 'Female', imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/41nLI6l6a7L.jpg' },
  { id: 3, name: 'Sari', occasion: 'Formal', culture: 'Indian', gender: 'Female', imageUrl: 'https://i5.walmartimages.com/asr/3356c5fa-d578-4bdd-bba0-8562f6f85001.cf5f3e1d41ae74919e7f801fc981e880.jpeg' },
  { id: 4, name: 'T-Shirt and Jeans', occasion: 'Casual', culture: 'All', gender: 'Male', imageUrl: 'https://cdn.shopify.com/s/files/1/0038/1111/5123/files/1_large.jpeg?v=1564175987' },
  { id: 5, name: 'Cheongsam', occasion: 'Formal', culture: 'Chinese', gender: 'Female', imageUrl: 'https://www.ehari.com.my/images/186630_20.jpg' },
  { id: 6, name: 'Kurta', occasion: 'Casual', culture: 'Indian', gender: 'Male', imageUrl: 'https://www.jiomart.com/images/product/original/rvg1f4njiq/rozland-nawabi-style-kurta-pajama-set-for-men-soft-j-card-silk-traditional-kurtas-pack-of-1-product-images-rvg1f4njiq-2-202310251941.jpg?im=Resize=(500,630)' },
  { id: 7, name: 'Evening Gown', occasion: 'Formal', culture: 'Western', gender: 'Female', imageUrl: 'https://i5.walmartimages.com/asr/23becc14-ef1b-49a5-90fc-1d94a6c4e969.c9722fd5d0e971fd5d8a631330e58fae.jpeg' },
  { id: 8, name: 'Hakama', occasion: 'Formal', culture: 'Japanese', gender: 'Male', imageUrl: 'https://fuukakimono-store.com/en/html/upload/save_image/0731151859_5f23b7d3d9be2.jpg' },
  { id: 9, name: 'Casual Dress', occasion: 'Casual', culture: 'Western', gender: 'Female', imageUrl: 'https://m.media-amazon.com/images/I/61dOfc412nL.jpg' },
];

const App = () => {
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedCulture, setSelectedCulture] = useState('');
  const [recommendedClothing, setRecommendedClothing] = useState<ClothingItem[]>([]);

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    filterClothing(gender, selectedOccasion, selectedCulture);
  };

  const handleOccasionChange = (occasion: string) => {
    setSelectedOccasion(occasion);
    filterClothing(selectedGender, occasion, selectedCulture);
  };

  const handleCultureChange = (culture: string) => {
    setSelectedCulture(culture);
    filterClothing(selectedGender, selectedOccasion, culture);
  };

  const filterClothing = (gender: string, occasion: string, culture: string) => {
    const filteredClothing = clothingItems.filter((item) => {
      return (
        (gender === '' || item.gender === gender) &&
        (occasion === '' || item.occasion === occasion) &&
        (culture === 'All' || item.culture === culture || culture === '')
      );
    });
    setRecommendedClothing(filteredClothing);
  };

  return (
    <div className="w-full h-screen p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col justify-center">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12">Outfit Recommendation</h1>
      
      <div className="flex flex-wrap -mx-2 mb-8">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2" htmlFor="gender">
            Gender
          </label>
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            id="gender"
            value={selectedGender}
            onChange={(e) => handleGenderChange(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2" htmlFor="occasion">
            Occasion
          </label>
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            id="occasion"
            value={selectedOccasion}
            onChange={(e) => handleOccasionChange(e.target.value)}
          >
            <option value="">Select Occasion</option>
            <option value="Formal">Formal</option>
            <option value="Casual">Casual</option>
          </select>
        </div>

        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2" htmlFor="culture">
            Culture
          </label>
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            id="culture"
            value={selectedCulture}
            onChange={(e) => handleCultureChange(e.target.value)}
          >
            <option value="">Select Culture</option>
            <option value="Western">Western</option>
            <option value="Japanese">Japanese</option>
            <option value="Indian">Indian</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-6">Recommended Outfits</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recommendedClothing.length > 0 ? (
          recommendedClothing.map((item) => (
            <li key={item.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover mb-4 rounded-lg"
              />
              <span className="text-gray-700 text-center font-semibold">{item.name}</span>
            </li>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No clothing items match the selected criteria.</p>
        )}
      </ul>
    </div>
  );
};

export default App;  
