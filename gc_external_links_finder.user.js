// ==UserScript==
// @name         GC External Links Finder
// @namespace    https://github.com/ChristianGK-GC/gc-external-links-finder
// @version      2.0.1
// @description  Finds and displays external service links (geocheckers, puzzles, planning tools) on geocaching.com cache pages
// @copyright    2025, ChristianGK (https://github.com/ChristianGK-GC)
// @author       ChristianGK
// @license      GNU General Public License v3.0
// @icon         https://raw.githubusercontent.com/ChristianGK-GC/gc-external-links-finder/main/images/icon.png
// @homepageURL  https://github.com/ChristianGK-GC/gc-external-links-finder
// @supportURL   https://github.com/ChristianGK-GC/gc-external-links-finder/issues
// @updateURL    https://github.com/ChristianGK-GC/gc-external-links-finder/raw/main/gc_external_links_finder.user.js
// @downloadURL  https://github.com/ChristianGK-GC/gc-external-links-finder/raw/main/gc_external_links_finder.user.js
// @match        https://www.geocaching.com/geocache/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_NAME = 'GC External Links Finder';
    const INIT_DELAY_MS = 1000;
    const MAX_IMAGE_WIDTH_PX = 200;
    const MAX_IMAGE_HEIGHT_PX = 100;

    // Service categories configuration
    const SERVICE_CATEGORIES = {
        geochecker: {
            name: 'Geochecker',
            icon: '<span style="color:green">✓</span>',
            services: {
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
                },
                'geocache-planer.de/checker': {
                    extractParam: (url) => {
                        const calid = url.match(/CALID=([A-Z0-9]+)/i)?.[1];
                        const key = url.match(/KEY=([A-Z0-9]+)/i)?.[1];
                        return (calid && key) ? { calid, key } : null;
                    },
                    getImageUrl: (param) => param ? `http://geocache-planer.de/CAL/checker/${param.calid}${param.key}.png` : null,
                    displayName: 'Geocache Planer Checker',
                    domainMatch: 'geocache-planer.de/CAL/checker.php'
                }
            }
        },
        puzzle: {
            name: 'Puzzles',
            icon: '🧩',
            services: {
                'jigidi.com': {
                    extractParam: (url) => url.match(/jigidi\.com\/([^\/]+)/i)?.[1],
                    getImageUrl: () => 'https://cdn2.jigidi.com/gfx/b/jigidi_logo.png',
                    displayName: 'Jigidi Puzzle'
                },
                'xctrails.org': {
                    extractParam: (url) => url.match(/xctrails\.org/i)?.[0],
                    getImageUrl: () => null,
                    displayName: 'XCTrails.org'
                },
                'wherigo.com': {
                    extractParam: () => null,
                    getImageUrl: () => 'https://s3.amazonaws.com/gs-geo-images/712dc5a3-1707-44da-9410-25050b77cc77.jpg',
                    displayName: 'Wherigo.com'
                }
            }
        },
        planning: {
            name: 'Planning',
            icon: '🗺️',
            services: {
                'geocache-planer.de/planer': {
                    extractParam: (url) => url.match(/geocache-planer\.de\/CAL\/index\.php\?CALID=([A-Z0-9]+)/i)?.[1],
                    getImageUrl: () => `http://geocache-planer.de/CAL/kalenderlogin.jpg`,
                    displayName: 'Geocache Planer',
                    domainMatch: 'geocache-planer.de/CAL/index.php'
                }
            }
        }
    };

    let hasRun = false;

    function log(message) {
        console.log(`${SCRIPT_NAME}: ${message}`);
    }

    function findExternalLinks() {
        if (hasRun) {
            log('Script already executed, skipping...');
            return;
        }
        hasRun = true;

        const containers = document.querySelectorAll('.UserSuppliedContent');
        log(`Found ${containers.length} containers with .UserSuppliedContent`);

        // Check for official HQ cache checker
        const hqCacheChecker = document.getElementById('ctl00_ContentBody_uxCacheChecker');
        const hasHqChecker = !!hqCacheChecker;
        if (hasHqChecker) {
            log('Found #ctl00_ContentBody_uxCacheChecker container');
        }

        // Initialize found links structure
        const foundLinks = {};
        Object.entries(SERVICE_CATEGORIES).forEach(([categoryKey, category]) => {
            foundLinks[categoryKey] = {};
            Object.keys(category.services).forEach(domain => {
                foundLinks[categoryKey][domain] = new Set();
            });
        });

        // Search for links in each category
        containers.forEach(container => {
            container.querySelectorAll('a[href]').forEach(link => {
                Object.entries(SERVICE_CATEGORIES).forEach(([categoryKey, category]) => {
                    Object.entries(category.services).forEach(([domain, config]) => {
                        // Use custom domainMatch if provided, otherwise use domain key
                        const matchString = config.domainMatch || domain;

                        if (link.href.includes(matchString)) {
                            let ref = link.href;

                            // Pass corrected coordinates if supported
                            if (categoryKey === 'geochecker' &&
                                "userDefinedCoords" in window &&
                                window.userDefinedCoords?.data?.isUserDefined &&
                                config.passCoords) {
                                const correctedCoordinates = document.getElementById("uxLatLon")?.textContent;
                                if (correctedCoordinates) {
                                    const parameters = config.passCoords(correctedCoordinates);
                                    const url = new URL(ref);
                                    Object.entries(parameters).forEach(([key, value]) => {
                                        url.searchParams.append(key, value);
                                    });
                                    ref = url.toString();
                                }
                            }

                            foundLinks[categoryKey][domain].add(ref);
                        }
                    });
                });
            });
        });

        // Output results
        let totalFound = 0;
        Object.entries(foundLinks).forEach(([categoryKey, domains]) => {
            Object.entries(domains).forEach(([domain, links]) => {
                const linkArray = Array.from(links);
                if (linkArray.length > 0) {
                    log(`${linkArray.length} links found to ${domain} (${categoryKey}):`);
                    linkArray.forEach((link, index) => console.log(`  ${index + 1}. ${link}`));
                    totalFound += linkArray.length;
                }
            });
        });

        if (totalFound === 0 && !hasHqChecker) {
            log('No external links found.');
        } else {
            log(`Total ${totalFound} external links found.`);
            createExternalLinksWidget(foundLinks, hasHqChecker);
        }
    }

    function getImageUrl(categoryKey, domain, url) {
        const config = SERVICE_CATEGORIES[categoryKey]?.services[domain];
        if (!config) return null;

        const param = config.extractParam(url);
        return config.getImageUrl(param);
    }

    function renderLinkElement(link, categoryKey, domain) {
        const imageUrl = getImageUrl(categoryKey, domain, link);
        const displayName = SERVICE_CATEGORIES[categoryKey].services[domain].displayName || domain;

        if (imageUrl) {
            return [
                `<a href="${link}" target="_blank" style="display: block; margin: 5px auto; text-align: center;">`,
                `<img src="${imageUrl}" title="${link}" style="max-width: ${MAX_IMAGE_WIDTH_PX}px; max-height: ${MAX_IMAGE_HEIGHT_PX}px; border: 0;" `,
                `alt="${displayName}" `,
                `onerror="this.onerror=null; this.parentElement.innerHTML='<span style=\\'display:block;padding:5px;background:#f0f0f0;border-radius:3px;text-align:center;\\'>${displayName}</span>';">`,
                '</a>'
            ].join('');
        } else {
            return `<a href="${link}" target="_blank" style="display: block; margin: 5px 0; padding: 5px; background: #f0f0f0; border-radius: 3px; text-align: left;">${displayName}</a>`;
        }
    }

    function createExternalLinksWidget(foundLinks, hasHqChecker = false) {
        const widgetParts = ['<div id="externalLinksWidget" class="CacheDetailNavigationWidget TopSpacing BottomSpacing">'];
        widgetParts.push('<h3 class="WidgetHeader">External Links</h3>');
        widgetParts.push('<div class="WidgetBody" id="GC_ExternalLinks">');

        // Display HQ Cache Checker if available
        if (hasHqChecker) {
            widgetParts.push('<div style="margin-bottom: 15px;">');
            widgetParts.push(`<h4 style="margin: 10px 0 5px 0; font-size: 14px; font-weight: bold;">${SERVICE_CATEGORIES.geochecker.icon} ${SERVICE_CATEGORIES.geochecker.name}</h4>`);
            widgetParts.push(
                '<a href="#ctl00_ContentBody_uxCacheChecker" style="display: block; margin: 5px 0; padding: 10px; border-radius: 3px; text-align: center; text-decoration: none;">',
                '  <svg viewBox="0 0 196 29" class="icon-logo" role="img" aria-labelledby="GeocachingLogo" width="100%" style="fill: #02874d;">',
                '    <use xlink:href="https://www.geocaching.com/images/branding/logo-geocaching.svg#gcLogo"></use>',
                '  </svg>',
                '</a>'
            );
            widgetParts.push('</div>');
        }

        // Display each category
        Object.entries(SERVICE_CATEGORIES).forEach(([categoryKey, category]) => {
            const categoryLinks = foundLinks[categoryKey];
            const hasCategoryLinks = Object.values(categoryLinks).some(links => links.size > 0);

            if (hasCategoryLinks || (categoryKey === 'geochecker' && hasHqChecker)) {
                // Skip header for geochecker if already shown with HQ checker
                if (!(categoryKey === 'geochecker' && hasHqChecker)) {
                    widgetParts.push(`<h4 style="margin: 10px 0 5px 0; font-size: 14px; font-weight: bold;">${category.icon} ${category.name}</h4>`);
                }

                widgetParts.push('<div style="margin-bottom: 15px;">');

                Object.entries(categoryLinks).forEach(([domain, links]) => {
                    const linkArray = Array.from(links);
                    if (linkArray.length > 0) {
                        linkArray.forEach(link => {
                            widgetParts.push(renderLinkElement(link, categoryKey, domain));
                        });
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
    const init = () => setTimeout(findExternalLinks, INIT_DELAY_MS);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
