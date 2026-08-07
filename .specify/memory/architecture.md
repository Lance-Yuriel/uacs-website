# Architecture Snapshot
> Auto-generated. Do not edit manually. Regenerate with `.specify/scripts/codebase-snapshot.sh`.

Generated: 2026-08-07T05:10:49Z

## Source File Tree
```
src/app/admin/events/page.tsx
src/app/admin/login/page.tsx
src/app/admin/page.tsx
src/app/api/events/[id]/route.ts
src/app/api/events/route.ts
src/app/api/members/route.ts
src/app/layout.tsx
src/app/page.tsx
src/components/admin/EventForm.tsx
src/components/events/EventCard.tsx
src/components/events/EventGallery.tsx
src/components/events/EventModal.tsx
src/components/events/EventYearSection.tsx
src/components/events/PastEventCard.tsx
src/components/events/UpcomingEventCard.tsx
src/components/events/index.ts
src/components/home/About.tsx
src/components/home/Constitution.tsx
src/components/home/Hero.tsx
src/components/home/HeroMemberCount.tsx
src/components/home/MemberCounter.tsx
src/components/home/index.ts
src/components/layout/AutoHideScrollbar.tsx
src/components/layout/DynamicNavbar.tsx
src/components/layout/Footer.tsx
src/components/layout/Navbar.tsx
src/components/layout/PillNavbar.tsx
src/components/layout/ScrollToTop.tsx
src/components/layout/Section.tsx
src/components/layout/SmartSnapScroll.tsx
src/components/layout/index.ts
src/components/ui/Badge.tsx
src/components/ui/Button.tsx
src/components/ui/Card.tsx
src/components/ui/EmptyState.tsx
src/components/ui/GradientText.tsx
src/components/ui/LiquidEther.tsx
src/components/ui/LoadingSpinner.tsx
src/components/ui/TiltedCard.tsx
src/components/ui/index.ts
src/contexts/AuthContext.tsx
src/hooks/useActiveSection.ts
src/lib/events.ts
src/lib/firebase-admin.ts
src/lib/firebase.ts
src/lib/googleSheets.ts
src/lib/utils.ts
src/types/database.ts
src/types/event.ts
src/types/navigation.ts
src/types/site.ts
```

## Dependencies (package.json)
```json
{
  "@tanstack/react-query": "^5.90.5",
  "@types/three": "^0.180.0",
  "clsx": "^2.1.1",
  "firebase": "^12.14.0",
  "firebase-admin": "^14.0.0",
  "framer-motion": "^12.23.24",
  "googleapis": "^164.0.0",
  "gsap": "^3.13.0",
  "lucide-react": "^0.546.0",
  "next": "15.5.6",
  "react": "19.1.0",
  "react-bits": "^1.0.5",
  "react-dom": "19.1.0",
  "tailwind-merge": "^3.3.1",
  "three": "^0.180.0"
}
```

## Dev Dependencies
```json
{
  "@eslint/eslintrc": "^3",
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "dotenv": "^17.2.3",
  "eslint": "^9",
  "eslint-config-next": "15.5.6",
  "tailwindcss": "^4",
  "tsx": "^4.20.6",
  "typescript": "^5"
}
```

## API Routes
- `/api/events/[id]` → [GET,PUT,DELETE]
- `/api/events` → [GET,POST]
- `/api/members` → [GET]

