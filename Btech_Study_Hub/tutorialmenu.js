const wrapper = document.querySelector(".wrapper"),
  selectBtn = wrapper.querySelector(".select-btn"),
  searchInp = wrapper.querySelector("input"),
  options = wrapper.querySelector(".options");

let courses = ["CHE110", "CSE111", "CSE326", "ECE249", "ECE279", "INT108", "MTH174",
  "PES118", "CSE101", "CSE121", "CSE320", "INT306", "MEC135", "MTH401", "PEL121", "PHY110",
  "CSE202", "CSE205", "CSE211", "CSE306", "CSE307", "MTH302", "PEL135", "CSE310", "CSE325", "CSE316"
  , "CSE408", "INT219", "INT222", "INT426", "PEA305"
];

// Function to show/hide thumbnails based on selected course
function showThumbnail(course) {
  // Hide all thumbnail containers
  document.querySelectorAll("[class^='thumbnail-container']").forEach(container => {
    container.style.display = 'none';
  });

  // Show the thumbnail container for the selected course
  const selectedContainer = document.querySelector(`.thumbnail-container-${course}`);
  if (selectedContainer) {
    selectedContainer.style.display = 'block';
  }
}

// Show CHE110 thumbnail by default
showThumbnail("CHE110");

function addCourse(selectedCourse) {
  options.innerHTML = "";
  courses.forEach(course => {
    let isSelected = course == selectedCourse ? "selected" : "";
    let li = `<li onclick="updateName(this)" class="${isSelected}">${course}</li>`;
    options.insertAdjacentHTML("beforeend", li);
  });
}
addCourse();

function updateName(selectedLi) {
  searchInp.value = "";
  addCourse(selectedLi.innerText);
  wrapper.classList.remove("active");
  selectBtn.firstElementChild.innerText = selectedLi.innerText;
  // Call the function to show/hide thumbnails based on the selected course
  showThumbnail(selectedLi.innerText);
}

searchInp.addEventListener("keyup", () => {
  let arr = [];
  let searchWord = searchInp.value.toLowerCase();
  arr = courses.filter(data => {
    return data.toLowerCase().startsWith(searchWord);
  }).map(data => {
    let isSelected = data == selectBtn.firstElementChild.innerText ? "selected" : "";
    return `<li onclick="updateName(this)" class="${isSelected}">${data}</li>`;
  }).join("");
  options.innerHTML = arr ? arr : `<p style="margin-top: 10px;color:white">Sorry! Course code not found <i class="uil uil-frown"></i> </p>`;
});

selectBtn.addEventListener("click", () => wrapper.classList.toggle("active"));
