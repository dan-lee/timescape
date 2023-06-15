# be careful does replace in place
mogrify -crop 480x120+0+74 ./output/timescape/*.png

# 1000/30 fps = ~33
apngasm --force -o ./output/timescape.apng -d 33 ./output/timescape/*.png
