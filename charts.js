function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);

    // Gauge - 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(metadataObj => metadataObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var output = samplesArray[0];
    console.log(output);

    // Gauge - 2. Create a variable that holds the first sample in the metadata array.
    var metaOutput = metadataArray[0];
    console.log(metaOutput);


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = output.otu_ids;
    var otuLables = output.otu_labels;
    var sampleValues = output.sample_values;
    console.log(otuId);
    
    // Gauge - 3. Create a variable that holds the washing frequency.
    var wfreqValue = metaOutput.wfreq;
    console.log(wfreqValue);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var sortedIds = otuId.sort((a,b) => b - a);
    var tenIds = sortedIds.slice(0,10).reverse();
    console.log(sortedIds);
    console.log(tenIds);

    var sortedValues = sampleValues.sort((a,b) => b - a);
    var tenValues = sortedValues.slice(0,10).reverse();
    console.log(sortedValues);
    console.log(tenValues);


    var yticks = tenIds.map(id => 'OTU '.concat(String(id)));
    console.log(yticks);

    
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: tenValues,
      y: yticks,
      type: 'bar',
      text: otuLables,
      orientation: 'h'
    };
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 25, r: 25, l: 25, b: 25 }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Buble Chart
    // 1. Create the trace for the bubble chart.
    var trace1 = {
      x: otuId,
      y: sampleValues,
      text: otuLables,
      mode: 'markers',
      marker: {
        color: otuId,
        size: sampleValues
      }      

    };
    var bubbleData = [trace1];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      //margin: autoexpand,
      hovermode: 'closest'
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreqValue, 
      type: 'indicator',
      mode: 'gauge+number',
      title: {text: 'Belly Button Washing Frequency'},
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          {range: [0,2], color:'red'},
          {range: [2,4], color: 'orange'},
          {range: [4,6], color: 'yellow'},
          {range: [6,8], color: 'lightgreen'},
          {range: [8,10], color: 'green'}
        ],
        bar: { color: "black" }
      }
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 450,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}




