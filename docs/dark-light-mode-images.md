# Dark Mode / Light Mode Image Transitions

This document explains the different approaches implemented for smooth transitions between dark and light mode images on the website.

## Three Approaches

### 1. Theme-Aware Container

This approach uses two separate images (one for dark mode, one for light mode) that are positioned on top of each other. CSS transitions handle the opacity to smoothly fade between them when the theme changes.

#### HTML Implementation:

```html
<div class="theme-aware-container">
    <img src="path/to/dark-image.jpg" alt="Image (Dark)" class="theme-aware-image dark-mode-image">
    <img src="path/to/light-image.jpg" alt="Image (Light)" class="theme-aware-image light-mode-image">
</div>
```

#### CSS Implementation:

```css
.theme-aware-container {
  position: relative;
  display: inline-block;
}

img.theme-aware-image {
  transition: opacity 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.dark-mode img.light-mode-image,
.light-mode img.dark-mode-image {
  opacity: 0;
  position: absolute;
}

.dark-mode img.dark-mode-image,
.light-mode img.light-mode-image {
  opacity: 1;
  position: relative;
}
```

#### JavaScript Initialization:

```javascript
function setupThemeAwareImages() {
    document.querySelectorAll('.theme-aware-container').forEach(container => {
        const darkImage = container.querySelector('.dark-mode-image');
        const lightImage = container.querySelector('.light-mode-image');
        
        if (darkImage && lightImage) {
            // Ensure images have the same dimensions and styles
            darkImage.style.width = '100%';
            lightImage.style.width = '100%';
            lightImage.style.top = '0';
            lightImage.style.left = '0';
            
            // Set initial positions
            lightImage.style.position = 'absolute';
            darkImage.style.position = 'relative';
            
            // Apply initial visibility based on current theme
            updateThemeAwareImages();
        }
    });
}

function updateThemeAwareImages() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    document.querySelectorAll('.theme-aware-container').forEach(container => {
        const darkImage = container.querySelector('.dark-mode-image');
        const lightImage = container.querySelector('.light-mode-image');
        
        if (darkImage && lightImage) {
            if (isDarkMode) {
                darkImage.style.opacity = '1';
                darkImage.style.position = 'relative';
                lightImage.style.opacity = '0';
                lightImage.style.position = 'absolute';
            } else {
                darkImage.style.opacity = '0';
                darkImage.style.position = 'absolute';
                lightImage.style.opacity = '1';
                lightImage.style.position = 'relative';
            }
        }
    });
}
```

**Best for:** Content images that need completely different versions for dark and light mode.

### 2. Filename Replacement

This approach uses JavaScript to swap the image source when the theme changes. It looks for images with `-dark` or `-light` in the filename and replaces them.

#### HTML Implementation:

```html
<img src="path/to/dark-image.png" alt="Image">
```

#### JavaScript Implementation:

```javascript
// In updateThemeIcons function:
document.querySelectorAll('img[src*="-dark."], img[src*="-light."]').forEach(img => {
    const currentSrc = img.getAttribute('src');
    if (currentSrc) {
        if (isDarkMode && currentSrc.includes('-light.')) {
            img.src = currentSrc.replace('-light.', '-dark.');
        } else if (!isDarkMode && currentSrc.includes('-dark.')) {
            img.src = currentSrc.replace('-dark.', '-light.');
        }
    }
});
```

**Best for:** Icons and smaller images where maintaining separate dark/light versions is manageable.

### 3. CSS Filter

This approach uses CSS filters (like invert) to change the appearance of the image based on the theme.

#### HTML Implementation:

```html
<img src="path/to/image.png" alt="Image" class="filter-image">
```

#### CSS Implementation:

```css
.filter-image {
  filter: invert(0);
  transition: filter 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.light-mode .filter-image {
  filter: invert(1);
}
```

**Best for:** Simple icons or images that work well with CSS filters. Best for monochrome images or situations where a simple filter adjustment is sufficient.

## Implementation in the Codebase

The website implements all three approaches:

1. **Theme-Aware Container**: Used for content images that need different versions for dark/light mode
2. **Filename Replacement**: Used for social media icons and other interface elements
3. **CSS Filter**: Used for the hero background image and decorative elements

All three approaches include proper CSS transitions to ensure smooth theme changes with no abrupt visual changes.

## Adding New Images

### For Content Images:

1. Create both dark and light versions of your image
2. Use the theme-aware-container approach:

```html
<div class="theme-aware-container">
    <img src="path/to/dark-version.jpg" alt="Description" class="theme-aware-image dark-mode-image">
    <img src="path/to/light-version.jpg" alt="Description" class="theme-aware-image light-mode-image">
</div>
```

### For Icons:

1. Name your files consistently with `-dark` and `-light` suffixes
2. Reference the dark version in your HTML:

```html
<img src="path/to/icon-dark.png" alt="Icon">
```

The JavaScript will automatically handle the swap when the theme changes.

### For Simple Graphics:

1. Use the filter approach for simple graphics that work well with CSS filters:

```html
<img src="path/to/image.png" alt="Description" class="filter-image">
``` 