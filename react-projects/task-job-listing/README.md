# Task 6 - Job Listing

A simple job listing application built with React, TypeScript, and Tailwind CSS. This application allows users to browse job listings, view detailed job information, and filter jobs based on various criteria.

## Features

- **Job Listings Dashboard**: Browse all available job opportunities with clean, card-based UI
- **Detailed Job View**: View comprehensive information about each job including responsibilities, requirements, and company details
- **Responsive Design**: Fully responsive layout that works on desktop and mobile devices
- **Tag-based Filtering**: Jobs are categorized with tags for easy filtering
- **Modern UI**: Clean, professional interface with attention to detail

## Screenshots

### Dashboard Page

![Dashboard Page](./src/assets/dash.png)

### Job Details Page

![Job Details Page](./src/assets/jobpage.png)

## Technologies Used

- **React**: Frontend library for building user interfaces
- **TypeScript**: Static typing for improved code quality and developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router**: For navigation between different pages
- **React Icons**: For beautiful, consistent icons throughout the application
- **Vite**: Next-generation frontend tooling for fast development and optimized builds

## Project Structure

- `src/components`: Reusable UI components
  - `JobCard.tsx`: Card component for displaying job listings
  - `JobList.tsx`: Component for displaying a list of job cards
  - `pages/`: Page-level components
    - `JobPage.tsx`: Detailed view of a specific job
    - `OpportunitiesDashboard.tsx`: Main dashboard page
- `src/data`: Mock data for the application
  - `jobs.json`: Sample job listings data
- `src/hooks`: Custom React hooks
  - `useGetJobs.ts`: Hook for fetching job data

### Prerequisites

- Node.js (v14 or higher)
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
# or
pnpm build
```
