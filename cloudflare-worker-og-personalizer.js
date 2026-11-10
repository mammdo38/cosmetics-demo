/**
 * Cloudflare Worker: Dynamic Open Graph Personalizer for WhatsApp & Social Media
 * Route: scailstudio.ir/*
 * 
 * What it does:
 * When a social crawler (WhatsApp, Telegram, Facebook, Twitter, LinkedIn) fetches any page
 * with ?for=... or ?client=..., this worker dynamically injects the client's name into
 * og:title and og:description, so WhatsApp link previews show the client's name in bold!
 * For normal visitors, it simply passes through the request without modifying anything.
 */

const SOCIAL_USER_AGENTS = [
  'WhatsApp',
  'facebookexternalhit',
  'TelegramBot',
  'Twitterbot',
  'LinkedInBot',
  'Slackbot'
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';
    
    // Check if request is from a social preview crawler
    const isSocialCrawler = SOCIAL_USER_AGENTS.some(bot => userAgent.includes(bot));
    
    const clientParam = url.searchParams.get('for') || url.searchParams.get('client') || url.searchParams.get('brand');
    
    // Fetch origin response from GitHub Pages
    const response = await fetch(request);
    
    // If it's a crawler and client parameter is present, modify the HTML in flight
    if (isSocialCrawler && clientParam) {
      const clientName = decodeURIComponent(clientParam).replace(/[_+]/g, ' ');
      
      class MetaRewriter {
        element(element) {
          const property = element.getAttribute('property') || element.getAttribute('name');
          if (property === 'og:title' || property === 'twitter:title') {
            element.setAttribute('content', `پیش‌پروژه اختصاصی برای «${clientName}» | استودیو اسکیل`);
          } else if (property === 'og:description' || property === 'twitter:description') {
            element.setAttribute('content', `پروتوتایپ فروشگاهی نسل جدید طراحی و آماده‌سازی شده متناسب با نیازهای «${clientName}» توسط استودیو اسکیل.`);
          }
        }
      }

      return new HTMLRewriter()
        .on('meta[property="og:title"]', new MetaRewriter())
        .on('meta[name="twitter:title"]', new MetaRewriter())
        .on('meta[property="og:description"]', new MetaRewriter())
        .on('meta[name="twitter:description"]', new MetaRewriter())
        .transform(response);
    }
    
    return response;
  }
};
