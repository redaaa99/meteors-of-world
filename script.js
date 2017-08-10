var url =  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";

$.getJSON(url, function( response) {

	$("#info").css("visibility","visible");

    var width = window.innerWidth-20,
    height = window.innerHeight-5;

	var projection = d3.geoMercator()
	    .translate([width / 2, height/1.5]);
	    
	

	var plane_path = d3.geoPath()
	        .projection(projection);

	var svg = d3.select("div").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "map")
	    
	var g = svg.append("g");
	var path = d3.geoPath()
	    .projection(projection);


	d3.json("https://d3js.org/world-50m.v1.json", function(error, topology) {
	    g.selectAll("path")
	      .data(topojson.feature(topology, topology.objects.countries)
	          .features)
	      .enter()
	      .append("path")
	      .attr("d", path)
	      .attr("fill","#888")
	      .attr("stroke","black")
	      .attr("stroke-width","0.5px")
	      ;
	 	
		g.selectAll("circle")
		   .data(response.features)
		   .enter()
		   .append("circle")
		   .attr("cx", function(d) {
		           return projection([d.properties.reclong, d.properties.reclat])[0];
		   })
		   .attr("cy", function(d) {
		           return projection([d.properties.reclong, d.properties.reclat])[1];
		   })
		   .attr("r", function(d) { 
        		var range = 718750/2/2;
    
		        if (d.properties.mass <= range) return 2;
		        else if (d.properties.mass <= range*2) return 3;
		        else if (d.properties.mass <= range*3) return 10;
		        else if (d.properties.mass <= range*20) return 20;
		        else if (d.properties.mass <= range*100) return 30;
		        return 50;
	      })
		   .attr("opacity",0.6)
		   .style("fill", function(d) { 
        		var range = 718750/2/2;
    
		        if (d.properties.mass <= range) return "#97fcbe";
		        else if (d.properties.mass <= range*2) return "#4286f4";
		        else if (d.properties.mass <= range*3) return "#d041f4";
		        else if (d.properties.mass <= range*20) return "#8bf441";
		        else if (d.properties.mass <= range*100) return "#f4b241";
		        return "#6d1f10";
	      })
		   .on("mouseover", function(d,i) {
	            $("#info").css("left", (d3.event.pageX + 5) + "px")
	                .css("top", (d3.event.pageY - 50) + "px");
	            $("#info ").html("Name: "+d.properties.name+"<br/> Mass: "+((d.properties.mass/1000).toFixed(2))+" kg<br/>Class: "+d.properties.recclass+"<br/>Longitude: "+((Number(d.properties.reclong)).toFixed(2))+"°<br/> Latitude: "+((Number(d.properties.reclat)).toFixed(2))+"°");
	            $("#info").show();
	            d3.select(this)
	            	.attr("stroke","black")
	            	.attr("stroke-width",1.5)
                	.attr("opacity",1);
	        })
	        .on("mouseout", function(d, i) {
	            $("#info").hide();
	            d3.select(this)
	            	.attr("stroke-width",0)
	            	.attr("opacity",0.6);
	        });;

		  

	 });

	var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

	svg.call(zoom);

	function zoomed() {
	  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
	  g.attr("transform", d3.event.transform);
	}
});




