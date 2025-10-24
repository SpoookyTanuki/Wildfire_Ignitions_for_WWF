// Fire location and date

// id Τατόι Αττική
var lat = 38.147269;
var lon = 23.821438;
var date = '2021-08-05';

var point = ee.Geometry.Point(lon, lat);
var fireDate = ee.Date(date);

// Create a square buffer of 500m
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

// Function to calculate NBR (Normalized Burn Ratio) for Sentinel-2 SR
function calculateNBR(image) {
  // Sentinel-2 SR: NIR = B8, SWIR2 = B12
  return image.normalizedDifference(['B8', 'B12']).rename('NBR');
}

// Function to calculate dNBR (differenced NBR)
function calculateDNBR(before, after) {
  var nbrBefore = calculateNBR(before);
  var nbrAfter = calculateNBR(after);
  return nbrBefore.subtract(nbrAfter).rename('dNBR');
}

// Display before-fire image
if (beforeFire) {
  var beforeDate = beforeFire.date().format('YYYY-MM-dd');
  print('Before Fire Image Date:', beforeDate);
  
  Map.addLayer(beforeFire, 
    {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, // Red, Green, Blue
    'Before Fire: ' + beforeDate.getInfo());
}

// Display after-fire image
if (afterFire) {
  var afterDate = afterFire.date().format('YYYY-MM-dd');
  print('After Fire Image Date:', afterDate);
  
  Map.addLayer(afterFire, 
    {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000},
    'After Fire: ' + afterDate.getInfo());
}

// Calculate and display dNBR
if (beforeFire && afterFire) {
  var dNBR = calculateDNBR(beforeFire, afterFire);
  
  Map.addLayer(dNBR, 
    {min: -0.5, max: 0.5, palette: ['blue', 'white', 'red']}, 
    'dNBR');
}

// Show the fire location and boundary
Map.addLayer(square, {color: 'red'}, 'Fire Area');
Map.addLayer(point, {color: 'blue'}, 'Fire Location');

// Zoom to the fire location
Map.centerObject(point, 14);
