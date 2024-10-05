import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

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
  { id: 10, name: 'Sherwani', occasion: 'Formal', culture: 'Indian', gender: 'Male', imageUrl: 'https://www.mashalcouture.com/cdn/shop/files/KunalRawal0627-min_1500x_a1565d29-a2f7-4d76-baea-39c273797bd0.png?v=1697718249&width=1946' },
  { id: 11, name: 'Jersy and Short', occasion: 'Sport', culture: 'All', gender: 'Male', imageUrl: 'https://images.outspot.be/gallery/16323/65e72383dd63a2.jpg' },
  { id: 11, name: 'sport wear', occasion: 'Sport', culture: 'All', gender: 'Female', imageUrl: 'https://tiimg.tistatic.com/new_website1/micro_cate_images/2/b/03/201003.jpg' },
];

const App = () => {
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedCulture, setSelectedCulture] = useState('');
  const [recommendedClothing, setRecommendedClothing] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(false);

  const filterClothing = (gender: string, occasion: string, culture: string) => {
    setLoading(true);
    setTimeout(() => {
      const filteredClothing = clothingItems.filter((item) => {
        return (
          (gender === '' || item.gender === gender) &&
          (occasion === '' || item.occasion === occasion) &&
          (culture === 'All' || item.culture === culture || culture === '')
        );
      });
      setRecommendedClothing(filteredClothing);
      setLoading(false);
    }, 500);
  };

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

  const resetFilters = () => {
    setSelectedGender('');
    setSelectedOccasion('');
    setSelectedCulture('');
    setRecommendedClothing([]);
  };

  const downloadPDF = () => {
    const element = document.getElementById('pdf-content');
    if (element) {
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5], // adjust margins as needed
        filename: 'outfit_recommendation.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true }, // ensure higher quality images
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };
      html2pdf().set(options).from(element).save();
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col justify-center">
      <h1 className="text-6xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-center mb-8 tracking-wide shadow-md">OUTFIT RECOMMENDATION</h1>
      
      <div id="pdf-content">
        {/* Filter Section */}
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
              <option value="Sport">Sport</option>
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
              <option value="All">All</option>
            </select>
          </div>
        </div>
        
       {/* Reset Button */}
    

      {/* Dynamic Heading */}
   <h2 className="text-3xl md:text-4xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg text-center">
  Recommended Outfits 
  {selectedGender && ` for ${selectedGender}`} 
  {selectedOccasion && ` - ${selectedOccasion} `} 
  {selectedCulture && `(${selectedCulture} )`}
</h2>


      {/* Loading Spinner */}
      {loading && <div className="text-center mb-4">Loading...</div>}

      {/* Recommended Outfits */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {!loading && recommendedClothing.length > 0 ? (
          recommendedClothing.map((item) => (
            <li
              key={item.id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover mb-4 rounded-lg lazyload"
                loading="lazy"
              />
              <span className="text-gray-700 text-center font-semibold">{item.name}</span>
            </li>
          ))
        ) : (
          !loading && <p className="text-gray-500 col-span-full text-center">No clothing items match the selected criteria.</p>
        )}
      </ul>
     
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={resetFilters}
          className="px-6 py-3 bg-green-400 hover:bg-green-800 text-white rounded-lg mx-2"
        >
          Reset Filters
        </button>
        <button
          onClick={downloadPDF}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg mx-2"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default App;
