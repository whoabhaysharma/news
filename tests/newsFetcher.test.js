import { fetchNews } from '../src/utils/newsFetcher.js';

jest.setTimeout(20000);

describe('fetchNews', () => {
  test('throws when url not provided', async () => {
    await expect(fetchNews()).rejects.toThrow('RSS URL is required');
  });

  test('fetches and returns news structure for a valid RSS url', async () => {
    const url = 'https://news.google.com/rss';
    const data = await fetchNews(url);
    expect(data).toHaveProperty('channelTitle');
    expect(data).toHaveProperty('articles');
    expect(Array.isArray(data.articles)).toBe(true);
  });
});
