# Dash Budget

A modern, responsive budget dashboard application built with React and Vite. Dash Budget allows users to track their total budget, add expenses, maintain a ledger, and visualize financial data through interactive graphs.

## Features

- **Budget Tracking**: Monitor your total budget and remaining balance.
- **Expense Ledger**: Add, edit, and delete expenses with a detailed ledger.
- **Data Visualization**: View financial trends with interactive graphs powered by Recharts.
- **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.
- **Modern UI Components**: Built with Radix UI primitives for accessible and customizable UI elements.
- **Form Handling**: Robust form management with React Hook Form and Zod for validation.
- **Dark/Light Mode**: Theme switching with `next-themes`.
- **Real-time Updates**: Powered by TanStack Query for efficient data fetching and state management.

## Tech Stack

- **Frontend**: React, React Router, Vite
- **Styling**: Tailwind CSS, Tailwind CSS Animate, Class Variance Authority (CVA)
- **UI Components**: Radix UI (Accordion, Dialog, Dropdown, Tabs, Toast, etc.), Lucide React (icons)
- **Form Handling**: React Hook Form, Zod
- **Data Visualization**: Recharts
- **State Management**: TanStack Query
- **Date Handling**: date-fns, React Day Picker
- **PDF Generation**: jsPDF
- **Others**: Embla Carousel, Vaul, CMDK, Input OTP

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or Yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/dash-budget.git
   cd dash-budget
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

### Available Scripts

- `npm run dev`: Starts the development server with Vite.
- `npm run build`: Builds the app for production.
- `npm run build:dev`: Builds the app in development mode.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the production build locally.

## Project Structure

```
dash-budget/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components for routing
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Tailwind CSS and global styles
│   ├── utils/             # Utility functions and helpers
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
├── public/                # Static assets
├── package.json           # Project dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── README.md              # This file
```

## Usage

1. **Set Budget**: Enter your total budget in the dashboard.
2. **Add Expenses**: Use the expense form to log transactions, which are added to the ledger.
3. **View Graphs**: Navigate to the graphs section to visualize spending patterns.
4. **Export Data**: Generate PDF reports of your budget and expenses using jsPDF.
5. **Switch Themes**: Toggle between light and dark modes for a comfortable viewing experience.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.


## Acknowledgments

- Built with [Vite](https://vite.dev/) for fast development and builds.
- Powered by [Radix UI](https://www.radix-ui.com/) for accessible components.
- Styled with [Tailwind CSS](https://tailwindcss.com/) for rapid UI development.
- Visualizations by [Recharts](https://recharts.org/).

---

# Output
- This folder contains the output which is expected after the completion of the code.
