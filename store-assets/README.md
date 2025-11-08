# PACE Store Assets

This directory contains all assets and documentation required for preparing PACE for App Store and Google Play Store submission.

## 📁 Directory Structure

```
store-assets/
├── icons/
│   ├── ICON_GUIDELINES.md          # Comprehensive icon design guidelines
│   ├── icon-ios.png                # iOS app icon (1024x1024) - TO CREATE
│   ├── adaptive-icon-foreground.png # Android foreground (1080x1080) - TO CREATE
│   └── adaptive-icon-background.png # Android background (1080x1080) - TO CREATE
├── screenshots/
│   ├── SCREENSHOT_SPECIFICATIONS.md # Complete screenshot requirements
│   ├── ios/                        # iOS screenshots - TO CREATE
│   │   ├── iphone-6.7/            # iPhone 14/15 Pro Max (1290x2796)
│   │   ├── iphone-6.5/            # iPhone 11 Pro Max (1242x2688)
│   │   ├── iphone-5.5/            # iPhone 8 Plus (1242x2208)
│   │   └── ipad-12.9/             # iPad Pro (2048x2732)
│   ├── android/                    # Android screenshots - TO CREATE
│   │   ├── phone/                 # Phone (1080x1920 or 1080x2340)
│   │   └── tablet/                # Tablet (1600x2560)
│   └── source/                     # Source files and templates
└── metadata/
    ├── STORE_METADATA.md           # ASO-optimized descriptions and metadata
    └── keywords.txt                # Extracted keyword lists - TO CREATE
```

## 🎯 Epic 14 Overview

**Objective**: Make PACE attractive on app stores to convert visitors into downloaders.

### Feature 14.1: Visual Assets

#### ✅ US 14.1.1: Adaptive App Icon
**Status**: Documentation Complete | Assets TO CREATE

**Requirements**:
- iOS: Square icon (1024x1024 PNG, no transparency)
- Android: Adaptive icon with separate foreground and background layers (1080x1080 each)

**Documentation**: [`icons/ICON_GUIDELINES.md`](./icons/ICON_GUIDELINES.md)

**Next Steps**:
1. Review icon design guidelines
2. Create icon concepts based on PACE brand
3. Design final icons using Figma/Adobe tools
4. Export at required resolutions
5. Test on simulators/devices
6. Update `app.json` configuration

#### ✅ US 14.1.2: Store Screenshots
**Status**: Documentation Complete | Screenshots TO CREATE

**Requirements**:
- iOS: Screenshots for iPhone 6.7", 6.5", 5.5", iPad 12.9"
- Android: Screenshots for Phone and Tablet
- Marketing text overlays on each screenshot

**Documentation**: [`screenshots/SCREENSHOT_SPECIFICATIONS.md`](./screenshots/SCREENSHOT_SPECIFICATIONS.md)

**Next Steps**:
1. Review screenshot specifications
2. Plan screenshot sequence (storytelling)
3. Capture app screens in simulators
4. Design text overlays with marketing copy
5. Export at required sizes for each platform
6. Review and optimize for conversion

### Feature 14.2: Metadata

#### ✅ US 14.2.1: Store Descriptions (ASO Optimized)
**Status**: Complete

**Deliverables**:
- ✅ Short descriptions (taglines)
- ✅ Long descriptions optimized with keywords
- ✅ Bilingual content (French and English)
- ✅ ASO keyword research and strategy
- ✅ Competitor analysis
- ✅ Store-specific formatting

**Documentation**: [`metadata/STORE_METADATA.md`](./metadata/STORE_METADATA.md)

**Ready to Use**: All metadata is ready for copy-paste into App Store Connect and Google Play Console.

## 📋 Quick Start Guide

### For Icon Creation

1. **Read Guidelines**: [`icons/ICON_GUIDELINES.md`](./icons/ICON_GUIDELINES.md)
2. **Design Tool**: Use Figma, Adobe Illustrator, or similar
3. **Export Specifications**:
   - iOS: 1024x1024 PNG (no transparency)
   - Android Foreground: 1080x1080 PNG (with transparency)
   - Android Background: 1080x1080 PNG (solid color)
