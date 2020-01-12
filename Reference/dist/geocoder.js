// Hold a reference to any infobubble opened

var bubble;
/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text) {
  if (!bubble) {
    bubble = new H.ui.InfoBubble(position, { content: text });
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}
/**
 * Creates a new marker and adds it to a group
 * @param {H.map.Group} group       The group holding the new marker
 * @param {H.geo.Point} coordinate  The location of the marker
 * @param {String} html             Data associated with the marker
 */
function addMarkerToGroup(group, coordinate, html) {
  var marker = new H.map.Marker(coordinate);
  // add custom data to the marker
  marker.setData(html);
  group.addObject(marker);
}

/**
 * Add two markers showing the position of Liverpool and Manchester City football clubs.
 * Clicking on a marker opens an infobubble which holds HTML content related to the marker.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addInfoBubble(map) {
  var group = new H.map.Group();

  map.addObject(group);

  // add 'tap' event listener, that opens info bubble, to the group
  group.addEventListener(
    "click",
    function(evt) {
      // event target is the marker itself, group is a parent event target
      // for all objects that it contains
      var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        // read custom data
        content: evt.target.getData()
      });
      // show info bubble
      ui.addBubble(bubble);
    },
    false
  );

  var newJSON = [];

  for (i = 0; i < 900; i++) {
    let tempString = x[i]["location2"].split(" ").join("+");
    let checkURL =
      "https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=4CujngcqAbmlQtNkwl6WbEZH9Q79aZG4gra3A_UPG50&searchtext=" +
      tempString +
      "+TORONTO";
    $.ajax({
      method: "GET",
      url: checkURL
    }).done(function(data) {
      // see what properties you need from data object and save it to variable
      var data = data;
      console.log(
        data.Response.View[0].Result[0].Location.DisplayPosition.Latitude
      );
      console.log(
        data.Response.View[0].Result[0].Location.DisplayPosition.Longitude
      );
      addMarkerToGroup(
        group,
        {
          lat:
            data.Response.View[0].Result[0].Location.DisplayPosition.Latitude,
          lng:
            data.Response.View[0].Result[0].Location.DisplayPosition.Longitude
        },
        "Alexandra Park" + "Testing!!!"
      );
    });
  }
}
