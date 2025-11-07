# PACE Application - Expected UI

## When Running on iOS Simulator or Physical Device

The application displays a simple, centered layout on a white background:

```
╔═══════════════════════════════════╗
║                                   ║
║                                   ║
║                                   ║
║                                   ║
║           Hello World!            ║
║         Welcome to PACE           ║
║                                   ║
║                                   ║
║                                   ║
║                                   ║
╚═══════════════════════════════════╝
```

### Visual Details:

**Main Title: "Hello World!"**
- Font Size: 32 pixels
- Font Weight: Bold
- Color: Black (#000000)
- Position: Center of screen

**Subtitle: "Welcome to PACE"**
- Font Size: 18 pixels
- Font Weight: Normal
- Color: Gray (#666666)
- Position: Below the title (10px margin)

**Background:**
- Color: White (#FFFFFF)
- Layout: Flexbox centered (both horizontally and vertically)

### Status Bar:
- Auto-styled based on the device's color scheme (light/dark mode)

## How This Meets the Requirements:

✅ **Epic 0 Objective Achieved**: The application displays "Hello World" and can run on:
- iPhone Simulator (via Mac with Xcode)
- Physical iPhone (via Expo Go app)

✅ **User Experience**: 
- Clean, simple interface
- Professional typography
- Responsive layout that works on all iOS screen sizes
- Immediate visual confirmation that the app is working

## Testing Checklist:

When you run the app, verify:
- [ ] App loads without errors
- [ ] "Hello World!" text is visible and bold
- [ ] "Welcome to PACE" subtitle is visible in gray
- [ ] Text is centered on the screen
- [ ] White background is displayed
- [ ] Status bar is visible at the top
- [ ] Hot reload works (change text in App.js and see it update)

## Next Steps:

After confirming the Hello World app works:
1. ✏️ Edit `App.js` to customize the message
2. 🎨 Add more styling to make it your own
3. 📱 Test on different iOS devices/simulators
4. 🚀 Build your first feature!