4. **Testing**: Test on simulators and real devices
5. **Update Config**: Modify `app.json` with new icon paths

### For Screenshot Creation

1. **Read Specifications**: [`screenshots/SCREENSHOT_SPECIFICATIONS.md`](./screenshots/SCREENSHOT_SPECIFICATIONS.md)
2. **Capture Screens**: Use iOS Simulator and Android Emulator
3. **Recommended Sequence**:
   - Screenshot 1: Hero/Dashboard
   - Screenshot 2: Daily Budget Feature
   - Screenshot 3: Add Expense
   - Screenshot 4: Expense History
   - Screenshot 5: Configuration
   - Screenshot 6: Premium Features (optional)
4. **Add Marketing Text**: Use design tool (Figma/Photoshop/Canva)
5. **Export**: Save at exact required dimensions
6. **Organize**: Follow naming convention in specifications

### For Store Submission

1. **Copy Metadata**: Use content from [`metadata/STORE_METADATA.md`](./metadata/STORE_METADATA.md)
2. **iOS App Store Connect**:
   - App Name: PACE - Budget Quotidien
   - Subtitle: Gérez votre budget au jour le jour
   - Keywords: budget,dépenses,finance,argent,économie,épargne,quotidien,gestion,tracker,personnel
   - Description: Use French or English version from metadata
3. **Google Play Console**:
   - Title: PACE - Budget Quotidien
   - Short Description: 80-character hook from metadata
   - Full Description: Long description from metadata
4. **Upload Assets**:
   - App icon
   - Screenshots (all required sizes)
   - Feature graphics (Google Play)

## 🎨 Design Resources

