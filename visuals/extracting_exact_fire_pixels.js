// ----------------------------
// Fire location and date
// ----------------------------
var lat = 38.147269;
var lon = 23.821438;
var date = '2021-08-05';

var point = ee.Geometry.Point(lon, lat);
var fireDate = ee.Date(date);

// ----------------------------
// Your manually drawn polygon (from Imports)
// Make sure you have "geometry" in your Imports
// ----------------------------

// ----------------------------
// Create a square buffer of 500m (for imagery search only)
// ----------------------------
var square = point.buffer(250).bounds();

// Sentinel-2 Surface Reflectance Image Collection
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(square)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));

// Find images before and after fire
var beforeFire = s2.filterDate('2017-03-28', fireDate)
    .sort('system:time_start', false)
    .first();

var afterFire = s2.filterDate(fireDate.advance(1, 'day'), ee.Date(Date.now()))
    .sort('system:time_start', true)
    .first();

// ----------------------------
// Functions to calculate NBR and dNBR
// ----------------------------
function calculateNBR(image) {
  // Sentinel-2 SR: NIR = B8, SWIR2 = B12
  return image.normalizedDifference(['B8', 'B12']).rename('NBR');
}

function calculateDNBR(before, after) {
  var nbrBefore = calculateNBR(before);
  var nbrAfter = calculateNBR(after);
  return nbrBefore.subtract(nbrAfter).rename('dNBR');
}

// ----------------------------
// Display before/after-fire images
// ----------------------------
if (beforeFire) {
  var beforeDate = beforeFire.date().format('YYYY-MM-dd');
  print('Before Fire Image Date:', beforeDate);
  
  Map.addLayer(beforeFire, 
    {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 
    'Before Fire: ' + beforeDate.getInfo());
}

if (afterFire) {
  var afterDate = afterFire.date().format('YYYY-MM-dd');
  print('After Fire Image Date:', afterDate);
  
  Map.addLayer(afterFire, 
    {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000},
    'After Fire: ' + afterDate.getInfo());
}

// ----------------------------
// Burned area extraction (dNBR > 0.1 inside geometry)
// ----------------------------
if (beforeFire && afterFire) {
  var dNBR = calculateDNBR(beforeFire, afterFire);

  // Burned mask where dNBR > 0.1
  var burnedMask = dNBR.gt(0.1);

  // Clip to your drawn polygon
  var burnedClipped = burnedMask.clip(geometry);

  // Convert raster mask to vector polygons
  var burnedVectors = burnedClipped.selfMask()
    .reduceToVectors({
      geometry: geometry,
      scale: 30,
      geometryType: 'polygon',
      eightConnected: true,
      labelProperty: 'burned',
      bestEffort: true,
      maxPixels: 1e10
    });

  // ----------------------------
  // Area calculation per polygon (in hectares)
  // ----------------------------
  var burnedWithArea = burnedVectors.map(function(feature) {
    var areaHa = feature.geometry().area().divide(10000);
    return feature.set('area_ha', areaHa);
  });

  // ----------------------------
  // Display results
  // ----------------------------
  Map.addLayer(dNBR, 
    {min: -0.5, max: 0.5, palette: ['blue', 'white', 'red']}, 
    'dNBR');
  Map.addLayer(burnedClipped, {palette: ['red']}, 'Burned Mask (dNBR > 0.1)');
  Map.addLayer(burnedWithArea, {color: 'yellow'}, 'Burned Area Polygon');

  print('Burned area polygons:', burnedWithArea);

  // ----------------------------
  // Export shapefile to Google Drive
  // ----------------------------
  Export.table.toDrive({
    collection: burnedWithArea,
    description: 'Burned_Areas',
    fileFormat: 'SHP'
  });
}

// ----------------------------
// Show fire location & boundary
// ----------------------------
Map.addLayer(square, {color: 'red'}, 'Fire Area (Search)');
Map.addLayer(point, {color: 'blue'}, 'Fire Location');

// Zoom to the fire location
Map.centerObject(point, 14);
