document.getElementById('reviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;

    const response = await fetch('/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, comment })
    });

    const result = await response.json();
    const messageDiv = document.getElementById('message');

    if (response.ok) {
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Review submitted successfully!';
        document.getElementById('reviewForm').reset();
    } else {
        messageDiv.style.color = 'red';
        messageDiv.textContent = result.error || 'Something went wrong.';
    }
});