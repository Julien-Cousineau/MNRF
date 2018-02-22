import rasterio
import rasterio.features
import rasterio.warp
import json
import numpy as np


with rasterio.open('data/RiverIceBreakupClassification_ON_AlbanyRiver_20170502_231318.tif') as dataset:

    # Read the dataset's valid data mask as a ndarray.
    # mask = dataset.dataset_mask()
    mask = dataset.read(1)
    mask=np.ma.masked_array(mask, mask=(mask == 0))
    print mask
    array=[]
    # Extract feature shapes and values from the array.
    sieve = rasterio.features.sieve(mask, 1000)
    print("sieve done")
    for geom, val in rasterio.features.shapes(sieve, transform=dataset.transform):

        # Transform shapes from the dataset's own coordinate
        # reference system to CRS84 (EPSG:4326).
        geom = rasterio.warp.transform_geom(dataset.crs, 'EPSG:4326', geom, precision=6)
        print val
        results = {
            'type': 'Feature', 
            'properties': {'raster_val': val}, 
            'geometry': geom }
        array.append(results)
    
    collection = {
        'type': 'FeatureCollection', 
        'features': array
    }
    
    with open('python-powered.geojson', 'w') as dst:
        json.dump(collection, dst)

