# DeepTeam Results Viewer

A modern web application for visualizing and analyzing DeepTeam security testing results. This application provides an intuitive interface to explore test results, view vulnerability assessments, and analyze attack method effectiveness.

## Features

- **File Selection**: Choose from available results files in the results directory
- **Overview Dashboard**: High-level statistics with interactive charts
- **Detailed Test Cases**: Browse individual test cases with filtering and search
- **Interactive Visualizations**: Pie charts and bar charts for result analysis
- **Advanced Filtering**: Filter by vulnerability type, attack method, and test status
- **Search Functionality**: Full-text search across all test case data
- **Responsive Design**: Works on desktop and mobile devices

## Screenshots

The application includes:
- Summary cards showing total tests, passing/failing counts, and pass rates
- Interactive pie chart for overall test results
- Bar charts for vulnerability type and attack method breakdowns
- Detailed tables with filtering capabilities
- Expandable test case views with input/output analysis

## Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager

## Installation

### Quick Start (Recommended)

**On macOS/Linux:**
```bash
cd ui-results-viewer
./start.sh
```

**On Windows:**
```cmd
cd ui-results-viewer
start.bat
```

This will automatically install dependencies and start both the backend server and frontend development server.

### Manual Installation

1. Navigate to the ui-results-viewer directory:
   ```bash
   cd ui-results-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start both servers (backend + frontend):
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

**Note:** The application requires both servers to be running:
- Backend server on port 3001 (serves results files and API)
- Frontend development server on port 3000 (React application)

## Usage

### Selecting Results Files

1. Use the dropdown in the "Select Results File" section to choose from available results
2. Files are automatically detected from the `../results/` directory
3. The application will load and parse the selected JSON file

### Viewing Results

- **Overview Section**: See high-level statistics and charts
- **Test Cases Section**: Browse individual test cases with filtering options
- **Expandable Details**: Click on test case headers to view full details
- **Input/Output Toggle**: Use the "Show/Hide Inputs" button to control prompt visibility

### Filtering and Search

- **Search Bar**: Search across all test case content
- **Vulnerability Filter**: Filter by specific vulnerability types
- **Attack Method Filter**: Filter by attack methods used
- **Status Filter**: Filter by pass/fail/error status

## Data Structure

The application expects results files with the following JSON structure:

```json
{
  "overview": {
    "vulnerability_type_results": [...],
    "attack_method_results": [...],
    "errored": 0
  },
  "test_cases": [...]
}
```

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `build/` directory.

## Customization

### Styling

The application uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Component styles in `src/index.css`
- Individual component styling

### Adding New Features

The component structure is modular:
- `App.js`: Main application container
- `FileSelector.js`: File selection component
- `ResultsOverview.js`: Overview charts and statistics
- `TestCasesViewer.js`: Test case browsing and filtering

## Troubleshooting

### Common Issues

1. **File Loading Errors**: Ensure the results directory contains valid JSON files
2. **Chart Rendering Issues**: Check that all required data fields are present
3. **Build Errors**: Verify Node.js version and dependency installation

### Development Mode

For development and debugging:
- Use browser developer tools to inspect console logs
- Check the Network tab for file loading issues
- Verify component state in React DevTools

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the DeepTeam playground and follows the same licensing terms.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the component documentation
- Open an issue in the project repository
