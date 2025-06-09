import sys
import json
from openai import OpenAI
import os
import re
from dotenv import load_dotenv
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def clean_commit_messages(commits_json):
    """
    Takes a list of commit objects and extracts + cleans the message field.
    """
    try:
        commits = json.loads(commits_json)
        entries = []
        for commit in commits:
            message = commit.get("message", "No message")

            # clean message
            message = re.sub(r"#?\d+", "", message)                 # Remove issue/ticket numbers like #123
            message = re.sub(r"(?im)^.*\b(wip|chore|refactor):.*(?:\n|$)", "", message) # removes wip, chore, and refactor
            message = re.sub(r"\s+", " ", message) # turn all whitespace characters into a single space.
            message = re.sub(r"\\u[0-9a-fA-F]{4}", "", message) # remove unicode characters


            author = commit.get("author", "Unknown author")
            date = commit.get("date", "Unknown date")
            entry = f"Author: {author}\nDate: {date}\nMessage:\n{message}"
            entries.append(entry)
        return entries
    except Exception as e:
        return [f"Failed to parse commit messages: {e}"]


def summarize(commits_text):
    prompt = f"""
    Summarize the following commit messages into release notes in Markdown:
    
    {commits_text}
    
    Format:
    ## Summary
    - Author(s):
    - Date: (format: YYYY-MM-DD)
    - Features:
    - Bug fixes:
    - Breaking Changes:
    """

    print(prompt)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def get_next_filename(number, prefix="releaseNotes", extension=".txt"):
    filename = f"{prefix}{number}{extension}"
    return filename

if __name__ == "__main__":
    # Read from stdin for compatibility with Node piping
    input_text = sys.stdin.read()
    cleaned_text = clean_commit_messages(input_text)

    folder = "releases"

    for i in range(len(cleaned_text)):
        filename = get_next_filename(i)
        filepath = os.path.join(folder, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            summary = summarize(cleaned_text[i])
            f.write(summary)

    print("Done")