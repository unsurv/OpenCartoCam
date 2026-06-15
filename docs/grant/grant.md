# nlnet grant

Initial work of this project has been supported by a grant from [nlnet](https://nlnet.nl/project/OpenCartoCam/)

This documents is used to track milestone.

## Hardware Development

Development of the physical systems, from PCB design to camera integration and sensor support, including 3D prototyping.

- buy devboard & setting it up (expense + work) ✅
  - bought [HAILO-15 dev board](https://www.solid-run.com/embedded-industrial-iot/hummingboard-hailo-15-aiot-sbc/)
- Daughterboard connection present ✅
  - see [img](#carrier-board-connection)
- Power management ✅
  - see lefthand side of [schematic](#schematic)
  - see center area of [PCB](#pcb-view)
- Battery support added ✅
  - see [PCB backside](#3d-preview-back)
  - see [BQ25606 schematic](#schematic)
- External connections (USB, antenna, camera) ✅
  - see [3D view front](#3d-preview-front)
  - see relevant parts of the [schematic](#schematic)
- PCB outline defined ✅
  - see [3D](#3d-preview-front)
- Camera connections ✅
  - see bottom right for [FPC connections](#schematic)
- Prototype assembly
- Debug connections ✅
  - see testpoints [schematic](#schematic)
  - see secondary [USB receptable](#schematic) for shell access
- SD card present ✅
  - bottom right in [schematic](#schematic)
  - see [PCB backside](#3d-preview-back)
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

## Images

### carrier board connection

``` {image} ./_static/DF40.PNG

```

### schematic

``` {image} ../hardware/_static/schematic.PNG

```

### PCB view

``` {image} ../hardware/_static/PCB_view.PNG

```

## 3D preview front

``` {image} ../hardware/_static/3D_preview_front.PNG

```

## 3D preview back

``` {image} ../hardware/_static/3D_preview_back.PNG

```
