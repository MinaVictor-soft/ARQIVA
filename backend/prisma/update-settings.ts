import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const s = await prisma.settings.findFirst();
  if (!s) { console.log('No settings row found'); return; }

  await prisma.settings.update({
    where: { id: s.id },
    data: {
      heroTitle: s.heroTitle || 'We Create Spaces',
      heroTitleAr: s.heroTitleAr || 'نصنع فضاءات',
      heroAccent: s.heroAccent || 'That Inspire',
      heroAccentAr: s.heroAccentAr || 'تُلهم وتبهر',
      heroLabel: s.heroLabel || 'Premium Architecture Studio',
      heroSubtitle: s.heroSubtitle || 'Award-winning architecture and interior design studio crafting timeless environments across the UAE and GCC.',
      heroSubtitleAr: s.heroSubtitleAr || 'استوديو معماري حائز على جوائز يصنع بيئات خالدة.',
      heroCta1Text: s.heroCta1Text || 'View Our Projects',
      heroCta1Url: s.heroCta1Url || '/projects',
      heroCta2Text: s.heroCta2Text || 'Start a Project',
      heroCta2Url: s.heroCta2Url || '/contact',
      statProjects: s.statProjects ?? 47,
      statCountries: s.statCountries ?? 6,
      statValue: s.statValue || '2.4B+',
      tagline: s.tagline || 'Architecture & Interior Design',
      workingHours: s.workingHours || 'Sunday – Thursday: 9:00 AM – 6:00 PM',
      footerTextAr: s.footerTextAr || 'نصنع تجارب معمارية تصمد أمام اختبار الزمن.',
      descriptionAr: s.descriptionAr || 'أرقيفا ستوديو هو مكتب معماري وتصميم داخلي رائد مقره دبي، الإمارات العربية المتحدة.',
      missionAr: s.missionAr || 'تصميم فضاءات ترفع من التجربة الإنسانية من خلال الهندسة المعمارية المتأنية.',
      visionAr: s.visionAr || 'أن نكون أكثر استوديو معماري تأثيراً في منطقة الشرق الأوسط وشمال أفريقيا.',
      addressAr: s.addressAr || 'المستوى 14، برج بولفارد بلازا 1، وسط مدينة دبي، الإمارات',
    },
  });
  console.log('✓ Settings updated with new fields');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
