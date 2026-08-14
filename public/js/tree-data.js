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
    <p>
  <button id="updateButton">Update</button>
  <button id="seeAllButton">See All Data for ${tree.tag}</button>
</p>
  </p>
`;

  updateButton.addEventListener("click", function () {
    results.innerHTML = `
      <h2>Update WooCommerce Status</h2>

      <p><strong>Tag:</strong> ${tree.tag}</p>

      <p><strong>Colour:</strong> ${tree.colour}</p>

      <p>
        <strong>WC Status:</strong>
        <select id="wcStatusInput">
          <option value="Never added to WC" ${
            tree.wcStatus === "Never added to WC" ? "selected" : ""
          }>Never added to WC</option>

          <option value="on" ${
            tree.wcStatus === "on" ? "selected" : ""
          }>on</option>

          <option value="off" ${
            tree.wcStatus === "off" ? "selected" : ""
          }>off</option>

          <option value="sold-on" ${
            tree.wcStatus === "sold-on" ? "selected" : ""
          }>sold-on</option>

          <option value="sold-off" ${
            tree.wcStatus === "sold-off" ? "selected" : ""
          }>sold-off</option>
        </select>
      </p>
      
      <button id="saveButton">Save Changes</button>
      <button id="cancelButton">Cancel</button>
    `;

    const saveButton = document.getElementById("saveButton");

    saveButton.addEventListener("click", async function () {
      const updatedWcStatus = document.getElementById("wcStatusInput").value;

      const response = await fetch(`/api/trees/${tree.tag}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          wcStatus: updatedWcStatus,
        }),
      });

      const savedTree = await response.json();

      loadTree();
    });

    const cancelButton = document.getElementById("cancelButton");

    cancelButton.addEventListener("click", function () {
      loadTree();
    });
  });

  const seeAllButton = document.getElementById("seeAllButton");

  seeAllButton.addEventListener("click", function () {
    window.location.href = `/forms/tree.html?tag=${tree.tag}`;
  });
}

loadTree();