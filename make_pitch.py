#!/usr/bin/env python3
"""
Scale Studio - Client Pitch Page Generator
Creates a personalized presentation landing file in /p/<slug>.html with custom Open Graph
meta tags so WhatsApp, Telegram, and social networks display the client's name and luxury image in the link preview.

Usage:
  python3 make_pitch.py "دکتر رضایی" perfume [dr-rezaei]
  python3 make_pitch.py "چرم مارال" bag
  python3 make_pitch.py "کلینیک دکتر مقدم" cosmetics
  python3 make_pitch.py "مهندس سلیمانی" realestate
"""

import sys
import os
import re
import urllib.parse

DEMO_CONFIGS = {
    'perfume': {
        'name': 'فروشگاه تخصصی عطر و ادکلن',
        'target': '/perfume/',
        'image': 'https://scailstudio.ir/assets/demo-perfume.webp',
        'desc': 'پیش‌پروژه و پروتوتایپ فروشگاهی مدرن عطر، طراحی و توسعه یافته متناسب با هویت برند'
    },
    'cosmetics': {
        'name': 'فروشگاه لوازم آرایشی و مراقبت پوست',
        'target': '/cosmetics/',
        'image': 'https://scailstudio.ir/assets/demo-cosmetics.webp',
        'desc': 'پیش‌پروژه فروشگاهی مینیمال و پرسرعت آرایشی با انتخابگر تناژ پوست و سبد خرید کشویی'
    },
    'bag': {
        'name': 'گالری کیف و اکسسوری چرم',
        'target': '/bag/',
        'image': 'https://scailstudio.ir/assets/demo-bag.webp',
        'desc': 'شوروم دیجیتال و فروشگاه لوکس اکسسوری چرم با سرعت بارگذاری آنی'
    },
    'realestate': {
        'name': 'سامانه تخصصی املاک و ویلاهای لوکس',
        'target': '/realestate/',
        'image': 'https://scailstudio.ir/assets/demo-badiz.webp',
        'desc': 'پلتفرم هوشمند معرفی و سرمایه‌گذاری ویلاهای لوکس با نقشه تعاملی و استعلام فوری'
    },
    'main': {
        'name': 'استودیو اسکیل (معماری وب فروشگاهی)',
        'target': '/',
        'image': 'https://scailstudio.ir/assets/logo-full.jpg',
        'desc': 'طراحی اختصاصی پلتفرم‌های فروشگاهی نسل جدید با بالاترین سرعت و هویت بصری لوکس'
    }
}

def create_slug(name):
    # Transliterate or clean simple slug
    slug = re.sub(r'[\s_+]+', '-', name.strip())
    # Keep persian or ascii letters/numbers
    slug = re.sub(r'[^\w\-]', '', slug)
    return slug.lower() or 'client'

def generate_pitch(client_name, demo_type='perfume', custom_slug=None):
    demo = DEMO_CONFIGS.get(demo_type, DEMO_CONFIGS['perfume'])
    encoded_name = urllib.parse.quote(client_name)
    slug = custom_slug or create_slug(client_name)
    
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'p')
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, f'{slug}.html')
    
    target_url = f"https://scailstudio.ir{demo['target']}?for={encoded_name}"
    title = f"پیش‌پروژه اختصاصی برای {client_name} | استودیو اسکیل"
    description = f"{demo['desc']} «{client_name}» توسط تیم استودیو اسکیل."
    image_url = demo['image']
    
    html = f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{target_url}">

  <!-- Open Graph / WhatsApp / Telegram Preview -->
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fa_IR">
  <meta property="og:site_name" content="Scale Studio | استودیو اسکیل">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:image" content="{image_url}">
  <meta property="og:image:width" content="800">
  <meta property="og:image:height" content="500">
  <meta property="og:image:alt" content="{title}">
  <meta property="og:url" content="https://scailstudio.ir/p/{slug}.html">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="{image_url}">

  <!-- فونت وزیرمتن و استایل انتقالی لوکس -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;800&display=swap">
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background: #0f0f12;
      color: #f3f3f5;
      font-family: 'Vazirmatn', -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      text-align: center;
      direction: rtl;
    }}
    .pitch-card {{
      max-width: 460px;
      width: 100%;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 36px 28px;
      backdrop-filter: blur(20px);
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
      animation: fadeIn 0.4s ease-out;
    }}
    @keyframes fadeIn {{
      from {{ opacity: 0; transform: translateY(12px); }}
      to {{ opacity: 1; transform: translateY(0); }}
    }}
    .badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 20px;
    }}
    .dot {{
      width: 8px; height: 8px; border-radius: 50%; background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }}
    h1 {{
      font-size: 1.35rem;
      font-weight: 800;
      margin-bottom: 12px;
      line-height: 1.5;
      color: #ffffff;
    }}
    p {{
      color: rgba(255, 255, 255, 0.65);
      font-size: 0.92rem;
      line-height: 1.8;
      margin-bottom: 28px;
    }}
    .btn-enter {{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px 24px;
      border-radius: 14px;
      background: #10b981;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all 0.2s;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.35);
    }}
    .btn-enter:hover {{
      background: #059669;
      transform: translateY(-2px);
    }}
    .spinner {{
      display: inline-block;
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }}
    @keyframes spin {{ to {{ transform: rotate(360deg); }} }}
  </style>

  <!-- هدایت آنی به دموی اصلی با حفظ نام مشتری -->
  <script>
    // هدایت خودکار در ۱ ثانیه برای راحتی کاربر
    setTimeout(function() {{
      window.location.replace("{target_url}");
    }}, 800);
  </script>
</head>
<body>
  <div class="pitch-card">
    <div class="badge">
      <span class="dot"></span>
      <span>پیش‌پروژه اختصاصی</span>
    </div>
    <h1>آماده‌سازی پروتوتایپ برای<br>«{client_name}»</h1>
    <p>در حال انتقال به محیط تعاملی و پرسرعت فروشگاه...</p>
    <a href="{target_url}" class="btn-enter">
      <span class="spinner"></span>
      <span>ورود فوری به پروژه</span>
    </a>
  </div>
</body>
</html>
"""
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    live_url = f"https://scailstudio.ir/p/{slug}.html"
    print(f"✅ صفحه پرزنتیشن اختصاصی ساخته شد:")
    print(f"👉 فایل: {out_file}")
    print(f"🔗 آدرس اشتراک در واتساپ (همراه با عکس و نام): {live_url}")
    print(f"🎯 هدایت مستقیم به: {target_url}")
    return live_url

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("راهنمای استفاده:")
        print('  python3 make_pitch.py "نام مشتری یا برند" [نوع_دمو: perfume|cosmetics|bag|realestate|main] [اسلاگ_اختیاری]')
        sys.exit(1)
    
    name = sys.argv[1]
    demo = sys.argv[2] if len(sys.argv) > 2 else 'perfume'
    custom_slug = sys.argv[3] if len(sys.argv) > 3 else None
    generate_pitch(name, demo, custom_slug)
