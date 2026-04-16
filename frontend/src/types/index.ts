export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  referral_code: string;
  bonus_points: number;
  is_staff: boolean;
}

export interface Course {
  id: number;
  name: string;
  direction: string;
  direction_display: string;
  description: string;
  price: number;
  status: string;
  image: string | null;
  created_at: string;
}

export interface CourseApplication {
  id: number;
  name: string;
  phone: string;
  course: number;
  course_name: string;
  status: string;
  created_at: string;
}

export interface TeacherCertImage {
  id: number;
  title: string;
  image: string;
  order: number;
}

export interface Teacher {
  id: number;
  full_name: string;
  direction: string;
  direction_display: string;
  bio: string;
  about: string;
  photo: string | null;
  experience_years: number;
  certificates: string;
  certificates_list: string[];
  certificate_images?: TeacherCertImage[];
}

export interface Certificate {
  id: number;
  student_name: string;
  certificate_name: string;
  score: string;
  image: string | null;
  created_at?: string;
}

export interface Comment {
  id: number;
  user: number;
  user_name: string;
  text: string;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  category_display: string;
  content: string;
  author: number;
  author_name: string;
  status: string;
  image: string | null;
  reading_time: number;
  comments_count: number;
  created_at: string;
  comments?: Comment[];
  updated_at?: string;
}

export interface MockApplication {
  id: number;
  name: string;
  phone: string;
  test_type: string;
  test_type_display: string;
  note: string;
  status: string;
  status_display: string;
  created_at: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  working_hours: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface BonusReward {
  id: number;
  name: string;
  points_required: number;
  is_active: boolean;
}

export interface BonusRequest {
  id: number;
  user: number;
  reward: number;
  reward_name: string;
  user_name: string;
  points_required: number;
  status: string;
  created_at: string;
}

export interface ReferralHistory {
  id: number;
  referrer: number;
  referred: number;
  referrer_name: string;
  referred_name: string;
  points_earned: number;
  created_at: string;
}

export interface AdminStats {
  total_students: number;
  new_applications_today: number;
  new_mock_requests: number;
  pending_bonus_requests: number;
  total_teachers: number;
  total_courses: number;
  total_blog_posts: number;
  unread_messages: number;
}

export interface BlogImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface LevelTest {
  id: number;
  title: string;
  description: string;
  time_limit: number;
  is_active: boolean;
  questions_count: number;
  questions?: Question[];
  created_at: string;
}

export interface Question {
  id: number;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct?: string;
  order: number;
}

export interface TestResultData {
  id: number;
  test: number;
  test_title: string;
  name: string;
  phone: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  level: string;
  level_description: string;
  time_spent: number;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  site_description: string;
  logo: string | null;
  phone_1: string;
  phone_2: string;
  email: string;
  address: string;
  telegram: string;
  instagram: string;
  youtube: string;
  facebook: string;
  tiktok: string;
  weekday_hours: string;
  weekend_hours: string;
  weekday_label: string;
  weekend_label: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string | null;
  stats_students: string;
  stats_experience: string;
  stats_teachers: string;
  stats_branches: string;
  meta_title: string;
  meta_description: string;
}
