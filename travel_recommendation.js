const searchForm = document.querySelector('.search-form');
const searchField = document.getElementById('query');
const searchSubmitBtn = document.getElementById('submit');
const resultsContainer = document.getElementById('results-list');
const modal = document.getElementById("resultsModal");
const closeBtn = document.querySelector(".close-button"); 
let allTravelData = null;

closeBtn.onclick = function() {
    closeModalAndClear();
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      closeModalAndClear();
    }
  }

function closeModalAndClear(){
    modal.style.display = "none";
    resultsContainer.innerHTML = '';
    searchField.value = ''; 
}


async function fetchJsonData() {
    try {
      const response = await fetch('./travel_recommendation_api.json');
      if (!response.ok) {
        throw new Error('Could not reach JSON file');
      }
     allTravelData = await response.json();
    } catch (error) {
      console.error('There has been a problem with fetch operation:', error);
    }
  }

  searchForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const searchTerm = searchField.value.trim().toLowerCase(); 

    if (searchTerm === "") {
        displayResults([{name: "Input Required", description: 'Please enter a key term (e.g., "beach", "temple", "country", or specific location name).', imageUrl: ''}]);
        return; 
    }

    if (!allTravelData) {
        displayResults([{name: "Error", description: 'Data is still loading, please try again in a moment.', imageUrl: ''}]);
        return;
    }

    // Call the combined filter function directly
    filterAndDisplayData(searchTerm);
  });

// Renamed and combined the filter logic into one central function
function filterAndDisplayData(keyword){
    let filteredResults = [];
    
    // Check Beaches
    if (allTravelData.beaches) {
        filteredResults.push(...allTravelData.beaches.filter(item => {
            return item.name.toLowerCase().includes(keyword);
        }));
    }
    
    // Check Temples
    if (allTravelData.temples) {
        filteredResults.push(...allTravelData.temples.filter(item => {
            return item.name.toLowerCase().includes(keyword);
        }));
    }

    // Check Countries/Cities
    if (allTravelData.countries) {
        allTravelData.countries.forEach(country => {
            country.cities.forEach(city => {
                // Check if the city name OR the parent country name matches the keyword
                if (city.name.toLowerCase().includes(keyword) || country.name.toLowerCase().includes(keyword)) {
                    // Avoid pushing duplicates if a city matches both its name and its country name
                    if (!filteredResults.some(result => result.name === city.name)) {
                        filteredResults.push(city);
                    }
                }
            });
        });
    }

    displayResults(filteredResults);
  }


    function displayResults(resultsArray) {
        
        resultsContainer.innerHTML = '';
        
        if (resultsArray.length === 0) {
            resultsContainer.innerHTML = '<li>No recommendations found for that search.</li>';
        } else {
            resultsArray.forEach(item => {
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = item.imageUrl;
                img.alt = item.name;
                img.style.maxWidth = '50%'; 
                img.style.height = 'auto';
                img.style.display = 'block';

                const text = document.createElement('p');
                text.textContent = `${item.name}: ${item.description}`;

                li.appendChild(img);
                li.appendChild(text);

                resultsContainer.appendChild(li);
            });
        }
        
        modal.style.display = "block";
    }
    

    fetchJsonData();
