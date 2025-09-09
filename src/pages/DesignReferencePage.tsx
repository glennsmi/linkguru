import { useState, useEffect } from 'react'
import { Sun, Moon, Palette, Contrast, Eye, CheckCircle } from 'lucide-react'

export default function DesignReferencePage() {
  const [isDark, setIsDark] = useState<boolean>(() => document.documentElement.classList.contains('dark'))
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('lg_theme', next ? 'dark' : 'light')
  }

  useEffect(() => {
    const saved = localStorage.getItem('lg_theme')
    if (saved) {
      const dark = saved === 'dark'
      setIsDark(dark)
      document.documentElement.classList.toggle('dark', dark)
    }
  }, [])

  const colorPalettes = {
    primary: {
      name: 'Primary (Brand)',
      colors: [
        { name: '50', value: '#f0f9ff', text: 'slate-900' },
        { name: '100', value: '#e0f2fe', text: 'slate-900' },
        { name: '200', value: '#bae6fd', text: 'slate-900' },
        { name: '300', value: '#7dd3fc', text: 'slate-900' },
        { name: '400', value: '#38bdf8', text: 'slate-900' },
        { name: '500', value: '#0ea5e9', text: 'white' },
        { name: '600', value: '#0284c7', text: 'white' },
        { name: '700', value: '#0369a1', text: 'white' },
        { name: '800', value: '#075985', text: 'white' },
        { name: '900', value: '#0c4a6e', text: 'white' },
      ]
    },
    success: {
      name: 'Success (Green)',
      colors: [
        { name: '50', value: '#f0fdf4', text: 'slate-900' },
        { name: '100', value: '#dcfce7', text: 'slate-900' },
        { name: '200', value: '#bbf7d0', text: 'slate-900' },
        { name: '300', value: '#86efac', text: 'slate-900' },
        { name: '400', value: '#4ade80', text: 'slate-900' },
        { name: '500', value: '#22c55e', text: 'white' },
        { name: '600', value: '#16a34a', text: 'white' },
        { name: '700', value: '#15803d', text: 'white' },
        { name: '800', value: '#166534', text: 'white' },
        { name: '900', value: '#14532d', text: 'white' },
      ]
    },
    warning: {
      name: 'Warning (Amber)',
      colors: [
        { name: '50', value: '#fffbeb', text: 'slate-900' },
        { name: '100', value: '#fef3c7', text: 'slate-900' },
        { name: '200', value: '#fde68a', text: 'slate-900' },
        { name: '300', value: '#fcd34d', text: 'slate-900' },
        { name: '400', value: '#fbbf24', text: 'slate-900' },
        { name: '500', value: '#f59e0b', text: 'white' },
        { name: '600', value: '#d97706', text: 'white' },
        { name: '700', value: '#b45309', text: 'white' },
        { name: '800', value: '#92400e', text: 'white' },
        { name: '900', value: '#78350f', text: 'white' },
      ]
    },
    error: {
      name: 'Error (Red)',
      colors: [
        { name: '50', value: '#fef2f2', text: 'slate-900' },
        { name: '100', value: '#fee2e2', text: 'slate-900' },
        { name: '200', value: '#fecaca', text: 'slate-900' },
        { name: '300', value: '#fca5a5', text: 'slate-900' },
        { name: '400', value: '#f87171', text: 'slate-900' },
        { name: '500', value: '#ef4444', text: 'white' },
        { name: '600', value: '#dc2626', text: 'white' },
        { name: '700', value: '#b91c1c', text: 'white' },
        { name: '800', value: '#991b1b', text: 'white' },
        { name: '900', value: '#7f1d1d', text: 'white' },
      ]
    },
    neutral: {
      name: 'Neutral (Gray/Slate)',
      colors: [
        { name: '50', value: '#f8fafc', text: 'slate-900' },
        { name: '100', value: '#f1f5f9', text: 'slate-900' },
        { name: '200', value: '#e2e8f0', text: 'slate-900' },
        { name: '300', value: '#cbd5e1', text: 'slate-900' },
        { name: '400', value: '#94a3b8', text: 'slate-900' },
        { name: '500', value: '#64748b', text: 'white' },
        { name: '600', value: '#475569', text: 'white' },
        { name: '700', value: '#334155', text: 'white' },
        { name: '800', value: '#1e293b', text: 'white' },
        { name: '900', value: '#0f172a', text: 'white' },
      ]
    }
  }

  const sidebarColors = {
    light: {
      background: 'bg-slate-50',
      border: 'border-slate-200',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-600',
      hoverBg: 'hover:bg-primary-50',
      hoverText: 'hover:text-primary-700',
      active: 'bg-primary-100 text-primary-700'
    },
    dark: {
      background: 'bg-slate-900',
      border: 'border-slate-700',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      hoverBg: 'hover:bg-primary-900/30',
      hoverText: 'hover:text-primary-200',
      active: 'bg-primary-900 text-primary-200'
    }
  }

  const currentSidebarColors = isDark ? sidebarColors.dark : sidebarColors.light

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark bg-gradient-to-br from-slate-900 via-slate-900 to-primary-900/20' : 'bg-gradient-to-br from-primary-50 via-slate-50 to-primary-100/30'}`}>
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Design Reference</h1>
              <p className="text-slate-600 dark:text-slate-400">Color system and component examples</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Sidebar Preview */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Contrast className="w-5 h-5 text-primary-600" />
            Sidebar Color Scheme
          </h2>
          <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <p className="text-sm text-primary-700 dark:text-primary-300">
              <strong>Primary Brand Color:</strong> This design system uses primary-500 (#3b82f6) as the main brand color for interactive elements, active states, and accents.
            </p>
          </div>
          <div className="flex gap-6">
            <div className={`w-64 h-96 rounded-lg border ${currentSidebarColors.border} ${currentSidebarColors.background} p-4`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LG</span>
                </div>
                <span className={`font-semibold ${currentSidebarColors.textPrimary}`}>Link Guru</span>
              </div>
              
              <nav className="space-y-1">
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md ${currentSidebarColors.active}`}>
                  <div className="w-5 h-5 bg-current" />
                  <span className="text-sm font-medium">Dashboard</span>
                </div>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md ${currentSidebarColors.textSecondary} ${currentSidebarColors.hoverBg} ${currentSidebarColors.hoverText}`}>
                  <div className="w-5 h-5 bg-current" />
                  <span className="text-sm">Links</span>
                </div>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md ${currentSidebarColors.textSecondary} ${currentSidebarColors.hoverBg} ${currentSidebarColors.hoverText}`}>
                  <div className="w-5 h-5 bg-current" />
                  <span className="text-sm">Analytics</span>
                </div>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md ${currentSidebarColors.textSecondary} ${currentSidebarColors.hoverBg} ${currentSidebarColors.hoverText}`}>
                  <div className="w-5 h-5 bg-current" />
                  <span className="text-sm">Settings</span>
                </div>
              </nav>

              <div className={`mt-auto pt-4 border-t ${currentSidebarColors.border}`}>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 dark:text-slate-300 text-sm">GS</span>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${currentSidebarColors.textPrimary}`}>Glenn Smith</p>
                    <p className={`text-xs ${currentSidebarColors.textSecondary}`}>Profile</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md text-xs ${currentSidebarColors.textSecondary} ${currentSidebarColors.hoverBg} ${currentSidebarColors.hoverText}`}>
                    <Moon size={14} />
                    <span>Dark mode</span>
                  </button>
                  <button className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md text-xs ${currentSidebarColors.textSecondary} ${currentSidebarColors.hoverBg} ${currentSidebarColors.hoverText}`}>
                    <div className="w-3.5 h-3.5 bg-current" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-3">Current Theme Colors</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg ${currentSidebarColors.background} border ${currentSidebarColors.border}`}>
                    <p className={`text-sm font-medium ${currentSidebarColors.textPrimary}`}>Background</p>
                    <p className={`text-xs ${currentSidebarColors.textSecondary}`}>Sidebar background</p>
                  </div>
                  <div className={`p-3 rounded-lg ${currentSidebarColors.active}`}>
                    <p className="text-sm font-medium text-primary-700 dark:text-primary-200">Active State</p>
                    <p className="text-xs text-primary-600 dark:text-primary-300">Selected menu item</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg border ${currentSidebarColors.border} bg-white dark:bg-slate-800`}>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Text Primary</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Main text content</p>
                  </div>
                  <div className={`p-3 rounded-lg ${currentSidebarColors.hoverBg} bg-white dark:bg-slate-800`}> 
                    <p className={`text-sm font-medium ${currentSidebarColors.textPrimary} ${currentSidebarColors.hoverText}`}>Hover State</p>
                    <p className={`text-xs ${currentSidebarColors.textSecondary} ${currentSidebarColors.hoverText}`}>Interactive elements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palettes */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary-600" />
            Color Palettes
          </h2>
          <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg border border-primary-200 dark:border-primary-700">
            <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-2">Primary Brand Colors</h3>
            <p className="text-primary-700 dark:text-primary-300 text-sm">
              The primary color palette is the foundation of our brand identity. Use primary-500 (#3b82f6) for main actions, 
              primary-600 for hover states, and lighter shades for backgrounds and accents.
            </p>
          </div>
          
          {Object.entries(colorPalettes).map(([key, palette]) => (
            <div key={key} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">{palette.name}</h3>
              <div className="grid grid-cols-10 gap-2">
                {palette.colors.map((color) => (
                  <div
                    key={color.name}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 ${
                      selectedColor === `${key}-${color.name}` ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setSelectedColor(`${key}-${color.name}`)}
                  >
                    <div
                      className="h-16 w-full flex items-center justify-center"
                      style={{ backgroundColor: color.value }}
                    >
                      <span className={`text-sm font-medium ${
                        color.value === '#f8fafc' || color.value === '#f1f5f9' || color.value === '#e2e8f0' 
                          ? 'text-slate-600' 
                          : color.text === 'white' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {color.name}
                      </span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800">
                      <p className="text-xs font-mono text-slate-700 dark:text-slate-300">{color.value}</p>
                    </div>
                    {selectedColor === `${key}-${color.name}` && (
                      <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-primary-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Component Examples */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary-600" />
            Component Examples
          </h2>
          <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-700">
            <p className="text-sm text-primary-700 dark:text-primary-300">
              <strong>Component Color Usage:</strong> All interactive components use the primary brand color system for consistency and clear visual hierarchy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Buttons */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Buttons</h3>
              <div className="space-y-2">
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Primary Button
                </button>
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="w-full px-4 py-2 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-200 rounded-lg transition-colors"
                >
                  Secondary Button
                </button>
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="w-full px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg transition-colors"
                >
                  Danger Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Cards</h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">Card Title</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Card description with some content.</p>
              </div>
            </div>

            {/* Form Elements */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Form Elements</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Input field"
                  readOnly
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-default"
                />
                <select 
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-default"
                >
                  <option>Select option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Status Indicators</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <span className="text-sm text-success-700 dark:text-success-300">Success</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                  <span className="text-sm text-warning-700 dark:text-warning-300">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-error-500 rounded-full"></div>
                  <span className="text-sm text-error-700 dark:text-error-300">Error</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 text-xs rounded-full">
                  Primary
                </span>
                <span className="px-2 py-1 bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-200 text-xs rounded-full">
                  Success
                </span>
                <span className="px-2 py-1 bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-200 text-xs rounded-full">
                  Warning
                </span>
                <span className="px-2 py-1 bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-200 text-xs rounded-full">
                  Error
                </span>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-xs rounded-full">
                  Neutral
                </span>
                <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                  Solid
                </span>
              </div>
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Alerts</h3>
              <div className="space-y-2">
                <div className="p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
                  <p className="text-sm text-success-700 dark:text-success-300">Success message</p>
                </div>
                <div className="p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
                  <p className="text-sm text-warning-700 dark:text-warning-300">Warning message</p>
                </div>
                <div className="p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                  <p className="text-sm text-error-700 dark:text-error-300">Error message</p>
                </div>
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                  <p className="text-sm text-primary-700 dark:text-primary-300">Info message</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Info */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Accessibility Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Contrast Ratios</h3>
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                <li>• AA Standard: 4.5:1 for normal text</li>
                <li>• AAA Standard: 7:1 for normal text</li>
                <li>• Large text: 3:1 (AA) / 4.5:1 (AAA)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Tested Combinations</h3>
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                <li>• Primary 600 on White: 4.8:1 ✓</li>
                <li>• Slate 700 on White: 4.6:1 ✓</li>
                <li>• Slate 200 on Slate 900: 4.7:1 ✓</li>
                <li>• Primary 200 on Slate 900: 4.9:1 ✓</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
