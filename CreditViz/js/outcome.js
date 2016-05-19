function renderOutcome(outcome) {
                
                 var diameter = 250,
                    format = d3.format(",d");
                var svg = d3.select("#outcome")
                    .attr("width", 350)
                    .attr("height", 350)
                    .append("g")
                    .attr("transform", "translate(50,50)");
               
                function render(root) {
                     var pack = d3.layout.pack()
                    .size([diameter - 4, diameter - 4])
                    .value(function(d) { return d.size; });
                         
                    colorScale = ["#d62728","#2ca02c"];
                    // draw legend    
                    var legend = svg.selectAll(".legend")
                      .data(["Absent","Present"])
                       .enter().append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                    // draw legend colored rectangles
                    legend.append("rect")
                      .attr("x", -20)
                      .attr("width", 18)
                      .attr("height", 18)
                      .style("fill", function(d,i) { return colorScale[i];});

                    // draw legend text
                    legend.append("text")
                      .attr("x", 20+20)
                      .attr("y", 9)
                      .attr("dy", ".35em")
                      .style("text-anchor", "end")
                      .text(function(d) { return d;});
                    
                  var node = svg.datum(root).selectAll(".node")
                      .data(pack.nodes)
                      .enter().append("g")
                      .attr("data-info", function(d) {
                            console.log(d["val"]);
                            return d["val"] ? d["val"] : null;
                      })
                      .attr("data-accuracy", function(d) {
                            console.log(d["accuracy"]);
                            return d["accuracy"] ? d["accuracy"] : null;
                      })
                      .attr("data-coverage", function(d) {
                            console.log(d["coverage"]);
                            return d["coverage"] ? d["coverage"] : null;
                      })
                      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                  
                  node.attr("class", function(d) { return d.children ? "node" : $(this).attr("data-info") == "a" ? "leaf node red":"leaf node green"; })
                  

                  node.append("circle")
                      .attr("class","packed")
                      .attr("r", function(d) { return d.r; })
                      .on("mouseenter",function(d,i) { 
                            d3.select("#tooltipOutcome").style({
                                visibility:"visible",
                                top:(d3.event.pageY-200) + "px",
                                left:(d3.event.pageX-800) + "px",
                                opacity:1
                            }).html( "<b>"+d.name+"</b>" +
                                (d.children ? "<br/>"+"Coverage : "+$(this).parent().attr("data-coverage")+"<br/>Accuracy : "+$(this).parent().attr("data-accuracy") : "")
                            
                            );
                        })
                        .on("mouseleave",function(d,i) { 
                            d3.select("#tooltipOutcome").style({
                                visibility:"hidden",
                                opacity:0
                            }).html("");
                        });

                  node.filter(function(d) { return !d.children; }).append("text")
                      .attr("dy", ".3em")
                      .style("text-anchor", "middle")
                      .text(function(d) { return d.name.substring(0, d.r / 3); });
                    
                  
                 
                }
                d3.json("data/rules.json", function(root) {
                    for(i =0;i<root.length;i++) {
                        if(outcome == root[i].name) {
                             root[i].name = "Rating "+outcome;
                             $(".outcomeTitle").html(root[i].name);
                             render(root[i]);
                             break;
                        }
                    }
                 
               
                });

                d3.select(self.frameElement).style("height", diameter + "px");            

}