
# Bankist Application

The **Bankist Application** is a web-based banking application that allows users to view and manage their financial transactions, transfer funds, and request loans. The app also provides a customized user experience with saved preferences, including theme settings and transaction filters.

## Project Overview
Bankist provides users with a simple, intuitive interface to monitor their account balance, view recent transactions, and perform operations like fund transfers and loan requests. Each session maintains the user’s preferences, enabling a seamless experience upon returning to the app.

## Key Features

### 1. User Authentication and Session Persistence
   - **Login System**: Users can log in using a unique username and PIN.
   - **Session Management**: The app remembers the last logged-in user and automatically restores their session upon reloading the page.

### 2. Transaction Management
   - **Viewing Movements**: Users can view all account movements, including deposits and withdrawals, with accurate timestamps.
   - **Transfer Funds**: Users can transfer funds to other Bankist accounts, and the data is saved persistently across both sender and receiver accounts.
   - **Request Loan**: Users can request a loan based on certain eligibility criteria, and the amount is immediately reflected in the account balance.

### 3. User Preferences and Filters
   - **Sort and Filter Transactions**: Users can sort transactions or filter by deposits or withdrawals. These preferences are saved and automatically reapplied when the user returns to the app.
   - **Theme Management**: Users can toggle between light and dark themes, with their choice saved in local storage. The app automatically applies the saved theme when the page is reloaded.

### 4. Local Storage Persistence
   - **Filter and Sorting Settings**: The app saves sorting and filter preferences (sorted, deposit-only, withdrawal-only) so that users find their last-used settings in place upon returning.
   - **Transaction Data**: All movements and dates are saved across accounts to ensure both sender and receiver accounts reflect updated transactions.
   - **Theme Selection**: Users’ selected theme (light or dark) is saved in local storage and applied during the next session.

## Technologies Used
- **HTML & CSS** for structure and styling.
- **JavaScript** for app logic and interaction.
- **Local Storage** for persisting user preferences, session data, and transaction details.

## Getting Started
1. **Clone the Repository**: 
   ```bash
   git clone https://github.com/yourusername/bankist-app.git
   ```
2. **Open the `index.html` file** in your browser to start using the app.

## Usage
1. Log in with a valid username and PIN.
2. View your account balance, transactions, and summaries.
3. Use filters or sort transactions as needed—preferences will be saved.
4. Transfer funds or request a loan, with updates saved across sessions.

## Future Improvements
- **Enhanced Security**: Add encryption for stored data.
- **Mobile Responsiveness**: Optimize the app for various screen sizes.
- **Advanced Filtering**: Add date-based or range-based transaction filtering.
