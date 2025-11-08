# PACE App Screenshots Specifications

## Overview
This document provides comprehensive specifications for creating app store screenshots for PACE across all required device sizes for both iOS App Store and Google Play Store.

## Purpose of Screenshots
Store screenshots serve to:
1. **Showcase Features**: Demonstrate key app functionality
2. **Tell a Story**: Guide users through the app's value proposition
3. **Drive Conversions**: Convince visitors to download
4. **Improve ASO**: Support App Store Optimization with visual content

## iOS App Store Requirements

### Required Screenshot Sizes

#### iPhone 6.7" Display (iPhone 14 Pro Max, iPhone 15 Pro Max)
- **Resolution**: 1290 x 2796 pixels (portrait)
- **Aspect Ratio**: 9:19.5
- **Devices**: iPhone 14 Pro Max, 15 Pro Max, 15 Plus
- **Priority**: **REQUIRED** (Primary display size)
- **Filename Pattern**: `iphone-6.7-[01-10].png`

#### iPhone 6.5" Display (iPhone 11 Pro Max, iPhone XS Max)
- **Resolution**: 1242 x 2688 pixels (portrait)
- **Aspect Ratio**: 9:19.5
- **Devices**: iPhone 11 Pro Max, XS Max, 11, XR
- **Priority**: **REQUIRED** (Secondary display size)
- **Filename Pattern**: `iphone-6.5-[01-10].png`

#### iPhone 5.5" Display (iPhone 8 Plus)
- **Resolution**: 1242 x 2208 pixels (portrait)
- **Aspect Ratio**: 9:16
- **Devices**: iPhone 8 Plus, 7 Plus, 6s Plus
- **Priority**: OPTIONAL (Legacy devices, but still good to include)
- **Filename Pattern**: `iphone-5.5-[01-10].png`

#### iPad Pro 12.9" Display (3rd gen and later)
- **Resolution**: 2048 x 2732 pixels (portrait)
- **Aspect Ratio**: 3:4
- **Devices**: iPad Pro 12.9" (3rd gen+)
- **Priority**: OPTIONAL (if app supports iPad)
- **Note**: PACE uses `"supportsTablet": true` in app.json
- **Filename Pattern**: `ipad-12.9-[01-10].png`

### iOS Screenshot Limits
- **Minimum**: 1 screenshot per device size
- **Maximum**: 10 screenshots per device size
- **Format**: PNG or JPEG (PNG recommended)
- **Recommended**: 5-8 screenshots to tell complete story

## Google Play Store Requirements

### Required Screenshot Sizes

#### Phone Screenshots
- **Minimum Resolution**: 320 pixels
- **Maximum Resolution**: 3840 pixels
- **Recommended**: 1080 x 1920 pixels or 1080 x 2340 pixels
- **Aspect Ratio**: Between 16:9 and 9:16
- **Priority**: **REQUIRED**
- **Filename Pattern**: `android-phone-[01-08].png`

#### 7-inch Tablet Screenshots
- **Recommended**: 1200 x 1920 pixels
- **Aspect Ratio**: Between 16:9 and 9:16
- **Priority**: OPTIONAL
- **Filename Pattern**: `android-tablet-7-[01-08].png`

#### 10-inch Tablet Screenshots
- **Recommended**: 1600 x 2560 pixels or 2048 x 2732 pixels
- **Aspect Ratio**: Between 16:9 and 9:16
- **Priority**: OPTIONAL
- **Filename Pattern**: `android-tablet-10-[01-08].png`

### Google Play Screenshot Limits
- **Minimum**: 2 screenshots (phone)
- **Maximum**: 8 screenshots per device type
- **Format**: PNG or JPEG (PNG recommended, max 8MB each)
- **Recommended**: 5-8 screenshots

## Screenshot Content Strategy

### Recommended Screenshot Sequence

#### Screenshot 1: Hero/Main Dashboard
**Purpose**: Show the core interface and main value proposition
**Content**: 
- Main dashboard showing daily budget
- Monthly health status
- Recent transactions
**Marketing Text**: 
- French: "Maîtrisez votre budget quotidien"
- English: "Master your daily budget"

#### Screenshot 2: Daily Budget Feature
**Purpose**: Highlight the unique daily budget calculation
**Content**:
- Large daily budget display
- Budget status indicator (On Track/Behind)
- Days remaining in cycle
**Marketing Text**:
- French: "Sachez combien vous pouvez dépenser aujourd'hui"
- English: "Know exactly what you can spend today"

#### Screenshot 3: Add Expense
**Purpose**: Show how easy it is to track expenses
**Content**:
- Add expense modal/screen
- Simple input fields
- Category selection
**Marketing Text**:
- French: "Ajoutez une dépense en quelques secondes"
- English: "Track expenses in seconds"

#### Screenshot 4: Expense History
**Purpose**: Demonstrate expense tracking and management
**Content**:
- List of recent transactions
- Category organization
- Easy delete/edit options
**Marketing Text**:
- French: "Suivez toutes vos dépenses"
- English: "Track all your spending"

