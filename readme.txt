The automated testing framework designed for the Blog Application. 
----------------------

Framework and Tools
----------------------
The framework is built using playwright** with JS, utilising the POM pattern.
* Playwright is choosed because of its batteries included in nature for API and UI testing, high speed execution, and ease of setup.
* POM pattern is used to reduces code duplication and simplifies maintenance.

Setup Instructions
-------------------
1. Ensure Node.js is installed on your local machine.
2. Install dependencies
    - npm install
    - npx playwright install chromium


How to Run Tests
----------------------
The suite is configured to run against the local development environment.

* Run all tests 
    - npm run test
* Run API tests only
    - npm run test:api
* Run UI tests only
    - npx run test:UI
* View test report
    - npx playwright show-report

Test Coverage Summary
----------------------
* Theme preference and "read" visual" mark persists across sessions
* Navigation and pagination logic and UI state persistence.
* Blog Management: CRUD operations both UI and Backend. with image case as well
* Login validation and automated capture of `localStorage` tokens for API auth.
* Comments: Validation of comment creation, retrieval by blog ID, and auth constraints.
* Navigation and pagination logic and UI state persistence.

Assumptions and Notes
----------------------
* The framework assumes the application is running at `http://localhost:5173`.
* AdminPage.login method is designed to capture the authentication token from `localStorage` and inject it into the API helpers for subsequent requests.
* The pagination test suite includes an intentional failure check for URL persistence, as the current application does not update the URL when the page changes.
