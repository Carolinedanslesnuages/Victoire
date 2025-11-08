# PACE App Icon Guidelines

## Overview
This document provides comprehensive guidelines for creating and implementing the PACE app icon for both iOS and Android platforms.

## Design Concept
PACE is a budget management application that helps users control their daily spending. The icon should convey:
- **Financial Management**: Money, budgeting, control
- **Simplicity**: Clean, modern, easy to understand
- **Progress/Movement**: The concept of "pace" and tracking
- **Trust**: Professional, reliable, secure

## Icon Specifications

### iOS Icon

#### Requirements
- **Format**: PNG (no transparency)
- **Size**: 1024x1024 pixels
- **Color Space**: sRGB or P3
- **Shape**: Square (iOS automatically applies rounded corners)
- **File**: `icon-ios.png`

#### Design Guidelines
1. **No Transparency**: iOS icons must have an opaque background
2. **Safe Area**: Keep important elements within 90% of the icon area (corners get rounded)
3. **Simplicity**: Icon should be recognizable at small sizes (20x20 to 1024x1024)
4. **No Text**: Avoid including app name in the icon
5. **Consistency**: Follow iOS design language (flat, modern, colorful)

#### Recommended Design Elements
- Primary Color: **#4A90E2** (Professional Blue) or **#34C759** (Success Green)
- Secondary Color: White or complementary shade
- Symbol Ideas:
  - Stylized "P" for PACE
  - Speedometer/gauge showing budget status
  - Calendar with currency symbol
  - Minimalist wallet/purse icon
  - Progress bar with currency symbol

### Android Adaptive Icon

#### Requirements
Android uses adaptive icons with two layers:
- **Foreground Layer**: 108x108 dp (1080x1080 px at xxxhdpi)
- **Background Layer**: 108x108 dp (1080x1080 px at xxxhdpi)
- **Safe Zone**: Important content within central 66x66 dp circle
- **Format**: PNG with transparency for foreground
- **Files**: `adaptive-icon-foreground.png` and `adaptive-icon-background.png`

#### Design Guidelines
1. **Foreground Layer**:
   - Contains the main icon symbol
   - Can use transparency
   - Keep within safe zone (central 66dp circle)
   - Should work on any background

2. **Background Layer**:
   - Solid color or subtle gradient
   - No transparency
   - Fills entire 108x108 dp area
   - Complements foreground layer

3. **Safe Zone**: 
   - Central 66x66 dp area guaranteed visible
   - Outer 21 dp on each side may be masked by device

#### Android Icon Shapes
Different Android devices may apply different masks:
- Circle
- Rounded square
- Squircle (square with rounded corners)
- Teardrop

Ensure your design works with all these shapes.

## Color Palette Recommendations

### Primary Palette
```
Blue Theme (Recommended):
- Primary: #4A90E2 (Trust, professionalism)
- Secondary: #FFFFFF (Clean, simple)
- Accent: #2E5C8A (Darker blue for depth)

Green Theme (Alternative):
- Primary: #34C759 (Success, positive)
- Secondary: #FFFFFF
- Accent: #248A3D (Darker green)

Purple Theme (Alternative):
- Primary: #AF52DE (Modern, creative)
- Secondary: #FFFFFF
- Accent: #7D3BAC (Darker purple)
```

## Technical Implementation

### Current Configuration (app.json)
```json
{
  "icon": "./assets/icon.png",
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    }
  }
}
```

### Recommended Configuration
After creating new icons:
```json
{
  "icon": "./assets/icon-ios.png",
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon-foreground.png",
      "backgroundColor": "#4A90E2"
    }
  }
}
```

## Icon Generation Tools

### Online Tools
1. **Figma**: Professional design tool (free tier available)
2. **Adobe Express**: Icon maker with templates
3. **Canva**: Easy-to-use with icon templates
4. **Icon Kitchen**: Android adaptive icon generator

### Command Line Tools
1. **ImageMagick**: For resizing and format conversion
   ```bash
   # Resize to 1024x1024
   convert source.png -resize 1024x1024 icon-ios.png
   ```

2. **Expo Tools**: Generate all icon sizes
   ```bash
   npx expo-optimize
   ```

## Quality Checklist

### iOS Icon
- [ ] 1024x1024 pixels
- [ ] PNG format
- [ ] No transparency
- [ ] sRGB color space
- [ ] Recognizable at all sizes
- [ ] Follows iOS design guidelines
- [ ] No text included
- [ ] Professional and polished

### Android Adaptive Icon
- [ ] Foreground: 1080x1080 pixels with transparency
- [ ] Background: 1080x1080 pixels, solid color
- [ ] Important content within 66dp safe zone
- [ ] Works with all device shapes (circle, square, etc.)
- [ ] Foreground contrasts with background
- [ ] No text in outer 21dp margins
- [ ] Tested on multiple device previews

## Design Tips

1. **Start Simple**: Begin with basic shapes and refine
2. **Test at Multiple Sizes**: Ensure legibility from 20x20 to 1024x1024
3. **Use Vector Graphics**: Create in vector format first, then export to PNG
4. **Maintain Consistency**: Keep the brand identity across platforms
5. **Get Feedback**: Test with potential users before finalizing
6. **Check Competition**: Review similar apps for inspiration (not copying)
7. **Dark/Light Modes**: Ensure icon works on both light and dark backgrounds

## Example Design Process

### Step 1: Concept Sketches
Create 3-5 rough concepts on paper or digital sketching tool

### Step 2: Digital Mockups
Choose best concept and create in design tool (Figma/Adobe XD)

### Step 3: Create Master Files
- iOS: 1024x1024 square
- Android Foreground: 1080x1080 with safe zone guidelines
- Android Background: 1080x1080 solid

### Step 4: Export and Test
- Export at required sizes
- Test in iOS simulator
- Test in Android emulator with different masks
- View on actual devices if possible

### Step 5: Refine
Make adjustments based on testing feedback

## Resources

### Design Inspiration
- [iOS Human Interface Guidelines - App Icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Android Material Design - Product Icons](https://material.io/design/iconography/product-icons.html)
- [Dribbble - App Icon Designs](https://dribbble.com/tags/app-icon)
- [Behance - Mobile App Icons](https://www.behance.net/search/projects?search=mobile%20app%20icon)

### Testing Tools
- [iOS Icon Preview](https://www.appicon.co)
- [Android Adaptive Icon Preview](https://adapticon.tooo.io)
- Xcode Simulator (iOS)
- Android Studio Emulator (Android)

## Next Steps

1. Create initial icon concepts based on these guidelines
2. Get stakeholder approval on chosen concept
3. Create final assets at required sizes
4. Update `app.json` configuration
5. Test icons in simulators/emulators
6. Submit to App Store and Google Play Store

---

**Note**: This is a living document. Update as icon designs evolve or platform requirements change.
