# Validation software

``` {hint}
At this time the validation software was tested with dummy data. Tests with actual output will be done ass soon as possible.
```

After capturing data via the OpenCartoCam we need to validate the data before uploading to OpenStreetMap. For this a browser based software was developed that relies on minimal outside network connections.

Right now the only connections are:

- osm-api-js download
- OSM tiles
- OSM api for login, downloading and uploading

For the OSM login and upload functionality to work a valid redirect URL must be set in the Oauth2 section of OSM.

The workaround is to set this URL to **http://127.0.0.1:8000/indext.html** and host the html locally via:

``` {code}
python -m http.server 8000 --bind 127.0.0.1
```

After registering the validation as a non-confidential Oauth2 app in OSM you can login and upload your data.

## Overview

``` {image} _static/validation.png
```

Sections:

- image preview (top left)
- map preview (top right)
- suggested nodes table (bottom left)
- captures table (bottom right)

You can cycle through suggested nodes and captures with the arrow keys. 


### Image preview

Shows the subsection of the 360° view where a detection has been made including a bounding box (bbox).

### Map preview

Shows OSM tiles augmented with captures, suggested data nodes and similar nodes from the OSM database in close proximity as to not duplicate data.

Suggested nodes are displayed which are draggable and editable via a simple click. Here the most relevant data fields for the OSM visualisation on [Surveillance under Surveillance](https://sunders.uber.space/) must be entered before being able to upload the data.

### Suggested node table

A list of suggested nodes calculated by intersecting capture directions from the camera position, relevant directions are displayed in the map preview.

Table contains the following columns

- class of the object
- Latitude
- Longitude
- amount of captures for this node
- estimated quality
- direction where the camera is pointed
- height
- angle from horizontal
- mounting type
- zone

These properties are necessary to create an estimated viewing angle of the camera which is then displayed on [Surveillance under Surveillance](https://sunders.uber.space/)

After entering all necessary fields for visualisation of the camera viewing angle the node can be marked as "validated" meaning ready for upload to the OSM database.

Below the suggested nodes table there is a list of "orphaned" captures that could not clearly be grouped to a combined suggested node. These captures could be real life features that only have been detected once or without the needed capture direction intersections present. The user must manually review and decide how many nodes to create from the data.

### Captures table

This table shows a list of grouped captures that have been suggested to belong to the same detection. Since currently only simulated data is used, assignments are clear. For real world output this needs to be looked at again.


## Upload

A working test upload can be viewed in the OSM dev database [here](https://master.apis.dev.openstreetmap.org/changeset/727247)