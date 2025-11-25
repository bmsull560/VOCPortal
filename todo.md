# VOS Education Hub - Project TODO

## Phase 1: Database Schema & Content Structure
- [x] Extend database schema with VOS-specific tables (pillars, quizzes, progress, certifications, maturity assessments)
- [x] Create content data structure for 10 VOS pillars
- [ ] Set up role-based curriculum definitions (Sales, CS, Marketing, Product, Executive, VE)
- [ ] Define maturity level progression logic (0-5)
- [x] Create quiz question bank for Pillar 1 (Unified Value Language)
- [x] Set up database helpers in server/db.ts

## Phase 2: Core UI & Navigation
- [x] Design and implement landing page with VOS branding
- [x] Create dashboard layout with sidebar navigation
- [ ] Build user profile page showing maturity level and progress
- [ ] Implement role selection interface
- [ ] Create learning path navigation (10 pillars)
- [x] Set up routing for all major pages
- [x] Apply VOS blue-green color palette theme
- [x] Copy provided visualization assets to public folder

## Phase 3: Pillar Content Pages
- [ ] Create PillarModule component for content display
- [ ] Build pillar overview pages (1-10)
- [ ] Integrate static visualizations (maturity chart, role grid, etc.)
- [ ] Add downloadable resources (KPI sheets, templates)
- [ ] Implement content unlocking based on progress

## Phase 4: Adaptive Quiz System
- [ ] Build QuizInterface component with question rendering
- [ ] Implement adaptive scoring logic (maturity-based)
- [ ] Create instant feedback system tied to maturity levels
- [ ] Build quiz result display with category breakdown
- [ ] Implement 80% pass threshold for certification
- [ ] Add quiz retake functionality with targeted drills
- [ ] Create role-specific question adaptations
- [ ] Build scenario-based question types

## Phase 5: Progress Tracking & Analytics
- [ ] Implement user progress tracking system
- [ ] Create progress dashboard with completion percentages
- [ ] Build maturity level assessment interface
- [ ] Implement maturity progression visualization
- [ ] Create certification badge system
- [ ] Build analytics dashboard (admin view)
- [ ] Track completion rates per pillar
- [ ] Measure knowledge gain (pre/post quiz scores)

## Phase 6: Simulations & Interactive Components
- [ ] Build Value Tree builder component
- [ ] Create simulation flow for lifecycle workflows
- [ ] Implement cross-functional handoff scenarios
- [ ] Build Value Commit template interface
- [ ] Create QBR/EBR template builder
- [ ] Add multi-step flow navigation

## Phase 7: TheSys C1 Integration
- [ ] Set up TheSys C1 API credentials
- [ ] Integrate C1 SDK into frontend
- [ ] Build AI Tutor using C1Chat component
- [ ] Implement role and maturity-aware system prompts
- [ ] Create adaptive quiz generation with C1
- [ ] Build personalized guidance system
- [ ] Test generative UI components

## Phase 8: Resource Library
- [ ] Create resource library page
- [ ] Add KPI Definition Sheet (downloadable PDF)
- [ ] Add Discovery Questions framework
- [ ] Add Value Commit templates
- [ ] Add QBR/EBR templates
- [ ] Add B2BValue Company Playbook excerpts
- [ ] Organize resources by pillar and role

## Phase 9: Certification System
- [ ] Build certification logic (80% threshold)
- [ ] Create role-specific badge designs
- [ ] Implement certificate generation
- [ ] Build certification display on user profile
- [ ] Add certification download functionality
- [ ] Create certification leaderboard

## Phase 10: Testing & Refinement
- [ ] Write vitest tests for quiz scoring logic
- [ ] Write vitest tests for maturity progression
- [ ] Write vitest tests for certification awarding
- [ ] Test adaptive content delivery
- [ ] Test role-based curriculum paths
- [ ] Validate all quiz feedback mechanisms
- [ ] Test TheSys C1 integration
- [ ] Mobile responsiveness testing
- [ ] Accessibility compliance check

## Phase 11: Polish & Documentation
- [ ] Add loading states for all async operations
- [ ] Implement error handling and user feedback
- [ ] Create onboarding flow for new users
- [ ] Add help tooltips and guidance
- [ ] Write user documentation
- [ ] Create admin guide for analytics
- [ ] Add FAQ section
- [ ] Optimize performance

## Future Enhancements (Post-MVP)
- [ ] Add remaining pillars (2-10) with full quiz content
- [ ] Implement AI Prompt Library (Pillars 9-10)
- [ ] Add team/cohort management for organizations
- [ ] Build advanced analytics with cohort comparison
- [ ] Add gamification elements (points, streaks)
- [ ] Implement peer learning features
- [ ] Add video content integration
- [ ] Build mobile app version

## Bug Fixes
- [x] Fix nested anchor tag error in Dashboard component (Link wrapping <a>)

## New Requirements from Flowith Document

### Content Completion
- [x] Complete Pillar 2-10 content with Topics, Outputs, and Resources
- [x] Add downloadable resource templates for each pillar
- [ ] Create GenAI Prompt Library for Pillar 9

### Role-Based Curriculum
- [ ] Implement role-based learning path filtering
- [ ] Create progressive module unlocking (L0→L1→L2→L3)
- [ ] Add module completion checkboxes
- [ ] Build role-specific assessment paths

### Enhanced Certification System
- [ ] Implement Bronze/Silver/Gold tier system
- [ ] Add final simulation assessment covering full value lifecycle
- [ ] Implement 40/30/30 scoring rubric (Technical/Cross-Functional/AI)
- [ ] Create certificate generation system

### Maturity Assessment Tool
- [ ] Build self-assessment questionnaire
- [ ] Display characteristics, symptoms, and actions for each level
- [ ] Add personalized recommendations based on current level
- [ ] Track progression from L0→L5

### Interactive Simulations
- [ ] AI-powered discovery session practice
- [ ] Value Tree building interactive exercise
- [ ] Business case development scenario
- [ ] QBR expansion modeling simulation

### Resource Library
- [ ] Create downloadable templates section
- [ ] Add playbooks and guides
- [ ] Implement GenAI Prompt Library interface
- [ ] Add policy documents download

## Current Bug Fixes
- [x] Fix nested anchor tag error in Profile page

## Bug Fixes (Current)
- [x] Fix nested anchor tag error in Dashboard component

## Urgent Bug Fix
- [x] Fix persistent nested anchor tag error in Dashboard (Link + Button issue)
