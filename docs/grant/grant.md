# Memorandum of understanding

Initial work of this project has been supported by a grant from [nlnet](https://nlnet.nl/project/OpenCartoCam/)

This documents is used to track milestone.

## Hardware Development

Development of the physical systems, from PCB design to camera integration and sensor support, including 3D prototyping.

- buy devboard & setting it up (expense + work)
  - bought [HAILO-15 dev board](https://www.solid-run.com/embedded-industrial-iot/hummingboard-hailo-15-aiot-sbc/)
- Daughterboard connection present
  - see .[img](./_static/DF40.PNG)
- Power management
  - see lefthand side of [schematic](../hardware/schematic.PNG)
  - see center area of [PCB](../hardware/PCB_view.PNG)
- Battery support added
  - see [PCB backside](../hardware/3D_preview_back.PNG)
  - see [BQ25606 schematic](../hardware/schematic.PNG)
- External connections (USB, antenna, camera)
  - see [3D view front](../hardware/3D_preview_front.PNG)
  - see relevant parts of the [schematic]((../hardware/schematic.PNG))
- PCB outline defined
  - see [3D](../hardware/3D_preview_front.PNG)
- Camera connections
  - see bottom right for [FPC connections](../hardware/schematic.PNG)
- Prototype assembly
- Debug connections
  - see testpoints [schematic](../hardware/schematic.PNG)
  - see secondary [USB receptable](../hardware/schematic.PNG) for shell access
- SD card present
  - bottom right in [schematic]see secondary [USB receptable](../hardware/schematic.PNG)
- IMX219 driver support on development board
- Customized Yocto Linux running on dev board
- Prototype 3D case
- Sensor (GPS + gyroscope) integration
- Hardware docs
- Hardware expenses (expenses; various parts + PCB production)

## Software Development

Core software implementation, including dewarping, sensor/software integration, and privacy-aware mapping output.

- Dewarp method established
- Hardware-accelerated model running  
- Software sensor integration  
- Privacy features (face, license plate blurring)  
- Output generation
- Browser-based evaluation software developed
- OSM integration
- Custom object detection model trained and integrated
- Software docs

## Supporting Activities

Tasks supporting data collection, preparation, and documentation.

- Gathering images for retraining (work + travelling expenses)
- Image preparation (binning, labelling, scaling)

## Final release

- Beta release
- Process feedback from security audit and accessibility scan
- Final release with updated documentation
