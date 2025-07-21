document.addEventListener('DOMContentLoaded', () => {
    const messageEl = document.getElementById('message');
    const authorSelect = document.getElementById('author-select');
    const guessForm = document.getElementById('guess-form');
    const resultEl = document.getElementById('result');

    let messages = [];
    let correctAuthor = '';

    // --- UPDATED CODE ---
    // We've added a .catch() block to see any errors in the browser console.
    fetch('./messages.json') // Using './' makes the path explicitly relative.
        .then(response => {
            if (!response.ok) {
                // This will catch errors like "404 Not Found"
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            messages = data;
            loadNewMessage();
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
            // Display an error message to the user on the page
            messageEl.textContent = 'Failed to load messages. Check the file path and JSON format.';
        });
    // --- END OF UPDATE ---

    function loadNewMessage() {
        if (messages.length === 0) return; // Don't run if data failed to load

        // Pick a random message
        const randomIndex = Math.floor(Math.random() * messages.length);
        const randomMessage = messages[randomIndex];
        correctAuthor = randomMessage.Author;

        // Display the message
        messageEl.textContent = `"${randomMessage.Content}"`;

        // Get all unique authors and populate the dropdown
        const uniqueAuthors = [...new Set(messages.map(m => m.Author))].sort();
        authorSelect.innerHTML = ''; // Clear previous options
        uniqueAuthors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = author;
            authorSelect.appendChild(option);
        });

        // Clear the previous result
        resultEl.textContent = '';
    }

    // Handle the user's guess
    guessForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from reloading the page
        const userGuess = authorSelect.value;

        if (userGuess === correctAuthor) {
            resultEl.textContent = "Correct! Nicely done. 🎉";
        } else {
            resultEl.textContent = `Sorry, that's not right. The correct author was ${correctAuthor}.`;
        }

        // Load a new message after a short delay
        setTimeout(loadNewMessage, 2000);
    });
});
