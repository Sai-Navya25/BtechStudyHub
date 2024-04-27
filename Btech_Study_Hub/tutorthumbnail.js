// Function to show/hide thumbnails based on selected course
function showThumbnail(course) {
    $("[class^='thumbnail-container']").hide(); // Hide all thumbnail containers
    $(`.thumbnail-container-${course}`).show(); // Show the thumbnail container for the selected course
}

// Adding functionality to show/hide thumbnails based on selected course
$(".options").on("click", "li", function() {
    let selectedCourse = $(this).text();
    showThumbnail(selectedCourse);
});

// Your existing menu functionality can go here
// Ensure that it does not conflict with the code above
// Example:
$(".select-btn").on("click", function() {
    $(".options").toggleClass("active");
});
