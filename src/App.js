import data from "./data.json";

// Sample dataset structure
const distributedDataset = data.slice().reduce((acc, ele) => {
  acc[ele.Alcohol] = acc[ele.Alcohol] ? [...acc[ele.Alcohol], ele] : [];
  return acc;
}, {});

const roundToThree = (num) => {
  return +(Math.round(num + "e+3") + "e-3");
};

// Utility function to calculate the mean
const calculateMean = (data, type) => {
  const sum = data.reduce((acc, entry) => (acc += +entry[type]), 0);
  return roundToThree(sum / data.length);
};

// Utility function to calculate the median
const calculateMedian = (data, type) => {
  const sortedData = data.slice().sort((a, b) => a[type] - b[type]);
  const middleIndex = Math.floor(sortedData.length / 2);

  if (sortedData.length % 2 === 0) {
    return roundToThree(
      (sortedData[middleIndex - 1][type] + sortedData[middleIndex][type]) / 2
    );
  } else {
    return roundToThree(sortedData[middleIndex][type]);
  }
};

// Utility function to calculate the mode
const calculateMode = (data, type) => {
  const frequencyMap = {};

  data.forEach((entry) => {
    if (!frequencyMap[entry[type]]) {
      frequencyMap[entry[type]] = 1;
    } else {
      frequencyMap[entry[type]]++;
    }
  });

  let mode = null;
  let maxFrequency = 0;

  for (const value in frequencyMap) {
    if (frequencyMap[value] > maxFrequency) {
      mode = parseFloat(value);
      maxFrequency = frequencyMap[value];
    }
  }

  return roundToThree(mode);
};

const structuredDataObject = (data, type) =>
  Object.entries(data)
    .slice()
    .reduce((acc, [key, value]) => {
      acc[key] = {
        mean: calculateMean(value, type),
        median: calculateMedian(value, type),
        mode: calculateMode(value, type)
      };
      return acc;
    }, {});

const FlavanoidsStatsTable = ({ data }) => {
  const structuredData = structuredDataObject(data, "Flavanoids");

  return (
    <table style={{ margin: "auto", width: "50%" }} border="auto">
      <thead>
        <tr>
          <th>Alcohol Class</th>
          <th>Flavanoids Mean</th>
          <th>Flavanoids Median</th>
          <th>Flavanoids Mode</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(structuredData).map(([key, value]) => (
          <tr key={key}>
            <td style={{ textAlign: "center" }}>Class {key}</td>
            <td style={{ textAlign: "center" }}>{value.mean}</td>
            <td style={{ textAlign: "center" }}>{value.median}</td>
            <td style={{ textAlign: "center" }}>{value.mode}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const calculateGamma = (entry) => {
  return (entry.Ash * entry.Hue) / entry.Magnesium;
};

const GammaStatsTable = ({ data }) => {
  // Calculate Gamma and statistics
  Object.values(data).forEach((entry) => {
    entry.forEach((ele) => {
      ele.Gamma = calculateGamma(ele);
    });
  });
  const structuredData = structuredDataObject(data, "Gamma");

  return (
    <table style={{ margin: "auto", width: "50%" }} border="auto">
      <thead>
        <tr>
          <th>Alcohol Class</th>
          <th>Gamma Mean</th>
          <th>Gamma Median</th>
          <th>Gamma Mode</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(structuredData).map(([key, value]) => (
          <tr key={key}>
            <td style={{ textAlign: "center" }}>Class {key}</td>
            <td style={{ textAlign: "center" }}>{value.mean}</td>
            <td style={{ textAlign: "center" }}>{value.median}</td>
            <td style={{ textAlign: "center" }}>{value.mode}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Flavanoids Statistics</h1>
      <FlavanoidsStatsTable data={distributedDataset} />
      <br></br>
      <h1 style={{ textAlign: "center" }}>Gamma Statistics</h1>
      <GammaStatsTable data={distributedDataset} />
    </div>
  );
}

export default App;
