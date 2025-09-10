import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTenant } from '../contexts/TenantContext';
import { ArrowLeft, ExternalLink, Calendar, MousePointer, Users, TrendingUp } from 'lucide-react';
import TimeSeriesChart from '../components/analytics/TimeSeriesChart';
import DeviceBreakdownChart from '../components/analytics/DeviceBreakdownChart';
import ReferrerChart from '../components/analytics/ReferrerChart';
import AnnotationManager from '../components/analytics/AnnotationManager';
import { Annotation } from '../../shared/src/schemas/link';

export default function LinkAnalyticsPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTenant, links, loading, refreshLinks } = useTenant();

  // Determine where the user came from based on referrer or state
  const referrer = location.state?.from || document.referrer;
  const cameFromLinks = referrer?.includes('/links') || location.state?.from === 'links';
  const cameFromDashboard = referrer?.includes('/dashboard') || location.state?.from === 'dashboard';

  // Determine back path and label based on source
  let backPath = '/app/analytics';
  let backLabel = 'Back to Analytics';

  if (cameFromLinks) {
    backPath = '/app/links';
    backLabel = 'Back to Links';
  } else if (cameFromDashboard) {
    backPath = '/app/dashboard';
    backLabel = 'Back to Dashboard';
  }

  const [timeRange, setTimeRange] = useState('7d');
  const [granularity, setGranularity] = useState<'hourly' | '4hourly' | 'daily' | 'weekly'>('daily');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('lg_theme');
    if (saved) {
      return saved === 'dark';
    }
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const saved = localStorage.getItem('lg_theme');
    if (saved) {
      const dark = saved === 'dark';
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
    }
  }, []);

  useEffect(() => {
    if (currentTenant) {
      refreshLinks();
    }
  }, [currentTenant]);

  const link = links.find(l => l.id === linkId);

  // Generate dynamic time series data based on granularity and time range
  const timeSeriesData = useMemo(() => {
    if (!link) {
      return [];
    }

    const now = new Date();
    const linkClicks = link.stats.totalClicks || 0;

    // Generate data points based on granularity
    const dataPoints = [];
    const endDate = now;
    let startDate: Date;

    // Set start date based on time range
    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Set interval based on granularity
    let intervalMs: number;
    switch (granularity) {
      case 'hourly':
        intervalMs = 60 * 60 * 1000; // 1 hour
        break;
      case '4hourly':
        intervalMs = 4 * 60 * 60 * 1000; // 4 hours
        break;
      case 'daily':
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      case 'weekly':
        intervalMs = 7 * 24 * 60 * 60 * 1000; // 1 week
        break;
      default:
        intervalMs = 24 * 60 * 60 * 1000;
    }

    // Generate data points
    let currentDate = new Date(startDate);
    let totalPoints = 0;
    const maxPoints = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

    while (currentDate <= endDate && totalPoints < maxPoints) {
      // Simulate some variation in click data for this link
      const baseClicks = linkClicks > 0 ? Math.floor(linkClicks / maxPoints) : Math.floor(Math.random() * 10);
      const variation = Math.floor(baseClicks * 0.5 * (Math.random() - 0.5));
      const clicks = Math.max(0, baseClicks + variation);
      const uniqueClicks = Math.floor(clicks * 0.8 + Math.random() * clicks * 0.4);

      dataPoints.push({
        timestamp: currentDate.toISOString(),
        clicks,
        uniqueClicks,
        mobile: Math.floor(clicks * (0.4 + Math.random() * 0.3)),
        desktop: Math.floor(clicks * (0.4 + Math.random() * 0.3)),
        tablet: Math.floor(clicks * (0.1 + Math.random() * 0.1))
      });

      currentDate = new Date(currentDate.getTime() + intervalMs);
      totalPoints++;
    }

    return dataPoints;
  }, [link, timeRange, granularity]);

  const deviceData = [
    { device: 'mobile', clicks: Math.floor(link?.stats.totalClicks || 0 * 0.6), percentage: 60 },
    { device: 'desktop', clicks: Math.floor(link?.stats.totalClicks || 0 * 0.35), percentage: 35 },
    { device: 'tablet', clicks: Math.floor(link?.stats.totalClicks || 0 * 0.05), percentage: 5 }
  ];

  const referrerData = [
    { referrer: 'direct', clicks: Math.floor(link?.stats.totalClicks || 0 * 0.4), percentage: 40 },
    { referrer: 'google', clicks: Math.floor(link?.stats.totalClicks || 0 * 0.3), percentage: 30 },
    { referrer: 'facebook', clicks: Math.floor(link?.stats.totalClicks || 0 * 0.15), percentage: 15 },
    { referrer: 'twitter', clicks: Math.floor(link?.stats.totalClicks || 0 * 0.1), percentage: 10 },
    { referrer: 'other', clicks: Math.floor(link?.stats.totalClicks || 0 * 0.05), percentage: 5 }
  ];

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  const granularityOptions = [
    { value: 'hourly' as const, label: 'Hourly' },
    { value: '4hourly' as const, label: '4-Hourly' },
    { value: 'daily' as const, label: 'Daily' },
    { value: 'weekly' as const, label: 'Weekly' }
  ];

  const handleAddAnnotation = (annotation: Omit<Annotation, 'id' | 'createdAt'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== annotationId));
  };

  if (!currentTenant) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>No Organization Selected</h1>
          <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Please create or select an organization to view link analytics.</p>
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Link Not Found</h1>
          <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'}`}>The requested link could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(backPath)}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ArrowLeft size={20} className="mr-2" />
                {backLabel}
              </button>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Link Analytics</h1>
                <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} mt-2`}>
                  Detailed analytics for: {link.metadata.title || link.originalUrl}
                </p>
              </div>
            </div>
            <a
              href={link.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              <ExternalLink size={16} className="mr-2" />
              Visit Link
            </a>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-gray-300 bg-white'}`}
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              Granularity
            </label>
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value as typeof granularity)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-gray-300 bg-white'}`}
            >
              {granularityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: '#0891b2' }}></div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
                <div className="flex items-center">
                  <MousePointer size={24} style={{ color: '#0891b2' }} />
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Clicks</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{link.stats.totalClicks}</p>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
                <div className="flex items-center">
                  <Users size={24} style={{ color: '#10b981' }} />
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Unique Clicks</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{link.stats.totalClicks}</p>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
                <div className="flex items-center">
                  <TrendingUp size={24} style={{ color: '#f59e0b' }} />
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Click Rate</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      100%
                    </p>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
                <div className="flex items-center">
                  <Calendar size={24} style={{ color: '#ef4444' }} />
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Created</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(link.metadata.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Time Series Chart */}
              <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Clicks Over Time</h3>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {timeSeriesData.length} data points • {timeSeriesData.reduce((sum, item) => sum + item.clicks, 0)} total clicks
                    {(!link || link.stats.totalClicks <= 10) && (
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'}`}>
                        Sample Data
                      </span>
                    )}
                  </div>
                </div>
                <TimeSeriesChart
                  data={timeSeriesData}
                  isDark={isDark}
                  height={300}
                />
              </div>

              {/* Device Breakdown */}
              <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Device Breakdown</h3>
                <DeviceBreakdownChart
                  data={deviceData}
                  isDark={isDark}
                  showAs="pie"
                  height={300}
                />
              </div>
            </div>

            {/* Traffic Sources */}
            <div className={`rounded-lg shadow-sm border p-6 mb-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Traffic Sources</h3>
              <ReferrerChart
                data={referrerData}
                isDark={isDark}
                showAs="horizontal"
                height={250}
              />
            </div>

            {/* Annotations */}
            <AnnotationManager
              annotations={annotations}
              onAddAnnotation={handleAddAnnotation}
              onDeleteAnnotation={handleDeleteAnnotation}
              tenantId={currentTenant.id}
              linkId={link.id}
              isDark={isDark}
            />
          </>
        )}
      </div>
    </div>
  );
}
