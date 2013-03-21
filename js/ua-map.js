/// <reference path="jsapi_vsdoc_v32_2012.js" />
dojo.require("dijit.TooltipDialog");
dojo.require("esri.virtualearth.VETiledLayer");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.tasks.find");
dojo.require("esri.arcgis.utils");
dojo.require("esri.dijit.Print");


var map;
var loadedInitParams = new Boolean();
loadedInitParams = false;

function map_init() {
    //check for parameters in the URL. If no results are found return null, else return results or 0.
    $.urlParam = function(name) {
        var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (!results) {
            return null;
        }
        return results[1] || 0;
    };

/*    var initExtent = new esri.geometry.Extent({
        "xmin": -12351813, "ymin": 3793264,
        "xmax": -12350093, "ymax": 3794160,
        "spatialReference": { "wkid": 3857 }
    });
*/

    map = new esri.Map("map", {
        //extent: initExtent,
        center: [-110.951944, 32.231667],
        zoom: 17,
        logo: false
    });

    var bing = new esri.virtualearth.VETiledLayer({
        id: "bing",
        bingMapsKey: 'AtE7K3QCsGklmUmkSvTkaP7IcFEBTfXUThpgp8PZhIJ2JugT8k9nC9TbihYL2fuV',
        //OLD ESRI BING KEY...
        //bingMapsKey: 'Al_odDeNeFrAQz9Z840Q1WepmpUI5ZbsRC7IWI2r7M18vuhevz5vZ7wxJwaL41tq',
        mapStyle: esri.virtualearth.VETiledLayer.MAP_STYLE_ROAD,
        maxScale: 6771
    });
    map.addLayer(bing);

/*    var graybase = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer");
        graybase.id = "graybase";
        graybase.visible = true;
        map.addLayer(graybase);
*/

    var imagery = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
        imagery.id = "imagery";
        imagery.visible = false;
        map.addLayer(imagery);

    //var enterprise_tile = new esri.layers.ArcGISTiledMapServiceLayer("http://services.maps.arizona.edu/pdc/rest/services/public/MapServer");
    var enterprise_tile = new esri.layers.ArcGISTiledMapServiceLayer("http://pdc-gisphobos.catnet.arizona.edu:6080/arcgis/rest/services/publicTiles/MapServer");
    enterprise_tile.id = "enterprise_tile";
    map.addLayer(enterprise_tile);

    dojo.connect(map, "onLoad", initOperationalLayer);

    dojo.connect(map, 'onLoad', function(theMap) {
        //resize the map when the browser resizes
        dojo.connect(dijit.byId('map'), 'resize', map,map.resize);
    });

    dojo.connect(map, "onZoomEnd", function(extent, zoomFactor, anchor, level) {
        dimTOCCheckboxes();
        // console.log("checking level: " + level);
        // if(level <= 17) {
        //     console.log("checking center" + extent.xmin);
        //     if (extent.xmin < -12351966) {
        //         console.log("turning on bing");
        //         bing.show();
        //     }
        // }
    });



    if(loadedInitParams === false) {
        if($.urlParam('x') != null && $.urlParam('y') != null && $.urlParam('lod') != null) {
            map.centerAndZoom(new esri.geometry.Point($.urlParam('x'), $.urlParam('y'), new esri.SpatialReference({ wkid: 102100 })),$.urlParam('lod'));
        }

        loadedInitParams = true;
    }
}

function orientationChanged() {
    if(map){
        map.reposition();
        map.resize();
    }
}

