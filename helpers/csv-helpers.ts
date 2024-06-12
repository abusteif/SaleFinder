import * as fs from 'fs';
import { stringify } from 'csv-stringify';

// Sample data to be saved to CSV
const data = [
  { name: 'John Doe', age: 30, city: 'New York' },
  { name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  { name: 'Sam Johnson', age: 35, city: 'Chicago' }
];

// Function to convert data to CSV and save to file

export function saveToCSV(fileName: string, data: any[]) {
  // Define CSV headers based on keys of the first object
  const headers = Object.keys(data[0]);
  console.log(headers)
  // Check if file exists
  const fileExists = fs.existsSync(fileName);

  // Use csv-stringify to create CSV string
  stringify(
    data,
    {
      header: !fileExists,  // Only include headers if the file doesn't exist
      columns: headers,
    },
    (err, output) => {
      if (err) {
        console.error('Error creating CSV string:', err);
        return;
      }

      // Append or write CSV string to file
      const writeFunction = fileExists ? fs.appendFile : fs.writeFile;

      writeFunction(fileName, output, (err) => {
        if (err) {
          console.error(`Error ${fileExists ? 'appending to' : 'writing to'} CSV file:`, err);
        } else {
          console.log(`CSV file ${fileExists ? 'appended' : 'saved'} as ${fileName}`);
        }
      });
    }
  );
}

// // Save the sample data to a CSV file
// saveToCSV('output.csv', data);
