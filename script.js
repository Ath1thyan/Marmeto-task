document.addEventListener("DOMContentLoaded", () => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json"
        );
        const data = await response.json();
        // console.log('Fetched data:', data);
        const product = data.product;
  
        // console.log('Product data:', product);
  
        // Event listener to sub-images
        const thumbnails = document.querySelectorAll(".thumbnail");
        thumbnails.forEach((thumbnail) => {
          thumbnail.addEventListener("click", () => {
            const mainImg = document.getElementById("main-img");
            const tempSrc = mainImg.src;
            mainImg.src = thumbnail.src;
            thumbnail.src = tempSrc;
          });
        });
  
        // Product vendor and title
        document.getElementById("vendor").innerText = product.vendor;
        document.getElementById("product").innerText = product.title;
  
        // Convert prices from strings to numbers
        const newPrice = parseFloat(product.price.replace("$", ""));
        const oldPrice = parseFloat(product.compare_at_price.replace("$", ""));
  
        // Display formatted prices
        document.getElementById("new-price").innerText = newPrice.toFixed(2);
        document.getElementById("old-price").innerText = oldPrice.toFixed(2);
  
        // Calculate offer percentage
        const offerPercentage = ((oldPrice - newPrice) / oldPrice) * 100;
        const offerPercentageRounded = Math.round(offerPercentage);
        document.getElementById("offer").innerText = offerPercentageRounded;
  
        // Product description
        document.getElementById("description").innerHTML = product.description;
  
        // Set color options
        const colorOptionsContainer = document.getElementById("color-selects");
        product.options[0].values.forEach((color) => {
          const colorKey = Object.keys(color)[0];
          const colorValue = color[colorKey];
          const colorDiv = document.createElement("div");
          colorDiv.className = "color";
          colorDiv.style.backgroundColor = colorValue;
          colorDiv.title = colorKey;
  
          const colorInnerDiv = document.createElement("div");
          colorInnerDiv.classList.add("color-inner");
  
          const colorTickDiv = document.createElement("div");
          colorTickDiv.classList.add("color-tick");
          colorTickDiv.innerHTML =
            '<i class="fa-solid fa-check" style="color: #ffffff;"></i>';
          colorTickDiv.style.opacity = "0";
  
          colorDiv.appendChild(colorInnerDiv);
          colorDiv.appendChild(colorTickDiv);
  
          colorDiv.addEventListener("click", () => {
            document.querySelectorAll(".color").forEach((c) => {
              c.classList.remove("selected");
              c.querySelector(".color-tick").style.opacity = "0";
            });
            colorDiv.classList.add("selected");
            colorDiv.style.outline = `3px solid ${colorValue}`;
            //   colorDiv.style.outlineOffset = "3px";
            colorTickDiv.style.opacity = "1";
          });
  
          colorOptionsContainer.appendChild(colorDiv);
        });
  
        // Set size options
        const sizeOptionsContainer = document.getElementById("size-selects");
        product.options[1].values.forEach((size) => {
          const sizeContainer = document.createElement("div");
          sizeContainer.classList.add("size");
  
          const sizeRadio = document.createElement("input");
          sizeRadio.type = "radio";
          sizeRadio.name = "size";
          sizeRadio.value = size;
          sizeRadio.id = `size-${size}`;
  
          const sizeLabel = document.createElement("label");
          sizeLabel.setAttribute("for", `size-${size}`);
          sizeLabel.innerText = size;
  
          sizeContainer.appendChild(sizeRadio);
          sizeContainer.appendChild(sizeLabel);
  
          sizeOptionsContainer.appendChild(sizeContainer);
          sizeOptionsContainer.appendChild(document.createElement("br"));
  
          sizeRadio.addEventListener("change", () => {
            document.querySelectorAll(".size").forEach((s) => {
              s.classList.remove("selected");
            });
            sizeContainer.classList.add("selected");
            sizeContainer.style.backgroundColor = "#EDF0F8";
            sizeContainer.style.color = "#3A4980";
          });
        });
  
        // Hide loader and show content
        document.getElementById("loader").style.display = "none";
        document.getElementById("container").style.display = "flex";
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
      }
    }
  
    fetchData();
  
    // Quantity increment/decrement functionality
    const quantityInput = document.getElementById("quantity-input");
    document.getElementById("increase").addEventListener("click", () => {
      quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    document.getElementById("decrease").addEventListener("click", () => {
      if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
      }
    });
  
    // Modal functionality
    const warningModal = document.getElementById("warning-modal");
    const warningMessage = document.getElementById("warning-message");
    const closeModal = document.querySelector(".modal .close");
  
    closeModal.onclick = function () {
      warningModal.style.display = "none";
    };
  
    window.onclick = function (event) {
      if (event.target === warningModal) {
        warningModal.style.display = "none";
      }
    };
  
    // Add to cart functionality
    document.getElementById("add-to-cart").addEventListener("click", () => {
      const selectedColorElement = document.querySelector(".color.selected");
      const selectedSizeElement = document.querySelector(".size input:checked");
  
      if (!selectedColorElement || !selectedSizeElement) {
        warningMessage.innerText = "Please select a color and size.";
        warningModal.style.display = "flex";
        return;
      }
  
      const selectedColor = selectedColorElement.title;
      const selectedSize = selectedSizeElement.value;
      const quantity = quantityInput.value;
      const productTitle = document.getElementById("product").innerText;
  
      // Store data in local storage
      localStorage.setItem("productTitle", productTitle);
      localStorage.setItem("selectedColor", selectedColor);
      localStorage.setItem("selectedSize", selectedSize);
      localStorage.setItem("quantity", quantity);
  
      // Display notification
      const notification = document.getElementById("notification");
      notification.innerText = `${productTitle} with color ${selectedColor} and size ${selectedSize} added to cart`;
      notification.style.display = "block";
  
      setTimeout(() => {
        notification.style.display = "none";
      }, 5000);
    });
  });
  