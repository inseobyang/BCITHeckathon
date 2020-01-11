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
    "maptile",
    "normal.day.grey",
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

  let data = [];
  sample.map((item, i) => {
    data.push([i, item[0], item[1]]);
  });

  // create the provider
  let provider = new H.datalens.Provider();
  provider.setData({
    columns: ["id", "lat", "lng"],
    rows: data
  });

  // create the layer
  let layer = new H.datalens.ObjectLayer(provider, {
    rowToMapObject: row => {
      return H.datalens.ObjectLayer.createReusableMarker(
        row.id,
        new H.geo.Point(row.lat, row.lng)
      );
    },
    rowToStyle: (row, zoom) => {
      let icon = H.datalens.ObjectLayer.createIcon(
        [
          "svg",
          {
            viewBox: "-20 -20 40 40"
          },
          [
            "circle",
            {
              r: 6,
              fill: "#F38630",
              stroke: "#000000"
            }
          ]
        ],
        { size: 25 * pixelRatio }
      );

      return { icon };
    },
    transitionOptions: row => {
      return {
        duration: (Math.floor(Math.random() * 4) + 2) * 1000,
        easing: "ease-in-out",
        interp: "slerp"
      };
    }
  });
  map.addLayer(layer);

  // update marker positions periodically
  function updateMarkerPositions() {
    let copy = sample.slice();
    let data = [];

    shuffle(copy);

    copy.map((item, i) => {
      data.push([i, item[0], item[1]]);
    });

    provider.setData({
      columns: ["id", "lat", "lng"],
      rows: data
    });
  }

  function shuffle(a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }
})();
