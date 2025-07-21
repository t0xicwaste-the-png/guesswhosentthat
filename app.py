import pandas as pd
from flask import Flask, render_template, request, session
import random

# Initialize the Flask application
app = Flask(__name__)
app.secret_key = 'a-secret-key'  # Needed for session management

# Load data and prepare it
df = pd.read_csv('extended_filtered_messages.csv')
messages = df['Content'].tolist()
authors = df['Author'].tolist()
unique_authors = sorted(list(set(authors)))

# --- Flask Routes ---

@app.route('/')
def home():
    """
    This is the main page of the game.
    It selects a random message and passes it to the template,
    along with the list of possible authors.
    """
    # Randomly select a message and its author
    random_index = random.randint(0, len(messages) - 1)
    message = messages[random_index]
    correct_author = authors[random_index]

    # Store the correct answer in the session
    session['correct_author'] = correct_author

    return render_template('index.html', message=message, authors=unique_authors)

@app.route('/guess', methods=['POST'])
def guess():
    """
    This route handles the user's guess.
    It checks if the guess is correct and displays the result.
    """
    user_guess = request.form['author']
    correct_author = session.get('correct_author', 'Unknown') # Get answer from session

    if user_guess == correct_author:
        result = "Correct! Nicely done."
    else:
        result = f"Sorry, that's not right. The correct author was {correct_author}."

    return f"""
    <h1>{result}</h1>
    <a href="/">Play again!</a>
    """

# --- Main execution ---
if __name__ == "__main__":
    # Note: This is for local development.
    # For a real website, you'd use a production web server.
    app.run(debug=True)