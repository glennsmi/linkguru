import { useMemo } from 'react';
import { VegaEmbed } from 'react-vega';

interface TimeSeriesData {
  timestamp: string;
  clicks: number;
  uniqueClicks: number;
  mobile: number;
  desktop: number;
  tablet: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  height?: number;
  isDark?: boolean;
}

export default function TimeSeriesChart({
  data,
  height = 400,
  isDark = false
}: TimeSeriesChartProps) {
  // Handle empty or low data scenarios
  const hasData = data && data.length > 0;
  const totalClicks = hasData ? data.reduce((sum, item) => sum + item.clicks, 0) : 0;

  const chartSpec = useMemo(() => {
    // If no data, show a placeholder
    if (!hasData || data.length === 0) {
      return {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container',
        height: height,
        background: isDark ? '#1f2937' : '#ffffff',
        data: { values: [] },
        layer: [
          {
            mark: {
              type: 'text',
              align: 'center',
              baseline: 'middle',
              fontSize: 16,
              color: isDark ? '#9ca3af' : '#6b7280'
            },
            encoding: {
              text: { value: 'No click data available for this time period' },
              x: { value: 'width' },
              y: { value: 'height' }
            }
          }
        ]
      };
    }

    // If very low data (less than 3 points), show a different message
    if (data.length < 3) {
      return {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container',
        height: height,
        background: isDark ? '#1f2937' : '#ffffff',
        data: { values: data },
        layer: [
          {
            mark: {
              type: 'text',
              align: 'center',
              baseline: 'middle',
              fontSize: 14,
              color: isDark ? '#d1d5db' : '#4b5563'
            },
            encoding: {
              text: { value: 'Limited data available. Try selecting a longer time range.' },
              x: { value: 'width' },
              y: { value: 'height' }
            }
          }
        ]
      };
    }

    // Normal chart for sufficient data
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: height,
      background: isDark ? '#1f2937' : '#ffffff',
      data: { values: data },
      mark: {
        type: 'line',
        interpolate: 'monotone',
        strokeWidth: 3,
        color: isDark ? '#0891b2' : '#0e7490',
        point: {
          filled: true,
          size: 5,
          color: isDark ? '#0891b2' : '#0e7490',
          strokeWidth: 2,
          stroke: isDark ? '#1f2937' : '#ffffff'
        }
      },
      encoding: {
        x: {
          field: 'timestamp',
          type: 'temporal',
          title: 'Time',
          axis: {
            labelColor: isDark ? '#e5e7eb' : '#374151',
            titleColor: isDark ? '#e5e7eb' : '#374151',
            format: '%b %d, %H:%M'
          }
        },
        y: {
          field: 'clicks',
          type: 'quantitative',
          title: 'Clicks',
          axis: {
            labelColor: isDark ? '#e5e7eb' : '#374151',
            titleColor: isDark ? '#e5e7eb' : '#374151'
          },
          scale: {
            zero: true
          }
        },
        tooltip: [
          { field: 'timestamp', type: 'temporal', title: 'Time', format: '%b %d, %Y %H:%M' },
          { field: 'clicks', type: 'quantitative', title: 'Total Clicks' },
          { field: 'uniqueClicks', type: 'quantitative', title: 'Unique Clicks' },
          { field: 'mobile', type: 'quantitative', title: 'Mobile' },
          { field: 'desktop', type: 'quantitative', title: 'Desktop' },
          { field: 'tablet', type: 'quantitative', title: 'Tablet' }
        ]
      },
      config: {
        axis: {
          domainColor: isDark ? '#374151' : '#e5e7eb',
          tickColor: isDark ? '#374151' : '#d1d5db',
          labelColor: isDark ? '#e5e7eb' : '#374151',
          gridColor: isDark ? '#374151' : '#f3f4f6',
          gridOpacity: isDark ? 0.3 : 0.5
        },
        view: {
          stroke: isDark ? '#374151' : '#e5e7eb'
        }
      }
    };
  }, [data, height, isDark, hasData]);

  return (
    <div className="w-full">
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-2 p-2 text-xs bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
          Data points: {data?.length || 0} | Total clicks: {totalClicks} | Has data: {hasData ? 'Yes' : 'No'}
        </div>
      )}
      <VegaEmbed spec={chartSpec as any} />
    </div>
  );
}
