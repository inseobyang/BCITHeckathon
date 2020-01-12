(function() {
  "use strict";

  var app_id = "DemoAppId01082013GAL";
  var app_code = "AJKnXv84fjrb0KIHawS0Tg";

  //initialize communication with the platform
  const platform = new H.service.Platform({
    app_id,
    app_code,
    useCIT: true,
    useHTTPS: true
  });

  //initialize a map
  const pixelRatio = devicePixelRatio > 1 ? 2 : 1;
  let defaultLayers = platform.createDefaultLayers({
    tileSize: 256 * pixelRatio
  });
  let mapTileService = platform.getMapTileService({ type: "base" });
  let fleetStyleLayer = mapTileService.createTileLayer(
    "mapnopttile", //removes public transit markers
    "reduced.day",
    256 * pixelRatio,
    "png8",
    { ppi: pixelRatio > 1 ? 320 : 100 }
  );
  const map = new H.Map(
    document.getElementsByClassName("dl-map")[0],
    fleetStyleLayer,
    { pixelRatio }
  );

  window.addEventListener("resize", function() {
    map.getViewPort().resize();
  });

  //make the map interactive
  const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  const ui = H.ui.UI.createDefault(map, defaultLayers);
  map.setZoom(13);
  map.setCenter(new H.geo.Point(43.6532, -79.3832));

  addInfoBubble(map);

  geocode(platform);
})();
