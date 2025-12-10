# GC External Links Finder

A userscript that finds and displays external service links on geocaching.com cache pages.

---

## Overview

GC External Links Finder automatically detects and displays links to various external services on geocaching.com cache pages. It creates a convenient widget organized by service categories, making it easier to access geocheckers, puzzles, and planning tools.

## Features

- Automatic detection of external service links
- Organized by service categories
- Visual representation with service logos/images
- Passes corrected coordinates to supported geocheckers
- Links directly to the official Geocaching.com HQ checker if available
- Fallback to text links if images fail to load

## Supported Services

### ✓ Geochecker Services

| Domain             | Type        | Pass Coordinates |
|:-------------------|:------------|:-----------------|
| certitudes.org     | Image link  | No               |
| geocheck.org       | Image link  | Yes              |
| geocheck.xyz       | Image link  | Yes              |
| geocheck.app       | Image link  | Yes              |
| geotjek.dk         | Image link  | Yes              |
| gc-apps.com        | Image link  | No               |
| geochecker.com     | Image link  | Yes              |
| gccheck.com        | Text link   | No               |
| geocaching.com     | HQ checker  | Yes              |

### 🧩 Puzzle Services

| Domain             | Type        |
|:-------------------|:------------|
| jigidi.com         | Image link  |

### 🗺️ Planning & Tools

| Domain                | Type        |
|:----------------------|:------------|
| xctrails.org          | Text link   |
| geocache-planer.de    | Text link   |

## Installation

### Prerequisites

Install a userscript manager in your browser:

- [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge, Opera)
- [Greasemonkey](https://www.greasespot.net/) (Firefox)
- [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge, Opera)

### Install the Script

1. Install one of the userscript managers above
2. Click on the following link: [Install GC External Links Finder](https://github.com/ChristianGK-GC/gc-external-links-finder/raw/main/gc_external_links_finder.user.js)
3. Your userscript manager will prompt you to install the script
4. Click "Install" to confirm

## Migration from GC Geochecker Finder

If you're upgrading from the old "GC Geochecker Finder" (v1.x):

1. Install the new "GC External Links Finder" script
2. Uninstall the old "GC Geochecker Finder" script
3. All geochecker functionality is preserved and extended with new service categories

## Usage

1. Navigate to any geocaching.com cache page
2. The script automatically scans the page for external service links
3. If links are found, a widget appears above the cache details
4. Links are organized by category (Geocheckers, Puzzles, Planning Tools)
5. All links open in a new tab

## Test userscript output after installation

### ✓ Geochecker

- [certitudes.org & geocheck.org](https://coord.info/GC7EFNV)
- [geocheck.org](https://coord.info/GC7YR3J)
- [gc-apps.com](https://coord.info/GCBDJR4)
- [geochecker.com](https://coord.info/GC2PM5J)
- [geocaching.com & geocheck.org](https://coord.info/GC8HWZR)
- [geocheck.xyz](https://coord.info/GC7QJ1E)
- [geocheck.app](https://coord.info/GC4ZRT0)
- [geotjek.dk](https://coord.info/GC6AX4A)
- [gccheck.com](https://coord.info/GC4CFAA)
- [geocache-planer.de](https://coord.info/GCA6MNY)

### 🧩 Puzzles

- [jigidi.com](https://coord.info/GCB0332)
- [xctrails.org (GC-Code)](https://coord.info/GC6B56W)
- [xctrails.org (UID)](https://coord.info/GCA6VT0)

### 🗺️ Planning

- [geocache-planer.de](https://coord.info/GCB61M6)

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

GNU General Public License v3.0 - see [License.md](License.md) for details.
