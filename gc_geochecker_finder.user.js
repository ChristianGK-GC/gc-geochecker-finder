// ==UserScript==
// @name         GC Geochecker Finder
// @namespace    https://github.com/ChristianGK-GC/gc-geochecker-finder
// @version      1.2.1
// @description  Finds and displays geochecker links from various domains on geocaching.com cache pages
// @copyright    2025, ChristianGK (https://github.com/ChristianGK-GC)
// @author       ChristianGK
// @license      GNU General Public License v3.0
// @icon         https://raw.githubusercontent.com/ChristianGK-GC/gc-geochecker-finder/main/images/icon.png
// @homepageURL  https://github.com/ChristianGK-GC/gc-geochecker-finder
// @supportURL   https://github.com/ChristianGK-GC/gc-geochecker-finder/issues
// @updateURL    https://github.com/ChristianGK-GC/gc-geochecker-finder/raw/main/gc_geochecker_finder.user.js
// @downloadURL  https://github.com/ChristianGK-GC/gc-geochecker-finder/raw/main/gc_geochecker_finder.user.js
// @match        https://www.geocaching.com/geocache/*
// @grant        none
// ==/UserScript==

/* make eslint happy and avoid no-undef warnings: */
/* global userDefinedCoords */

(function () {
    'use strict';

    const SCRIPT_NAME = 'Geochecker Searcher';

    // Configuration for supported domains
    const DOMAIN_CONFIG = {
        'certitudes.org': {
            extractParam: (url) => url.match(/wp=([A-Z0-9]+)/i)?.[1],
            getImageUrl: (param) => param ? `https://www.certitudes.org/logo?wp=${param}` : null,
        },
        'geocheck.org': {
            extractParam: (url) => url.match(/gid=([a-f0-9\-]+)/i)?.[1],
            getImageUrl: (param) => param ? `http://geocheck.org/geocheck_small.php?gid=${param}` : null,
            passCoords: (coords) => { return { 'coord': coords.replace(/[^NSEW0-9]/g, "") } }
        },
        'geotjek.dk': {
            extractParam: (url) => url.match(/gid=([a-f0-9\-]+)/i)?.[1],
            getImageUrl: (param) => param ? `http://geotjek.dk/geocheck_small.php?gid=${param}` : null,
            passCoords: (coords) => { return { 'coord': coords.replace(/[^NSEW0-9]/g, "") } }
        },
        'geocheck.xyz': {
            extractParam: (url) => url.match(/gid=([a-f0-9\-]+)/i)?.[1],
            getImageUrl: (param) => param ? `http://geocheck.xyz/geocheck_small.php?gid=${param}` : null,
            passCoords: (coords) => { return { 'coord': coords.replace(/[^NSEW0-9]/g, "") } }
        },
        'geocheck.app': {
            extractParam: (url) => url.match(/gid=([a-f0-9\-]+)/i)?.[1],
            getImageUrl: (param) => param ? `http://geocheck.xyz/geocheck_small.php?gid=${param}` : null,
            passCoords: (coords) => { return { 'coord': coords.replace(/[^NSEW0-9]/g, "") } }
        },
        'gc-apps.com': {
            extractParam: (url) => url.match(/\/checker\/([a-f0-9]+)/i)?.[1],
            getImageUrl: (param) => param ? `https://www.gc-apps.com/checker/${param}/image` : null
        },
        'geochecker.com': {
            extractParam: () => null,
            getImageUrl: () => `https://www.geochecker.com/images/geochecker_title.png`,
            passCoords: (coords) => { return { 'lastcoords': coords } }
        },
        'gccheck.com': {
            extractParam: (url) => url.match(/([A-Z0-9]+)$/i)?.[1],
            getImageUrl: () => null
            //getImageUrl: (param) => param ? `https://gccheck.com/counterimg/${param}.png` : null // broken at provider
        }
    };

    let hasRun = false;

    function log(message) {
        console.log(`${SCRIPT_NAME}: ${message}`);
    }

    function findGecheckerLinks() {
        if (hasRun) {
            log('Script already executed, skipping...');
            return;
        }
        hasRun = true;

        // Search only in user content
        const containers = document.querySelectorAll('.UserSuppliedContent');
        log(`Found ${containers.length} containers with .UserSuppliedContent`);

        // Search in official cache checker section
        const hqCacheChecker = document.getElementById('ctl00_ContentBody_uxCacheChecker');
        let hasHqChecker = false;
        if (hqCacheChecker) {
            log('Found #ctl00_ContentBody_uxCacheChecker container');
            hasHqChecker = true;
        }

        const foundLinks = Object.keys(DOMAIN_CONFIG).reduce((acc, domain) => {
            acc[domain] = new Set();
            return acc;
        }, {});

        // Search for links
        containers.forEach(container => {
            container.querySelectorAll('a[href]').forEach(link => {
                Object.keys(DOMAIN_CONFIG).forEach(domain => {
                    if (link.href.includes(domain)) {
                        let ref = link.href;

                        // Corrected listing coordinates passed to the checker, if supported by service
                        if ("userDefinedCoords" in window &&
                            userDefinedCoords && userDefinedCoords.data && userDefinedCoords.data.isUserDefined &&
                            DOMAIN_CONFIG[domain].passCoords) {
                            let correctedCoordinates = document.getElementById("uxLatLon").textContent;
                            let parameters = DOMAIN_CONFIG[domain].passCoords(correctedCoordinates);

                            const url = new URL(ref);
                            Object.entries(parameters).forEach(([key, value]) => {
                                url.searchParams.append(key, value);
                            });
                            ref = url.toString();
                        }

                        foundLinks[domain].add(ref);
                    }
                });
            });
        });

        // Output results
        const totalFound = Object.entries(foundLinks).reduce((total, [domain, links]) => {
            const linkArray = Array.from(links);
            if (linkArray.length > 0) {
                log(`${linkArray.length} links found to ${domain}:`);
                linkArray.forEach((link, index) => console.log(`  ${index + 1}. ${link}`));
            }
            return total + linkArray.length;
        }, 0);

        if (totalFound === 0 && !hasHqChecker) {
            log('No geochecker links found.');
        } else {
            log(`Total ${totalFound} geochecker links found.`);
            createGecheckerWidget(foundLinks, hasHqChecker);
        }
    }

    function getImageUrl(domain, url) {
        const config = DOMAIN_CONFIG[domain];
        if (!config) return null;

        const param = config.extractParam(url);
        return config.getImageUrl(param);
    }

    function createGecheckerWidget(foundLinks, hasHqChecker = false) {
        const widgetParts = ['<div id="geocheckerWidget" class="CacheDetailNavigationWidget TopSpacing BottomSpacing">'];
        widgetParts.push('<h3 class="WidgetHeader">Geochecker Links</h3>');
        widgetParts.push('<div class="WidgetBody" id="GC_GecheckerLinks">');

        // Zeige HQ Cache Checker an, wenn vorhanden
        if (hasHqChecker) {
            widgetParts.push('<div style="margin-bottom: 15px;">');
            widgetParts.push(
                '<a href="#ctl00_ContentBody_uxCacheChecker" style="display: block; margin: 5px 0; padding: 10px; border-radius: 3px; text-align: center; text-decoration: none;">',
                '  <svg viewBox="0 0 196 29" class="icon-logo" role="img" aria-labelledby="GeocachingLogo" width="100%" style="fill: #02874d;">',
                '    <use xlink:href="https://www.geocaching.com/images/branding/logo-geocaching.svg#gcLogo"></use>',
                '  </svg>',
                '</a>'
            );
            widgetParts.push('</div>');
        }

        Object.entries(foundLinks).forEach(([domain, links]) => {
            const linkArray = Array.from(links);
            if (linkArray.length > 0) {
                widgetParts.push('<div style="margin-bottom: 15px;">');
                linkArray.forEach(link => {
                    const imageUrl = getImageUrl(domain, link);

                    if (imageUrl) {
                        widgetParts.push(
                            `<a href="${link}" target="_blank" style="display: block; margin: 5px auto; text-align: center;">`,
                            `<img src="${imageUrl}" title="${link}" style="max-width: 200px; border: 0;">`,
                            '</a>'
                        );
                    } else {
                        widgetParts.push(
                            `<a href="${link}" target="_blank" style="display: block; margin: 5px 0; padding: 5px; background: #f0f0f0; border-radius: 3px; text-align: left;">${domain}</a>`
                        );
                    }
                });
                widgetParts.push('</div>');
            }
        });

        widgetParts.push('</div></div>');

        const html = widgetParts.join('');
        const insertionPoint = document.querySelector('#ctl00_ContentBody_detailWidget') ||
            document.querySelector('.CacheDetailNavigationWidget');

        if (insertionPoint) {
            insertionPoint.insertAdjacentHTML('beforebegin', html);
            log('Widget inserted successfully');
        } else {
            log('Could not find insertion point for widget');
        }
    }

    // Initialize
    const init = () => setTimeout(findGecheckerLinks, 1000);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
