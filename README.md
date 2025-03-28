# EmployWise User Management App

A React application that integrates with the Reqres API to perform user authentication and management functions.

## Features

- User authentication
- Paginated user listing
- User editing, and deletion
- Responsive design
- Persistent login session
- Error handling and form validation

## Technologies Used

- React.js
- React Router
- Axios
- Context API (for state management)
- Shadcn (for UI components)
- React Hook Form (for form handling)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/employwise.git
   cd employwise
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Assumptions & Considerations

1. **Authentication**:
   - Used the provided test credentials (eve.holt@reqres.in / cityslicka)
   - Token is stored in localStorage for persistence
   - Automatic redirect to login if token is missing/expired

2. **User Management**:
   - The Reqres API doesn't actually persist changes, so updates/deletes only affect the UI temporarily
   - Added client-side state updates to simulate persistence
   - Implemented optimistic updates for better UX

3. **Error Handling**:
   - Added basic form validation
   - Displayed API error messages to users
   - Implemented loading states during API calls

4. **Pagination**:
   - Used the pagination data provided by the API
   - Implemented page navigation controls

5. **UI/UX**:
   - Used Material-UI for consistent styling
   - Made the app responsive for different screen sizes
   - Added loading indicators for better feedback

## API Endpoints Used

- POST `/api/login` - User authentication
- GET `/api/users` - List users (paginated)
- PUT `/api/users/{id}` - Update user
- DELETE `/api/users/{id}` - Delete user

## Future Improvements

1. Add proper form validation with better error messages
2. Implement client-side search/filter functionality
3. Add user roles and permissions
4. Implement proper error boundaries

## Hosted Version

The application is hosted on Vercel: [https://employwise.vercel.app](https://employwise.vercel.app)
