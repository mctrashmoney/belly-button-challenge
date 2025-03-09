// Build the metadata panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.find((meta) => meta.id == parseInt(sample));

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.find((s) => s.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    const bubbleChart = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    // Define Bubble Chart Layout
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      hovermode: "closest"
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleChart, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for y-ticks
    const yticks = otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();

    // Build a Bar Chart
    const barChart = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    // Define Bar Chart Layout
    const barLayout = {
      title: "Top 10 OTUs Found",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [barChart], barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
