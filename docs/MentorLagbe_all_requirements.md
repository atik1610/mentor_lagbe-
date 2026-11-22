# MentorLagbe — Complete Master Requirements Checklist

> Source: 15 screenshots supplied 20 November 2026. Target completion: 22 November 2026.
> As of 20 November 2026, ML-004 is verified done (1 of 216 strict completion-target checkpoints). Separately, 3 preliminary setup milestones have been verified. This is an internal implementation tracker, NOT an official grading score.
> **Progress rule:** Mark Done only after verifying working behavior and logging clear evidence (file/route/test screenshot/deployed URL).
> **Required:** all Required and Challenge items. **Optional:** at least two of the five numbered differentiation options. Google social login is a separate extra option.
> Some atomic rows intentionally split a larger statement so no visible requirement gets lost. All numeric counts are tracker item counts, not the employer’s official rubric.

## 01 Scope & constraints — 12 checkpoints

- [ ] **ML-001** (Required; source screenshot(s) 01,02,03,14) — Build MentorLagbe as a full-stack smart tuition and mentorship platform for online and home tuition / tutor booking.
- [ ] **ML-002** (Required; source screenshot(s) 01,02,03,14) — Implement exactly three application roles: student, tutor, admin.
- [ ] **ML-003** (Required; source screenshot(s) 01,02,03,14) — Support both subject-wise batch tuition and 1-on-1 mentorship offerings.
- [x] **ML-004** (Required; source screenshot(s) 01,02,03,14) — Use Next.js App Router for the frontend.
- [ ] **ML-005** (Required; source screenshot(s) 01,02,03,14) — Use Node.js and Express.js for the backend API.
- [ ] **ML-006** (Required; source screenshot(s) 01,02,03,14) — Use MongoDB as the application database.
- [ ] **ML-007** (Required; source screenshot(s) 01,02,03,14) — Use TypeScript or JavaScript as allowed for frontend and backend; choose and apply consistently.
- [ ] **ML-008** (Required; source screenshot(s) 01,02,03,14) — Use BetterAuth, its MongoDB adapter, JWT-based protected API access and role-based authorization.
- [ ] **ML-009** (Required; source screenshot(s) 01,02,03,14) — Integrate Stripe payments and ImgBB API image uploads.
- [ ] **ML-010** (Required; source screenshot(s) 01,02,03,14) — Keep the design distinctive; do not replicate any earlier module, conceptual project or assignment.
- [ ] **ML-011** (Required; source screenshot(s) 01,02,03,14) — Provide a polished, recruiter-friendly, non-gobindo, aligned, well-spaced visual design.
- [ ] **ML-012** (Required; source screenshot(s) 01,02,03,14) — Finish and submit by 22 November 2026 (user-provided target).

## 02 Data architecture — 27 checkpoints

