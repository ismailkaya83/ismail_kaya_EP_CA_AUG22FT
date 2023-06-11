## Acknowledgements

Our project group, consisting of Kubilay Kartal, Emirhan Sözan, Ismail Kaya, and Asim Emre Yilmaz, embarked on a collaborative development journey to create a high-quality solution. We aimed to streamline our development process and ensure code quality by adopting a boilerplate. After careful consideration, we chose the “node-express-boilerplate” available at https://github.com/hagopj13/node-express-boilerplate.

To initiate the project, Emirhan Sözan took the lead in configuring the initial settings and setup of the chosen boilerplate. Emirhan customized the boilerplate to align with our project requirements and established the necessary foundations for our development environment.

Throughout the development process, our team collaborated closely, holding weekly meetings to discuss progress, overcome challenges, and make collective decisions. We recognized the value of teamwork and effectively divided responsibilities based on our individual strengths and interests.

Ismail Kaya contributed significantly by writing comprehensive test cases to ensure adequate coverage for the implemented functionalities. Their dedication in detecting and resolving potential issues early on provided us with confidence in the stability and reliability of our codebase.

Asim Emre Yilmaz played a crucial role in creating Sequelize Models and establishing associations within our database. Their expertise in database management and ORM (Object-Relational Mapping) proved invaluable. Asim’s efforts helped us design an efficient and well-structured data model.

Ismail Kaya also collaborated with the team in preparing the Postman documentation. They meticulously documented the various API endpoints, including request and response payloads. This documentation facilitated seamless communication between the frontend and backend teams and aided in the development process.

Additionally, Asim Emre Yilmaz took the lead in preparing the Database Entity Relationship Diagram (ERD). By visually representing the relationships between different entities in our database, Asim Emre Yilmaz provided us with a clear understanding of the data structure, promoting data integrity and consistency.

Lastly, Kubilay Kartal took on the responsibility of preparing the Retrospective Report. In this report, Kubilay captured key insights, lessons learned, and identified areas for improvement during the development process. This document serves as a valuable resource for future projects, allowing us to continually refine our development practices.

Our project group worked collaboratively, leveraging each member’s skills and expertise. By utilizing the selected boilerplate, we benefited from its built-in features such as JWT-based authentication, request validation, and unit and integration tests. We successfully customized the boilerplate to meet our project’s specific needs, resulting in a high-quality solution.

Throughout our work, we relied on resources like Stack Overflow (https://stackoverflow.com/) and the Sequelize documentation (https://sequelize.org/docs/v6/core-concepts/assocs/) for guidance and assistance.

We got help from ChatGPT while writing Descriptions, Informative messages, and Retrospective Report.

## Node Version
- v16.14.2

## Install the dependencies:

```bash
yarn install
```

## Create MySQL Database on your desired workbench

```
CREATE SCHEMA `StockSalesDB`;

CREATE USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';
ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';
GRANT ALL PRIVILEGES ON StockSalesDB.* TO 'admin'@'localhost';
```

## Run Tests

```bash
yarn test
```

## Run Tests

```bash
yarn dev
```

## Husky permissions (On Mac or Linux)

```bash
chmod ug+x .husky/post-checkout
chmod ug+x .husky/post-commit
chmod ug+x .husky/pre-commit
chmod ug+x .husky/_/husky.sh
```
## Descriptions

- This project is a modern web application backend built on Node.js and utilizes various npm packages for enhanced functionality. Below is a brief description of its different modules:

### Main Application (src/index.js)
- The main entry point for the application, handling the setup and initialization of the Express.js server, middleware, and routes.

### Scripts
- start: Starts the application using pm2, a process manager for Node.js applications.
- dev: Runs the application in development mode with nodemon, automatically restarting the app when file changes are detected.
- test and test:watch: Runs Jest tests in single-run mode or watch mode, respectively.
- coverage and coverage:coveralls: Generates test coverage reports.
- lint and lint:fix: Lint checks the code with ESLint and automatically fixes fixable problems.
- prettier and prettier:fix: Checks if the code is formatted according to Prettier rules, and automatically formats it if not.
- prepare: Sets up Husky for Git hooks.

### Dependencies
- axios, node-fetch: Used for making HTTP requests.
- bcryptjs: Helps in hashing and verifying passwords for user authentication.
- compression: Middleware that attempts to compress response bodies for all request.
- cors: Enables CORS (Cross-Origin Resource Sharing) with various options.
- cross-env: Allows setting environment variables in scripts.
- dotenv: Loads environment variables from a .env file into process.env.
- express: Fast, unopinionated, minimalist web framework for Node.js.
- express-rate-limit: Basic rate-limiting middleware for Express.
- helmet: Helps secure your apps by setting various HTTP headers.
- http-errors: Create HTTP error objects.
- http-status: Utility to interact with HTTP status code.
- joi: Object schema validation.
- jsend: A simple, specification-based JSON response format for API.
- jsonwebtoken: Implementation of JSON Web Tokens.
- moment: A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
- mongoose, mysql, mysql2, sequelize: Database-related libraries.
- morgan: HTTP request logger middleware for node.js.
- passport, passport-jwt: Authentication middleware for Node.js.
- pm2: Production process manager for Node.js applications with a built-in load balancer.
- validator: A library of string validators and sanitizers.
- winston: A multi-transport async logging library for Node.js.
- xss-clean: Middleware to sanitize and clean user input to prevent XSS attacks.

### DevDependencies
- coveralls: Provides test coverage reporting to Coveralls.io.
- eslint, eslint-config-airbnb-base, eslint-config-prettier, eslint-plugin-import, eslint-plugin-jest, eslint-plugin-prettier, eslint-plugin-security: ESLint and various configurations and plugins for it.
- faker: Generate massive amounts of fake data in the browser and Node.js.
- husky: Simplifies Git hooks management.
- jest: A delightful JavaScript Testing Framework with a focus on simplicity.
- lint-staged: Lint your files in stages.
- node-mocks-http: Node.js module to create express http request and response mock object for unit testing.
- nodemon: Monitor for any changes in your node.js application and automatically restart the server.
- prettier: An opinionated code formatter.
- supertest: Super-agent driven library for testing node.js HTTP servers.

## environment variables

PORT=8000

DATABASE_NAME="StockSalesDB"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="P@ssw0rd"
HOST="localhost"
DIALECT="mysql"

JWT_SECRET=saadfals09890aksjldfhkla9889skdjfg
JWT_ACCESS_EXPIRATION_MINUTES=120
JWT_REFRESH_EXPIRATION_DAYS=120
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

ITEM_SEED_URL=http://143.42.108.232:8888/items/stock
ADMIN_USERNAME_DB="Admin"
ADMIN_PASSWORD_DB="P@ssw0rd2023"
ADMIN_EMAIL_DB="ismail.kaya.bergen@gmail.com"
