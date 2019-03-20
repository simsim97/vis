window.onload = function(){
    setupVis();
};

const WIDTH = 1700;
const HEIGHT = 1500;
const PAD = 10;
const MARGIN = 50;
const projection = d3.geoMercator()
                    .scale(800)
                    .translate([2100, 1200])
                    .rotate([0,0,20]);
const pathGenerator = d3.geoPath().projection(projection);

var cname = [];

function setupVis() {
    let svg = d3.select("#vis1")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);
    var color = d3.scaleLinear()
        .range(["rgb(255, 242, 246)","rgb(252, 191, 210)", "rgb(249, 139, 173)", "rgb(237, 97, 140)",
            "rgb(198, 35, 85)", "rgb(135, 0, 41)", "rgb(104, 0, 32)"]);


    var legendText = ["A", "B", "C", "D"];
    // Load in my states data!
    d3.csv("oxy.csv", function(data) {
        color.domain([0,90,80,85,90,95,100,200]); // setting the range of the input data

        d3.json("canada.json")
        .then(function (json) {
            const provinces = topojson.feature(json, json.objects.canadaprov);
            // Grab State Name
            var dataState = data.Province;
            // Grab data value
            var dataValue = data.Oxycodone;

            provinces.features[0].properties['Oxycodone'] = 89.5;
            provinces.features[1].properties['Oxycodone'] = 33.3;
            provinces.features[2].properties['Oxycodone'] = 129.6;
            provinces.features[3].properties['Oxycodone'] = 65.8;
            provinces.features[4].properties['Oxycodone'] = 0;
            provinces.features[5].properties['Oxycodone'] = 0;
            provinces.features[6].properties['Oxycodone'] = 0;
            provinces.features[7].properties['Oxycodone'] = 192.9;
            provinces.features[8].properties['Oxycodone'] = 90.8;
            provinces.features[9].properties['Oxycodone'] = 163.6;
            provinces.features[10].properties['Oxycodone'] = 87.7;
            provinces.features[11].properties['Oxycodone'] = 162.5;
            provinces.features[12].properties['Oxycodone'] = 0;

            const paths = svg.selectAll('path')
                .data(provinces.features)
                .enter()
                .append('path')
                .attr('d', pathGenerator)
                .style("fill", function(d){
                    // Get data value
                    var value = d.properties.Oxycodone;
                   //console.log(d.properties);

                  //  if (value) {
                        //If value exists…
                        return color(value);
                        //console.log(color(value))
                   // } else {
                        //If value is undefined…
                     //   return "rgb(213,222,217)";
                  //  }
                });
        })


             });
        };
