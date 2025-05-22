# Digital Wallet API

A secure digital wallet system with features for deposits, withdrawals, transfers, fraud detection, and administrative oversight.

## Features

- **User Management**
  - Registration and authentication
  - JWT-based authorization
  - Account deletion (soft delete)

- **Wallet Operations**
  - Deposit funds
  - Withdraw funds
  - Transfer between users
  - Transaction history

- **Security Features**
  - Automatic fraud detection
  - Large transaction monitoring
  - Multiple transfer detection
  - Email notifications (mocked)

- **Admin Features**
  - View flagged transactions
  - Monitor total system balance
  - Track top users by balance

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Node-cron for scheduled tasks
- Nodemailer (mock implementation)

## Getting Started

1. **Clone the repository**

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file with:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/digital_wallet
   JWT_SECRET=your-secret-key
   ```

4. **Start MongoDB**
   Ensure MongoDB is running locally

5. **Start the server**
   ```sh
   node server.js
   ```

## API Endpoints

### Authentication Routes

#### Register User
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "msg": "User registered successfully"
  }
  ```

#### Login User
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "token": "JWT_Token_String"
  }
  ```

#### Delete Account
- **Endpoint:** `DELETE /api/auth/delete`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "msg": "Account soft-deleted successfully"
  }
  ```

### Wallet Routes

#### Deposit Money
- **Endpoint:** `POST /api/wallet/deposit`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "amount": "number"
  }
  ```
- **Response:**
  ```json
  {
    "msg": "Deposit successful",
    "balance": "number"
  }
  ```

#### Withdraw Money
- **Endpoint:** `POST /api/wallet/withdraw`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "amount": "number"
  }
  ```
- **Response:**
  ```json
  {
    "msg": "Withdrawal successful",
    "balance": "number"
  }
  ```

#### Transfer Money
- **Endpoint:** `POST /api/wallet/transfer`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "toUserId": "string",
    "amount": "number"
  }
  ```
- **Response:**
  ```json
  {
    "msg": "Transfer successful"
  }
  ```

#### Transaction History
- **Endpoint:** `GET /api/wallet/history`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "transactions": [
      {
        "type": "deposit|withdraw|transfer",
        "amount": "number",
        "from": "userId",
        "to": "userId",
        "status": "success|failed",
        "createdAt": "date"
      }
    ]
  }
  ```

### Admin Routes

#### Get Flagged Transactions
- **Endpoint:** `GET /api/admin/flags`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "frauds": [
      {
        "userId": {
          "name": "string",
          "email": "string"
        },
        "type": "string",
        "message": "string",
        "timestamp": "date"
      }
    ]
  }
  ```

#### Get Total System Balance
- **Endpoint:** `GET /api/admin/total-balances`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "totalBalance": "number"
  }
  ```

#### Get Top Users
- **Endpoint:** `GET /api/admin/top-users`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "topUsers": [
      {
        "name": "string",
        "email": "string",
        "balance": "number"
      }
    ]
  }
  ```

### Error Responses

All routes may return the following error formats:

#### Authentication Errors
```json
{
  "msg": "No token provided"
}
```
or
```json
{
  "msg": "Invalid or expired token"
}
```

#### Validation Errors
```json
{
  "msg": "Error message describing the validation failure"
}
```

#### Server Errors
```json
{
  "msg": "Server error",
  "err": "Error details"
}
```
## Security Features

### Fraud Detection
- Monitors transactions for suspicious patterns
- Flags large deposits/withdrawals (≥₹10,000)
- Detects rapid successive transfers (3+ in 5 minutes)
- Daily automated fraud scanning

### Authentication
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes using middleware

## Development

The project uses the following development tools:
- `nodemon` for development auto-reload
- Environment configuration via `dotenv`
- Mongoose for MongoDB object modeling

## Error Handling

The API includes comprehensive error handling for:
- Invalid credentials
- Insufficient funds
- Invalid transactions
- Server errors
- Authentication failures