- [ ] **ML-013** (Required; source screenshot(s) 03,04,05) — Use exactly four main application MongoDB collections named users, tuitions, applications and payments (source wording).
- [ ] **ML-014** (Required; source screenshot(s) 03,04,05) — users: store _id, name, email and image (ImgBB optional / image URL).
- [ ] **ML-015** (Required; source screenshot(s) 03,04,05) — users: store role restricted to student, tutor or admin.
- [ ] **ML-016** (Required; source screenshot(s) 03,04,05) — users: store phone and bio profile fields.
- [ ] **ML-017** (Required; source screenshot(s) 03,04,05) — users: store subscription plan with free/pro values; default free.
- [ ] **ML-018** (Required; source screenshot(s) 03,04,05) — users: store createdAt timestamp.
- [ ] **ML-019** (Required; source screenshot(s) 03,04,05) — users: create through BetterAuth signup; allow profile updates, admin role updates and Stripe-triggered plan updates.
- [ ] **ML-020** (Required; source screenshot(s) 03,04,05) — tuitions: store _id, title, subject and classLevel.
- [ ] **ML-021** (Required; source screenshot(s) 03,04,05) — tuitions: store mode as Online/Offline, location, monthlyFee and daysPerWeek.
- [ ] **ML-022** (Required; source screenshot(s) 03,04,05) — tuitions: store bannerImage, description, tutorName and tutorEmail.
- [ ] **ML-023** (Required; source screenshot(s) 03,04,05) — tuitions: store approvalStatus as pending/approved/rejected, isActive and createdAt.
- [ ] **ML-024** (Required; source screenshot(s) 03,04,05) — tuitions: create and manage by owning Tutor; approval/rejection by Admin.
- [ ] **ML-025** (Required; source screenshot(s) 03,04,05) — applications: store _id, tuitionId and tuitionTitle.
- [ ] **ML-026** (Required; source screenshot(s) 03,04,05) — applications: store subject, monthlyFee and tutorEmail.
- [ ] **ML-027** (Required; source screenshot(s) 03,04,05) — applications: store studentName, studentEmail and studentPhone.
- [ ] **ML-028** (Required; source screenshot(s) 03,04,05) — applications: store preferredSchedule and studentNote.
- [ ] **ML-029** (Required; source screenshot(s) 03,04,05) — applications: store status pending/accepted/rejected and appliedAt.
- [ ] **ML-030** (Required; source screenshot(s) 03,04,05) — applications: create by Student; allow application status update by owning Tutor.
- [ ] **ML-031** (Required; source screenshot(s) 03,04,05) — payments: store _id, userEmail, userName, userRole and planName.
- [ ] **ML-032** (Required; source screenshot(s) 03,04,05) — payments: store amount, currency, transactionId and stripeSessionId.
- [ ] **ML-033** (Required; source screenshot(s) 03,04,05) — payments: store paymentStatus paid and paidAt.
- [ ] **ML-034** (Required; source screenshot(s) 03,04,05) — payments: create using verified Stripe Checkout/Webhook processing.
- [ ] **ML-035** (Required; source screenshot(s) 03,04,05) — Connect users → tuitions → applications by user identity and tuitionId; connect payments → users for plan updates.
- [ ] **ML-036** (Required; source screenshot(s) 03,04,05) — Free Tutors can create at most two tuition listings; Pro Tutors can create unlimited listings.
- [ ] **ML-037** (Required; source screenshot(s) 03,04,05) — Only approved listings with isActive=true appear publicly.
- [ ] **ML-038** (Required; source screenshot(s) 03,04,05) — Application status starts pending, then may become accepted or rejected by owning Tutor.
- [ ] **ML-039** (Required; source screenshot(s) 03,04,05) — Successful Pro subscription records payment and changes the matching users.plan to pro.

## 03 Global navigation & footer — 10 checkpoints

- [ ] **ML-040** (Required; source screenshot(s) 06) — Show MentorLagbe logo/brand name consistently in navbar and on home page (style and size).
- [ ] **ML-041** (Required; source screenshot(s) 06) — Provide public navigation links: Home (/), Browse Tuitions (/tuitions), Pricing (/pricing) and How It Works / About.
- [ ] **ML-042** (Required; source screenshot(s) 06) — Unauthenticated navbar shows Sign In and Sign Up actions.
- [ ] **ML-043** (Required; source screenshot(s) 06) — Authenticated navbar shows user avatar/profile image.
- [ ] **ML-044** (Required; source screenshot(s) 06) — Authenticated navbar shows user name and role badge (student/tutor/admin).
- [ ] **ML-045** (Required; source screenshot(s) 06) — Authenticated navbar provides Dashboard link, Update Profile link and Sign Out action.
- [ ] **ML-046** (Required; source screenshot(s) 06) — Footer includes MentorLagbe logo and a brief tagline.
- [ ] **ML-047** (Required; source screenshot(s) 06) — Footer includes quick navigation links.
- [ ] **ML-048** (Required; source screenshot(s) 06) — Footer includes contact information: email, phone and location.
- [ ] **ML-049** (Required; source screenshot(s) 06) — Footer includes copyright text and social links; use the new X logo, not the old Twitter bird.

## 04 Public pages & home — 24 checkpoints

