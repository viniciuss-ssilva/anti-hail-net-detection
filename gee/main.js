// Determining the central viewing area and creating points for learning
var AOI = 
    ee.Geometry.Polygon(
        [[[-50.857335020273226, -28.469481615934455],
          [-50.857335020273226, -28.504937765694294],
          [-50.78180401441385, -28.504937765694294],
          [-50.78180401441385, -28.469481615934455]]], null, false);
Map.addLayer(ee.Image().paint(AOI, 0, 2), {}, 'region', false);
var municipios = ee.FeatureCollection('projects/ee-viniciusfernandesilva/assets/MunicipiosMacasWGS84')
var vacaria = municipios.filter(ee.Filter.eq('NM_MUN', 'Vacaria'))

// Imports of samples by class 
var unprotected_cultures = ee.FeatureCollection('projects/ee-viniciusfernandesilva/assets/amostra_cultivosA')
var protected_cultures = ee.FeatureCollection('projects/ee-viniciusfernandesilva/assets/amostra_telasA')
var green_sample = ee.FeatureCollection('projects/ee-viniciusfernandesilva/assets/class3')
                  .merge(ee.FeatureCollection('projects/ee-viniciusfernandesilva/assets/class3_2_1'))
var light_sample = ee.FeatureCollection('projects/ee-viniciusfernandesilva/assets/class4')
                  .merge(ee.FeatureCollection('projects/ee-viniciusfernandesilva/assets/class_4_2_1'))

// Converting the mappings into point samples and defining the classes
// Class 0: nets
// Class 1: unprotected cultures
// Class 2: Open forest
// Class 3: Bare soil
var culture_points = unprotected_cultures.map(function(feature){
  var center = feature.geometry().centroid();
  var properties = feature.toDictionary();
  properties = properties.set('class', 1)
  return ee.Feature(center, properties);
});
culture_points = culture_points.randomColumn('rand')
culture_points = culture_points.sort('rand').limit(200)

var hailnet_points = protected_cultures.map(function(feature){
  var center = feature.geometry().centroid();
  var properties = feature.toDictionary();
  properties = properties.set('class', 0)
  return ee.Feature(center, properties);
});
hailnet_points = hailnet_points.randomColumn('rand')
hailnet_points = hailnet_points.sort('rand').limit(200)

var green_area = green_sample.map(function(feature){
  var point = feature.geometry();
  var properties = feature.toDictionary();
  properties = properties.set('class', 2)
  return ee.Feature(point, properties);
});

var light_area = light_sample.map(function(feature){
  var point = feature.geometry()
  var properties = feature.toDictionary();
  properties = properties.set('class', 3)
  return ee.Feature(point, properties);
});

var points = hailnet_points.merge(culture_points).merge(green_area).merge(light_area)

// Import of the Sentinel-2 collection with low cloud cover in the second half of 2024
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(vacaria) 
  .filterDate('2024-01-06', '2100-01-01') 
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5));
  
// Selection of the best image by applying a cloud mask
var mask_clouds = function(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10; 
  var cirrusBitMask = 1 << 11; 
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0) 
              .and(qa.bitwiseAnd(cirrusBitMask).eq(0)); 
  return image.updateMask(mask);
};

var s2_filtred = s2.map(mask_clouds);

var best_images = s2_filtred.median().clip(vacaria);

// Bands to be used for classification
var bands = ['B2', 'B3', 'B4', 'B8', 'B12']; // blue, green, red, NIR, SWIR2
var final_image = best_images.select(bands);

// Training and test samples split
var sample = final_image.sampleRegions({
  collection: points,
  properties: ['class'],
  scale: 10
});

var split = sample.randomColumn({columnName: 'split'});
var train = split.filter(ee.Filter.lt('split', 0.7));
var test = split.filter(ee.Filter.gte('split', 0.7));

// Random Forest Training
var classifier = ee.Classifier.smileRandomForest(50).train({
  features: train,
  classProperty: 'class',
  inputProperties: bands
});

// Image classification and visualization
var classified = final_image.classify(classifier);

var palette = ['93C777', '117701', '315818', 'CCFFFF', '7CB15F'];
var palette2 = ['yellow', 'purple', 'green', 'grey'];

Map.addLayer(classified, {min: 0, max: 3, palette: palette2}, 'Classes');

var rgb_image = best_images.select(['B4', 'B3', 'B2']);
Map.addLayer(rgb_image, {min: 0, max: 3000}, 'RGB image');

Map.centerObject(AOI, 13);

// Model accuracy test and confusion matrix
var validation_classified = test.classify(classifier);

var confusion_matrix = validation_classified.errorMatrix({
  actual: 'class', 
  predicted: 'classification'
});

print('Confusion Matrix', confusion_matrix);

// Accuracy indices
var accuracy = confusion_matrix.accuracy();
print('Overall accuracy:', accuracy);

var kappa = confusion_matrix.kappa();
print('Kappa index:', kappa);

var precision = confusion_matrix.producersAccuracy();
print('Precision by class:', precision);

var recall = confusion_matrix.consumersAccuracy();
print('Recall by class:', recall);

Map.addLayer(points, {}, 'pontos', false)

// Classification post-processing

// Modify unwanted pixels in the vicinity of large objects.
var filtred = classified.reduceNeighborhood({
  reducer: ee.Reducer.mode(),
  kernel: ee.Kernel.square({radius: 2})
});

Map.addLayer(filtred, {min: 0, max: 3, palette: palette2}, 'Refined classification');

// Vectorization of the nets

var nets = filtred.eq(0).selfMask();

var nets_vectors = nets.reduceToVectors({
  geometry: vacaria,  
  scale: 10,                   
  geometryType: 'polygon',  
  eightConnected: false,
  labelProperty: 'classe',
  maxPixels: 1e13                
});

nets_vectors = nets_vectors.map(function(feat) {
  var geometryFixed = feat.geometry({maxError: 1}).buffer(0, 1);
  var area = geometryFixed.area({maxError: 1});
  return feat.set('area', area).setGeometry(geometryFixed);
});

var filtred_vectors = nets_vectors.filter(ee.Filter.gt('area', 25000));

// Visuzalização e exportação

Map.addLayer(filtred_vectors, {color: 'FF0000'}, 'Nets (vectors)');