## Exported Components
components//ui/GradientText.tsx:11:export default function GradientText({
components//ui/Card.tsx:4:export interface CardProps {
components//ui/Card.tsx:44:export interface CardHeaderProps {
components//ui/Card.tsx:65:export interface CardContentProps {
components//ui/Card.tsx:86:export interface CardTitleProps {
components//ui/Card.tsx:108:export interface CardDescriptionProps {
components//ui/Card.tsx:129:export { Card, CardHeader, CardContent, CardTitle, CardDescription };
components//ui/TiltedCard.tsx:31:export default function TiltedCard({
components//ui/LoadingSpinner.tsx:4:export interface LoadingSpinnerProps {
components//ui/LoadingSpinner.tsx:40:export default LoadingSpinner;
components//ui/Badge.tsx:4:export interface BadgeProps {
components//ui/Badge.tsx:49:export default Badge;
components//ui/Button.tsx:4:export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
components//ui/Button.tsx:87:export default Button;
components//ui/EmptyState.tsx:5:export interface EmptyStateProps {
components//ui/EmptyState.tsx:45:export default EmptyState;
components//ui/LiquidEther.tsx:6:export interface LiquidEtherProps {
components//ui/LiquidEther.tsx:59:export default function LiquidEther({
components//home/Hero.tsx:16:export interface HeroProps {
components//home/Hero.tsx:171:export default Hero;
components//home/Constitution.tsx:9:export interface ConstitutionProps {
components//home/Constitution.tsx:145:export default Constitution;
components//home/HeroMemberCount.tsx:9:export interface HeroMemberCountProps {
components//home/HeroMemberCount.tsx:210:export default HeroMemberCount;
components//home/MemberCounter.tsx:9:export interface MemberCounterProps {
components//home/MemberCounter.tsx:138:export default MemberCounter;
components//home/About.tsx:10:export interface AboutProps {
components//home/About.tsx:151:export default About;
components//layout/Navbar.tsx:13:export interface NavbarProps {
components//layout/Navbar.tsx:207:export default Navbar;
components//layout/ScrollToTop.tsx:5:export default function ScrollToTop() {
components//layout/PillNavbar.tsx:18:export interface PillNavbarProps {
components//layout/PillNavbar.tsx:373:export default PillNavbar;
components//layout/Section.tsx:4:export interface SectionProps {
components//layout/Section.tsx:41:export default Section;
components//layout/DynamicNavbar.tsx:14:export interface DynamicNavbarProps {
components//layout/DynamicNavbar.tsx:328:export default DynamicNavbar;
components//layout/AutoHideScrollbar.tsx:5:export default function AutoHideScrollbar() {
components//layout/Footer.tsx:15:export interface FooterProps {
components//layout/Footer.tsx:134:export default Footer;
components//layout/SmartSnapScroll.tsx:5:export default function SmartSnapScroll() {
components//admin/EventForm.tsx:597:export default EventForm;
components//events/EventGallery.tsx:13:export interface EventGalleryProps {
components//events/EventGallery.tsx:369:export default EventGallery;
components//events/EventModal.tsx:172:export default EventModal;
components//events/EventYearSection.tsx:12:export interface EventYearSectionProps {
components//events/EventYearSection.tsx:119:export default EventYearSection;
components//events/UpcomingEventCard.tsx:179:export default UpcomingEventCard;
components//events/PastEventCard.tsx:9:export interface PastEventCardProps {
components//events/PastEventCard.tsx:116:export default PastEventCard;
components//events/EventCard.tsx:10:export interface EventCardProps {
components//events/EventCard.tsx:95:export default EventCard;

## Type Definitions
src/types//navigation.ts:1:export interface NavLink {
src/types//navigation.ts:7:export interface SocialLink {
src/types//navigation.ts:13:export interface NavigationData {
src/types//site.ts:1:export interface SiteConfig {
src/types//site.ts:21:export interface MemberCountResponse {
src/types//database.ts:2:export interface Database {
src/types//event.ts:1:export type EventStatus = 'upcoming' | 'past';
src/types//event.ts:3:export interface EventDTO {
src/types//event.ts:19:export interface EventWithMeta extends EventDTO {
src/types//event.ts:26:export interface EventsResponse {
src/types//event.ts:31:export interface EventFormState {

## Lib Exports
lib//firebase.ts:44:export { app, auth, storage, isConfigured };
lib//utils.ts:4:export function cn(...inputs: ClassValue[]) {
lib//utils.ts:8:export function formatDate(date: string): string {
lib//utils.ts:22:export function formatTime12Hour(time: string | null | undefined): string | null {
lib//utils.ts:46:export function scrollToSection(sectionId: string): void {
lib//utils.ts:56:export function debounce<T extends (...args: unknown[]) => unknown>(
lib//utils.ts:67:export function throttle<T extends (...args: unknown[]) => unknown>(
lib//googleSheets.ts:12:export async function getMemberCount(): Promise<number> {
lib//googleSheets.ts:52:export async function getCurrentYearMemberCount(): Promise<number> {
lib//googleSheets.ts:112:export async function getMemberCountWithTimestamp(): Promise<MemberCountResponse> {
lib//events.ts:5:export interface CountdownMeta {
lib//events.ts:12:export function toLocalDate(dateStr: string): Date | null {
lib//events.ts:19:export function getStartOfToday(): Date {
lib//events.ts:24:export function determineEventStatus(dateStr: string | null | undefined): EventStatus {
lib//events.ts:34:export function buildCountdownMeta(eventName: string, dateStr: string | null | undefined): CountdownMeta {
lib//firebase-admin.ts:34:export const adminDb = getFirestore();
lib//firebase-admin.ts:35:export const adminAuth = getAuth();
lib//firebase-admin.ts:36:export const adminStorage = getStorage();

## Environment Variables (.env.example)
```
# UACS Website — Environment Variables
# Copy this to .env.local and fill in real values.
# NEVER commit .env.local to Git.

# Firebase Client SDK (safe to expose via NEXT_PUBLIC_)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server-side only — NEVER expose to client)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Google Sheets API
GOOGLE_SHEETS_API_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
```

---
Snapshot complete.
