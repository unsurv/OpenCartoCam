# OpenCartoCam

## What is it

OpenCartoCam is an open source 360-degree camera that leverages edge computing to support cartographing the world. Equipped with precise positioning systems and hardware-accelerated object detection, it enables semi-automatic mapping and categorization while maintaining a compact form factor.

## Current status

Status **in development**

- decided on SolidRun [Hailo-15-SOM](https://www.solid-run.com/hailo-15-som/) as main compute unit.
- custom designed carrier board with necessary power structure and external connectors (USB, Micro SD, SMA)
- ublox NEO-F10 GNSS receiver (L1 + L5) with passive omnidirectional antenna for good value urban performance.
- two IMX 678 (M12 lens mount) sensors with kernel support
- dead reckoning
- off the shelf [Insta360 Ace Pro 2 battery](https://store.insta360.com/en/product/ace-pro-2-battery)

## TODOs

- board evaluation
- Yocto software integration
- Sensor integration (Gyro, GNSS)

## Funding

This project is funded through [NGI0 Commons Fund](https://nlnet.nl/commonsfund), a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) program. Learn more at the [NLnet project page](https://nlnet.nl/project/OpenCartoCam).

[<img src="https://nlnet.nl/logo/banner.png" alt="NLnet foundation logo" width="20%" />](https://nlnet.nl)
[<img src="https://nlnet.nl/image/logos/NGI0_tag.svg" alt="NGI Zero Logo" width="20%" />](https://nlnet.nl/commonsfund)

## Licences

GNSS schematic partially based on [SparkFun NEO-F10N](https://github.com/sparkfun/SparkFun_u-blox_NEO-F10N)
by SparkFun Electronics, licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

Modifications by Martin. Schematic is also licensed under CC BY-SA 4.0.
