# Educational Web Application Style Guide

This CSS framework provides a comprehensive set of reusable components for educational web applications, interactive learning interfaces, and content management systems.

## Core Philosophy

- **Agnostic Design**: Components work for any educational content, not just psychology experiments
- **Semantic Naming**: Classes describe function, not specific use cases  
- **Progressive Enhancement**: Basic functionality works everywhere, enhanced features layer on top
- **Responsive by Default**: All components adapt to different screen sizes

## Component Categories

### 1. Layout Components

#### Card Grids
```css
.card-grid          /* Responsive grid for content cards (320px min-width) */
.centered-grid      /* Alternative grid for centered content (280px min-width) */
.step-grid          /* Legacy alias for step-based content */
.option-grid        /* Legacy alias for centered options */
```

#### Content Cards
```css
.content-card       /* Modern flexible content container */
.step-card          /* Legacy alias for step-based content */
.centered-card      /* Centered content with smaller footprint */
.option-card        /* Legacy alias for option selection */
```

#### Content Sections
```css
.content-section    /* Main content area with border */
.content-box        /* Highlighted content with left accent border */
.info-section       /* Information highlight section */
.highlight-section  /* General purpose highlight */
.configuration-section /* Settings and config areas */
```

### 2. Interactive Components

#### Buttons
```css
.primary-btn        /* Main action button (blue) */
.secondary-btn      /* Secondary action button (gray) */
.action-btn         /* Generic action button */
.btn                /* Base button class with .primary/.secondary modifiers */

/* Button Modifiers */
.compact            /* Smaller padding for inline buttons */
```

#### Status Elements
```css
.status-badge       /* General status indicator */
.step-status        /* Legacy alias for step progress */

/* Status Modifiers */
.available          /* Green - ready/active state */
.pending            /* Yellow - waiting/upcoming state */
.disabled           /* Gray - inactive state */
```

### 3. Interface Components

#### Headers
```css
.app-header         /* Application header section */
.game-header        /* Legacy alias for interactive headers */
```

#### Interactive Sections
```css
.interactive-section /* Main interactive area */
.experiment-section  /* Legacy alias for experiments */
```

#### Navigation
```css
.progress-bar       /* Progress indicator container */
.progress-step      /* Individual progress item */
.navigation         /* Navigation button container */
.nav-btn            /* Navigation button */
```

### 4. Content Components

#### Expandable Content
```css
.concept-card       /* Collapsible FAQ-style content */
.card-header        /* Clickable header for expansion */
.card-content       /* Collapsible content area */
.toggle-icon        /* Rotation indicator for expansion */
```

#### Educational Content
```css
.formula            /* Mathematical formula display */
.parameter-grid     /* Grid for parameter/setting displays */
.parameter-box      /* Individual parameter container */
```

#### Code and Technical
```css
.code-block         /* Syntax-highlighted code container */
.formatted-prompt   /* Styled prompt/instruction blocks */
```

### 5. Validation and Testing

#### Results Display
```css
.result-item        /* Individual result/test item */
.test-result        /* Legacy alias for test results */

/* Result States */
.result-pass        /* Success state (green) */
.result-fail        /* Failure state (red) */
.test-pass          /* Legacy success alias */
.test-fail          /* Legacy failure alias */
```

#### Testing Interface
```css
.test-summary       /* Test suite summary */
.test-suite-results /* Test suite container */
.suite-summary      /* Individual suite summary */
```

## Usage Patterns

### Basic Content Layout
```html
<div class="content-section">
    <h3>Section Title</h3>
    <div class="content-box">
        <h4>Subsection</h4>
        <p>Content goes here...</p>
        <button class="primary-btn">Take Action</button>
    </div>
</div>
```

### Card Grid Layout
```html
<div class="card-grid">
    <div class="content-card">
        <div class="status-badge available">Ready</div>
        <h3>Card Title</h3>
        <p>Card description...</p>
        <div class="card-footer">
            <a href="#" class="primary-btn">Learn More</a>
        </div>
    </div>
</div>
```

### Interactive Interface
```html
<div class="interactive-section">
    <div class="app-header">
        <h2>Application Title</h2>
        <div class="progress-bar">
            <div class="progress-step active">Step 1</div>
            <div class="progress-step">Step 2</div>
        </div>
    </div>
    <!-- Interactive content -->
</div>
```

## Migration Guide

### From Experiment-Specific to Agnostic

| Old Class | New Class | Notes |
|-----------|-----------|-------|
| `.step-section` | `.content-section` | More generic naming |
| `.step-box` | `.content-box` | Can be used for any highlighted content |
| `.experiment-section` | `.interactive-section` | Broader application scope |
| `.config-section` | `.configuration-section` | More formal naming |
| `.game-header` | `.app-header` | Application-agnostic |

### Legacy Support

All old class names are maintained as aliases to ensure backwards compatibility. You can migrate gradually:

```css
/* Both work the same */
.step-section { /* legacy */ }
.content-section { /* preferred */ }
```

## Responsive Behavior

- **Mobile (< 768px)**: Single column layouts, larger touch targets
- **Tablet (768px - 1024px)**: Flexible grid layouts adapt to available space  
- **Desktop (> 1024px)**: Full multi-column layouts with hover states

## Browser Support

- **Modern Browsers**: Full feature support with animations and transitions
- **Legacy Browsers**: Graceful degradation, core functionality maintained
- **Accessibility**: Screen reader friendly, keyboard navigation support

## Customization

The framework uses CSS custom properties for easy theming:

```css
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --accent-color: #667eea;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
}
```

## Best Practices

1. **Use semantic class names** that describe purpose, not appearance
2. **Combine base classes with modifiers** (e.g., `.primary-btn.compact`)
3. **Prefer content-focused over layout-focused** class names
4. **Test across devices** to ensure responsive behavior
5. **Validate accessibility** with screen readers and keyboard navigation 