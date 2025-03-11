# Property Land Cover Analysis Tool

A web-based tool that allows users to interactively select property boundaries on a satellite imagery map and analyze land cover types (e.g., trees, grass, water, buildings) within those boundaries.

## Features

- **Interactive Map Interface:** Display satellite imagery and allow users to draw polygons to define property boundaries.
- **Land Cover Analysis:** Analyze the selected area to classify land cover into multiple categories.
- **Visual Results:** Display analysis results with color-coded charts and percentages.
- **Cross-Platform Compatibility:** Works on both desktop and mobile devices.

## Technologies Used

- **React:** Frontend framework for building the user interface.
- **TypeScript:** For type-safe JavaScript code.
- **Leaflet.js:** For interactive maps with satellite imagery.
- **TensorFlow.js:** For client-side land cover analysis.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/property-analysis.git
   cd property-analysis
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. The map will load with satellite imagery of San Francisco.
2. Use the drawing tools to draw a polygon around the property you want to analyze:
   - Click on the map to add points to your polygon
   - Each click adds a point, and when you have at least 3 points, a blue polygon will appear
   - Double-click to complete the polygon
   - To start over, click the "Clear Points" button in the bottom-left corner
3. Click the "Analyze Property" button to process the selected area.
4. View the analysis results showing the percentage of different land cover types within your selected boundary.
5. To analyze a different area, draw a new polygon and click "Analyze Property" again.

## Development

### Project Structure

- `src/components/Map.tsx`: Map component with drawing tools
- `src/components/Analysis.tsx`: Handles the land cover analysis
- `src/components/Results.tsx`: Displays analysis results
- `src/App.tsx`: Main application component

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from create-react-app

## Limitations

- This is a prototype application using simulated analysis results.
- In a production environment, a more sophisticated land cover classification model would be used.
- The application uses free and open-source map data, which may have limitations in some regions.

## Future Enhancements

- Integrate a real machine learning model for accurate land cover classification
- Add the ability to save and share analysis results
- Improve the visualization with more detailed breakdowns of land cover types
- Add additional map layers and data sources
- Implement user accounts and history tracking

## Project Status

This application is currently in prototype stage to demonstrate the concept and UI. The land cover analysis is simulated using random data. Future iterations will include:

1. Integration with real satellite imagery processing
2. More accurate land cover classification using pre-trained models
3. Additional features like property boundary import/export

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenStreetMap and ESRI for providing free satellite imagery
- React and Leaflet.js communities for excellent documentation and examples