- [ ] **ML-050** (Required; source screenshot(s) 06,08) — Build the responsive home/landing page at / with modern visual structure and appropriate animations.
- [ ] **ML-051** (Required; source screenshot(s) 06,08) — Home hero/banner has an engaging tutoring/mentorship headline.
- [ ] **ML-052** (Required; source screenshot(s) 06,08) — Home hero has a search/CTA leading to Browse Tuitions.
- [ ] **ML-053** (Required; source screenshot(s) 06,08) — Home hero uses a high-quality illustration or photo.
- [ ] **ML-054** (Required; source screenshot(s) 06,08) — Home Featured Tuitions fetches six latest approved AND active tuition records dynamically from MongoDB.
- [ ] **ML-055** (Required; source screenshot(s) 06,08) — Each featured tuition card has equal height and width.
- [ ] **ML-056** (Required; source screenshot(s) 06,08) — Each featured tuition card displays Title, Subject and Class Level.
- [ ] **ML-057** (Required; source screenshot(s) 06,08) — Each featured tuition card displays Mode (Online/Offline), Monthly Fee and Tutor Name.
- [ ] **ML-058** (Required; source screenshot(s) 06,08) — Each featured tuition card has View Details navigation.
- [ ] **ML-059** (Required; source screenshot(s) 06,08) — Home Pricing section contrasts Free vs Pro for both Tutors and Students.
- [ ] **ML-060** (Required; source screenshot(s) 06,08) — Home Pricing includes Subscribe with Stripe CTA.
- [ ] **ML-061** (Required; source screenshot(s) 06,08) — Home How MentorLagbe Works section explains the student/tutor flow in three or four steps.
- [ ] **ML-062** (Required; source screenshot(s) 06,08) — Home has Top Subjects and/or Platform Statistics & Testimonials section.
- [ ] **ML-063** (Required; source screenshot(s) 06,08) — Popular subject examples include Math, Physics, Programming and IELTS.
- [ ] **ML-064** (Required; source screenshot(s) 06,08) — If showing platform counters or testimonials, use verified/grounded statistics or credible feedback rather than invented claims.
- [ ] **ML-065** (Required; source screenshot(s) 06,08) — Implement Browse Tuitions at /tuitions as a grid of publicly approved and active listings.
- [ ] **ML-066** (Required; source screenshot(s) 06,08) — Browse page has search UI by tuition Title or Subject.
- [ ] **ML-067** (Required; source screenshot(s) 06,08) — Browse page has filters for Subject, Class Level and Online/Offline Mode.
- [ ] **ML-068** (Required; source screenshot(s) 06,08) — Implement dynamic Tuition Details page at /tuitions/[id].
- [ ] **ML-069** (Required; source screenshot(s) 06,08) — Tuition Details displays Banner Image, Title, Subject, Class Level and Schedule.
- [ ] **ML-070** (Required; source screenshot(s) 06,08) — Tuition Details displays Location/Mode, Monthly Fee and Description.
- [ ] **ML-071** (Required; source screenshot(s) 06,08) — Tuition Details displays a Tutor profile summary and relevant tutor details.
- [ ] **ML-072** (Required; source screenshot(s) 06,08) — Create /pricing page showing subscription tiers for Students and Tutors.
- [ ] **ML-073** (Required; source screenshot(s) 06,08) — Create a How It Works / About public page or public content destination.

## 05 Auth, security & protection — 22 checkpoints

