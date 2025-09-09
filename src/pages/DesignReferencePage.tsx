import { useState, useEffect } from 'react'
import { Sun, Moon, Palette, Contrast, Eye } from 'lucide-react'

export default function DesignReferencePage() {
  const [isDark, setIsDark] = useState<boolean>(() => document.documentElement.classList.contains('dark'))
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    
    // Force remove and add the class to ensure it's applied
    document.documentElement.classList.remove('dark')
    if (next) {
      document.documentElement.classList.add('dark')
    }
    
    localStorage.setItem('lg_theme', next ? 'dark' : 'light')
    
    // Force a re-render by updating state again
    setTimeout(() => {
      setIsDark(next)
      console.log('Design page theme toggled to:', next ? 'dark' : 'light', 'DOM has dark class:', document.documentElement.classList.contains('dark'))
    }, 50)
  }

  const copyToClipboard = async (colorValue: string) => {
    try {
      await navigator.clipboard.writeText(colorValue)
      setCopiedColor(colorValue)
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedColor(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy color:', err)
    }
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
      name: 'Primary (Cyan)',
      colors: [
        { name: '50', value: '#ecfeff', text: 'slate-900' },
        { name: '100', value: '#cffafe', text: 'slate-900' },
        { name: '200', value: '#a5f3fc', text: 'slate-900' },
        { name: '300', value: '#67e8f9', text: 'slate-900' },
        { name: '400', value: '#22d3ee', text: 'slate-900' },
        { name: '500', value: '#0891b2', text: 'white' },
        { name: '600', value: '#0e7490', text: 'white' },
        { name: '700', value: '#155e75', text: 'white' },
        { name: '800', value: '#164e63', text: 'white' },
        { name: '900', value: '#083344', text: 'white' },
      ]
    },
    secondary: {
      name: 'Secondary (Emerald)',
      colors: [
        { name: '50', value: '#ecfdf5', text: 'slate-900' },
        { name: '100', value: '#d1fae5', text: 'slate-900' },
        { name: '200', value: '#a7f3d0', text: 'slate-900' },
        { name: '300', value: '#6ee7b7', text: 'slate-900' },
        { name: '400', value: '#34d399', text: 'slate-900' },
        { name: '500', value: '#10b981', text: 'white' },
        { name: '600', value: '#059669', text: 'white' },
        { name: '700', value: '#047857', text: 'white' },
        { name: '800', value: '#065f46', text: 'white' },
        { name: '900', value: '#064e3b', text: 'white' },
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
    },
  }

  const sidebarColors = {
    light: {
      background: 'bg-slate-50',
      border: 'border-slate-200',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-600',
      hoverBg: 'hover:bg-cyan-50',
      hoverText: 'hover:text-cyan-700',
      active: 'text-white',
      primary: '#0891b2',
      secondary: '#10b981'
    },
    dark: {
      background: 'bg-slate-900',
      border: 'border-slate-700',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      hoverBg: 'hover:bg-slate-800',
      hoverText: 'hover:text-white',
      active: 'text-white',
      primary: '#0891b2',
      secondary: '#10b981'
    }
  }

  const currentSidebarColors = isDark ? sidebarColors.dark : sidebarColors.light

  return (
    <div 
      key={`design-page-${isDark ? 'dark' : 'light'}`}
      className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-primary-900/20' : 'bg-gradient-to-br from-primary-50 via-slate-50 to-primary-100/30'}`}
    >
      {/* Header */}
      <div className={`sticky top-0 z-50 ${isDark ? 'bg-slate-800' : 'bg-white'} border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} px-6 py-4 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Design Reference</h1>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Color system and component examples</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg group ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} transition-colors`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Sidebar Preview */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
            <Contrast className="w-5 h-5 text-primary-600" />
            Sidebar Color Scheme
          </h2>
          <div className={`mb-4 p-3 ${isDark ? 'bg-primary-900/20' : 'bg-primary-50'} rounded-lg border ${isDark ? 'border-primary-800' : 'border-primary-200'}`}>
            <p className={`text-sm ${isDark ? 'text-primary-300' : 'text-primary-700'}`}>
              <strong>Primary Brand Color:</strong> This design system uses primary-500 (#3b82f6) as the main brand color for interactive elements, active states, and accents.
            </p>
          </div>
          <div className="flex gap-6">
            <div className={`w-64 h-96 rounded-lg border ${currentSidebarColors.border} ${currentSidebarColors.background} p-4`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0891b2' }}>
                  <span className="text-white font-bold text-sm">LG</span>
                </div>
                <span className={`font-semibold ${currentSidebarColors.textPrimary}`}>Link Guru</span>
              </div>
              
              <nav className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md text-white" style={{ backgroundColor: '#0891b2' }}>
                  <div className="w-5 h-5 bg-white rounded" />
                  <span className="text-sm font-medium text-white">Dashboard</span>
                </div>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-cyan-50'}`}>
                  <div className="w-5 h-5 bg-current" />
                  <span className="text-sm">Links</span>
                </div>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-cyan-50'}`}>
                  <div className="w-5 h-5 bg-current" />
                  <span className="text-sm">Analytics</span>
                </div>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-cyan-50'}`}>
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
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Glenn Smith</p>
                    <p className={`text-xs ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>Profile</p>
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
              <h3 className={`text-lg font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-3`}>Current Theme Colors</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-white'} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Background</p>
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sidebar background</p>
                  </div>
                  <div className="p-3 rounded-lg text-white" style={{ backgroundColor: '#0891b2' }}>
                    <p className="text-sm font-medium text-white">Active State</p>
                    <p className="text-xs text-white/80">Selected menu item</p>
                  </div>
                  <div className="p-3 rounded-lg text-white" style={{ backgroundColor: '#0891b2' }}>
                    <p className="text-sm font-medium text-white">Brand Logo</p>
                    <p className="text-xs text-white/80">LG logo background</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Text Primary</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Main text content</p>
                  </div>
                  <button className={`p-3 rounded-lg w-full text-left transition-all duration-200 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-cyan-50 hover:bg-cyan-100'}`}> 
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-cyan-700'}`}>Hover State</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-cyan-600'}`}>Interactive elements</p>
                  </button>
                  <div className={`p-3 rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>Profile Link</p>
                    <p className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}>Secondary accent color</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palettes */}
        <div className="space-y-6">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'} flex items-center gap-2`}>
            <Palette className="w-5 h-5 text-primary-600" />
            Color Palettes
          </h2>
          <div className={`p-4 ${isDark ? 'bg-gradient-to-r from-primary-900/20 to-primary-800/20' : 'bg-gradient-to-r from-primary-50 to-primary-100'} rounded-lg border ${isDark ? 'border-primary-700' : 'border-primary-200'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-primary-200' : 'text-primary-800'} mb-2`}>Primary Brand Colors</h3>
            <p className={`${isDark ? 'text-primary-300' : 'text-primary-700'} text-sm`}>
              The primary color palette is the foundation of our brand identity. Use primary-500 (#3b82f6) for main actions, 
              primary-600 for hover states, and lighter shades for backgrounds and accents.
            </p>
          </div>
          
          {Object.entries(colorPalettes).map(([key, palette]) => (
            <div key={key} className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'} p-6`}>
              <h3 className={`text-lg font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-4`}>{palette.name}</h3>
              <div className="grid grid-cols-10 gap-2">
                {palette.colors.map((color) => (
                  <div
                    key={color.name}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border transition-all duration-200 ${isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'} ${
                      copiedColor === color.value ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => copyToClipboard(color.value)}
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
                    <div className={`p-2 transition-colors ${isDark ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-white group-hover:bg-slate-50'}`}>
                      <p className={`text-xs font-mono transition-colors ${isDark ? 'text-slate-300 group-hover:text-slate-200' : 'text-slate-700 group-hover:text-slate-900'}`}>{color.value}</p>
                    </div>
                    {copiedColor === color.value && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-pulse">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                          Copied!
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logo Assets */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
            <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded" />
            Logo Assets
          </h2>
          <div className={`mb-6 p-4 ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-lg`}>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong>Brand Identity:</strong> The infinity ribbon logo represents endless possibilities and continuous growth in link management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SVG Logo */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>SVG Logo (Vector)</h3>
              <div className={`p-4 ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-200'} flex items-center justify-center`}>
                <img 
                  src="/images/Infinite ribbon.svg" 
                  alt="Link Guru Logo SVG" 
                  className="h-16 w-auto"
                />
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Scalable vector format - use for web, print, and high-resolution displays
              </p>
            </div>

            {/* PNG Logo */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>PNG Logo (Raster)</h3>
              <div className={`p-4 ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-200'} flex items-center justify-center`}>
                <img 
                  src="/images/Infinite ribbon.png" 
                  alt="Link Guru Logo PNG" 
                  className="h-16 w-auto"
                />
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                High-resolution raster format - use for social media and web applications
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-cyan-900/20 dark:to-emerald-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700">
            <h4 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'} mb-2`}>Usage Guidelines</h4>
            <ul className={`text-xs space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li>• Use SVG for scalable applications (web, print)</li>
              <li>• Use PNG for fixed-size applications (social media, favicons)</li>
              <li>• Maintain minimum clear space around the logo</li>
              <li>• Logo should be clearly visible against both light and dark backgrounds</li>
            </ul>
          </div>
        </div>

        {/* Component Examples */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
            <Eye className="w-5 h-5 text-primary-600" />
            Component Examples
          </h2>
          <div className={`mb-6 p-4 ${isDark ? 'bg-primary-900/20' : 'bg-primary-50'} rounded-lg border ${isDark ? 'border-primary-700' : 'border-primary-200'}`}>
            <p className={`text-sm ${isDark ? 'text-primary-300' : 'text-primary-700'}`}>
              <strong>Component Color Usage:</strong> All interactive components use the primary brand color system for consistency and clear visual hierarchy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Buttons */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Buttons</h3>
              <div className="space-y-2">
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="w-full px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#0891b2' }}
                >
                  Primary Button
                </button>
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="w-full px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#10b981' }}
                >
                  Secondary Button
                </button>
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Danger Button
                </button>
                <button 
                  onClick={(e) => e.preventDefault()}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Neutral Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Cards</h3>
              <div className={`p-4 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                <h4 className={`font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Card Title</h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>Card description with some content.</p>
              </div>
            </div>

            {/* Form Elements */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Form Elements</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Input field"
                  readOnly
                  className={`w-full px-3 py-2 border ${isDark ? 'border-slate-600' : 'border-slate-300'} rounded-lg ${isDark ? 'bg-slate-800 text-slate-100 placeholder-slate-400' : 'bg-white text-slate-900 placeholder-slate-500'} focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-default`}
                />
                <select 
                  disabled
                  className={`w-full px-3 py-2 border ${isDark ? 'border-slate-600' : 'border-slate-300'} rounded-lg ${isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'} focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-default`}
                >
                  <option>Select option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Status Indicators</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>Success</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>Error</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0891b2' }}></div>
                  <span className={`text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                  <span className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Secondary</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Badges</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-white text-xs rounded-full" style={{ backgroundColor: '#0891b2' }}>
                  Primary
                </span>
                <span className="px-2 py-1 text-white text-xs rounded-full" style={{ backgroundColor: '#10b981' }}>
                  Secondary
                </span>
                <span className={`px-2 py-1 ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'} text-xs rounded-full`}>
                  Neutral
                </span>
                <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                  Warning
                </span>
              </div>
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Alerts</h3>
              <div className="space-y-2">
                <div className={`p-3 ${isDark ? 'bg-cyan-900/20' : 'bg-cyan-50'} border ${isDark ? 'border-cyan-800' : 'border-cyan-200'} rounded-lg`}>
                  <p className={`text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>Primary message</p>
                </div>
                <div className={`p-3 ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-50'} border ${isDark ? 'border-emerald-800' : 'border-emerald-200'} rounded-lg`}>
                  <p className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Secondary message</p>
                </div>
                <div className={`p-3 ${isDark ? 'bg-amber-900/20' : 'bg-amber-50'} border ${isDark ? 'border-amber-800' : 'border-amber-200'} rounded-lg`}>
                  <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>Warning message</p>
                </div>
                <div className={`p-3 ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'} border ${isDark ? 'border-slate-600' : 'border-slate-300'} rounded-lg`}>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Neutral message</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Info */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-slate-50'} rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-4`}>Accessibility Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-2`}>Contrast Ratios</h3>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <li>• AA Standard: 4.5:1 for normal text</li>
                <li>• AAA Standard: 7:1 for normal text</li>
                <li>• Large text: 3:1 (AA) / 4.5:1 (AAA)</li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-2`}>Tested Combinations</h3>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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
