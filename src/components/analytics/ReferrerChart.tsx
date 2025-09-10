import { useMemo } from 'react';
import { VegaEmbed } from 'react-vega';

interface ReferrerData {
  referrer: string;
  clicks: number;
  percentage: number;
}

interface ReferrerChartProps {
  data: ReferrerData[];
  height?: number;
  isDark?: boolean;
  showAs: 'horizontal' | 'vertical' | 'donut';
}

export default function ReferrerChart({
  data,
  height = 300,
  isDark = false,
  showAs = 'horizontal'
}: ReferrerChartProps) {
  const chartSpec = useMemo(() => {
    if (showAs === 'donut') {
      return {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: height,
        height: height,
        background: isDark ? '#1f2937' : '#ffffff',
        data: { values: data },
        mark: 'arc',
        encoding: {
          theta: { field: 'clicks', type: 'quantitative' },
          color: {
            field: 'referrer',
            type: 'nominal',
            scale: {
              range: ['#6b7280', '#4285f4', '#1877f2', '#1da1f2', '#e4405f']
            }
          },
          tooltip: [
            { field: 'referrer', type: 'nominal' },
            { field: 'clicks', type: 'quantitative' },
            { field: 'percentage', type: 'quantitative', format: '.1f' }
          ]
        }
      };
    } else {
      const isHorizontal = showAs === 'horizontal';
      return {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container',
        height: height,
        background: isDark ? '#1f2937' : '#ffffff',
        data: { values: data },
        mark: 'bar',
        encoding: {
          x: isHorizontal ? { field: 'clicks', type: 'quantitative' } : { field: 'referrer', type: 'nominal' },
          y: isHorizontal ? { field: 'referrer', type: 'nominal' } : { field: 'clicks', type: 'quantitative' },
          color: {
            field: 'referrer',
            type: 'nominal',
            scale: {
              range: ['#6b7280', '#4285f4', '#1877f2', '#1da1f2', '#e4405f']
            }
          },
          tooltip: [
            { field: 'referrer', type: 'nominal' },
            { field: 'clicks', type: 'quantitative' },
            { field: 'percentage', type: 'quantitative', format: '.1f' }
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
