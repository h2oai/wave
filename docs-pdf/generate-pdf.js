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
