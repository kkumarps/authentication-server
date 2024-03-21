# Authentication Server with Node.js

This is an authentication server built with Node.js. The version used is 20.5.1.
MySQL database is used to store data.

## Installation

To install the required npm packages, run the following command:

```bash
npm install
```

## Environment Configuration

Change the PORT number here if required

PORT = your_port_num

You can configure the SMTP host, username, password, and JWT secret key for the token in the .env file:

SMTP_HOST=your_smtp_host <br>
SMTP_USERNAME=your_smtp_username <br>
SMTP_PASSWORD=your_smtp_password <br>
JWT_SECRET=your_jwt_secret_key

Replace MySQL host, username and password with your SQL database host, username, and password respectively.

SQL_HOST=your_sql_host <br>
SQL_USER=your_sql_username <br>
SQL_PASSWORD=your_sql_password

## Getting Started

To start the server, run the following command:

```bash
npm start
```

## User Actions and Endpoints

- **Signup**: Allows users to sign up.

  - Endpoint: [http://localhost:3000/api/v1/auth/signup](http://localhost:3000/api/v1/auth/signup)
  - Method: POST
  - Form Data: name, email, password

- **Verify OTP**: Allows users to verify their email using OTP.

  - Endpoint: [http://localhost:3000/api/v1/auth/signup](http://localhost:3000/api/v1/auth/signup)
  - Method: POST
  - Form Data: email, otp

- **Login**: Allows users to log in.

  - Endpoint: [http://localhost:3000/api/v1/auth/login](http://localhost:3000/api/v1/auth/login)
  - Method: POST
  - Form Data: email, password

- **Logout**: Allows users to log out.

  - Endpoint: [http://localhost:3000/api/v1/auth/logout](http://localhost:3000/api/v1/auth/logout)
  - Method: GET

- **Dashboard**: Provides access to the user's dashboard.

  - Endpoint: [http://localhost:3000/api/v1/dashboard](http://localhost:3000/api/v1/dashboard)
  - Method: GET
  - Headers: Authorization (Token obtained after successful login)

- **Get Total Count of All Category Preferences**: Retrieves the total count of all category preferences.

  - Endpoint: [http://localhost:3000/api/v1/dashboard?action=totCount](http://localhost:3000/api/v1/dashboard?action=totCount)
  - Method: GET

- **Get Dashboard with Pagination**: Retrieves the dashboard data with pagination.

  - Endpoint: [http://localhost:3000/api/v1/dashboard?list={pageNum}](http://localhost:3000/api/v1/dashboard?list={pageNum})
  - Method: GET
  - Query Parameter: pageNum (Page Number)

- **Save Selected Preference**: Saves selected preferences.
  - Endpoint: [http://localhost:3000/api/v1/dashboard?action=savePreference](http://localhost:3000/api/v1/dashboard?action=savePreference)
  - Method: POST
  - Form Data: selected preferences

## Usage

1. **Signup**:

   - Navigate to [Signup Page](http://localhost:3000/signup.html).
   - Fill out the form with your name, email, and password.
   - Click "Signup" to register.
   - After signup, you will be redirected to [OTP Verification Page](http://localhost:300/otp.html) to verify your email using OTP.

2. **OTP Verification**:

   - Navigate to [OTP Verification Page](http://localhost:3000/otp.html).
   - Enter your email and OTP received in your email id.
   - Upon successful verification, you will be redirected to the [Dashboard](http://localhost:3000/dashboard.html).

3. **Login**:

   - Navigate to [Login Page](http://localhost:3000/login.html).
   - Enter your email and password.
   - Click "Login" to log in.

4. **Dashboard**:

   - Once logged in, you can access your dashboard at [Dashboard Page](http://localhost:3000/dashboard.html).
   - From the dashboard, you can select preferences from the catalogue.

5. **Logout**:
   - To log out, you can access [Logout Endpoint](http://localhost:3000/api/v1/auth/logout) to clear the token from the database.
