/**
 * EduTrack Asset Constants
 * High-fidelity generated imagery
 */

import loginCampusHero from './assets/images/login_campus_hero_1790578026647.jpg';
import dashboardBanner from './assets/images/dashboard_banner_1790578046603.jpg';
import adminAvatar from './assets/images/admin_avatar_1790578057644.jpg';
import modernClassroom from './assets/images/modern_classroom_1790578781489.jpg';
import libraryStudy from './assets/images/library_study_1790578800804.jpg';
import teacherFemale from './assets/images/teacher_portrait_female_1790579206751.jpg';
import teacherMale from './assets/images/teacher_portrait_male_1790579220576.jpg';
import studentFemale from './assets/images/student_portrait_female_1790579235646.jpg';
import studentMale from './assets/images/student_portrait_male_1790579251924.jpg';

export const ASSETS = {
  loginCampusHero,
  dashboardBanner,
  adminAvatar,
  modernClassroom,
  libraryStudy,
  portraits: {
    teacherFemale,
    teacherMale,
    studentFemale,
    studentMale,
  },
  avatars: {
    admin: adminAvatar,
    teacher1: teacherFemale,
    teacher2: teacherMale,
    teacher3: teacherFemale,
    teacher4: teacherMale,
    teacher5: teacherMale,
    teacher6: teacherFemale,
    teacher7: teacherMale,
    teacher8: teacherFemale,
    student1: studentMale,
    student2: studentFemale,
    student3: studentMale,
    student4: studentFemale,
    student5: studentMale,
    student6: studentFemale,
    student7: studentMale,
    student8: studentFemale,
  }
};

/**
 * Returns a guaranteed fallback SVG avatar with user initials if an image fails to load
 */
export function getInitialsAvatarSvg(name: string, bg = '#0F2747', fg = '#FFFFFF'): string {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('') || 'ED';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="${bg}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="${fg}" font-family="sans-serif" font-size="38" font-weight="bold">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

