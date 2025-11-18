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
        displayResults([{name: "Input Required", description: 'Please enter "beach", "temple", or "country".', imageUrl: ''}]);
        return; 
    }

    if (!allTravelData) {
        displayResults([{name: "Error", description: 'Data is still loading, please try again in a moment.', imageUrl: ''}]);
        return;
    }

    filterData(searchTerm);
  });

  function filterData(keyword){
    let filteredResults = [];
    
    if (keyword.includes('beach') || keyword.includes('beaches')) {
        // Add all beaches results
        filteredResults.push(...allTravelData.beaches);
    } else if (keyword.includes('temple') || keyword.includes('temples')) {
        // Add all temples results
        filteredResults.push(...allTravelData.temples);
    } else if (keyword.includes('country') || keyword.includes('countries')) {
        // Add all cities from all countries
        allTravelData.countries.forEach(country => {
            filteredResults.push(...country.cities);
        });
    } else {
         displayResults([{name: "Invalid Search", description: 'Search term must be "beach", "temple", or "country".', imageUrl: ''}]);
         return;
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
                img.style.maxWidth = '100%'; 
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
