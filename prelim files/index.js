(function() {
  "use strict";

  var apikey = "4CujngcqAbmlQtNkwl6WbEZH9Q79aZG4gra3A_UPG50";

  //initialize communication with the platform
  const platform = new H.service.Platform({
    apikey,
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
    "reduced.night",
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
  map.setZoom(6);
  map.setCenter(new H.geo.Point(50.90978, 10.87203));

  const sample = [
    [49.606945, 8.368333],
    [50.98194, 12.50638],
    [51.83169, 12.19096],
    [52.19585, 14.58753],
    [51.30805, 13.55555],
    [51.36305, 11.94083],
    [51.55222, 12.05388],
    [51.2936, 13.35611],
    [53.30638, 12.75222],
    [52.58055, 13.91666],
    [52.2036, 13.15638],
    [54.33825, 12.71051],
    [50.91527, 11.71444],
    [52.91888, 12.42527],
    [52.07361, 11.62638],
    [51.36333, 14.94999],
    [53.83277, 13.66861],
    [51.88944, 14.53194],
    [51.29694, 14.12749],
    [52.38, 13.5225],
    [51.1328, 13.7672],
    [50.9798, 10.9581],
    [50.02233, 8.57055],
    [52.1346, 7.68482],
    [53.6304, 9.98822],
    [52.47259, 13.4039],
    [50.86589, 7.14273],
    [51.22701, 6.76677],
    [48.3538, 11.7861],
    [49.49869, 11.07805],
    [51.42388, 12.23308],
    [49.21459, 7.1095],
    [48.68989, 9.22196],
    [52.3597, 13.28769],
    [52.4611, 9.68479],
    [53.0475, 8.78665],
    [49.69999, 8.64583],
    [49.94869, 7.26388],
    [49.47305, 8.51416],
    [51.03499, 8.68083]
  ];

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

  setTimeout(updateMarkerPositions, 0);
  setInterval(updateMarkerPositions, 5000);
});
