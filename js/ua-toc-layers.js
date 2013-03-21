function AddLayersTOC(id) {
    //hide layers
    $.each(map.graphicsLayerIds, function (i, layer) {
        if (layer != "buildingsLayer"
        &&  layer != "UASitePoints"  
        &&  layer != "construction"
        &&  layer != "greekHousesMapTips"
        ) {map.getLayer(layer).hide()};
    });

    switch (id)
	{
		case "rbtAccessibility":
			$(".accessibilityTOC").toggleClass("o");
            showTOCLayers("accessibilityTOC");
			break;
        case "rbtAthletics":
            $(".athleticsTOC").toggleClass("o");
            map.getLayer("athleticsOffCampus").show();
            map.getLayer("athleticsOnCampus").show();
            break;
        case "rbtMuseums":
            $(".museumsTOC").toggleClass("o");
            map.getLayer("museums").show();
            break;
        case "rbtSafety":
            $(".safetyTOC").toggleClass("o");
            map.getLayer("campusRec").show();
            map.getLayer("police").show();
            map.getLayer("safeRide").show();
            map.getLayer("safeRideAnno1").show();
            showTOCLayers("safetyTOC");
            break;
        case "rbtLibraries":
            $(".librariesTOC").toggleClass("o");
            map.getLayer("libraries").show();
            break;
        case "rbtParking":
            $(".parkingTOC").toggleClass("o");
            showTOCLayers("parkingTOC");
            break;
        case "rbtEateries":
            $(".eateriesTOC").toggleClass("o");
            map.getLayer("eateries1").show();
            map.getLayer("eateries2").show();
            map.getLayer("eateries3").show();
            break;
        case "rbtHousing":
            $(".housingTOC").toggleClass("o");
            map.getLayer("housing_reslife").show();
            map.getLayer("housing_greek").show();
            break;
        case "rbtTransportation":
            $(".transportationTOC").toggleClass("o");
            showTOCLayers("transportationTOC");
            break;
        case "rbtAttractions":
            $(".attractionsTOC").toggleClass("o");
            map.getLayer("offCampusLandmarks").show();
            showTOCLayers("attractionsTOC");
            break;
        default:
			""	
	}
    dimTOCCheckboxes();
    
    //executed on checkbox click event
    $(document).ready(function(){
        $('input.toctop_checkbox').change(function() {
            var chk = this;
            var layers = chk.value.split(",");
            $.each(layers, function(i,layer) {
        	   chk.checked == true ? map.getLayer(layer).show() : map.getLayer(layer).hide();   
            });
        });
    });
    //executed when clicking a Zoom button
    $('.zoomToLayer').click(function() {    
        switch(this.id)
        {
            case "athleticsOffCampus":
                xmin=-12351930;
                ymin=3790914;
                xmax=-12347209;
                ymax=3794307;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));
                break;
            case "rgt-athleticsOffCampus":
                xmin=-12351930;
                ymin=3790914;
                xmax=-12347209;
                ymax=3794307;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));
                break;
            case "athleticsOnCampus":
                xmin=-12351342;
                ymin=3793044;
                xmax=-12349899;
                ymax=3794081;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));
                break;
            case "rgt-athleticsOnCampus":
                xmin=-12351342;
                ymin=3793044;
                xmax=-12349899;
                ymax=3794081;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));
                break;
            case "museums":
                xmin=-12351802;
                ymin=3793531;
                xmax=-12349998;
                ymax=3794360;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));
                break;
            case "rgt-museums":
                xmin=-12351802;
                ymin=3793531;
                xmax=-12349998;
                ymax=3794360;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));
                break;
            case "police": 
                map.centerAndZoom(new esri.geometry.Point(-12350256, 3794145, new esri.SpatialReference({ wkid: 102100 })), 18);
                break;
            case "rgt-police": 
                map.centerAndZoom(new esri.geometry.Point(-12350256, 3794145, new esri.SpatialReference({ wkid: 102100 })), 18);
                break;
            case "campusRec": 
                map.centerAndZoom(new esri.geometry.Point(-12350864, 3793162, new esri.SpatialReference({ wkid: 102100 })), 17);
                break;
            case "rgt-campusRec": 
                map.centerAndZoom(new esri.geometry.Point(-12350864, 3793162, new esri.SpatialReference({ wkid: 102100 })), 17);
                break;                     
            case "libraries":
                xmin=-12352169;
                ymin=3793500;
                xmax=-12349784;
                ymax=3795100;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));                
                break;     
            case "rgt-libraries":
                xmin=-12352169;
                ymin=3793500;
                xmax=-12349784;
                ymax=3795100;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));                
                break;                 
            case "eateries3":
                xmin=-12352227;
                ymin=3793274;
                xmax=-12350392;
                ymax=3794351;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));                
                break;
            case "rgt-eateries3":
                xmin=-12352227;
                ymin=3793274;
                xmax=-12350392;
                ymax=3794351;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));                
                break;
            case "oldMain": 
                map.centerAndZoom(new esri.geometry.Point(-12351277, 3793766, new esri.SpatialReference({ wkid: 102100 })), 19);
                break;
            case "rgt-oldMain": 
                map.centerAndZoom(new esri.geometry.Point(-12351277, 3793766, new esri.SpatialReference({ wkid: 102100 })), 19);
                break;
            case "visitorCenter": 
                map.centerAndZoom(new esri.geometry.Point(-12351989, 3793799, new esri.SpatialReference({ wkid: 102100 })), 19);
                break;
            case "rgt-visitorCenter": 
                map.centerAndZoom(new esri.geometry.Point(-12351989, 3793799, new esri.SpatialReference({ wkid: 102100 })), 19);
                break;
            case "offCampusLandmarks":
                xmin=-12409320;
                ymin=3754020;
                xmax=-12262561;
                ymax=3977524;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));                
                break;     
            case "rgt-offCampusLandmarks":
                xmin=-12409320;
                ymin=3754020;
                xmax=-12262561;
                ymax=3977524;
                map.setExtent(new esri.geometry.Extent(xmin,ymin,xmax,ymax, new esri.SpatialReference({ wkid:102100 })));                
                break;                              
            default:
                map.setExtent(map.getLayer(this.id).fullExtent);   
        }
     });    
}

function showTOCLayers(_div) {
    $.each($("." + _div).children("input"), function (i, chk) {
        chk.checked = true;
        //console.log("Checkbox values: " + chk.value);
        var layers = chk.value.split(",");
        $.each(layers, function(i,layer) {
            //console.log("turning on: " + layer);
            map.getLayer(layer).show();
        });
    });
}

function dimTOCCheckboxes() {
    $(".o > input").prop("disabled", true);

    $.each(map.getLayersVisibleAtScale(map.getScale()), function (i, layer) {
        $.each($(".o > input"), function (i, chk) {
            if (chk.value.search(layer.id) >= 0) {
                chk.disabled = false;
            }
            $("#" + chk.id + "+ label").toggleClass("zoomDisabled", chk.disabled);
        });
    });
 }

//LET'S KEEP THIS
/*
function dimTOCCheckboxesBak() {
    $("input.toctop_checkbox").prop("disabled", true);

    $.each(map.getLayersVisibleAtScale(map.getScale()), function (i, layer) {
        //console.debug("checking " + layer.id);
        $.each($("input.toctop_checkbox"), function (i, chk) {
            //console.debug("      CHECKBOX VALUE:" + chk.value);
            if (chk.value.search(layer.id) >= 0) {
                //console.debug("MATCH! - " + layer.id);
                console.log("checkbox id: " + chk.id);
                chk.disabled = false;
            }
        });
    });
}
*/