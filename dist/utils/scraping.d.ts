import { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
export declare function fetchHTML(url: string, options?: AxiosRequestConfig): Promise<string>;
export declare function parseHTML(html: string): cheerio.CheerioAPI;
export declare function sleep(ms: number): Promise<void>;
//# sourceMappingURL=scraping.d.ts.map