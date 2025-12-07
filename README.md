# GC Geochecker Finder

A userscript that automatically finds and displays geochecker links on geocaching.com cache pages.

---

## Overview

GC Geochecker Finder is a userscript that automatically detects and displays geochecker links from various domains on geocaching.com cache pages. It creates a convenient widget that shows all found geochecker links with their associated images, making it easier to verify mystery cache solutions.

## Supported Domains

| Domains        |                                | Pass Corrected Coordinates           |
| :--------------| :------------------------------| :----------------------------------- |
| certitudes.org | image link                     | no  |
| geocheck.org   | image link                     | yes |
| geocheck.xyz   | image link                     | yes |
| geotjek.dk     | image link                     | yes |
| gc-apps.com    | image link                     | no  |
| geochecker.com | image link                     | yes |
| gccheck.com    | text link                      | no  |
| geocaching.com | default checker provided by HQ | yes |

## Installation

### Prerequisites

Install a userscript manager in your browser:

- [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge, Opera)
- [Greasemonkey](https://www.greasespot.net/) (Firefox)
- [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge, Opera)

### Install the Script

1. Install one of the userscript managers above
2. Click on the following link: [Install GC Geochecker Finder](https://github.com/ChristianGK-GC/gc-geochecker-finder/raw/main/gc_geochecker_finder.user.js)
3. Your userscript manager will prompt you to install the script
4. Click "Install" to confirm

## Usage

1. Navigate to any geocaching.com cache page
2. The script automatically scans the page for geochecker links
3. If geochecker links are found, a widget appears above the cache details
4. Any geochecker link is opened in a new tab

## Test userscript output after installation

- [certitudes.org & geocheck.org](https://coord.info/GC7EFNV)
- [geocheck.org](https://coord.info/GC7YR3J)
- [gc-apps.com](https://coord.info/GCBDJR4)
- [geochecker.com](https://coord.info/GC2PM5J)
- [geocaching.com & geocheck.org](https://coord.info/GC8HWZR)
- [geocheck.xyz](https://coord.info/GC7QJ1E)
- [geocheck.app](https://coord.info/GC4ZRT0)
- [geotjek.dk](??https://coord.info/GC6AX4A)
- [gccheck.com](https://coord.info/GC4CFAA)

## Contributing

Contributions are welcome! Please feel free to:

- Report bugs via [GitHub Issues](https://github.com/ChristianGK-GC/gc-geochecker-finder/issues)
- Suggest new features or supported domains

## License

This project is licensed under the **GNU General Public License v3.0**.

## Author

Created by [ChristianGK](https://github.com/ChristianGK-GC)

## Support

If you encounter any issues or have questions:

- Open an issue on [GitHub](https://github.com/ChristianGK-GC/gc-geochecker-finder/issues)
- Check existing issues for similar problems
