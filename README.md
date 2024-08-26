Web Scraper

This Node.js script is designed to analyze a website by discovering internal and external links, checking for common vulnerabilities, and parsing robots.txt and sitemap.xml. It provides a simple way to gather information about a website’s structure and potential issues.

Features:
- Link Discovery: Crawls the website to extract and list internal and external links.
- Vulnerability Check: Checks a predefined list of common paths for potential vulnerabilities.
- Robots.txt Parsing: Retrieves and lists disallowed paths from robots.txt.
- Sitemap.xml Parsing: Retrieves and lists URLs from sitemap.xml.

Prerequisites:
- Node.js: Make sure you have Node.js installed. You can download it from https://nodejs.org/.

Installation:
1. Clone the Repository:
   git clone <repository-url>
   cd <repository-directory>

2. Install Dependencies:
   npm install

Usage:
1. Run the Script:
   node discoverLinks.js

2. Follow Prompts:
   - You will be prompted to enter the website URL. Make sure to provide a valid URL starting with http:// or https://.

Script Details:
- Dependencies:
  - axios: For making HTTP requests.
  - cheerio: For parsing HTML and extracting links.
  - readline-sync: For reading user input from the command line.
  - xml2js: For parsing XML data.

- Source Code:
  - discoverLinks.js: The main script that performs web scraping and analysis.

Legal and Ethical Considerations:
- Permission: Ensure you have explicit permission to scan and analyze the website.
- Respect robots.txt: Abide by the rules specified in the robots.txt file.
- Responsible Use: Use this tool ethically and responsibly to avoid causing any harm to the website or its users.

Troubleshooting:
- Module Not Found: If you encounter errors related to missing modules, make sure all dependencies are correctly installed with npm install.
- Invalid URL: Ensure you provide a valid URL with the correct protocol (http:// or https://).

Contributing:
Feel free to submit issues or pull requests if you find bugs or have suggestions for improvements.