### Icon Design
- **Tools**: Figma, Adobe Illustrator, Sketch, Canva
- **Mockup Preview**: [AppIcon.co](https://www.appicon.co/), [Adapticon](https://adapticon.tooo.io/)
- **Color Palette**: See Icon Guidelines for recommended colors
- **Inspiration**: Dribbble, Behance (search "app icon finance")

### Screenshot Design
- **Capture Tools**: Xcode Simulator (iOS), Android Studio Emulator
- **Design Tools**: Figma, Photoshop, Canva, Adobe Express
- **Device Mockups**: [Previewed.app](https://previewed.app/), [Mockuphone](https://mockuphone.com/)
- **Text Overlay**: Marketing copy provided in Screenshot Specifications

### ASO Tools
- **Keyword Research**: App Annie, Sensor Tower, Mobile Action
- **Competitor Analysis**: Monitor top budget apps
- **A/B Testing**: App Store Connect experiments, Google Play experiments

## 🔑 Key Information

### App Details
- **App Name**: PACE
- **Full Title**: PACE - Budget Quotidien / PACE - Daily Budget Manager
- **Category**: Finance (Primary), Productivity (Secondary)
- **Bundle ID (iOS)**: com.carolinedanslesnuages.pace
- **Package (Android)**: com.carolinedanslesnuages.pace

### Target Audience
- Young professionals managing personal budgets
- Students tracking expenses
- Families saving for financial goals
- Anyone seeking simple budget management

### Unique Selling Points
1. **Daily Budget Focus**: Know what you can spend today
2. **Simplicity**: No complex features or overwhelming UI
3. **Privacy-First**: Local storage, no mandatory cloud sync
4. **Flexible Cycles**: Custom budget cycle based on payday
5. **Bilingual**: Native French and English support

### Competitive Advantages
- Simpler than YNAB or Mint
- More privacy-focused than competitors
- Daily-focused vs monthly-only budgeting
- Free core features (freemium model)

## 📊 ASO Keywords

### French (iOS: 100 chars)
```
budget,dépenses,finance,argent,économie,épargne,quotidien,gestion,tracker,personnel
```

### English (iOS: 100 chars)
```
budget,expenses,finance,money,savings,daily,management,tracker,personal,spending
```

### Full Keyword Lists
See [`metadata/STORE_METADATA.md`](./metadata/STORE_METADATA.md) for comprehensive keyword research and strategy.

## ✅ Completion Checklist

### Icons (US 14.1.1)
- [ ] Review icon design guidelines
- [ ] Create 3-5 icon concept sketches
- [ ] Design final icon in vector format
- [ ] Export iOS icon (1024x1024)
- [ ] Export Android foreground (1080x1080)
- [ ] Export Android background (1080x1080)
- [ ] Test icons in simulators
- [ ] Test icons on real devices
- [ ] Update app.json configuration
- [ ] Verify icons appear correctly in builds

### Screenshots (US 14.1.2)
- [ ] Review screenshot specifications
- [ ] Plan screenshot storytelling sequence
- [ ] Set up iOS simulators (6.7", 6.5", 5.5")
- [ ] Set up Android emulators (Phone, Tablet)
- [ ] Capture raw screenshots for each device
- [ ] Design marketing text overlays
- [ ] Create French language screenshots
- [ ] Create English language screenshots
- [ ] Export at exact required dimensions
- [ ] Optimize file sizes (< 8MB each)
- [ ] Organize files by platform and device
- [ ] Review for quality and consistency

### Metadata (US 14.2.1)
- [x] Research ASO keywords
- [x] Analyze competitor apps
- [x] Write French short description
- [x] Write French long description
- [x] Write English short description
- [x] Write English long description
- [x] Optimize descriptions with keywords
- [x] Create keyword lists for both platforms
- [x] Document store URLs (privacy, support, etc.)
- [x] Prepare "What's New" text templates
- [x] Create review response templates

### Store Submission Prep
- [ ] Create App Store Connect account (iOS)
- [ ] Create Google Play Console account (Android)
- [ ] Complete content rating questionnaires
- [ ] Verify Privacy Policy and ToS URLs
- [ ] Prepare support contact information
- [ ] Test all external URLs
- [ ] Review platform guidelines compliance
- [ ] Prepare app builds for submission

## 🚀 Timeline Estimate

### Phase 1: Icon Creation (2-3 days)
- Day 1: Concept and design
- Day 2: Refinement and export
- Day 3: Testing and integration

### Phase 2: Screenshot Creation (3-5 days)
- Day 1: Planning and raw captures
- Day 2-3: Design and text overlays
- Day 4: Export and optimization
- Day 5: Review and revisions

### Phase 3: Store Setup (1-2 days)
- Day 1: Account setup and metadata input
- Day 2: Asset upload and final review

**Total**: 6-10 days for complete store presence preparation

## 📞 Support

### Questions or Issues?
- Create an issue in the [GitHub repository](https://github.com/Carolinedanslesnuages/PACE/issues)
- Review Epic 14 requirements in the original issue
- Consult individual guideline documents for detailed information

### Document Updates
These documents are living resources. Update them as:
- Platform requirements change
- New best practices emerge
- App features evolve
- ASO strategies prove effective

---

## 📚 Additional Resources

### Platform Documentation
- [iOS App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policy](https://play.google.com/about/developer-content-policy/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Material Design](https://material.io/design)

### ASO Resources
- [App Store Optimization Guide](https://developer.apple.com/app-store/product-page/)
- [Google Play ASO Best Practices](https://developer.android.com/distribute/best-practices/launch/store-listing)
- [Mobile App Marketing Insights](https://www.data.ai/en/insights/)

### Design Inspiration
- [Dribbble - App Icons](https://dribbble.com/tags/app-icon)
- [Behance - Mobile Design](https://www.behance.net/search/projects?search=mobile%20app%20design)
- [App Store - Finance Category](https://apps.apple.com/genre/ios-finance/id6015)

---

**Last Updated**: 2025-11-08
**Epic**: 14 - Store Presence
**Status**: Documentation Complete | Assets In Progress
