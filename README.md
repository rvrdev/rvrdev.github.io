# Rayan Reynaldo - Mid Level Full-Stack Engineer Portfolio

Professional portfolio built with Next.js 16, TypeScript, and Tailwind CSS. Showcasing 2+ years of full-stack development experience.

## Stack

- **Frontend**: React.js, Next.js, TypeScript
- **Backend**: Node.js/Express, PHP/Laravel, Python/FastAPI
- **Databases**: PostgreSQL, MySQL, Redis
- **DevOps**: Docker, CI/CD, Git

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans & Geist Mono
- **Deployment**: Optimized for Vercel/GitHub Pages

## Getting Started

### Prerequisites
- Node.js 20+ installed
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rvrdev/rvrdev.github.io.git
cd rvrdev.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## Project Structure

```
├── app/
│   ├── page.tsx          # Main portfolio page with all sections
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles and Tailwind config
├── public/               # Static assets (images, icons)
└── package.json          # Dependencies and scripts
```

## Portfolio Sections

### 1. Hero Section
- Name, title, professional summary
- Technology stack badges
- Key statistics
- **Customize**: Edit hero section in `app/page.tsx`

### 2. About Me
- Core competencies
- Technical expertise
- **Customize**: Edit about section in `app/page.tsx`

### 3. Skills Overview
Six categories: Frontend, Backend, Databases, DevOps/Cloud, Tools/Platforms, Soft Skills
- **Customize**: Edit skills section in `app/page.tsx`

### 4. Featured Projects
Four projects with tech stack, architecture, impact metrics, and challenges solved:
1. Enterprise Payment Gateway Platform
2. Real-Time Analytics Dashboard (SaaS)
3. E-Commerce Marketplace Platform
4. Content Management System (Headless CMS)

**Customize**: Edit projects section in `app/page.tsx`

### 5. Experience Timeline
Two positions with quantified achievements:
- Mid Level Full-Stack Engineer (2023 – Present)
- Full-Stack Developer (2022 – 2023)

**Customize**: Edit experience section in `app/page.tsx`

### 6. Education & Certifications
- Bachelor of Science in Information Technology
- AWS Solutions Architect, Docker Certified, PSM I
- **Customize**: Edit education section in `app/page.tsx`

### 7. Contact Section
GitHub, LinkedIn, Email, Website links
**Customize**: Edit contact section in `app/page.tsx`

## Customization Guide

### Update Personal Information

1. **Name & Title** (app/page.tsx, lines 7-12):
```tsx
<h1>Your Name</h1>
<h2>Your Title</h2>
```

2. **Email** (app/page.tsx, line 584):
```tsx
href="mailto:your.email@example.com"
```

3. **LinkedIn URL** (app/page.tsx, line 573):
```tsx
href="https://linkedin.com/in/your-profile"
```

4. **GitHub URL** (app/page.tsx, line 562):
```tsx
href="https://github.com/yourusername"
```

### Update Projects

Replace placeholder projects with your real projects:
1. Find the project section (lines 139-402)
2. Update project name, description, and tech stack
3. Replace placeholder metrics with actual data
4. Add real GitHub/demo links

### Update Experience

Modify company names and dates:
1. Locate Experience Timeline section (lines 405-520)
2. Replace company names and dates
3. Update achievement descriptions with your real accomplishments
4. Keep metrics-focused language (percentages, dollar amounts, user counts)

### Update Education

1. Find Education section (lines 523-552)
2. Replace university name and dates
3. Update certifications list

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (automatic configuration for Next.js)

### Deploy to GitHub Pages

1. Update `next.config.js`:
```js
module.exports = {
  output: 'export',
  basePath: '/rvrdev.github.io',
  images: { unoptimized: true }
}
```

2. Build and export:
```bash
npm run build
```

3. Deploy the `out/` folder to GitHub Pages

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

- Responsive design
- Dark mode
- SEO optimized
- Performance optimized (Lighthouse 95+)
- WCAG accessible
- TypeScript
- Tailwind CSS
- Next.js 16

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this portfolio template for your own projects.

## Contact

**Rayan Reynaldo**
Email: rayan.reynaldo@example.com
GitHub: [@rvrdev](https://github.com/rvrdev)
LinkedIn: [rayan-reynaldo](https://linkedin.com/in/rayan-reynaldo)

---

Built with Next.js 16 & Tailwind CSS
