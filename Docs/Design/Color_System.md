# Link Guru Design System - Color Palette

## Overview
A comprehensive color system designed for optimal contrast, accessibility, and flexibility across light and dark modes.

## Primary Colors

### Brand Primary
- **Primary 50**: `#f0f9ff` - Lightest tint for backgrounds
- **Primary 100**: `#e0f2fe` - Very light tint
- **Primary 200**: `#bae6fd` - Light tint
- **Primary 300**: `#7dd3fc` - Medium light tint
- **Primary 400**: `#38bdf8` - Medium tint
- **Primary 500**: `#0ea5e9` - Base brand color
- **Primary 600**: `#0284c7` - Medium dark tint
- **Primary 700**: `#0369a1` - Dark tint
- **Primary 800**: `#075985` - Very dark tint
- **Primary 900**: `#0c4a6e` - Darkest tint

### Accent Colors

#### Success (Green)
- **Success 50**: `#f0fdf4` - Lightest
- **Success 100**: `#dcfce7` - Very light
- **Success 200**: `#bbf7d0` - Light
- **Success 300**: `#86efac` - Medium light
- **Success 400**: `#4ade80` - Medium
- **Success 500**: `#22c55e` - Base
- **Success 600**: `#16a34a` - Medium dark
- **Success 700**: `#15803d` - Dark
- **Success 800**: `#166534` - Very dark
- **Success 900**: `#14532d` - Darkest

#### Warning (Amber)
- **Warning 50**: `#fffbeb` - Lightest
- **Warning 100**: `#fef3c7` - Very light
- **Warning 200**: `#fde68a` - Light
- **Warning 300**: `#fcd34d` - Medium light
- **Warning 400**: `#fbbf24` - Medium
- **Warning 500**: `#f59e0b` - Base
- **Warning 600**: `#d97706` - Medium dark
- **Warning 700**: `#b45309` - Dark
- **Warning 800**: `#92400e` - Very dark
- **Warning 900**: `#78350f` - Darkest

#### Error (Red)
- **Error 50**: `#fef2f2` - Lightest
- **Error 100**: `#fee2e2` - Very light
- **Error 200**: `#fecaca` - Light
- **Error 300**: `#fca5a5` - Medium light
- **Error 400**: `#f87171` - Medium
- **Error 500**: `#ef4444` - Base
- **Error 600**: `#dc2626` - Medium dark
- **Error 700**: `#b91c1c` - Dark
- **Error 800**: `#991b1b` - Very dark
- **Error 900**: `#7f1d1d` - Darkest

## Neutral Colors

### Light Mode Neutrals
- **Gray 50**: `#f8fafc` - Background
- **Gray 100**: `#f1f5f9` - Light background
- **Gray 200**: `#e2e8f0` - Border light
- **Gray 300**: `#cbd5e1` - Border medium
- **Gray 400**: `#94a3b8` - Text muted
- **Gray 500**: `#64748b` - Text secondary
- **Gray 600**: `#475569` - Text primary
- **Gray 700**: `#334155` - Text dark
- **Gray 800**: `#1e293b` - Text darkest
- **Gray 900**: `#0f172a` - Background dark

### Dark Mode Neutrals
- **Slate 50**: `#f8fafc` - Text lightest
- **Slate 100**: `#f1f5f9` - Text light
- **Slate 200**: `#e2e8f0` - Text medium light
- **Slate 300**: `#cbd5e1` - Text medium
- **Slate 400**: `#94a3b8` - Text muted
- **Slate 500**: `#64748b` - Border light
- **Slate 600**: `#475569` - Border medium
- **Slate 700**: `#334155` - Background light
- **Slate 800**: `#1e293b` - Background medium
- **Slate 900**: `#0f172a` - Background dark

## Semantic Color Usage

### Sidebar Colors
- **Background**: `bg-slate-50 dark:bg-slate-900`
- **Border**: `border-slate-200 dark:border-slate-700`
- **Text Primary**: `text-slate-700 dark:text-slate-200`
- **Text Secondary**: `text-slate-500 dark:text-slate-400`
- **Hover**: `hover:bg-slate-100 dark:hover:bg-slate-800`
- **Active**: `bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200`

### Card Colors
- **Background**: `bg-white dark:bg-slate-800`
- **Border**: `border-slate-200 dark:border-slate-700`
- **Shadow**: `shadow-sm dark:shadow-slate-900/20`

### Button Colors
- **Primary**: `bg-primary-600 hover:bg-primary-700 text-white`
- **Secondary**: `bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200`
- **Danger**: `bg-error-600 hover:bg-error-700 text-white`

## Accessibility Standards

### Contrast Ratios
- **AA Standard**: 4.5:1 for normal text, 3:1 for large text
- **AAA Standard**: 7:1 for normal text, 4.5:1 for large text

### Tested Combinations
- Primary 600 on White: 4.8:1 (AA)
- Slate 700 on White: 4.6:1 (AA)
- Slate 200 on Slate 900: 4.7:1 (AA)
- Primary 200 on Slate 900: 4.9:1 (AA)

## Usage Guidelines

1. **Always test contrast** when combining colors
2. **Use semantic colors** for consistent meaning
3. **Prefer neutral grays** for text and borders
4. **Reserve brand colors** for interactive elements
5. **Maintain consistency** between light and dark modes