- [ ] **ML-074** (Required; source screenshot(s) 07,13) — Set up BetterAuth on the backend using the MongoDB adapter.
- [ ] **ML-075** (Required; source screenshot(s) 07,13) — Connect frontend Next.js authentication flow to the backend.
- [ ] **ML-076** (Required; source screenshot(s) 07,13) — Create /sign-up with Full Name, Email, Password and role selection (Student or Tutor only).
- [ ] **ML-077** (Required; source screenshot(s) 07,13) — Assign new users role chosen at signup, and default plan=free.
- [ ] **ML-078** (Required; source screenshot(s) 07,13) — Validate signup required fields.
- [ ] **ML-079** (Required; source screenshot(s) 07,13) — Validate signup email format.
- [ ] **ML-080** (Required; source screenshot(s) 07,13) — Validate signup password length.
- [ ] **ML-081** (Required; source screenshot(s) 07,13) — Create /sign-in with email and password.
- [ ] **ML-082** (Required; source screenshot(s) 07,13) — Validate sign-in form input and show error toast notifications.
- [ ] **ML-083** (Required; source screenshot(s) 07,13) — After login, obtain or generate a JWT for protected backend API requests per the specification.
- [ ] **ML-084** (Required; source screenshot(s) 07,13) — Send the JWT with client requests to protected backend endpoints.
- [ ] **ML-085** (Required; source screenshot(s) 07,13) — Implement custom Express middleware verifyToken.
- [ ] **ML-086** (Required; source screenshot(s) 07,13) — Implement custom Express middleware verifyStudent.
- [ ] **ML-087** (Required; source screenshot(s) 07,13) — Implement custom Express middleware verifyTutor.
- [ ] **ML-088** (Required; source screenshot(s) 07,13) — Implement custom Express middleware verifyAdmin.
- [ ] **ML-089** (Required; source screenshot(s) 07,13) — Enforce role permissions on the server rather than only hiding frontend buttons.
- [ ] **ML-090** (Required; source screenshot(s) 07,13) — Secure frontend configuration secrets with environment variables (.env.local).
- [ ] **ML-091** (Required; source screenshot(s) 07,13) — Secure MongoDB, BetterAuth, JWT, ImgBB and Stripe credentials using backend .env variables.
- [ ] **ML-092** (Required; source screenshot(s) 07,13) — Prevent signed-in users from being redirected to login when reloading private routes.
- [ ] **ML-093** (Required; source screenshot(s) 07,13) — Protect private dashboard routes from unauthenticated access.
- [ ] **ML-094** (Required; source screenshot(s) 07,13) — Protect /dashboard/... pages from unauthorized role access.
- [ ] **ML-095** (Required; source screenshot(s) 07,13) — Provide a working authenticated Sign Out flow.

## 06 Applications & tuition flows — 11 checkpoints

- [ ] **ML-096** (Required; source screenshot(s) 05,08) — Student can open a public tuition details page and launch an Apply for Tuition form/modal.
- [ ] **ML-097** (Required; source screenshot(s) 05,08) — Only users with student role can submit a tuition application.
- [ ] **ML-098** (Required; source screenshot(s) 05,08) — Tutor/Admin visitors see Apply Now hidden or disabled with a clear notice.
- [ ] **ML-099** (Required; source screenshot(s) 05,08) — Application form collects student phone number.
- [ ] **ML-100** (Required; source screenshot(s) 05,08) — Application form collects preferred schedule.
- [ ] **ML-101** (Required; source screenshot(s) 05,08) — Application form collects learning note.
- [ ] **ML-102** (Required; source screenshot(s) 05,08) — Saving an application creates an applications record with status pending and links to tuition and Student/Tutor.
- [ ] **ML-103** (Required; source screenshot(s) 05,08) — Prevent duplicate applications from same student to the same tuition.
- [ ] **ML-104** (Required; source screenshot(s) 05,08) — After application, display actionable success/error feedback and current application status.
- [ ] **ML-105** (Required; source screenshot(s) 05,08) — Tutor can accept or reject applications only for the Tutor’s own tuition listings.
- [ ] **ML-106** (Required; source screenshot(s) 05,08) — Student can see application status updates (Pending/Accepted/Rejected).

## 07 Payments & subscriptions — 12 checkpoints

- [ ] **ML-107** (Required; source screenshot(s) 09,12) — Implement Stripe Checkout for Pro Tutor plan priced at $15.
- [ ] **ML-108** (Required; source screenshot(s) 09,12) — Implement Stripe Checkout for Pro Student plan priced at $10.
- [ ] **ML-109** (Required; source screenshot(s) 09,12) — Provide purchase/Subscribe CTA from pricing and relevant role dashboard views.
- [ ] **ML-110** (Required; source screenshot(s) 09,12) — Create /payment/success route.
- [ ] **ML-111** (Required; source screenshot(s) 09,12) — Create /payment/cancel route.
- [ ] **ML-112** (Required; source screenshot(s) 09,12) — On verified successful payment, set user plan to pro automatically.
- [ ] **ML-113** (Required; source screenshot(s) 09,12) — On verified successful payment, insert full transaction record into payments collection.
- [ ] **ML-114** (Required; source screenshot(s) 09,12) — Integrate Stripe Webhook or verified checkout session confirmation for payment-to-database sync.
- [ ] **ML-115** (Required; source screenshot(s) 09,12) — Avoid treating the success-page redirect alone as evidence that a payment succeeded.
- [ ] **ML-116** (Required; source screenshot(s) 09,12) — Pro Tutor plan enables unlimited tuition posts.
- [ ] **ML-117** (Required; source screenshot(s) 09,12) — Pro Student plan provides priority booking / verified badge as described in the assignment.
- [ ] **ML-118** (Required; source screenshot(s) 09,12) — Allow Tutor and Student plan to be reflected across UI/dashboard and persisted in MongoDB.

