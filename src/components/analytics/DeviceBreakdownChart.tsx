import { useMemo } from 'react';
import { VegaEmbed } from 'react-vega';

interface DeviceData {
  device: string;
  clicks: number;
  percentage: number;
}

interface DeviceBreakdownChartProps {
  data: DeviceData[];
  height?: number;
  isDark?: boolean;
  showAs: 'pie' | 'bar';
}

export default function DeviceBreakdownChart({
  data,
  height = 300,
  isDark = false,
  showAs = 'pie'
}: DeviceBreakdownChartProps) {
  const chartSpec = useMemo(() => {
    const colors = {
      mobile: '#0891b2',
      desktop: '#10b981',
      tablet: '#f59e0b'
    };

    if (showAs === 'pie') {
      return {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: height,
        height: height,
        background: isDark ? '#1f2937' : '#ffffff',
        data: { values: data },
        mark: {
          type: 'arc',
          innerRadius: 60,
          outerRadius: height / 2 - 20
        },
        encoding: {
          theta: {
            field: 'clicks',
            type: 'quantitative'
          },
          color: {
            field: 'device',
            type: 'nominal',
            scale: {
              domain: ['mobile', 'desktop', 'tablet'],
              range: [colors.mobile, colors.desktop, colors.tablet]
            },
            legend: {
              title: 'Device',
              labelColor: isDark ? '#e5e7eb' : '#374151',
              titleColor: isDark ? '#e5e7eb' : '#374151'
            }
          },
          tooltip: [
            { field: 'device', type: 'nominal', title: 'Device' },
            { field: 'clicks', type: 'quantitative', title: 'Clicks' },
            { field: 'percentage', type: 'quantitative', title: 'Percentage', format: '.1f' }
          ]
        },
        config: {
          view: { stroke: null }
        }
      };
    } else {
      return {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container',
        height: height,
        background: isDark ? '#1f2937' : '#ffffff',
        data: { values: data },
        mark: 'bar',
        encoding: {
          x: {
            field: 'device',
            type: 'nominal',
            axis: {
              labelColor: isDark ? '#e5e7eb' : '#374151',
              titleColor: isDark ? '#e5e7eb' : '#374151'
            }
          },
          y: {
            field: 'clicks',
            type: 'quantitative',
            axis: {
              labelColor: isDark ? '#e5e7eb' : '#374151',
              titleColor: isDark ? '#e5e7eb' : '#374151'
            }
          },
          color: {
            field: 'device',
            type: 'nominal',
            scale: {
              domain: ['mobile', 'desktop', 'tablet'],
              range: [colors.mobile, colors.desktop, colors.tablet]
            }
          },
          tooltip: [
            { field: 'device', type: 'nominal', title: 'Device' },
            { field: 'clicks', type: 'quantitative', title: 'Clicks' },
            { field: 'percentage', type: 'quantitative', title: 'Percentage', format: '.1f' }
          ]
        }
      };
    }
  }, [data, height, isDark, showAs]);

  return (
    <div className="w-full">
      <VegaEmbed spec={chartSpec as any} />
    </div>
  );
}
