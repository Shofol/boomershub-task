import { Request, Response, NextFunction } from "express";
import puppeteer from "puppeteer-core";
import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser";
import { PropertyController } from "./propertyController";

export class ScraperController {
  static async getPropertyNames(): Promise<string[]> {
    const csvPath = path.join(
      __dirname,
      "../../assets/Sample_Properties_Data.csv"
    );
    const propertyNames: string[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row: any) => {
          if (row.Name && row.Name.trim()) {
            propertyNames.push(row.Name.trim());
          }
        })
        .on("end", () => {
          resolve(propertyNames);
        })
        .on("error", (error: any) => {
          reject(error);
        });
    });
  }

  static async scrapeProperties(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Read property names from CSV file
      const propertyNames = await ScraperController.getPropertyNames();

      if (propertyNames.length === 0) {
        res.status(400).json({
          success: false,
          message: "No property names found in CSV file",
        });
        return;
      }

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

      const scrapedProperties = [];

      // Scrape data for each property in the CSV
      for (const propertyName of propertyNames) {
        try {
          // Clear the input field and type the property name
          await page.click("#input-14");
          await page.keyboard.down("Control");
          await page.keyboard.press("KeyA");
          await page.keyboard.up("Control");
          await page.type("#input-14", propertyName);

          await page.click(
            "body > div.siteforcePrmBody > div.cCenterPanel.slds-m-top--x-large.slds-p-horizontal--medium > div > div > div > div > div.cb-section_row.slds-grid.slds-wrap.slds-large-nowrap > div > div > div:nth-child(2) > c-rs_-t-u-l-i-p_-l-t-c-search > div.mainContent > div.contentBackground > div.buttonContainer > button.contentButton2"
          );

          // Wait for the table to load
          await page.waitForSelector(
            "body > div.siteforcePrmBody > div.cCenterPanel.slds-m-top--x-large.slds-p-horizontal--medium > div > div > div > div > div.cb-section_row.slds-grid.slds-wrap.slds-large-nowrap > div > div > div:nth-child(2) > c-rs_-t-u-l-i-p_-l-t-c-search > div.mainContent > div.lightningTableContainer",
            { visible: true, timeout: 10000 }
          );

          // Wait for the table rows to load
          await page.waitForSelector(
            "body > div.siteforcePrmBody > div.cCenterPanel.slds-m-top--x-large.slds-p-horizontal--medium > div > div > div > div > div.cb-section_row.slds-grid.slds-wrap.slds-large-nowrap > div > div > div:nth-child(2) > c-rs_-t-u-l-i-p_-l-t-c-search > div.mainContent > div.lightningTableContainer > div:nth-child(1) > lightning-datatable > div.dt-outer-container > div > div > table > tbody > tr",
            { visible: true, timeout: 10000 }
          );

          const row =
            "body > div.siteforcePrmBody > div.cCenterPanel.slds-m-top--x-large.slds-p-horizontal--medium > div > div > div > div > div.cb-section_row.slds-grid.slds-wrap.slds-large-nowrap > div > div > div:nth-child(2) > c-rs_-t-u-l-i-p_-l-t-c-search > div.mainContent > div.lightningTableContainer > div:nth-child(1) > lightning-datatable > div.dt-outer-container > div > div > table > tbody > tr >";

          // Get the data from the table
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

          // Save scraped data to database
          const scrapedData = {
            providerName,
            address,
            city,
            county,
            zipcode,
            state: "TEXAS",
          };

          await PropertyController.saveScrapedProperty(
            scrapedData,
            propertyName
          );

          scrapedProperties.push({
            name: propertyName,
            provider: {
              providerName,
              address,
              city,
              county,
              zipcode,
            },
          });

          // Wait a bit before scraping the next property
          await page.waitForTimeout(2000);
        } catch (error) {
          console.error(`Error scraping property ${propertyName}:`, error);
          // Continue with next property even if one fails
        }
      }

      await browser.close();

      res.json({
        success: true,
        data: {
          scrapedProperties,
          totalScraped: scrapedProperties.length,
          availableProperties: propertyNames,
        },
        message: `Successfully scraped ${scrapedProperties.length} properties from CSV. Data saved to database.`,
      });
    } catch (error) {
      next(error);
    }
  }

  // Test endpoint to verify CSV reading
  static async testCSVReading(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const propertyNames = await ScraperController.getPropertyNames();

      res.json({
        success: true,
        data: {
          propertyNames,
          count: propertyNames.length,
        },
        message: `Successfully read ${propertyNames.length} property names from CSV`,
      });
    } catch (error) {
      next(error);
    }
  }
}