## 08 Student dashboard — 10 checkpoints

- [ ] **ML-119** (Required; source screenshot(s) 09,10) — Create role-based responsive Student Dashboard overview at /dashboard/student.
- [ ] **ML-120** (Required; source screenshot(s) 09,10) — Student overview shows Total Applied Tuitions stat card.
- [ ] **ML-121** (Required; source screenshot(s) 09,10) — Student overview shows Accepted Applications stat card.
- [ ] **ML-122** (Required; source screenshot(s) 09,10) — Student overview shows Pending Applications stat card.
- [ ] **ML-123** (Required; source screenshot(s) 09,10) — Student overview shows Current Plan (Free/Pro) stat card.
- [ ] **ML-124** (Required; source screenshot(s) 09,10) — Create /dashboard/student/my-applications to list all applications by current student.
- [ ] **ML-125** (Required; source screenshot(s) 09,10) — Student My Applications displays Tuition Title, Tutor Name and Email.
- [ ] **ML-126** (Required; source screenshot(s) 09,10) — Student My Applications displays Monthly Fee and Applied Date.
- [ ] **ML-127** (Required; source screenshot(s) 09,10) — Student My Applications displays Pending/Accepted/Rejected status badges.
- [ ] **ML-128** (Required; source screenshot(s) 09,10) — Allow student to Cancel/Delete a submitted application only while its status is pending.

## 09 Tutor dashboard — 20 checkpoints

- [ ] **ML-129** (Required; source screenshot(s) 10) — Create role-based responsive Tutor Dashboard overview at /dashboard/tutor.
- [ ] **ML-130** (Required; source screenshot(s) 10) — Tutor overview has Total Tuitions Posted stat card.
- [ ] **ML-131** (Required; source screenshot(s) 10) — Tutor overview has Active/Approved Tuitions stat card.
- [ ] **ML-132** (Required; source screenshot(s) 10) — Tutor overview has Total Applicants Received stat card.
- [ ] **ML-133** (Required; source screenshot(s) 10) — Tutor overview has Current Plan (Free/Pro) stat card.
- [ ] **ML-134** (Required; source screenshot(s) 10) — Create /dashboard/tutor/post-tuition form with Title, Subject, Class Level and Mode.
- [ ] **ML-135** (Required; source screenshot(s) 10) — Tutor post form includes Location, Monthly Fee, Days/Week and Description.
- [ ] **ML-136** (Required; source screenshot(s) 10) — Tutor post form allows banner image upload via ImgBB API.
- [ ] **ML-137** (Required; source screenshot(s) 10) — Validate tutor post form and save new tuition as approvalStatus=pending.
- [ ] **ML-138** (Required; source screenshot(s) 10) — Enforce a two-tuition creation limit for Free Tutors and unlimited for Pro.
- [ ] **ML-139** (Required; source screenshot(s) 10) — Create /dashboard/tutor/my-tuitions to list Tutor’s own tuition posts.
- [ ] **ML-140** (Required; source screenshot(s) 10) — My Tuitions shows admin approvalStatus (pending/approved/rejected).
- [ ] **ML-141** (Required; source screenshot(s) 10) — My Tuitions shows whether tuition is active / closed.
- [ ] **ML-142** (Required; source screenshot(s) 10) — My Tuitions allows editing/updating post details (CRUD).
- [ ] **ML-143** (Required; source screenshot(s) 10) — My Tuitions allows deleting tuition posts (CRUD).
- [ ] **ML-144** (Required; source screenshot(s) 10) — My Tuitions allows toggling tuition Active/Closed.
- [ ] **ML-145** (Required; source screenshot(s) 10) — Create /dashboard/tutor/applicants to list students applying to Tutor’s own posts.
- [ ] **ML-146** (Required; source screenshot(s) 10) — Applicants view displays Student Name, Email, Phone and Preferred Schedule.
- [ ] **ML-147** (Required; source screenshot(s) 10) — Applicants view displays Student Note and Tuition Title.
- [ ] **ML-148** (Required; source screenshot(s) 10) — Applicants view allows Tutor to Accept or Reject applications.

