var w = 500;
var h = 300;

var margin = {
    top: 60,
    bottom: 40,
    left: 70,
    right: 40
};

var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;


// define map projection
var projection = d3.geoAlbersUsa()
    .translate([w/2, h/2])
    .scale([500]);

//Define default path generator
var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("body")
    .append("svg")
    .attr("id", "chart")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("tranform", "translate(0" + margin.left + "," + margin.top + ")");

var color = d3.scaleQuantile()
    .range(["rgb(252, 191, 210)", "rgb(249, 139, 173)", "rgb(237, 97, 140)", "rgb(198, 35, 85)", "rgb(135, 0, 41)"]);

d3.csv("oxy.csv", function(data){

    color.domain([ d3.min(data, function(d){ return d.value; }),
        d3.max(data, function(d){ return d.value; })
    ]);

    d3.json("canada.json", function(json){

        //Merge the agriculture and GeoJSON data
        //Loop through once for each agriculture data value
        for(var i = 0; i < data.length; i++){
            // grab state name
            var dataState = data[i].state;

            //grab data value, and convert from string to float
            var dataValue = parseFloat(data[i].value);

            //find the corresponding state inside the GeoJSON
            for(var n = 0; n < json.features.length; n++){

                // properties name gets the states name
                var jsonState = json.features[n].properties.name;
                // if statment to merge by name of state
                if(dataState == jsonState){
                    //Copy the data value into the JSON
                    // basically creating a new value column in JSON data
                    json.features[n].properties.value = dataValue;

                    //stop looking through the JSON
                    break;
                }
            }
        }

        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function(d){
                //get the data value
                var value = d.properties.value;

                if(value){
                    //If value exists
                    return color(value);
                } else {
                    // If value is undefined
                    //we do this because alaska and hawaii are not in dataset we are using but still in projections
                    return "#ccc"
                }

            });


    });

})