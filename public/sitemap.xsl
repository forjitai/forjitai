<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

<xsl:output method="html" encoding="UTF-8" indent="yes" />

<xsl:template match="/">
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>XML Sitemap — Forjit AI</title>
      <meta name="robots" content="noindex, follow" />
      <style>
        body {
          margin: 0;
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
          background: #0c0a09;
          color: #e7e5e4;
          line-height: 1.6;
        }
        .container { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
        header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          border-bottom: 1px solid #292524;
          margin-bottom: 24px;
        }
        .logo-mark {
          width: 40px; height: 40px;
          background: #fbbf24; color: #0c0a09;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 20px;
        }
        h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #fbbf24;
          opacity: 0.7;
          margin-top: 2px;
        }
        .info {
          background: #1c1917;
          border: 1px solid #292524;
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 24px;
          font-size: 14px;
          color: #a8a29e;
        }
        .info strong { color: #e7e5e4; }
        .info code {
          background: #0c0a09;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          color: #fbbf24;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: #1c1917;
          border: 1px solid #292524;
          border-radius: 8px;
          overflow: hidden;
        }
        th {
          background: #292524;
          color: #fbbf24;
          text-align: left;
          font-weight: 600;
          padding: 12px 16px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        td {
          padding: 14px 16px;
          border-top: 1px solid #292524;
          font-size: 13px;
          vertical-align: top;
        }
        tr:hover td { background: rgba(251, 191, 36, 0.03); }
        td a {
          color: #fbbf24;
          text-decoration: none;
          word-break: break-all;
        }
        td a:hover { text-decoration: underline; }
        .priority, .changefreq {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
          background: #292524;
          color: #a8a29e;
        }
        .lastmod {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #78716c;
        }
        footer {
          margin-top: 32px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #78716c;
          text-align: center;
        }
        footer a { color: #fbbf24; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <div class="logo-mark">F</div>
          <div>
            <h1>XML Sitemap</h1>
            <div class="tag">Forjit AI · initial phase</div>
          </div>
        </header>

        <div class="info">
          <strong>This is the machine-readable sitemap</strong> — it helps search engines (Google, Bing, etc.) discover and crawl all pages on <code>www.forjitai.in</code>. If you're human, visit the <a style="color:#fbbf24;" href="/sitemap">readable sitemap</a> or go <a style="color:#fbbf24;" href="/">home</a>.
          <br /><br />
          Total URLs: <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong>
        </div>

        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Frequency</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                </td>
                <td>
                  <span class="lastmod"><xsl:value-of select="sitemap:lastmod"/></span>
                </td>
                <td>
                  <span class="changefreq"><xsl:value-of select="sitemap:changefreq"/></span>
                </td>
                <td>
                  <span class="priority"><xsl:value-of select="sitemap:priority"/></span>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>

        <footer>
          Generated by Forjit AI · <a href="/">Home</a> · <a href="/sitemap">Human Sitemap</a> · <a href="/robots.txt">robots.txt</a>
        </footer>
      </div>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>