## 10 Admin dashboard — 13 checkpoints

- [ ] **ML-149** (Required; source screenshot(s) 10) — Create responsive Admin Dashboard overview at /dashboard/admin.
- [ ] **ML-150** (Required; source screenshot(s) 10) — Admin overview shows Total Users stat card.
- [ ] **ML-151** (Required; source screenshot(s) 10) — Admin overview shows Total Tutors stat card.
- [ ] **ML-152** (Required; source screenshot(s) 10) — Admin overview shows Pending vs Approved Tuitions statistics.
- [ ] **ML-153** (Required; source screenshot(s) 10) — Admin overview shows Total Stripe Revenue statistic.
- [ ] **ML-154** (Required; source screenshot(s) 10) — Create /dashboard/admin/users listing all registered users.
- [ ] **ML-155** (Required; source screenshot(s) 10) — Admin Users page supports changing user role among student/tutor/admin.
- [ ] **ML-156** (Required; source screenshot(s) 10) — Perform role changes through a protected BetterAuth admin plugin or protected Express backend API.
- [ ] **ML-157** (Required; source screenshot(s) 10) — Create /dashboard/admin/tuitions listing all submitted tutor posts.
- [ ] **ML-158** (Required; source screenshot(s) 10) — Admin Tuitions page lets Admin approve pending/new posts.
- [ ] **ML-159** (Required; source screenshot(s) 10) — Admin Tuitions page lets Admin reject posts.
- [ ] **ML-160** (Required; source screenshot(s) 10) — Create /dashboard/admin/transactions with all Stripe payment records.
- [ ] **ML-161** (Required; source screenshot(s) 10) — Admin Transactions table displays User Name, Email, Role, Plan Name, Amount, Transaction ID and Payment Date.

## 11 Shared dashboard & profile — 8 checkpoints

- [ ] **ML-162** (Required; source screenshot(s) 09,12) — Provide a responsive role-based dashboard layout with a collapsible sidebar toggle.
- [ ] **ML-163** (Required; source screenshot(s) 09,12) — Dashboard layout includes a top bar.
- [ ] **ML-164** (Required; source screenshot(s) 09,12) — Dashboard layout includes user profile summary.
- [ ] **ML-165** (Required; source screenshot(s) 09,12) — Dashboard routing/menus depend on active user role.
- [ ] **ML-166** (Required; source screenshot(s) 09,12) — Dashboard is full-width with consistent color theme across screens.
- [ ] **ML-167** (Required; source screenshot(s) 09,12) — Create shared /dashboard/profile accessible to student, tutor and admin.
- [ ] **ML-168** (Required; source screenshot(s) 09,12) — Allow editing Name, Phone and Bio.
- [ ] **ML-169** (Required; source screenshot(s) 09,12) — Allow profile picture upload through ImgBB API (optional upload) and/or image URL.

## 12 UX & design quality — 17 checkpoints

- [ ] **ML-170** (Required; source screenshot(s) 02,06,11,12) — Use a consistent main-heading font, size and color across page sections.
- [ ] **ML-171** (Required; source screenshot(s) 02,06,11,12) — Keep readable paragraph text and balanced paragraph spacing.
- [ ] **ML-172** (Required; source screenshot(s) 02,06,11,12) — Keep image sizes and inter-image spacing uniform.
- [ ] **ML-173** (Required; source screenshot(s) 02,06,11,12) — Use a consistent button style matching the home page.
- [ ] **ML-174** (Required; source screenshot(s) 02,06,11,12) — Apply consistent alignment and balanced whitespace throughout.
- [ ] **ML-175** (Required; source screenshot(s) 02,06,11,12) — Use equal-size cards and equal-size image grid cells for services/listings/projects/products.
- [ ] **ML-176** (Required; source screenshot(s) 02,06,11,12) — Ensure comfortable contrast and visual clarity.
- [ ] **ML-177** (Required; source screenshot(s) 02,06,11,12) — Make public pages responsive on mobile, tablet and desktop.
- [ ] **ML-178** (Required; source screenshot(s) 02,06,11,12) — Make every dashboard responsive on mobile and tablet.
- [ ] **ML-179** (Required; source screenshot(s) 02,06,11,12) — Add smooth loading/skeleton states while fetching page and dashboard data (loading.tsx or spinner).
- [ ] **ML-180** (Required; source screenshot(s) 02,06,11,12) — Implement custom 404 Not Found page (not-found.tsx) with clear explanation and Back to Home.
- [ ] **ML-181** (Required; source screenshot(s) 02,06,11,12) — Implement custom error boundary page (error.tsx) with clear explanation and Back to Home.
- [ ] **ML-182** (Required; source screenshot(s) 02,06,11,12) — Use toast notifications for form submissions.
- [ ] **ML-183** (Required; source screenshot(s) 02,06,11,12) — Use toast notifications for login/logout.
- [ ] **ML-184** (Required; source screenshot(s) 02,06,11,12) — Use toast notifications for CRUD operations and error alerts.
- [ ] **ML-185** (Required; source screenshot(s) 02,06,11,12) — Seed at least 10–12 realistic, connected, Admin-approved tuitions across varied subjects.
- [ ] **ML-186** (Required; source screenshot(s) 02,06,11,12) — Use real connected sample records rather than empty disconnected placeholder content.

