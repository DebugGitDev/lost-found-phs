document.addEventListener("DOMContentLoaded", function () {

  var nameInput = document.getElementById("itemName");
  var imageInput = document.getElementById("itemImage");
  var addBtn = document.getElementById("addBtn");
  var grid = document.getElementById("grid");

  var items = JSON.parse(localStorage.getItem("items")) || [];

  function saveItems() {
    localStorage.setItem("items", JSON.stringify(items));
  }

  function renderItems() {
    grid.innerHTML = "";

    for (var i = 0; i < items.length; i++) {
      var card = document.createElement("div");
      card.className = "card";

      var img = document.createElement("img");
      img.src = items[i].image;

      var name = document.createElement("div");
      name.className = "name";
      name.innerText = items[i].name;

      var del = document.createElement("button");
      del.innerText = "×";
      del.onclick = (function (index) {
        return function () {
          items.splice(index, 1);
          saveItems();
          renderItems();
        };
      })(i);

      card.appendChild(del);
      card.appendChild(img);
      card.appendChild(name);
      grid.appendChild(card);
    }
  }

  addBtn.addEventListener("click", function () {
    if (nameInput.value === "" || imageInput.files.length === 0) {
      alert("Please enter a name and choose an image.");
      return;
    }

    addBtn.disabled = true;

    var file = imageInput.files[0];
    var reader = new FileReader();

    reader.onload = function () {
      var img = new Image();
      img.onload = function () {

        var canvas = document.createElement("canvas");
        var size = 200;
        canvas.width = size;
        canvas.height = size;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, size, size);

        var compressed = canvas.toDataURL("image/jpeg", 0.7);

        items.push({
          name: nameInput.value,
          image: compressed
        });

        saveItems();
        renderItems();

        nameInput.value = "";
        imageInput.value = "";
        addBtn.disabled = false;
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });

  renderItems();
});