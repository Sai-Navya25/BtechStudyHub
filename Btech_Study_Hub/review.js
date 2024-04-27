document.addEventListener("DOMContentLoaded", function() {
    const allStar = document.querySelectorAll('.rating .star');
    const ratingValue = document.querySelector('.rating input');
    const nameInput = document.getElementById('name');
    const opinionInput = document.getElementById('opinion');
    const reviewList = document.getElementById('review-list');

    function addReviewToDatabase(name, opinion, rating) {
        fetch('/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, opinion, rating })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error adding review to database');
            }
            return response.json();
        })
        .then(data => {
            console.log('Review added to database successfully:', data);
            // After adding the review to the database, update the review list
            addReviewToList(name, opinion, rating);
        })
        .catch(error => {
            console.error('Error adding review to database:', error);
        });
    }

    function addReviewToList(name, opinion, rating) {
        const reviewItem = document.createElement('li');
        reviewItem.style.whiteSpace = "nowrap"; // Prevent line breaks
        reviewItem.style.display = "inline-block"; // Ensure each review item is inline
        reviewItem.style.paddingRight = "20px"; // Add spacing between review items
        reviewItem.innerHTML = `
            <strong>${name}</strong>: (${rating}/5<i class='bx bx-star star' style="color:#f01447;"></i>): ${opinion}
        `;
        reviewList.appendChild(reviewItem);
    }

    allStar.forEach((item, idx) => {
        item.addEventListener('click', function() {
            ratingValue.value = idx + 1;

            allStar.forEach((star, i) => {
                if (i <= idx) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
            });
        });
    });

    document.querySelector('.btn.submit').addEventListener('click', function(event) {
        event.preventDefault();
        const name = nameInput.value;
        const opinion = opinionInput.value;
        const rating = parseInt(ratingValue.value);

        if (name && opinion && rating >= 1 && rating <= 5) {
            addReviewToDatabase(name, opinion, rating);
            nameInput.value = '';
            opinionInput.value = '';
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    // Fetch existing reviews from the server when the page loads
    fetch('/review')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error fetching reviews');
        }
        return response.json();
    })
    .then(reviews => {
        console.log('Fetched reviews:', reviews);
        reviews.forEach(review => {
            const { name, opinion, rating } = review;
            addReviewToList(name, opinion, rating);
        });
    })
    .catch(error => {
        console.error('Error fetching reviews:', error);
    });
});
