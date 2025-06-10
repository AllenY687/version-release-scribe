# Welcome to Version Release Scribe

## Project info

The backend files are contained within the /backend folder. Node.js + Express as well as some python were used to create the backend. 
Run the backend by navigating into /backend and running `node index.js`. The server is hosted on port 3001.

The frontent is a vite -> TypeScript + React project. Navigate to the /frontend folder and run `npm run dev`. the web server will be hosted on port 8080.

Version release scribe currently saves generated release notes on disk under /backend/releases. 
A python script is used to fetch commits from branch `main` and pipe the messages into ChatGPT using an OpenAI key to create LLM-generated human-readable notes.
To generate new notes, you will need to add a `COMPANY_TOKEN` that has access to the codebase's commits as well as an `OPENAI_API_KEY` to .env under /backend. 
Generate new notes by hosting the backend and then visiting the /api/generated-release-notes endpoint (on browser or through curl).

## Project demo
https://drive.google.com/file/d/1qaJl1WDRJW7pNm21qq2P6zbqfD6hMKW_/view?usp=sharing

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

- Node.js
- Express
- JavaScript
