document.addEventListener("DOMContentLoaded", function () {

  const uid=JSON.parse(localStorage.getItem('id'));
  // Existing code for fetching and displaying the list of plants in the nursery
  fetchPlantsInNursery(uid)
    .then((plants) => {
      // Display the list of plants in the nursery
      displayPlantsInNursery(plants);
    })
    .catch((error) => {
      console.error("Error fetching plants in nursery:", error);
    });

  // Function to fetch plants in the user's nursery
  async function fetchPlantsInNursery(userId) {
    try {
      const response = await fetch(
        `http://localhost:5503/getPlantsInNursery?userId=${userId}`
      );
      const data = await response.json();
      console.log(data);
      return data.plants || [];
    } catch (error) {
      throw error;
    }
  }

  // Function to display the list of plants in the nursery
  function displayPlantsInNursery(plants) {
    const plantListElement = document.getElementById("plantList");

    plants.forEach((plant) => {
      // Create a list item for each plant
      const listItem = document.createElement("li");

      // Create a div to hold plant details
      const plantDetailsDiv = document.createElement("div");
      plantDetailsDiv.classList.add("plant-details");

      // Display plant name
      const plantName = document.createElement("h3");
      plantName.textContent = plant.common_name;
      plantDetailsDiv.appendChild(plantName);
      // const response = fetch(
      //   `http://localhost:5503/getPlantDetails?plantId=${plantId}`
      // );
      // const data=response.json();

      // Display watering schedule
      const wateringSchedule = document.createElement("p");
      wateringSchedule.textContent = `Watering Schedule: ${plant.watering}`;
      plantDetailsDiv.appendChild(wateringSchedule);

      // Display sunlight requirement
      const sunlightRequirement = document.createElement("p");
      sunlightRequirement.textContent = `Sunlight Requirement: ${plant.sunlight}`;//check1
      plantDetailsDiv.appendChild(sunlightRequirement);

      // Add a click event listener to redirect to the plant details page
      listItem.addEventListener("click", function () {
        // Redirect to the plant details page with the plant ID
        window.location.href = `/plantDetails.html?id=${plant.p_id}`;
      });

      // Append the plant details div to the list item
      listItem.appendChild(plantDetailsDiv);

      // Append the list item to the plant list
      plantListElement.appendChild(listItem);
    });
  }

  const welcomeMessageElement = document.getElementById("username");
  const userd = JSON.parse(localStorage.getItem("usersd"));
  const emailsd = JSON.parse(localStorage.getItem("emaild"));
  console.log(userd);
  console.log(emailsd);
  welcomeMessageElement.textContent = userd;

  const searchBarContainerEl = document.querySelector(".search-bar-container");
  const searchInputEl = document.querySelector(".input");
  const searchResultsEl = document.getElementById("searchResults");
  const userIcon = document.getElementById("user");
  userIcon.addEventListener("click", function () {
    // Redirect to the profile page (replace "profile.html" with your actual profile page)
    window.location.href = "profile.html";
  });
  searchInputEl.addEventListener("input", async () => {
    const searchTerm = searchInputEl.value.trim();

    // Show search results dynamically
    if (searchTerm.length >= 3) {
      try {
        const response = await fetch(
          `http://localhost:5503/searchPlants?searchTerm=${searchTerm}`
        );
        const data = await response.json();

        if (data.plants.length > 0) {
          const resultItems = data.plants.map(
            (plant) =>
              `<div class="search-result-item" data-plant-id="${plant.p_id}">${plant.common_name}</div>`
          );
          searchResultsEl.innerHTML = resultItems.join("");
          searchResultsEl.style.display = "block";
        } else {
          searchResultsEl.innerHTML = "No results found";
          searchResultsEl.style.display = "block";
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      // Hide search results if search term is less than 3 characters
      searchResultsEl.style.display = "none";
    }
  });

  searchResultsEl.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("search-result-item")) {
      const plantId = target.dataset.plantId;
      if (plantId) {
        // Redirect to the plant details page with the corresponding plantId
        window.location.href = `plantDetails.html?id=${plantId}`;
      }
    }
  });

  // Hide search results on clicking anywhere outside the search bar
  document.addEventListener("click", (event) => {
    if (!searchBarContainerEl.contains(event.target)) {
      searchResultsEl.style.display = "none";
    }
  });

  const magnifierEl = document.querySelector(".magnifier");

  magnifierEl.addEventListener("click", () => {
    searchBarContainerEl.classList.toggle("active");
  });
});
