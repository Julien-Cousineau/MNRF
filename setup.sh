# For GDAL
sudo add-apt-repository ppa:ubuntugis/ubuntugis-unstable
sudo apt-get update
sudo apt-get install -y gdal-bin python-gdal 

# for mapnik 
# sudo add-apt-repository ppa:ubuntu-toolchain-r/test
# sudo apt-get install -y libstdc++-5-dev

 curl -X POST -F "iceFile=@AlbanyRiver_2018_03_17.tif" http://localhost:8080/upload?key=wPx4kT3Qngc7vwKdExtiIlTixNQ5iZVHDDD
 curl -X POST -F "iceFile=@AlbanyRiver_2018_03_17.tif" https://mnrmap-appsrvr.canadaeast.cloudapp.azure.com/upload?key=wPx4kT3Qngc7vwKdExtiIlTixNQ5iZVHDDD

gdalwarp -overwrite /cloud/ice/upload/SevernRiver_2018_03_19.tif /cloud/ice/process/SevernRiver_2018_03_19.m.tif 

/usr/local/bin/gdalwarp -overwrite -srcnodata 0 -dstnodata 0 /cloud/ice/upload/SevernRiver_2018_03_19.tif /cloud/ice/process/SevernRiver_2018_03_19.m.tif
/usr/local/bin/gdal_translate -of vrt -expand rgba /cloud/ice/process/SevernRiver_2018_03_19.m.tif /cloud/ice/process/SevernRiver_2018_03_19.m.vrt
/usr/local/bin/gdal2tiles.py --profile=mercator -z 1-14 -a 0 /cloud/ice/process/SevernRiver_2018_03_19.m.vrt /cloud/ice/tiles/SevernRiver_2018_03_19

python /home/julianc/gdal2tiles.py --profile=mercator -z 1-10 -a 0,0,0 /cloud/ice/process/SevernRiver_2018_03_19.m.vrt /cloud/ice/tiles/SevernRiver_2018_03_19
