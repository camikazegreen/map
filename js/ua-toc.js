var tocTopTitle = "";
var gerry = 0;

$(window).load(function (){
  $('#right-side-tool-tab').click(function (){
    $('.right-side-tools').toggleClass('visible', '1000');
    $('.claro').removeClass('more-info', '1000');
    $('.right-side-tools').removeClass('more-info', '1000');
    return false;
  });
  $("input[type='radio']").change(function (){
    changeLayers(this);
  });
  $('.my-location-wrapper').click(function(){
      $('.my-location').toggleClass('on', '500');
      return false;
  });
  $('.layer-controls-toggle').click(function(){
      $('.layer-controls-wrapper').toggleClass('up') 
      return false;
  });
  $('input:radio').change(function() {
    var f = $(this).attr('id');
    $('.button-tag').removeClass('checked');
    $('label[for='+f+']').addClass('checked')
  });
  $('input:checkbox').change(function() {
    var f = $(this).attr('id');
    // $('.checkbox-square').removeClass('ico-ua-x');
    $('label[for='+f+'] .checkbox-status').toggleClass('ico-ua-x')
  });
    
   // jQuery(window).ready(function(){  
   //          jQuery("#btnInit").click(initiate_watchlocation);  
   //          jQuery("#btnStop").click(stop_watchlocation);  
   //      });  
   //      var watchProcess = null;  
   //      function initiate_watchlocation() {  
   //      }  
   //      function stop_watchlocation() {  
   //      }  
   //      function handle_errors(error)  
   //      {  
   //          switch(error.code)  
   //          {  
   //              case error.PERMISSION_DENIED: alert("user did not share geolocation data");  
   //              break;  
   //              case error.POSITION_UNAVAILABLE: alert("could not detect current position");  
   //              break;  
   //              case error.TIMEOUT: alert("retrieving position timedout");  
   //              break;  
   //              default: alert("unknown error");  
   //              break;  
   //          }  
   //      }  
   //      function handle_geolocation_query(position) {  
   //      }  
  $(".loc-off").click(function() {
  if(gerry === 0){
     
      if(navigator.geolocation){  
        navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
        watchId = navigator.geolocation.watchPosition(showLocation, locationError);
      }
      else {
        alert("Browser doesn't support Geolocation. Visit http://caniuse.com to discover browser support for the Geolocation API.");
      }
     gerry = 1;
  }
  else {
    navigator.geolocation.clearWatch(watchId);
    $('map_graphics_layer').remove('.map_graphics_layer');

    gerry = 0;
  }
  });
});
$(document).ready(function(){
   $('.right-side-tools').localScroll({
    duration:800,
    target:'.modal-box-surface',
    hash:true
    });
 });

function stopWatching(){ 
     $(".my-location-wrapper").removeClass('loc-on', '1000');
     $(".my-location-wrapper").addClass('loc-off', '1000');
      navigator.geolocation.clearWatch();  //navigator.geolocation.stop_watchPosition();
  alert("Babagaluh");
};

function getMoreResources() {
    $(".moreInfo").toggleClass("show");
    $('.claro').toggleClass('more-info', '1000');
    $('.right-side-tools').toggleClass('more-info', '1000');
    
    if ($(".layer-controls-wrapper").hasClass("on")){
    $(".layer-controls-wrapper").toggleClass("on");
    }
}
function getCandyBar() {
    document.getElementById("candyBar").innerHTML = "<div class=\"more-resources\"><a href=\"#\" onclick=\"getMoreResources()\">More Resources</a></div><a href=\"#\"  name= \"link\" class= \"link\" id= \"link\" onclick=\"getLink()\"><div class=\"arizona-btn brillant\"><div class=\"fs1 ico-ua-link\" aria-hidden=\"true\" data-ico=\"&#xe000;\" title=\"Link to this view of the map.\"></div></div></a><a href=\"#\" name= \"help\" class= \"help\"><div class=\"arizona-btn brillant\"><div class=\"glyph\"><div class=\"fs1 ico-ua-info\" aria-hidden=\"true\" data-ico=\"&#xe000;\" title=\"Help and feedback\"></div></div></div></a><a href=\"#\" name= \"print\" class= \"print\"id= \"print\" onclick=\"getPrint()\"><div class=\"arizona-btn brillant\"><div class=\"glyph\"><div class=\"fs1 ico-ua-printer\" aria-hidden=\"true\" data-ico=\"&#xe000;\"title=\"Print the map.\"></div></div></div></a>";
}
function getLink() {
    document.getElementById("candyBar").innerHTML = "<input type=\"text\" class=\"input-medium arizona-text-box link\" id=\"linkBox\" value=\"http://tinyurl.co\" autofocus readonly><div class=\"arizona-btn brillant candy\"><div class=\"candy-close\" onclick=\"getCandyBar()\"></div></div>";
    var qs = "http://"
      + window.location.hostname.toString() 
      + window.location.pathname.toString() + "?"      
      +"x=" + map.extent.getCenter().x.toFixed(0)
      +"&y=" + map.extent.getCenter().y.toFixed(0)
      +"&lod=" + map.getZoom()
      ;
    
    // if($("#searchbox").val() != '') {
    //   qs = qs + "&id=" + $("#searchbox").val();
    // }

    $('#linkBox').val(qs);
}
function getPrint() {
    document.getElementById("candyBar").innerHTML = "<div class=\"arizona-btn brillant candy\"><div class=\"candy-close\" onclick=\"getCandyBar()\"></div>";
                                //parameter is the title of the printed map.
        createPrintDijit("University of Arizona Map");
}

