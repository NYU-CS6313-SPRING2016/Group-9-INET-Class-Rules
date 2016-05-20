
function renderDataPoints() {
var width=400,
            height=450,
            margin = {top:50,bottom:50,left:50,right:20},
            innerWidth = width-margin.left-margin.right,
            innerHeight = height-margin.top-margin.bottom;
var data = [];
var chart = d3.select("#viz")

var xGroup = chart.append("g")
    .attr("transform","translate("+margin.left+","+(innerHeight+margin.top)+")");
var yGroup = chart.append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");
var dotGroup = chart.append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");

// text label for the x axis
var xLabel = chart.append("text")
            .style("text-anchor", "middle")
            .attr("dx", 220 )
            .attr("dy", 430 );

// text label for the y axis
var yLabel = chart.append("text")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .attr("dx", -210 )
            .attr("dy", 10 );
    
function highlight(rule) {
            
            dotGroup.selectAll("circle").style("stroke",function(d,i) {
                return d["Rule_no"] == rule ?"black":undefined
            });
            
            //num = rule.split(" ");
    
            //var table = $('#example').DataTable();
    
            $('table tr td #'+rule.replace(" ",'')).parent().parent().css("background-color","#b3d9ff");
            //table.row( parseInt(num[1]) ).scrollTo();
    
             num = rule.split(" ");
                var rowpos1 = $('.dataTables_scrollBody table tr #Rule'+ num[1]).position();
                 var rowpos2 = $('.DTFC_LeftBodyWrapper table tr #Rule'+ num[1]).position();
                     var rowpos3 = $('.DTFC_RightBodyWrapper table tr #Rule'+ num[1]).position();
                //alert(JSON.stringify(rowpos1)+" "+'.dataTables_scrollBody table tr #Rule'+ num[1]);
                
                //var rowpos2 = $('.DTFC_LeftBodyWrapper table tr #Rule'+ num[1]).offset();
                //n = 34 * (parseInt(num[1])-1);
    
                $('.dataTables_scrollBody').animate({scrollTop: rowpos1.top-50}, 1000);
                $('.DTFC_LeftBodyWrapper').animate({scrollTop: rowpos2.top-50}, 1000);
                $('.DTFC_RightBodyWrapper').animate({scrollTop: rowpos3.top-50}, 1000);
    
}
        
function unHighlight(rule) {            
           
            dotGroup.selectAll("circle").style("stroke",undefined);
            
            $('table tr td #'+rule.replace(" ",'')).parent().parent().css("background-color","transparent");
            
}
    
var tip;
    
function renderChart(data) {
    tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<b>"+d["Rule_no"]+"</b><br/>"+"Credit Rating : "+(d.class)+"<br/>"+"Coverage : "+d.coverage+"<br/>"+"Accuracy : "+d.accuracy;
  });
    chart.call(tip);
    chart.attr("width",width)
        .attr("height",height);
    
    var xScale = d3.scale.linear()
                .range([0,innerWidth])
                .domain([0,d3.max(data,function(d) { return +d["coverage"] })]);
    
    
    var yScale = d3.scale.linear()
                .range([innerHeight,0])
                .domain(d3.extent(data,function(d) { return +d["accuracy"] }));
        
    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
    var colorScale  = d3.scale.category10().range(["#E6A745", "#FFC300"]);
    
    xLabel.text("Coverage");
    yLabel.text("Accuracy");
    
    xGroup.call(xAxis);
            
    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");
            
    yGroup.call(yAxis);
    
    
    var selection = dotGroup.selectAll("circle")
                            .data(data);
    selection.enter()
                .append("circle")
                .attr("r",5)
                .attr("cx",function(d,i) { return xScale(d["coverage"]) })
                .attr("cy",function(d,i) { return yScale(d["accuracy"]) })
                .attr("fill",function(d,i) {return colorScale(d["class"]) })
                .attr("opacity","0.6")
                .attr("data-rule",function(d,i) { return d["Rule_no"] })
                .attr("id",function(d,i) {
                    //d['Rule_no']  = d['Rule_no'].replace(' ','');
                    return d['Rule_no'].replace(' ','');
                })
                .on("mouseenter",function(d,i) {
                    tip.show(d);
                    highlight(d["Rule_no"]);                
                })
                .on("mouseleave",function(d,i) {
                    tip.hide(d);
                    unHighlight(d["Rule_no"]);
                });
                
            
    selection.exit().remove();
    selection.transition()
            .attr("r",5)
            .attr("cx",function(d,i) { return xScale(d["coverage"]) })
            .attr("cy",function(d,i) { return yScale(d["accuracy"]) })
            .attr("data-rule",function(d,i) { return d["Rule_no"] })
            .attr("id",function(d,i) {
                //d['Rule_no']  = d['Rule_no'].replace(' ','');
                return d['Rule_no'].replace(' ','') ;
            })
            .attr("fill",function(d,i) {return colorScale(d["class"]) });
            
    /*
    // draw legend    
    var legend = chart.selectAll(".legend")
      .data(colorScale.domain())
       .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
      .attr("x", 260)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colorScale);

    // draw legend text
    legend.append("text")
      .attr("x", 260+40)
      .attr("y", 7)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;});*/
    
        var outcome_color=[];
        var leg=$('.legend');
        for (i = 0; i < leg.length; i++) {
            var dict={
                        color:$(leg[i]).children(":first").css("fill"),
                        value:$(leg[i]).children(":last").text()
                    };
            outcome_color.push(dict);
            }
        for (i=0;i<outcome_color.length;i++){
            var rgb_color=String(outcome_color[i]['color']).split(",");
            var red=+(rgb_color[0].substring(4));
            var green=+(rgb_color[1]);
            var blue=+(rgb_color[2].substring(0,rgb_color[2].length-1));
            var decColor = blue | (green << 8) | (red << 16);
            $('.credit_rating'+outcome_color[i]['value']).parent().attr("bgcolor","#"+decColor.toString(16));
        }
        
}
function render(data) {
        renderChart(data);
}
    d3.json("data/rules.json", function(d) {
        return { Rule_no : d.Rule_no , accuracy : +d.accuracy , coverage : +d.coverage , class : d.class  }; 
    })
    .get(function(error,rows) {
         rows.sort(function(a,b) {
              return d3.descending(a.class,b.class);
       });
        render(rows);
    });

}
