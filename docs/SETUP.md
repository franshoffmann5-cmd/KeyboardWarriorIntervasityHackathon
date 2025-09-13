# Password Fort - Setup Instructions
This guide will help you set up and run the project on your local machine.

## Requirements

Before you begin, ensure you have the following installed on your system:

- **Node.js** v18 or higher
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`
- **Git** (for cloning the repository)
  - Download from: https://git-scm.com/

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/franshoffmann5-cmd/KeyboardWarriorIntervasityHackathon.git
   cd KeyboardWarriorIntervasityHackathon
   ```

2. **Navigate to the source directory:**
   ```bash
   cd src
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Fix any security vulnerabilities (recommended):**
   ```bash
   npm audit fix --force
   ```

## Running the Project

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Open your web browser (Chrome, Firefox, Edge, etc.)
   - Navigate to: `http://localhost:3000` (the number may differ for you, but it should be something like this)
   - The application will automatically reload when you make changes to the code
