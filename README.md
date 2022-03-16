# Fetching GitHub most popular projects demo service

Service in node.js for fetching the most popular repositories, sorted by number of stars.
The user makes a GET request locally at the http://localhost:7000/getRepos endporint, and can use the following optional query parameters:

- createdAt, must be a "YYYY-MM-DD"
- limit, must be a positive integer
- language

## Getting started

Run `npm ci` to install all necessary packages

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the service using nodemon, i.e. restarting the application when file changes in the directory are detected.

### `npm run test`

Runs the test file, shows code coverage

### `npm run prettier`

Runs prettier

### `npm run lint`

Runs lint
