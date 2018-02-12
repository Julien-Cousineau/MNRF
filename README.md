# Ministry of Natural Resources and Forestry - Far North Dashboard
Web-based dashboard/tool to provide MNRF and emergency managers with improved access to near real-time information

## History
Feb-07-2018 Project created

## Intent
Develop a web-based dashboard/tool to provide MNRF and emergency managers with improved access to near real-time information. 
The purpose of the new dashboard/tool will be to support emergency management in Ontario’s Far North.

## Installation
```bash
npm install
```
## Usage
```bash
npm start
```
## Development website
https://mnrf-jcousineau.c9users.io/

## Stations & Rivers
Albany River

Attawapiskat River

Moose River

Winisk River

## Data Source
##### Water Level & Precipitation 
KISTERS QueryServices (http://204.41.16.133/KiWIS/KiWIS?service=kisters&type=queryServices&request=getRequestInfo&datasource=0&format=html)

**Albany**

station_no: 04HA001

station_id: 146399

**Albany@Fishing**

station_no: 04HA002

station_id: 146412

**Albany@Stooping**

station_no: 04HA003

station_id: 481782

**Attawapiskat**

station_no: 04FC001

station_id: 146273

**Moose**

station_no: 04LG004

station_id: 146658

**Winisk**

station_no: 04DC001

station_id: 146172

##### Camera Photos
Flickr (https://www.flickr.com/photos/145447898@N03/)

##### Radarsat
 (???) 
 
 Note:GEOJSON/Shapefile would be best instead of images.

## Methodology
##### Water Level & Precipitation 

Plot Template : https://codepen.io/jcousineau/pen/oEZraY

https://github.com/rywhale/kiwisR/tree/master/R

getStationList (http://204.41.16.133/KiWIS/KiWIS?service=kisters&type=queryServices&request=getStationList&datasource=0&format=objson)

getTimeseriesList (http://204.41.16.133/KiWIS/KiWIS?service=kisters&type=queryServices&request=getTimeseriesList&datasource=0&format=objson&station_id=146399)

ts_name (???)


##### Camera Photos
Use flickr API and REST

_Testing Api_

Get all photos from account (https://www.flickr.com/services/api/explore/flickr.people.getPhotos) (i.e. user_id=145447898@N03, min_upload_date=2018-01-21, per_page=500)

The site will create this link (https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=0496671cc41a7050d35902b2428ebffc&user_id=145447898%40N03&min_upload_date=2018-01-21&per_page=500&format=json&nojsoncallback=1&api_sig=c62934d6178aa6b12521af8849a4bf37)

Get photo info (https://www.flickr.com/services/api/explore/flickr.photos.getInfo) (i.e photo_id=37555690575)

The site will create this link (https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=f61852d3561fc798e108a8dd505f5a0d&photo_id=37555690575&format=rest&api_sig=573cc5c2914d437fa2a880129c1b02ac)

The JSON file can be sorted by the title attribute. Here's an exmaple of the JSON row:
```JSON
 { "id": "40027637332", "owner": "145447898@N03", "secret": "d5027f8efe", "server": "4616", "farm": 5, "title": "04FC001_Attawapiskat_Rv_20180203150108.jpg", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
```

JPG Link Format

https://c1.staticflickr.com/{farm}/{server}/{id}_{secret}_b.jpg

https://c1.staticflickr.com/5/4616/40027637332_d5027f8efe_b.jpg

Title example: 04HA001_ALBANY_RV_20180207200058.jpg

##### Radarsat


## Web Server
Domain name?

Might store 

HTTP / HTTPS


## TODO

Create time-series graph

Create gauge graph
...

## Issues

This CORS is causing problems http / https. KISTERS only has http :(

## Question
What ts_name should I use?