function toc_init() {
    //TODO: Use v_public_buildings.BL_NAME_PUBLIC field in layer 101
    $.getJSON("http://services.maps.arizona.edu/pdc/rest/services/public/MapServer/101/query?where=Name+%3C%3E+%27%27&returnGeometry=false&outFields=OBJECTID%2C+Name&orderByFields=Name&f=json",  function(data) {
        for (i in data["features"]) {
          //console.log(data["features"][i]["attributes"]["Name"]);
          $('#searchbox')
            .append($("<option></option>")
            .attr("value",data["features"][i]["attributes"]["OBJECTID"])
            .text(data["features"][i]["attributes"]["Name"])
          );
        }
        if($.urlParam('id') != null) {
          $('#searchbox').val($.urlParam('id'));
          $('#searchbox').trigger("liszt:updated");
          doSearch();
        }
        $("#searchbox").chosen({allow_single_deselect:true});
        $("#searchbox").chosen().change(doSearch);
      });


  $('#chkImagery').change(function() {
    if(this.checked) {
      map.getLayer("imagery").show();
      map.getLayer("bing").hide();
      map.getLayer("enterprise_tile").hide();
    }
    else {
      map.getLayer("imagery").hide();
      map.getLayer("bing").show();
      map.getLayer("enterprise_tile").show();
    }
  });

  $('#spanShareUrl').click(function() {
    $('#shareUrl').css("visibility", "visible");
    var qs = "http://"
      + window.location.hostname.toString() 
      + window.location.pathname.toString() + "?"      
      +"x=" + map.extent.getCenter().x.toFixed(0)
      +"&y=" + map.extent.getCenter().y.toFixed(0)
      +"&lod=" + map.getZoom()
      ;
    
    if($("#searchbox").val() != '') {
      qs = qs + "&id=" + $("#searchbox").val();
    }

    $('#shareUrl').val(qs);
  });
}

function changeLayers(_radio) {
    if ($(".layer-controls-wrapper").hasClass("on")){
    $(".layer-controls-wrapper").toggleClass("on");
    setTimeout(function(){     
      if (tocTopTitle == "") {
        $("div").removeClass("o");
        AddLayersTOC(_radio.id);
      }
      else {
        $("div").removeClass("o");
        tocTopTitle = _radio.value;
      }
    },200);
    setTimeout(function(){
      $(".layer-controls-wrapper").toggleClass("on")
    },300);      
  }
  else {
     setTimeout(function(){     
      if (tocTopTitle == "") {
        $("div").removeClass("o");
        AddLayersTOC(_radio.id);
      }
      else {
        $("div").removeClass("o");
        tocTopTitle = _radio.value;
      }
    },200);
    setTimeout(function(){
      $(".layer-controls-wrapper").toggleClass("on")
    },300);      
  };
}


function locationError(error) {
    //error occurred so stop watchPosition
    if(navigator.geolocation){
        navigator.geolocation.clearWatch(watchId);
    }
    switch (error.code) {
    case error.PERMISSION_DENIED:
        alert("Location not provided");
        break;

    case error.POSITION_UNAVAILABLE:
        alert("Current location not available");
        break;

    case error.TIMEOUT:
        alert("Timeout");
        break;

    default:
        alert("unknown error");
        break;
    }
}

function zoomToLocation(location) {
    var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(location.coords.longitude, location.coords.latitude));
    addGraphic(pt);    
    map.centerAndZoom(pt, 20);
}

function showLocation(location) {
    //zoom to the users location and add a graphic
    var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(location.coords.longitude, location.coords.latitude));
    if (!graphic) {
        addGraphic(pt);
    }
    else { //move the graphic if it already exists
        graphic.setGeometry(pt);
    }
    map.centerAt(pt);
}
      
function addGraphic(pt){
    var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 12, 
      new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
      new dojo.Color([147, 164, 69, .3]), 8), 
      new dojo.Color([147, 164, 69])
    );
    graphic = new esri.Graphic(pt, symbol);
    map.graphics.add(graphic);
}