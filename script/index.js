const loadTreeCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories") // promise of response
    .then((res) => res.json()) // promise of json data
    .then((json) => displayTreeCategories(json.categories));
};

const displayTreeCategories = (categories) => {
     const levelTrees = document.getElementById("tree-categories");
     levelTrees.innerHTML = "";
     categories.forEach((category) => {
         const li = document.createElement("li");
         li.innerHTML = `<button class="w-[250px] text-left px-3 py-1 hover:bg-green-100 rounded" onclick="fetchCategoryData('${category.id}')">${category.category_name}</button>`;
         levelTrees.appendChild(li);
     });
     MarkIsActiveCategory();
};

const MarkIsActiveCategory = () => {
     document.querySelectorAll("#tree-categories button").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelectorAll("#tree-categories button, #all-trees-btn").forEach(btn => {
                btn.classList.remove("bg-green-700", "text-white");
            });
            this.classList.add("bg-green-700", "text-white");
        });
     });

    const allTreesBtn = document.getElementById("all-trees-btn");
    allTreesBtn.addEventListener("click", function () {
        document.querySelectorAll("#tree-categories button, #all-trees-btn").forEach(btn => {
            btn.classList.remove("bg-green-700", "text-white");
        });
        this.classList.add("bg-green-700", "text-white");
    });
}

const fetchCategoryData = (categoryId) => {
      const url = `https://openapi.programming-hero.com/api/category/${categoryId}`;
      fetch(url)
        .then((res) => res.json())
        .then((json) => displayCategoryData(json.plants));
}

const displayCategoryData = (trees) => {
      const treeContainer = document.getElementById("tree-container");
      treeContainer.innerHTML = "";
      trees.forEach((tree) => {
            const btnDiv = document.createElement("div");
            btnDiv.innerHTML = `<div class="bg-white p-6 rounded shadow  hover:shadow-xl hover:scale-105 hover:bg-green-100 transition-all duration-300">
                <img src="${tree.image}" alt="${tree.name}" class="w-full h-40 object-cover rounded mb-3">
                <h3 onclick="loadDetailsTree(${tree.id})" class="font-semibold mb-1">${tree.name}</h3>
                <p class="text-sm text-gray-600 mb-2 line-clamp-3">
                    ${tree.description}
                </p>
                <div class="flex justify-between items-center">
                  <span class="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded mt-2 mb-4">${tree.category}</span>
                  <span class="font-semibold">৳${tree.price}</span>
                </div>
                <button onclick="addToCart('${tree.id}')" class="bg-green-700 text-white px-3 py-1 rounded-full w-full text-center">Add to Cart</button>
            </div>`;
            treeContainer.appendChild(btnDiv);
      });
}
let allTreesData = [];
const allTrees = () => {
     const url = `https://openapi.programming-hero.com/api/plants`;
     fetch(url)
       .then((res) => res.json())
       .then((json) => {
           allTreesData = json.plants;
           displayAllTrees(allTreesData);
       });
}

const displayAllTrees = (trees) => {
      const treeContainer = document.getElementById("tree-container");
      treeContainer.innerHTML = "";
      trees.forEach((tree) => {
            const btnDiv = document.createElement("div");
            btnDiv.innerHTML = `<div class="bg-white p-6 rounded shadow  hover:shadow-xl hover:scale-105 hover:bg-green-100 transition-all duration-300">
                <img src="${tree.image}" alt="${tree.name}" class="w-full h-40 object-cover rounded mb-3">
                <h3 onclick="loadDetailsTree(${tree.id})" class="font-semibold mb-1">${tree.name}</h3>
                <p class="text-sm text-gray-600 mb-2 line-clamp-3">
                    ${tree.description}
                </p>
                <div class="flex justify-between items-center">
                  <span class="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded mt-2 mb-4">${tree.category}</span>
                  <span class="font-semibold">৳${tree.price}</span>
                </div>
                <button onclick="addToCart('${tree.id}')" class="bg-green-700 text-white px-3 py-1 rounded-full w-full text-center">Add to Cart</button>
            </div>`;
            treeContainer.appendChild(btnDiv);
      });
}

const loadDetailsTree = async (id) => {
    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    showDetailsTree(details.plants);
}

const showDetailsTree = (details) => {
    console.log(details);
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `<h1 class="font-semibold text-[20px]"> ${details.name} </h1>
        <img class="w-full h-[300px] object-cover" src="${details.image}" alt="hero image" />
        <p>
           <span class="font-semibold">Category :</span>
           <span class="font-sans">${details.category}</span>
        </p>
        <p>
            <span class="font-semibold">Price :</span>
            <span class="font-sans">৳${details.price}</span>
        </p>
        <p>
            <span class="font-semibold">Description :</span>
            <span class="font-sans text-[14px]">${details.description}</span>
        </p>`;
        document.getElementById("word_modal").showModal();
}

let cart = [];
const addToCart = (id) => {
    const treeId = typeof allTreesData[0].id === "number" ? Number(id) : id;
    const tree = allTreesData.find((tree) => tree.id === treeId);
    if(!tree) {
        console.log("Tree not found");
        return;
    }
    const existingItem = cart.find((item) => item.id === treeId);
    if(existingItem) {
        existingItem.quantity += 1; 
    }
    else {
        cart.push({ ...tree, quantity: 1 });
    }
    displayCart();
}

const displayCart = () => {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; 

      if(cart.length === 0) {
          cartItemsContainer.innerHTML = `<p class="text-sm text-gray-500">Your cart is empty.</p>`;
          return;
      }
      let total = 0;

      cart.forEach(item => {
          total += item.price * item.quantity;
          const itemDiv = document.createElement("div");
          itemDiv.className = "space-y-2 bg-green-100 p-4 rounded-2xl mb-2";
          itemDiv.innerHTML = `
              <div class="flex justify-between items-center text-sm">
                  <div class="flex flex-col">
                      <span>${item.name}</span>
                      <span>৳${item.price} x ${item.quantity}</span>
                  </div>
                  <button class="text-red-500" onclick="removeFromCart('${item.id}')">
                      <i class="fa-solid fa-xmark"></i>
                  </button>
              </div>
          `;
           cartItemsContainer.appendChild(itemDiv);
      });

    // Display total
      const totalDiv = document.createElement("div");
      totalDiv.className = "mt-4 flex justify-between font-semibold";
      totalDiv.innerHTML = `
          <span>Total:</span>
          <span>৳${total}</span>
      `;
      cartItemsContainer.appendChild(totalDiv);
};

const removeFromCart = (id) => {
    cart = cart.filter(item => item.id != id); // Remove item by id
    displayCart(); // Re-render cart
};



allTrees();
loadTreeCategories();