const puppeteer = require('puppeteer');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const path = require('path');

const START_URL = 'https://wave.h2oai.com/docs/getting-started';
const PAGINATION_SELECTOR = 'a.pagination-nav__link.pagination-nav__link--next';
const OUTPUT_FILENAME = 'wave-documentation.pdf';

async function getAllPageUrls(page, maxPages = Infinity) {
  const urls = [];
  let nextPageUrl = START_URL;

  while (nextPageUrl) {
    if (urls.length >= maxPages) break;
    if (urls.includes(nextPageUrl)) break;

    console.log(`Visiting: ${nextPageUrl}`);
    await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
    urls.push(nextPageUrl);

    const nextHref = await page.evaluate((sel) => {
      const nextLink = document.querySelector(sel);
      return nextLink?.href || null;
    }, PAGINATION_SELECTOR);

    if (!nextHref) break;
    nextPageUrl = nextHref;
  }

  return urls;
}

async function cleanupDom(page) {
  await page.evaluate(() => {
    // Remove footer along w the cookie banners
    document.querySelector('footer')?.remove();
    document.querySelector('section.notice')?.remove();

    // to expand tabbed panels. This config works best
    document.querySelectorAll('.tabs-container').forEach(tabsContainer => {
      const tabButtons = tabsContainer.querySelectorAll('[role="tab"]');
      const tabPanels = tabsContainer.querySelectorAll('[role="tabpanel"]');

      tabPanels.forEach((panel, i) => {
        panel.style.display = 'block';
        panel.style.visibility = 'visible';
        panel.style.position = 'static';
        panel.style.height = 'auto';
        panel.style.opacity = '1';

        const originalTabButton = tabButtons[i];
        if (originalTabButton) {
          const clonedTabButton = originalTabButton.cloneNode(true);
          clonedTabButton.style.display = 'inline-block';
          clonedTabButton.style.padding = '6px 12px';
          clonedTabButton.style.marginBottom = '8px';
          clonedTabButton.style.border = '1px solid #ccc';
          clonedTabButton.style.borderRadius = '4px';
          clonedTabButton.style.backgroundColor = '#f0f0f0';
          clonedTabButton.style.color = '#333';
          clonedTabButton.style.fontWeight = 'bold';
          panel.parentNode.insertBefore(clonedTabButton, panel);
        }
      });

      const tabList = tabsContainer.querySelector('[role="tablist"]');
      if (tabList) tabList.style.display = 'none';
    });

    // Converting image URLs to absolute - we need to do this because some images are relative
    document.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http')) {
        img.src = new URL(src, window.location.origin).href;
      }
    });

    // Converting t relative links to absolute
    document.querySelectorAll('a[href^="/"]').forEach((a) => {
      a.href = new URL(a.getAttribute('href'), window.location.origin).href;
    });

    // force inject CSS to fix wide tables
    const style = document.createElement('style');
    style.textContent = `
      table {
        table-layout: fixed !important;
        width: 100% !important;
        max-width: 100% !important;
        border-collapse: collapse;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      th, td {
        word-break: break-word !important;
        white-space: normal !important;
        overflow-wrap: break-word !important;
        max-width: 200px; /* Adjust max width per cell as needed */
        padding: 8px !important;
        border: 1px solid #ddd !important;
      }
      /* Optional: wrap tables in a scroll container if needed */
      .table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        margin-bottom: 1em;
      }
    `;
    document.head.appendChild(style);
  });
}


async function generatePdfBuffers(page, urls) {
  const pdfBuffers = [];
  page.setDefaultNavigationTimeout(120_000);
  page.setDefaultTimeout(120_000);

  for (const [index, url] of urls.entries()) {
    try {
      console.log(`Generating PDF for ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2' });

      await cleanupDom(page);
      await autoScroll(page);

      // Wait for all images to load - important as most images are lazy loaded
      await page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.all(images.map(img =>
          img.complete ? Promise.resolve() :
            new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            })
        ));
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '15mm',
          right: '15mm',
        },
        displayHeaderFooter: false,
        footerTemplate: `
          <div style="font-size:10px; color: #999; width:100%; text-align:center; margin:0 auto;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>`,
        headerTemplate: '<div></div>',
      });

      pdfBuffers.push(pdfBuffer);
    } catch (error) {
      console.error(`Error ingenerating PDF for ${url}: ${error.message}`);
    }
  }

  return pdfBuffers;
}

async function mergePdfs(pdfBuffers) {
  const mergedPdf = await PDFDocument.create();

  for (const pdfBytes of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    // const MAX_PAGES = 25;  // Limit pages crawled and processed (only for testing purposes!!)
    const urls = await getAllPageUrls(page); //, MAX_PAGES);
    console.log(`Found ${urls.length} pages.`);

    const pdfBuffers = await generatePdfBuffers(page, urls);
    const mergedPdf = await mergePdfs(pdfBuffers);

    fs.writeFileSync(OUTPUT_FILENAME, mergedPdf);
    console.log(`Success. PDF saved as ${OUTPUT_FILENAME}`);
  } catch (err) {
    console.error('Failed. Error generating PDF:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
