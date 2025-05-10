// Select all filter buttons, filterable cards, and dropdowns
const filterButtons = document.querySelectorAll(".filter_buttons button");
const filterableCards = document.querySelectorAll(".card-container .card");
const dropdowns = document.querySelectorAll(".dropdown");

// Common filtering logic
function filterCardsByData(selectedFilter) {
  filterableCards.forEach((card) => {
    const cardBatch = card.getAttribute("data-batch");
    const cardName = card.dataset.name;

    // Show or hide the card based on filter condition
    if (
      selectedFilter === "All batches" ||
      selectedFilter === "" ||
      cardBatch === selectedFilter ||
      cardName === selectedFilter
    ) {
      // Show card and add reveal animation
      card.classList.remove("hide", "exit");
      setTimeout(() => {
        card.classList.add("reveal"); // Add reveal class for the animation
      }, 10);

      setTimeout(() => {
        card.classList.add("visible"); // Ensure visibility after animation
      }, 500); // Adjust based on reveal animation duration
    } else {
      // Apply exit animation before hiding the card
      card.classList.remove("reveal", "visible");
      card.classList.add("exit");
      setTimeout(() => {
        card.classList.add("hide");
      }, 500); // Ensure card hides after exit animation
    }
  });
}

// Button click event
filterButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    // Update active button state
    document
      .querySelector(".filter_buttons .active")
      .classList.remove("active");
    e.target.classList.add("active");

    // Get filter value from the button's data-name attribute or default to "All batches"
    const filterValue = e.target.dataset.name || "All batches";

    // Apply the filter
    filterCardsByData(filterValue);
  });
});

// Dropdown logic
dropdowns.forEach((dropdown) => {
  const select = dropdown.querySelector(".select");
  const caret = dropdown.querySelector(".caret");
  const selected = dropdown.querySelector(".selected");
  const menu = document.createElement("ul");

  menu.className = "menu";

  //const menuItems = [
   // "All",
    //  ];

  // Add menu items dynamically
  menuItems.forEach((item) => {
    const option = document.createElement("li");
    option.innerText = item;

    // Handle dropdown item selection
    option.addEventListener("click", () => {
      selected.innerText = item;
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");

      // Add dd-active to the selected option and remove it from others
      menu.querySelectorAll("li").forEach((opt) => {
        opt.classList.remove("dd-active"); // Remove dd-active from all items
      });
      option.classList.add("dd-active"); // Add dd-active to the clicked option

      // Apply the filter
      filterCardsByData(item);
    });

    menu.appendChild(option);
  });

  dropdown.appendChild(menu);

  // Toggle dropdown visibility
  select.addEventListener("click", (event) => {
    event.stopPropagation();
    caret.classList.toggle("caret-rotate");
    menu.classList.toggle("menu-open");
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");
    }
  });
});

// Ensure cards are visible on page load or refresh by applying the default filter
document.addEventListener("DOMContentLoaded", () => {
  // Trigger the default filter to show all cards (or set to a specific filter if needed)
  filterCardsByData("All batches");
});






// Start ---


// Account Details Page JS Code Start

// Function to update image source and ensure visibility
function updateImageSource(imageId, imageSource) {
  const imgElement = document.getElementById(imageId);
  if (imgElement) {
    imgElement.src = imageSource;
    imgElement.style.display = "block";
  } else {
    console.warn(`Image element with ID "${imageId}" not found.`);
  }
}

// Function to reset error and preview
function resetErrorAndPreview(errorElement, previewContainer, imageId) {
  errorElement.textContent = "";
  previewContainer.innerHTML = `
    <span>
      <img id="${imageId}" src="./assets/icons/cloudUploading.svg" alt="Upload Image" />
      Upload Image
    </span>`;
}

// Function to display error message and reset preview
function displayError(errorElement, previewContainer, imageId, errorMessage) {
  errorElement.textContent = errorMessage;
  previewContainer.innerHTML = `
    <span>
      <img id="${imageId}" src="./assets/icons/cloudUploading.svg" alt="Upload Image" />
      Upload Image
    </span>`;
}

// Function to validate the file for file input
function validateFile(
  file,
  maxSize,
  expectedAspectRatio,
  errorElement,
  previewContainer,
  imageId,
  customErrorMessage
) {
  resetErrorAndPreview(errorElement, previewContainer, imageId);

  if (!file) {
    displayError(errorElement, previewContainer, imageId, customErrorMessage);
    return false;
  }

  // Validate file size
  if (file.size > maxSize) {
    displayError(
      errorElement,
      previewContainer,
      imageId,
      `${customErrorMessage}`
    );
    return false;
  }

  // Validate file format
  const validFormats = ["image/jpeg", "image/png"];
  if (!validFormats.includes(file.type)) {
    displayError(
      errorElement,
      previewContainer,
      imageId,
      `${customErrorMessage} Unsupported file format.`
    );
    return false;
  }

  // Validate aspect ratio asynchronously
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const aspectRatio = img.width / img.height;
      const tolerance = 0.01;
      if (Math.abs(aspectRatio - expectedAspectRatio) > tolerance) {
        displayError(
          errorElement,
          previewContainer,
          imageId,
          `${customErrorMessage}`
        );
        return;
      }

      // Display the uploaded image
      previewContainer.innerHTML = "";
      previewContainer.appendChild(img);
    };

    img.onerror = function () {
      displayError(
        errorElement,
        previewContainer,
        imageId,
        `${customErrorMessage} Invalid image file.`
      );
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
  return true;
}

// Set up validations for file input 1
document.getElementById("fileInput1").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const maxSize = 200 * 1024; // 200KB
  const expectedAspectRatio = 1; // 1:1 aspect ratio
  const errorElement = document.getElementById("error1");
  const previewContainer = document.getElementById("previewContainer1");
  const imageId = "myImg"; // ID for the image element
  const customErrorMessage =
    "*File exceed size limit or the format does not support";

  validateFile(
    file,
    maxSize,
    expectedAspectRatio,
    errorElement,
    previewContainer,
    imageId,
    customErrorMessage
  );
});

// Set up validations for file input 2
document.getElementById("fileInput2").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const maxSize = 1 * 1024 * 1024; // 1MB
  const expectedAspectRatio = 4 / 3; // 4:3 aspect ratio
  const errorElement = document.getElementById("error2");
  const previewContainer = document.getElementById("previewContainer2");
  const imageId = "myImg1"; // ID for the image element
  const customErrorMessage =
    "*File exceed size limit or the format does not support which is more than 4:3 aspect ratio";

  validateFile(
    file,
    maxSize,
    expectedAspectRatio,
    errorElement,
    previewContainer,
    imageId,
    customErrorMessage
  );
});

// Account Details Page JS Code End