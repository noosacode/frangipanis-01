const urlParams = new URLSearchParams(window.location.search);
const tag = urlParams.get("tag");

const results = document.getElementById("results");

async function loadTree() {
  const response = await fetch(`/api/trees/${tag}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });

  const tree = await response.json();

  if (!response.ok) {
    results.innerHTML = `
      <p>Unable to load tree ${tag}.</p>
    `;
    return;
  }

  results.innerHTML = `
  <h2>WooCommerce / Turn On</h2>

  <p><strong>Tag:</strong> ${tree.tag}</p>

    <p><strong>WooCommerce status:</strong> ${tree.wcStatus || ""}</p>

  <p><strong>Colour:</strong> ${tree.colour || ""}</p>

  <p><strong>Bag Size:</strong> ${tree.bagSize || ""}</p>

  <p><strong>Price:</strong> ${tree.price ?? ""}</p>

  <p><strong>Transport:</strong> ${tree.transportSize || ""}</p>

  <p><strong>Best Photo:</strong> ${
    tree.bestPhotoDate ? new Date(tree.bestPhotoDate).toLocaleDateString() : ""
  }</p>

  <p><strong>Notes:</strong> ${tree.notes || ""}</p>

  <p><strong>Inside Notes:</strong> ${tree.insideNotes || ""}</p>

  <p><strong>Outside Notes:</strong> ${tree.outsideNotes || ""}</p>

  <p>
    <button id="updateButton">Update</button>
  </p>
`;

  updateButton.addEventListener("click", function () {
    results.innerHTML = createFormHTML(tree);
    attachFormListeners(tree);
  });

}

loadTree();
