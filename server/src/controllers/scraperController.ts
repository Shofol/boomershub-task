import { Request, Response, NextFunction } from "express";
import puppeteer from "puppeteer-core";

export class ScraperController {
  static async getProvider(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const browser = await puppeteer.launch({
        headless: "new",
        executablePath:
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.goto("https://txhhs.my.site.com/TULIP/s/ltc-provider-search");
      await page.click("#combobox-button-6");
      await page.click("#combobox-button-6-0-6");

      await page.click("#combobox-button-10");
      await page.click("#combobox-button-10-1-10");

      await page.type("#input-14", "BROOKDALE CREEKSIDE");

      await page.click(
        "body > div.siteforcePrmBody > div.cCenterPanel.slds-m-top--x-large.slds-p-horizontal--medium > div > div > div > div > div.cb-section_row.slds-grid.slds-wrap.slds-large-nowrap > div > div > div:nth-child(2) > c-rs_-t-u-l-i-p_-l-t-c-search > div.mainContent > div.contentBackground > div.buttonContainer > button.contentButton2"
      );

      // Wait for the table to load
      await page.waitForSelector(
        "body > div.siteforcePrmBody > div.cCenterPanel.slds-m-top--x-large.slds-p-horizontal--medium > div > div > div > div > div.cb-section_row.slds-grid.slds-wrap.slds-large-nowrap > div > div > div:nth-child(2) > c-rs_-t-u-l-i-p_-l-t-c-search > div.mainContent > div.lightningTableContainer",
        { visible: true }
      );

      // wait for the table to load
      await page.waitForSelector(
        "body > div.siteforcePrmBody > div.cCenterPanel.slds-m-top--x-large.slds-p-horizontal--medium > div > div > div > div > div.cb-section_row.slds-grid.slds-wrap.slds-large-nowrap > div > div > div:nth-child(2) > c-rs_-t-u-l-i-p_-l-t-c-search > div.mainContent > div.lightningTableContainer > div:nth-child(1) > lightning-datatable > div.dt-outer-container > div > div > table > tbody > tr",
        { visible: true }
      );

      const row =
        "body > div.siteforcePrmBody > div.cCenterPanel.slds-m-top--x-large.slds-p-horizontal--medium > div > div > div > div > div.cb-section_row.slds-grid.slds-wrap.slds-large-nowrap > div > div > div:nth-child(2) > c-rs_-t-u-l-i-p_-l-t-c-search > div.mainContent > div.lightningTableContainer > div:nth-child(1) > lightning-datatable > div.dt-outer-container > div > div > table > tbody > tr >";

      // get the address from the table
      const providerName = await page.$eval(
        `${row} th`,
        (el) => el.innerText || ""
      );

      const address = await page.$eval(
        `${row} td:nth-child(2)`,
        (el) => el.innerText || ""
      );

      const city = await page.$eval(
        `${row} td:nth-child(3)`,
        (el) => el.innerText || ""
      );

      const county = await page.$eval(
        `${row} td:nth-child(4)`,
        (el) => el.innerText || ""
      );

      const zipcode = await page.$eval(
        `${row} td:nth-child(5)`,
        (el) => el.innerText || ""
      );

      await browser.close();

      res.json({
        success: true,
        data: {
          provider: {
            providerName,
            address,
            city,
            county,
            zipcode,
          },
        },
        message: "Page loaded and form filled with specified values",
      });
    } catch (error) {
      next(error);
    }
  }
}
