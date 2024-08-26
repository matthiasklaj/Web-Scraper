const axios = require('axios');
const cheerio = require('cheerio');
const readlineSync = require('readline-sync');
const { URL } = require('url');
const xml2js = require('xml2js');

// List of common paths to check
const VULNERABILITIES = [
    '/admin', '/admin/login', '/admin/config', '/admin/dashboard', 
    '/config', '/backup', '/.env', '/.git', '.git/config', '.git/HEAD', 
    '.git/index', '.git/objects', '.git/refs', '/phpinfo.php', '/test.php', 
    '/login', '/user', '/users', '/api', '/api/v1', '/api/v2', '/api/admin'
];

// Function to fetch and parse robots.txt
async function parseRobotsTxt(url) {
    try {
        const response = await axios.get(new URL('/robots.txt', url).href);
        const lines = response.data.split('\n');
        const disallowed = lines.filter(line => line.startsWith('Disallow:')).map(line => line.split(' ')[1]);
        return disallowed;
    } catch (error) {
        console.error('Failed to fetch robots.txt:', error.message);
        return [];
    }
}

// Function to fetch and parse sitemap.xml
async function parseSitemap(url) {
    try {
        const response = await axios.get(new URL('/sitemap.xml', url).href);
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        const urls = result.urlset.url.map(entry => entry.loc[0]);
        return urls;
    } catch (error) {
        console.error('Failed to fetch sitemap.xml:', error.message);
        return [];
    }
}

// Function to discover links from a page
async function discoverLinks(url, visited = new Set()) {
    const links = new Set();
    if (visited.has(url)) return links;
    visited.add(url);

    try {
        const response = await axios.get(url, { timeout: 5000 });
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            $('a[href]').each((_, element) => {
                const href = $(element).attr('href');
                if (href) {
                    try {
                        const absoluteUrl = new URL(href, url).href;
                        if (!links.has(absoluteUrl)) {
                            links.add(absoluteUrl);
                            if (absoluteUrl.startsWith(url)) {
                                discoverLinks(absoluteUrl, visited); // Recursively crawl internal links
                            }
                        }
                    } catch (error) {
                        // Ignore invalid URLs
                    }
                }
            });
        }
    } catch (error) {
        console.error(`Failed to fetch ${url}: ${error.message}`);
    }
    return links;
}

// Function to check for common vulnerabilities
async function checkForVulnerabilities(url) {
    const vulnerabilities = [];
    for (const path of VULNERABILITIES) {
        const testUrl = new URL(path, url).href;
        try {
            const response = await axios.get(testUrl, { timeout: 5000 });
            if (response.status === 200) {
                vulnerabilities.push(testUrl);
            }
        } catch (error) {
            // Ignore errors and continue
        }
    }
    return vulnerabilities;
}

// Main function
async function main() {
    const baseUrl = readlineSync.question('Please enter the website URL (e.g., http://example.com): ');

    try {
        new URL(baseUrl);
    } catch (e) {
        console.error('Invalid URL. Please provide a valid URL starting with http:// or https://');
        return;
    }

    console.log('Discovering links from the website...');
    const links = await discoverLinks(baseUrl);
    const linksArray = Array.from(links);

    console.log('\nLinks discovered from the website:');
    linksArray.forEach(link => console.log(link));

    console.log('\nChecking for common vulnerabilities...');
    const vulnerabilities = await checkForVulnerabilities(baseUrl);

    if (vulnerabilities.length > 0) {
        console.log('\nPotential vulnerabilities found:');
        vulnerabilities.forEach(url => console.log(url));
    } else {
        console.log('\nNo common vulnerabilities found.');
    }

    console.log('\nParsing robots.txt...');
    const disallowedPaths = await parseRobotsTxt(baseUrl);
    console.log('Disallowed paths from robots.txt:');
    disallowedPaths.forEach(path => console.log(new URL(path, baseUrl).href));

    console.log('\nParsing sitemap.xml...');
    const sitemapUrls = await parseSitemap(baseUrl);
    console.log('URLs from sitemap.xml:');
    sitemapUrls.forEach(url => console.log(url));
}

main();