## 13 Core challenge tasks — 5 checkpoints

- [ ] **ML-187** (Challenge; source screenshot(s) 13) — Challenge 1: Implement dynamic server-side search by tuition title or subject on /tuitions.
- [ ] **ML-188** (Challenge; source screenshot(s) 13) — Challenge 1: Implement server-side class-level and Online/Offline-mode filters on /tuitions.
- [ ] **ML-189** (Challenge; source screenshot(s) 13) — Challenge 2: Verify JWT and user roles through custom Express middlewares verifyToken, verifyStudent, verifyTutor, verifyAdmin.
- [ ] **ML-190** (Challenge; source screenshot(s) 13) — Challenge 3: Implement direct file upload to ImgBB on /dashboard/profile (not just pasting image URLs).
- [ ] **ML-191** (Challenge; source screenshot(s) 13) — Challenge 3: Implement direct banner file upload to ImgBB on /dashboard/tutor/post-tuition (not just URLs).

## 14 Optional enhancements — 5 checkpoints

- [ ] **ML-192** (Optional; source screenshot(s) 14) — Optional 1: Add server-side pagination to Browse Tuitions with Previous/Next/page numbers using MongoDB .skip() and .limit().
- [ ] **ML-193** (Optional; source screenshot(s) 14) — Optional 2: Add seed script/endpoint with realistic AI-generated connected JSON for tutors, tuitions and sample applications.
- [ ] **ML-194** (Optional; source screenshot(s) 14) — Optional 3: Let Students bookmark/save tuition listings and view Saved Tuitions in dashboard.
- [ ] **ML-195** (Optional; source screenshot(s) 14) — Optional 4: Add smooth Dark/Light theme switcher throughout landing pages and dashboards.
- [ ] **ML-196** (Optional; source screenshot(s) 14) — Optional 5: Allow accepted Students to add a 1–5 star review and feedback to the tuition post.

## 15 Deployment & reliability — 10 checkpoints

- [ ] **ML-197** (Required; source screenshot(s) 02) — Deploy an accessible production-ready frontend with working live URL.
- [ ] **ML-198** (Required; source screenshot(s) 02) — Deploy an accessible production-ready backend API.
- [ ] **ML-199** (Required; source screenshot(s) 02) — Make production frontend/backend communicate without CORS errors.
- [ ] **ML-200** (Required; source screenshot(s) 02) — Ensure production API does not show 404 errors on valid routes.
- [ ] **ML-201** (Required; source screenshot(s) 02) — Ensure production API does not show 504 timeout errors on valid requests.
- [ ] **ML-202** (Required; source screenshot(s) 02) — Ensure the live application does not show general site/landing errors.
- [ ] **ML-203** (Required; source screenshot(s) 02) — Directly reload every relevant client route without navigation errors.
- [ ] **ML-204** (Required; source screenshot(s) 02) — Directly reload every private dashboard route without losing the authenticated session.
- [ ] **ML-205** (Required; source screenshot(s) 02) — Validate deployed Stripe webhook/session verification and production database syncing.
- [ ] **ML-206** (Required; source screenshot(s) 02) — Test all three roles and core workflows against production deployment.

