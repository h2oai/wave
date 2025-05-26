const puppeteer = require('puppeteer');
const fs = require('fs');
const { PDFDocument, rgb, StandardFonts, PDFName } = require('pdf-lib');
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

    console.log(`Scraping: ${nextPageUrl}`);
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

    // to expand tabbed panels. This config works best but need to explore more options
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

    // Converting  relative links to absolute
    document.querySelectorAll('a[href^="/"]').forEach((a) => {
      a.href = new URL(a.getAttribute('href'), window.location.origin).href;
    });

    // force inject CSS to fix wide tables - temporary fix
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

    // wrap all tables in a wrapper for horizontal scroll
    document.querySelectorAll('table').forEach(table => {
      if (!table.parentNode.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  });
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
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

      // extracting page title for TOC - need to check with a different selector
      const pageTitle = await page.evaluate(() => {
        return document.querySelector('h1')?.textContent || document.title;
      });

      // wait for all images to load before generating PDF 
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
            top: '25mm',
            bottom: '20mm',
            left: '15mm',
            right: '15mm',
        },
        displayHeaderFooter: true,
        headerTemplate: `
            <style>
            .header {
                font-size: 12px;
                color: #333;
                width: 100%;
                text-align: center;
                padding-bottom: 8px;
            }
            </style>
            <div class="header">H2O Wave Documentation</div>
        `,
        footerTemplate: `
            <div class="footer">
            </div>
        `,
        });


      pdfBuffers.push({
        buffer: pdfBuffer,
        title: pageTitle,
        url: url
      });
    } catch (error) {
      console.error(`Error generating PDF for ${url}: ${error.message}`);
    }
  }

  return pdfBuffers;
}

async function createToc(pdfEntries) {
  const tocDoc = await PDFDocument.create();
  const page = tocDoc.addPage([595, 842]); // A4 size

  // Add the TOC title - experiment with different fonts and sizes
  page.drawText('Table of Contents', {
    x: 50,
    y: 750,
    size: 18,
    color: rgb(0, 0, 0)
  });

  // Add entries 
  let yPosition = 700;
  let currentPage = 2; // to only start after TOC and cover page

  for (const entry of pdfEntries) {
    const loadedPdf = await PDFDocument.load(entry.buffer);
    const pageCount = loadedPdf.getPageCount();
    
    page.drawText(entry.title, {
      x: 50,
      y: yPosition,
      size: 12
    });
    
    page.drawText(currentPage.toString(), {
      x: 500,
      y: yPosition,
      size: 12
    });
    
    yPosition -= 20;
    currentPage += pageCount;
  }

  return await tocDoc.save();
}


async function mergePdfsWithToc(pdfEntries) {
  const mergedPdf = await PDFDocument.create();
  const tocPdf = await createToc(pdfEntries);

  //loading the TOC PDF and add its pages first, otherwise it wont be formatted correctly
  const tocDoc = await PDFDocument.load(tocPdf);
  const tocPages = await mergedPdf.copyPages(tocDoc, tocDoc.getPageIndices());
  tocPages.forEach(page => mergedPdf.addPage(page));


  const sectionFirstPages = {};

    // Add content pages and record first page for each section
    for (const entry of pdfEntries) {
        const pdf = await PDFDocument.load(entry.buffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page, i) => {
        mergedPdf.addPage(page);
        if (i === 0) {
            // Store the page ref for this sections first page
            sectionFirstPages[entry.title] = page;
        }
        });
    }

  const tocPage = mergedPdf.getPage(0);
  const tocFont = await mergedPdf.embedFont(StandardFonts.Helvetica);
  let tocY = 700;

  for (const entry of pdfEntries) {
    const targetPage = sectionFirstPages[entry.title];
    if (!targetPage) continue;

    // should find a better way to get the page number
    tocPage.drawText(entry.title, {
      x: 50,
      y: tocY,
      size: 12,
      font: tocFont,
      color: rgb(0, 0, 1),
    });


    const annotation = mergedPdf.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [50, tocY, 300, tocY + 15],  
      Border: [0, 0, 0],
      A: {
        Type: 'Action',
        S: 'GoTo',
        D: [targetPage.ref, 'Fit'],
      },
    });

    const annots = tocPage.node.lookup(PDFName.of('Annots')) || mergedPdf.context.obj([]);
    annots.push(annotation);
    tocPage.node.set(PDFName.of('Annots'), annots);

    tocY -= 20;
  }

const totalPages = mergedPdf.getPageCount();
const font = await mergedPdf.embedFont(StandardFonts.Helvetica);
const fontSize = 10;
const marginBottom = 20;

for (let i = 0; i < totalPages; i++) {
  const page = mergedPdf.getPage(i);
  const { width, height } = page.getSize();

  const text = `Page ${i + 1} of ${totalPages}`;

  page.drawText(text, {
    x: width / 2 - (font.widthOfTextAtSize(text, fontSize) / 2),
    y: marginBottom,
    size: fontSize,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
}

  return await mergedPdf.save();
}


async function main() {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--font-render-hinting=none'] 
  });
  const page = await browser.newPage();

  try {
    const MAX_PAGES = Infinity; // Only for testing, set to Infinity for all pages when actually generating the PDF
    const urls = await getAllPageUrls(page, MAX_PAGES);
    console.log(`Found ${urls.length} pages.`);

    const pdfEntries = await generatePdfBuffers(page, urls);
    const finalPdf = await mergePdfsWithToc(pdfEntries);

    fs.writeFileSync(OUTPUT_FILENAME, finalPdf);
    console.log(`Success. PDF saved as ${OUTPUT_FILENAME}`);
  } catch (err) {
    console.error('Failed. Error generating PDF:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