function initOperationalLayer(map) {
    //MapTips Labels
    //  Buildings
    //  Construction
    //  UASitePoints  
    //  GreekHouses
    //  athleticsOffCampus
    //  AED 1
    //  AED 2
    //  AED 3
    //  Eateries 1
    //  Eateries 2
    //  WalkingPaths
    //  Fitness Course
    //  Fitness Stops 1
    //  Fitness Stops 2
    //  Fitness Stops 3
    //  OffCampus Landmarks

    //InfoWindows
    //  Buildings
    //  GreekHouses
    //  Audible Classrooms


    //Building Info Window information
    var bldgInfoContent = "<img src='http://maps.arizona.edu/WebBuildingPhotos/${Buildings.SpaceNum}.jpg'>" 
                + "<div id='bldg-num'> Alias: ${Buildings.AliasName} </div>"
                + "<div id='bldg-num'> Address: ${v_public_buildings.BL_ADDRESS_1} </div>"
                + "<div id='bldg-num'> Building Number: ${Buildings.SpaceNumLetter} </div>";

    var bldgInfoTemplate = new esri.InfoTemplate("<b>${v_public_buildings.BL_NAME_PUBLIC}</b>", bldgInfoContent);

    //Greek Houses Info Window information
    
    // var greek_type = "${GreekType}";
    // if(greek_type == "1")
    //     greek_type = "Fraternity";
    // if(greek_type == "2")
    //     greek_type = "Sorority";
    var greekInfoContent = "" //"<img src='http://maps.arizona.edu/WebBuildingPhotos/${Buildings.SpaceNum}.jpg'>" 
                + "<div id='bldg-num'> Address: ${Address} </div>"
                //+ "<div id='bldg-num'> Type:${GreekType}</div>";

    var greekInfoTemplate = new esri.InfoTemplate("<b>${Name}</b>", greekInfoContent);

    //Audible Device Classrooms information
    var audibleInfoContent = "<div id='bldg-num'> Building: ${building_name} </div>"
                + "<div id='bldg-num'> Room #: ${ALSRoom_1} </div>"
                + "<div id='bldg-num'><a href='${url}'>More Info</div>";

    var audibleInfoTemplate = new esri.InfoTemplate("<b>Audible Device Classroom</b>", audibleInfoContent);

    map.infoWindow.resize(200, 270);

    //maptip or tooltip constructor
    var dialog = new dijit.TooltipDialog({
        id: "tooltipDialog"
      , style: "position: absolute; text-align:center; width: 105px; font: normal normal bold 10pt Helvetica; z-index:100"
    });
    dialog.startup();    



     var url = "http://services.maps.arizona.edu/pdc/rest/services/public/MapServer/"
    //var url = "http://pdc-gisdeimos:6080/arcgis/rest/services/public/MapServer";
    var urlphobos = "http://pdc-gisphobos:6080/arcgis/rest/services/public/MapServer";
    var symbol; var opLayer;

    //Accessibility Layers
    opLayer = new esri.layers.FeatureLayer(url + 17, { id: "entrances1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 18, { id: "entrances2", visible: false });
    map.addLayer(opLayer); 
    opLayer = new esri.layers.FeatureLayer(url + 19, { id: "entrances3", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 20, { id: "ramps", visible: false });
    map.addLayer(opLayer);
    //todo: update ados layer id.
    opLayer = new esri.layers.FeatureLayer(url + 16, { id: "ados", visible: false });
    map.addLayer(opLayer);       
    opLayer = new esri.layers.FeatureLayer(url + 65, { id: "elevators1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 66, { id: "elevators2", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 67, { id: "elevators3", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 37, { id: "disabledParking1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 38, { id: "disabledParking2", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 39, { id: "disabledParking3", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 5, { id: "bathrooms1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 6, { id: "bathrooms2", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 7, { id: "bathrooms3", visible: false });
    map.addLayer(opLayer);


    // Athletics Layers ///////////////////////////////////////////////////////////////////
    opLayer = new esri.layers.FeatureLayer(url + 75, { id: "athleticsOnCampus", visible: false });
    // symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0,1]), 2),new dojo.Color([171, 5, 32,0.90]));
    //         opLayer.setRenderer(new esri.renderer.SimpleRenderer(symbol));
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 76, { id: "athleticsOffCampus", visible: false, outFields: ["Name"] });
    dojo.connect(opLayer, "onMouseOver", function (evt) {
        dialog.setContent(evt.graphic.attributes["Name"]);
        dojo.style(dialog.domNode, "opacity", 0.85);
        dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    });
    dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer);
    ///////////////////////////////////////////////////////////////////////////////////////

    //Museums & Art Venues
    opLayer = new esri.layers.FeatureLayer(url + 69, { id: "museums", visible: false });
    map.addLayer(opLayer);

    //Health & Safety ///////////////////////////////////////////////////////////////////
    opLayer = new esri.layers.FeatureLayer(url + 70, { id: "hospitals", visible: false });
    map.addLayer(opLayer);

    opLayer = new esri.layers.FeatureLayer(url + 68, { id: "police", visible: false });
    opLayer.setDefinitionExpression("Buildings.SpaceNum = 100");    
    symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([125,125,125,1]), 1),new dojo.Color([212,146,179,0.90]));
            opLayer.setRenderer(new esri.renderer.SimpleRenderer(symbol)); 
    map.addLayer(opLayer);    

    opLayer = new esri.layers.FeatureLayer(url + 68, { id: "campusRec", visible: false });
    opLayer.setDefinitionExpression("Buildings.SpaceNum = 117 or Buildings.SpaceNum = 117.01 or Buildings.SpaceNum = 527");    
    opLayer.setRenderer(new esri.renderer.SimpleRenderer(symbol));   
    map.addLayer(opLayer);

    opLayer = new esri.layers.FeatureLayer(url + 96, { id: "safeRideAnno1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 97, { id: "safeRideAnno2", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 98, { id: "safeRide", visible: false });
    map.addLayer(opLayer);

    opLayer = new esri.layers.FeatureLayer(url + 22, { id: "emergencyPhones1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 23, { id: "emergencyPhones2", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 24, { id: "emergencyPhones3", visible: false });
    map.addLayer(opLayer);        
    ///////////////////////////////////////////////////////////////////////////////////////



    //Libraries
    opLayer = new esri.layers.FeatureLayer(url + 71, { id: "libraries", visible: false });
    map.addLayer(opLayer);

    //Parking
    opLayer = new esri.layers.FeatureLayer(url + 84, { id: "parkingLots", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 83, { id: "parkingVisitorLots", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 80, { id: "parkingVisitor1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 81, { id: "parkingVisitor2", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 82, { id: "parkingVisitor3", visible: false });
    map.addLayer(opLayer);            
    opLayer = new esri.layers.FeatureLayer(url + 42, { id: "motorcycle1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 43, { id: "motorcycle2", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 44, { id: "motorcycle3", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 46, { id: "bicycle1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 47, { id: "bicycle2", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 48, { id: "bicycle3", visible: false });
    map.addLayer(opLayer);

    //Housing
    opLayer = new esri.layers.FeatureLayer(url + 77, { id: "housing_reslife", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 78, { id: "housing_greek", visible: false, 
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        outFields: ["Name", "Address", "GreekType"],
        infoTemplate: greekInfoTemplate
    });
    dojo.connect(opLayer, "onMouseOver", function (evt) {
        dialog.setContent(evt.graphic.attributes["Name"]);
        dojo.style(dialog.domNode, "opacity", 0.85);
        dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    });
    dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});    
    map.addLayer(opLayer);

    //Transportation
    opLayer = new esri.layers.FeatureLayer(url + 52, { id: "catTranShuttleRoutesGreen", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 53, { id: "catTranShuttleRoutesNight", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 54, { id: "catTranShuttleRoutesOrange", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 55, { id: "catTranShuttleRoutesPurple", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 56, { id: "catTranShuttleRoutesTeal", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 57, { id: "catTranShuttleRoutesUSA", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 115, { id: "sunLinkStreetCarTracks", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 51, { id: "bikeRoutes", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 26, { id: "catTranShuttleStops1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 27, { id: "catTranShuttleStops2", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 28, { id: "catTranShuttleStops3", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 34, { id: "sunLinkStreetCarStops1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 35, { id: "sunLinkStreetCarStops2", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 36, { id: "sunLinkStreetCarStops3", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 30, { id: "sunTranStops1", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 31, { id: "sunTranStops2", visible: false });
    map.addLayer(opLayer);
    opLayer = new esri.layers.FeatureLayer(url + 32, { id: "sunTranStops3", visible: false });
    map.addLayer(opLayer);

    //Attractions
    opLayer = new esri.layers.FeatureLayer(url + 72, { id: "historicBuildings", visible: false });
    map.addLayer(opLayer);
    
    symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([125,125,125,1]), 1),new dojo.Color([150,25,14,0.90]));

    opLayer = new esri.layers.FeatureLayer(url + 73, { id: "museumsAttractions", visible: false });
    opLayer.setRenderer(new esri.renderer.SimpleRenderer(symbol));   
    map.addLayer(opLayer);  
    
    opLayer = new esri.layers.FeatureLayer(url + 68, { id: "oldMain", visible: false });
    opLayer.setDefinitionExpression("Buildings.SpaceNum = 21");    
            opLayer.setRenderer(new esri.renderer.SimpleRenderer(symbol));   
    map.addLayer(opLayer);    

    opLayer = new esri.layers.FeatureLayer(url + 68, { id: "visitorCenter", visible: false });
    opLayer.setDefinitionExpression("Buildings.SpaceNum = 412");    
            opLayer.setRenderer(new esri.renderer.SimpleRenderer(symbol));   
    map.addLayer(opLayer);
 

    //ON ALL THE TIME
/*    
    opLayer = new esri.layers.FeatureLayer(url + 95, {
        id: "construction",
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
        opacity: 0,
        outFields: ["ProjectName"]
    });
    dojo.connect(opLayer, "onMouseOver", function (evt) {
        dialog.setContent(evt.graphic.attributes["ProjectName"]);
        dojo.style(dialog.domNode, "opacity", 0.85);
        dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    });
    dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer);

    opLayer = new esri.layers.FeatureLayer(url + 50, {
        id: "UASitePoints",
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["Name"]
    });
    dojo.connect(opLayer, "onMouseOver", function (evt) {
        dialog.setContent(evt.graphic.attributes["Name"]);
        dojo.style(dialog.domNode, "opacity", 0.85);
        dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    });
    dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer);
*/
    /////////////FIND ME BUILDINGS!/////////////////////
    opLayer = new esri.layers.FeatureLayer(url + 68, {
        id: "buildingsLayer",
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        opacity: 0,
        maxAllowableOffset: 6,
        outFields: ["v_public_buildings.BL_NAME_PUBLIC", "Buildings.AliasName", "v_public_buildings.BL_ADDRESS_1", "Buildings.SpaceNum", "Buildings.SpaceNumLetter"],
        infoTemplate: bldgInfoTemplate
    });
    dojo.connect(opLayer, "onMouseOver", function (evt) {
        dialog.setContent(evt.graphic.attributes["v_public_buildings.BL_NAME_PUBLIC"]);
        dojo.style(dialog.domNode, "opacity", 0.85);
        dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    });
    //close maptip/tooltip on mouseout and click.
    dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    dojo.connect(opLayer, "onClick", function (evt) {dijit.popup.close(dialog);});  
    // symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0,1]), 2),new dojo.Color([171, 5, 32,0.90]));
    //         opLayer.setRenderer(new esri.renderer.SimpleRenderer(symbol));
    map.addLayer(opLayer);
/*
    //Greek Houses
    opLayer = new esri.layers.FeatureLayer(url + 78, {
        id: "greekHousesMapTips",
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
        opacity: 0,
        maxAllowableOffset: 6,
        outFields: ["Name", "Address", "GreekType"],
        infoTemplate: greekInfoTemplate        
    });
    dojo.connect(opLayer, "onMouseOver", function (evt) {
        dialog.setContent(evt.graphic.attributes["Name"]);
        dojo.style(dialog.domNode, "opacity", 0.85);
        dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    });
    //close maptip/tooltip on mouseout and click.
    dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    dojo.connect(opLayer, "onClick", function (evt) {dijit.popup.close(dialog);});  
    map.addLayer(opLayer);

*/
    //////////////// AUDIBLE DEVICE CLASSROOMS /////////////////
    opLayer = new esri.layers.FeatureLayer(url + 9, { id: "classrooms1", visible: false
        // , outFields: ["building_name", "ALSRoom_1", "url"]
        // , infoTemplate: audibleInfoTemplate
    });        
    map.addLayer(opLayer);

    opLayer = new esri.layers.FeatureLayer(url + 10, { id: "classrooms2", visible: false
        // , outFields: ["building_name", "ALSRoom_1", "url"]
        // , infoTemplate: audibleInfoTemplate
    });        
    map.addLayer(opLayer);

    opLayer = new esri.layers.FeatureLayer(url + 11, { id: "classrooms3", visible: false
        // , outFields: ["building_name", "ALSRoom_1", "url"]
        // , infoTemplate: audibleInfoTemplate
    });
    map.addLayer(opLayer);
    
    //////////////// AED DEFIBULATORS /////////////////
    opLayer = new esri.layers.FeatureLayer(url + 13, { id: "aeds1", visible: false });
    map.addLayer(opLayer);

    opLayer = new esri.layers.FeatureLayer(url + 14, { id: "aeds2", visible: false
        //, outFields:["Floor"] 
    });
    //dojo.connect(opLayer, "onMouseOver", function (evt) {
    //    //dialog.setContent(evt.graphic.attributes["BuildingNum"]);
    //     dialog.setContent("Floor #: 2");
    //     dojo.style(dialog.domNode, "opacity", 0.85);
    //     dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    // });
    // dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer);

    opLayer = new esri.layers.FeatureLayer(url + 15, { id: "aeds3", visible: false });
    map.addLayer(opLayer);

    //Eateries
    opLayer = new esri.layers.FeatureLayer(url + 1, { id: "eateries1", visible: false, outFields:["name"] });
    dojo.connect(opLayer, "onMouseOver", function (evt) {
        dialog.setContent(evt.graphic.attributes["name"]);
        dojo.style(dialog.domNode, "opacity", 0.85);
        dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    });
    dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer);    
    
    opLayer = new esri.layers.FeatureLayer(url + 2, { id: "eateries2", visible: false, outFields:["name"] });
    dojo.connect(opLayer, "onMouseOver", function (evt) {
        dialog.setContent(evt.graphic.attributes["name"]);
        dojo.style(dialog.domNode, "opacity", 0.85);
        dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    });
    dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer);    
    
    opLayer = new esri.layers.FeatureLayer(url + 3, { id: "eateries3", visible: false });
    map.addLayer(opLayer);

    //////////////// WALKING PATHS, FIT COURSES, FITNESS STATIONS //////////////////////
    opLayer = new esri.layers.FeatureLayer(url + 62, { id: "walkingPaths", visible: false
        //, outFields:["DistanceMiles"] 
    });
    // dojo.connect(opLayer, "onMouseOver", function (evt) {
    //     dialog.setContent(evt.graphic.attributes["DistanceMiles"]);
    //     dojo.style(dialog.domNode, "opacity", 0.85);
    //     dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    // });
    // dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer);  

    opLayer = new esri.layers.FeatureLayer(url + 63, { id: "fitCourse", visible: false });
    // dojo.connect(opLayer, "onMouseOver", function (evt) {
    //     dialog.setContent("Fitness Path");
    //     dojo.style(dialog.domNode, "opacity", 0.85);
    //     dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    // });
    // dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer);

    opLayer = new esri.layers.FeatureLayer(url + 59, { id: "fitnessStations1", visible: false
        //, outFields:["Stations"] 
    });
    // dojo.connect(opLayer, "onMouseOver", function (evt) {
    //     dialog.setContent(evt.graphic.attributes["Stations"]);
    //     dojo.style(dialog.domNode, "opacity", 0.85);
    //     dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    // });
    // dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer);

    opLayer = new esri.layers.FeatureLayer(url + 60, { id: "fitnessStations2", visible: false
        //, outFields:["Stations"] 
    });
    // dojo.connect(opLayer, "onMouseOver", function (evt) {
    //     dialog.setContent(evt.graphic.attributes["Stations"]);
    //     dojo.style(dialog.domNode, "opacity", 0.85);
    //     dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    // });
    // dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer);

    opLayer = new esri.layers.FeatureLayer(url + 61, { id: "fitnessStations3", visible: false
        //, outFields:["Stations"] 
    });
    // dojo.connect(opLayer, "onMouseOver", function (evt) {
    //     dialog.setContent(evt.graphic.attributes["Stations"]);
    //     dojo.style(dialog.domNode, "opacity", 0.85);
    //     dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    // });
    // dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer);

    //////////////// OFF CAMPUS LANDMARKS //////////////////////
    opLayer = new esri.layers.FeatureLayer(url + 49, { id: "offCampusLandmarks", visible: false, 
            mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
            outFields:["Name"] 
    });
    dojo.connect(opLayer, "onMouseOver", function (evt) {
        dialog.setContent(evt.graphic.attributes["Name"]);
        dojo.style(dialog.domNode, "opacity", 0.85);
        dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    });
    dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    map.addLayer(opLayer); 

}

dojo.addOnLoad(map_init);
function closeDialog() {
    alert("mouse OUT");
    //map.graphics.clear();
    dijit.popup.close(dialog);
}


function doSearch() {
    if($("#searchbox").val() != '') {
        var findTask = new esri.tasks.FindTask("http://services.maps.arizona.edu/pdc/rest/services/public/MapServer/");

        //create find parameters and define known values
        var findParams = new esri.tasks.FindParameters();
        findParams.returnGeometry = true;
        findParams.layerIds = [101];
        findParams.searchFields = ["OBJECTID"];        

        //set the search text to find parameters
        //TODO: Pass the #searchbox text, not value... then!
        findParams.searchText = $("#searchbox").val();
        findTask.execute(findParams, showResults);
    }
    else {
        //"X" has been hit to clear searchbox
        map.graphics.clear();
    }
}

//TODO: combine these two functions:
/* currently not in use!
function doSearchById(id) {
    var findTask = new esri.tasks.FindTask("http://services.maps.arizona.edu/pdc/rest/services/public/MapServer/");

    //create find parameters and define known values
    var findParams = new esri.tasks.FindParameters();
    findParams.returnGeometry = true;
    findParams.layerIds = [101];
    findParams.searchFields = ["OBJECTID"];        

    //set the search text to find parameters
    //TODO: Pass the #searchbox text, not value... then!
    findParams.searchText = id;
    findTask.execute(findParams, showResults);
}*/


function showResults(results) {
//symbology for graphics
    var markerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));
    var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 1);
    var polygonSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 0, 0, 0.55]));

    //find results return an array of findResult.
    map.graphics.clear();

    //Build an array of attribute information and add each found graphic to the map
    dojo.forEach(results, function(result) {
        var graphic = result.feature;
        //TODO: check the OBJECTID for a match.
        //TODO: need a better conditional than than the querystring check... will not zoom to a search, if Id is provided.
        switch (graphic.geometry.type) {
        case "point":
            graphic.setSymbol(markerSymbol);
            if($.urlParam('id') == null) //the extent is in the querystring, no need to zoom
                map.centerAndZoom(graphic.geometry.GetPoint(),18);
            break;
        case "polyline":
            graphic.setSymbol(lineSymbol);
            if($.urlParam('id') == null) //the extent is in the querystring, no need to zoom
                map.setExtent(graphic.geometry.getExtent(),true);
            break;
        case "polygon":
            graphic.setSymbol(polygonSymbol);
            if($.urlParam('id') == null) //the extent is in the querystring, no need to zoom
                map.setExtent(graphic.geometry.getExtent(),true);
            break;
        }
        map.graphics.add(graphic);
    });
}

function createPrintDijit(printTitle) {
    var printer,layoutTemplate, templateNames, mapOnlyIndex, templates;

    //esri.config.defaults.io.proxyUrl = "/arcgisserver/apis/javascript/proxy/proxy.ashx";

    // create an array of objects that will be used to create print templates
    var layouts = [
      { 
        "name": "Letter ANSI A Landscape", 
        "label": "Landscape (PDF)", 
        "format": "pdf", 
        "options": { 
          "legendLayers": [], // empty array means no legend
          "scalebarUnit": "Feet",
          "titleText": printTitle
        }
      }, 
      { 
        "name": "Letter ANSI A Portrait", 
        "label": "Portrait (PDF)", 
        "format": "pdf", 
        "options": { 
          "legendLayers": [], // empty array means no legend
          "scalebarUnit": "Feet",
          "titleText": printTitle 
        }
      },      
      {
        "name": "Letter ANSI A Landscape", 
        "label": "Landscape (image)", 
        "format": "png32", 
        "options":  { 
          "legendLayers": [],
          "scaleBarUnit": "Feet",
          "titleText": printTitle
        }
      },
      {
        "name": "Letter ANSI A Portrait", 
        "label": "Portrait (image)", 
        "format": "png32", 
        "options":  { 
          "legendLayers": [],
          "scaleBarUnit": "Feet",
          "titleText": printTitle
        }
      }      
    ];

    // create the print templates, could also use dojo.map
    var templates = [];
    dojo.forEach(layouts, function(lo) {
      var t = new esri.tasks.PrintTemplate();
      t.layout = lo.name;
      t.label = lo.label;
      t.format = lo.format;
      t.layoutOptions = lo.options
      templates.push(t);
    });

    printer = new esri.dijit.Print({
      map: map,
      templates: templates,
      url: "http://services.maps.arizona.edu/pdc/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"}, dojo.byId("candyBar"));
      printer.startup();
}

//todo: not implemented yet!
function mapTipByName(oplayer,dialog) {
        //"open" maptip/tooltip on mouseover
    dojo.connect(opLayer, "onMouseOver", function (evt) {
        dialog.setContent(evt.graphic.attributes["v_public_buildings.BL_NAME_PUBLIC"]);
        dojo.style(dialog.domNode, "opacity", 0.85);
        dijit.popup.open({ popup: dialog, x: evt.pageX, y: evt.pageY });
    });

    //close maptip/tooltip on mouseout and click.
    dojo.connect(opLayer, "onMouseOut", function (evt) {dijit.popup.close(dialog);});
    dojo.connect(opLayer, "onClick", function (evt) {dijit.popup.close(dialog);});
}