## 16 GitHub, README & submission — 13 checkpoints

- [ ] **ML-207** (Required; source screenshot(s) 02,15) — Create at least 20 meaningful client-side Git commits with descriptive messages.
- [ ] **ML-208** (Required; source screenshot(s) 02,15) — Create at least 12 meaningful server-side Git commits with descriptive messages.
- [ ] **ML-209** (Required; source screenshot(s) 02,15) — Provide README.md with project name.
- [ ] **ML-210** (Required; source screenshot(s) 02,15) — Include README project purpose and key features.
- [ ] **ML-211** (Required; source screenshot(s) 02,15) — Include README live application URL.
- [ ] **ML-212** (Required; source screenshot(s) 02,15) — Include README Admin testing credentials (secure demo only; never expose real keys).
- [ ] **ML-213** (Required; source screenshot(s) 02,15) — Include README significant packages used.
- [ ] **ML-214** (Required; source screenshot(s) 02,15) — Prepare submission Admin Email.
- [ ] **ML-215** (Required; source screenshot(s) 02,15) — Prepare submission Admin Password (demo testing credential).
- [ ] **ML-216** (Required; source screenshot(s) 02,15) — Prepare submission Tutor Email and Password for quick testing.
- [ ] **ML-217** (Required; source screenshot(s) 02,15) — Prepare submission Live Site Link.
- [ ] **ML-218** (Required; source screenshot(s) 02,15) — Prepare submission GitHub Server Repository Link.
- [ ] **ML-219** (Required; source screenshot(s) 02,15) — Prepare submission GitHub Client Repository Link.

## 17 Extra explicitly optional — 1 checkpoints

- [ ] **ML-220** (Extra optional; source screenshot(s) 07) — Optional auth enhancement: Add Google social login via BetterAuth (not counted among the required two of five optional differentiators).

## Dependencies and important interpretation notes

- **BetterAuth vs exactly four collections:** the instructions say exactly four main MongoDB collections while also requiring a BetterAuth MongoDB adapter. BetterAuth may need its own persistence collections. Treat the four named collections as the application domain collections; verify actual adapter behavior and request clarification if strict collection count is enforced.
- **BetterAuth vs JWT:** the document requires both BetterAuth and explicit JWT verification middleware. Do not assume BetterAuth session cookies automatically satisfy the JWT challenge; implement and validate an appropriate token flow.
- **Role restriction:** normal signup choices are Student/Tutor. Admin users need a safe seeded/admin-controlled provision mechanism; never enable public Admin self-registration.
- **Payments:** the source permits Stripe webhook *or session verification*; check payment success server-side before making plan changes.
- **Distinct optional features:** two out of the listed five are the differentiator target. The separately mentioned optional Google login is not a substitute unless the evaluator agrees.
- **Free tutor two-post ceiling:** the document says up to two posts. To avoid ambiguous loopholes, agree on whether deleted/rejected posts count; preserve evidence of chosen policy.
- **Data format:** this checklist preserves the source terms (e.g. Online/Offline, pending/approved/rejected, paid, free/pro).

## 20–22 November high-level execution checkpoints

- **20 Nov:** project scaffold, data schema, authentication, RBAC, public page structure and meaningful commits.
- **21 Nov:** tuition CRUD, admin moderation, student applications, all dashboards, server-side search/filter and uploads.
- **22 Nov:** Stripe, testing, seed content, fixes, deployment, README, commit-count checks and final submission.
- This timeline is a priority guide, not a guarantee that a large full-stack application can be safely completed in that window.

## Verified setup milestones (separate from the 220 source-requirement rows)

- [x] Express server folder created and npm initialized — VS Code evidence, 20 Nov 2026.
- [x] Server dependencies (`express`, `cors`, `dotenv`, `mongodb`, `nodemon`) installed — VS Code terminal evidence, 20 Nov 2026; 2 moderate npm audit warnings remain to investigate.
- [x] Next.js App Router frontend scaffold running at `http://localhost:3000` — screenshot, 20 Nov 2026.

**Strict source-requirement completion:** 1 / 216 = 0.5% (rounded). The earlier 3/216 = 1.4% estimate treated two preliminary setup milestones as source requirements; they are now tracked separately to avoid inflating requirement completion.