#### Screenshot 5: Configuration
**Purpose**: Show personalization capabilities
**Content**:
- Budget configuration screen
- Income/charges/savings setup
- Custom cycle start day
**Marketing Text**:
- French: "Personnalisez selon votre situation"
- English: "Customize to your needs"

#### Screenshot 6: Premium Features (if applicable)
**Purpose**: Highlight premium capabilities
**Content**:
- Premium features list
- Custom categories
- Advanced analytics (if implemented)
**Marketing Text**:
- French: "Débloquez plus de fonctionnalités"
- English: "Unlock premium features"

#### Screenshot 7: Settings & Privacy
**Purpose**: Show control and privacy features
**Content**:
- Settings screen
- Privacy controls
- Data management
**Marketing Text**:
- French: "Vos données restent privées"
- English: "Your data stays private"

#### Screenshot 8: Multi-currency Support
**Purpose**: Show international appeal
**Content**:
- Currency selection
- Multiple currency support
**Marketing Text**:
- French: "Support multi-devises"
- English: "Multi-currency support"

## Design Guidelines

### Text Overlays

#### Title Text
- **Font Size**: 48-72pt (adjust for device size)
- **Font Weight**: Bold or Heavy
- **Color**: High contrast with background
- **Position**: Top 25% or bottom 25% of screenshot
- **Max Characters**: 30-40 characters

#### Subtitle/Body Text
- **Font Size**: 24-36pt
- **Font Weight**: Regular or Medium
- **Color**: Complementary to title
- **Position**: Below title
- **Max Characters**: 60-80 characters

### Color Scheme
- **Background Tint**: Semi-transparent gradient overlay
- **Text Background**: Subtle shadow or semi-transparent box for readability
- **Brand Colors**: Use PACE brand colors consistently
- **Contrast Ratio**: Maintain WCAG AA standards (4.5:1 minimum)

### Visual Elements
- **Device Frame**: Optional (mockup device frame)
- **Status Bar**: Include realistic status bar (time, battery, signal)
- **Navigation**: Show realistic app navigation
- **Data**: Use realistic but polished demo data
- **Language**: Match app store language (French for French store, English for English store)

## Creating Screenshots

### Method 1: Simulator/Emulator Screenshots (Recommended)

#### iOS - Using Xcode Simulator
```bash
# Start simulator with specific device
npx expo start --ios

# In simulator:
# 1. Navigate to desired screen
# 2. Press Cmd+S to save screenshot
# Screenshots saved to Desktop
```

Device configurations:
- iPhone 15 Pro Max (6.7")
- iPhone 11 Pro Max (6.5")
- iPhone 8 Plus (5.5")
- iPad Pro 12.9" (if supporting iPad)

#### Android - Using Android Studio Emulator
```bash
# Start emulator
npx expo start --android

# In emulator controls, click camera icon to take screenshot
```

Device configurations:
- Pixel 7 Pro (1080 x 2400)
- Pixel Tablet (2560 x 1600)

### Method 2: Physical Device Screenshots

#### iOS Physical Device
1. Navigate to desired screen in app
2. Press Side Button + Volume Up (iPhone X and later)
3. Screenshots saved to Photos app
4. AirDrop to Mac for processing

#### Android Physical Device
1. Navigate to desired screen
2. Press Power + Volume Down
3. Screenshots saved to Gallery
4. Transfer to computer via USB or cloud

### Method 3: Design Tools (For Marketing Text Overlays)

#### Using Figma (Recommended)
1. Import device mockup frames
2. Place screenshots in frames
3. Add text overlays and design elements
4. Export at required dimensions

#### Using Adobe Photoshop
1. Create artboard at required size
2. Import screenshot
3. Add text layers and graphics
4. Export as PNG at 100% quality

#### Using Canva
1. Set custom dimensions
2. Upload screenshot
3. Add text and design elements
4. Download as PNG

## Quality Checklist

### Technical Requirements
- [ ] Correct dimensions for each device size
- [ ] PNG format (or high-quality JPEG)
- [ ] No compression artifacts
- [ ] Proper aspect ratios maintained
- [ ] File size under 8MB (Google Play requirement)

### Content Requirements
- [ ] Realistic demo data (no placeholder text)
- [ ] Proper localization (FR for French store, EN for English store)
- [ ] No typos or grammatical errors
- [ ] Consistent branding throughout
- [ ] Clear, readable text overlays
- [ ] High contrast for readability
- [ ] Professional appearance

### Strategic Requirements
- [ ] Screenshots tell a cohesive story
- [ ] Key features highlighted
- [ ] Value proposition clear
- [ ] Call-to-action implied
- [ ] Differentiators showcased
- [ ] User benefits emphasized
- [ ] Progression from simple to advanced features

## Screenshot Organization

### Directory Structure
```
store-assets/screenshots/
├── ios/
│   ├── iphone-6.7/
│   │   ├── 01-hero.png
│   │   ├── 02-daily-budget.png
│   │   └── ...
│   ├── iphone-6.5/
│   └── iphone-5.5/
├── android/
│   ├── phone/
│   └── tablet/
└── source/
    └── raw-screenshots/
```

### Naming Convention
```
[platform]-[device-size]-[number]-[description].[extension]

Examples:
- ios-6.7-01-hero.png
- ios-6.5-02-daily-budget.png
- android-phone-01-hero.png
```

## Marketing Text Examples

### French Store (App Store Connect & Google Play Console)

#### Screenshot 1 (Hero)
**Title**: Maîtrisez votre budget quotidien
**Subtitle**: Sachez exactement ce que vous pouvez dépenser chaque jour

#### Screenshot 2 (Daily Budget)
**Title**: Budget personnalisé
**Subtitle**: Adapté à vos revenus et vos charges

#### Screenshot 3 (Add Expense)
**Title**: Suivi simplifié
**Subtitle**: Enregistrez vos dépenses en quelques secondes

#### Screenshot 4 (Expense History)
**Title**: Historique complet
**Subtitle**: Visualisez toutes vos transactions

#### Screenshot 5 (Configuration)
**Title**: 100% personnalisable
**Subtitle**: Configurez selon votre situation financière

### English Store

#### Screenshot 1 (Hero)
**Title**: Master Your Daily Budget
**Subtitle**: Know exactly what you can spend today

#### Screenshot 2 (Daily Budget)
**Title**: Personalized Budgeting
**Subtitle**: Adapted to your income and expenses

#### Screenshot 3 (Add Expense)
**Title**: Simple Tracking
**Subtitle**: Log expenses in seconds

#### Screenshot 4 (Expense History)
**Title**: Complete History
**Subtitle**: View all your transactions

#### Screenshot 5 (Configuration)
**Title**: 100% Customizable
**Subtitle**: Configure to your financial situation

## Tools and Resources

### Screenshot Mockup Tools
- [Previewed](https://previewed.app/) - Device mockup generator
- [Mockuphone](https://mockuphone.com/) - Free device mockups
- [Smartmockups](https://smartmockups.com/) - Professional mockups
- [Figma + Device Mockup Plugins](https://www.figma.com/)

### Screenshot Annotation Tools
- [Figma](https://figma.com) - Professional design tool
- [Canva](https://canva.com) - Easy-to-use design tool
- [Adobe Express](https://www.adobe.com/express/) - Quick designs
- [Sketch](https://www.sketch.com/) - Mac-only design tool

### Screenshot Optimization
- [TinyPNG](https://tinypng.com/) - PNG compression
- [ImageOptim](https://imageoptim.com/) - Mac image optimizer
- [Squoosh](https://squoosh.app/) - Online image optimizer

### ASO Screenshot Best Practices
- [Apple App Store Screenshot Guidelines](https://developer.apple.com/app-store/product-page/)
- [Google Play Screenshot Best Practices](https://developer.android.com/distribute/best-practices/launch/store-listing)
- [App Annie ASO Guide](https://www.data.ai/en/academy/)

## Testing and Validation

### Before Submission
1. **Preview on Devices**: View screenshots on actual devices
2. **A/B Testing**: Create multiple versions and test with target audience
3. **Competitor Analysis**: Compare with similar successful apps
4. **Stakeholder Review**: Get feedback from team members
5. **Localization Check**: Ensure text is properly translated and culturally appropriate
6. **Technical Validation**: Verify all dimensions and formats are correct

### App Store Connect Preview
- Use App Store Connect screenshot preview
- Check appearance in different contexts (search results, product page)
- Verify on different device sizes

### Google Play Console Preview
- Use Google Play Console store listing preview
- Test on different screen sizes
- Check tablet appearance if applicable

## Timeline and Process

### Phase 1: Planning (1 day)
- Review app features
- Define key messages
- Create screenshot storyboard
- Gather demo data

### Phase 2: Capture (1 day)
- Set up simulators/emulators
- Capture raw screenshots
- Organize files
- Review for quality

### Phase 3: Design (2-3 days)
- Create text overlays
- Add marketing copy
- Apply branding
- Create variations

### Phase 4: Review (1 day)
- Internal review
- Make revisions
- Get stakeholder approval
- Finalize versions

### Phase 5: Export (1 day)
- Export all required sizes
- Optimize file sizes
- Organize for upload
- Document file mapping

## Maintenance

### When to Update Screenshots
- Major UI redesign
- New significant features
- Seasonal promotions
- ASO optimization efforts
- Poor conversion rates
- Competitor updates
- Store policy changes

### Version Control
- Keep source files (PSD, Figma, etc.)
- Version screenshots (v1, v2, etc.)
- Document changes and A/B test results
- Maintain both French and English versions

---

**Note**: This is a living document. Update as requirements change or new platform features are introduced.
