import ReactECharts from 'echarts-for-react';
import type { TechnicalIndicators } from '../types';

interface KLineChartProps {
  data: TechnicalIndicators;
  showMA?: boolean;
  showBoll?: boolean;
}

export default function KLineChart({ data, showMA = true, showBoll = false }: KLineChartProps) {
  const { dates, open, close, low, high, volume, ma5, ma10, ma20, ma60, bollUpper, bollMid, bollLower } = data;

  // ECharts candlestick format: [open, close, low, high]
  const candlestickData = dates.map((_, i) => [open[i], close[i], low[i], high[i]]);

  // Volume bar colors: green if up, red if down (compared to previous close)
  const volumeData = volume.map((v, i) => {
    const isUp = i === 0 ? close[i] >= open[i] : close[i] >= close[i - 1];
    return {
      value: v,
      itemStyle: { color: isUp ? '#26a69a' : '#ef5350' },
    };
  });

  const legendData: string[] = [];
  const series: any[] = [
    {
      name: 'K线',
      type: 'candlestick',
      data: candlestickData,
      itemStyle: {
        color: '#ef5350',       // 跌 - 填充色
        color0: '#26a69a',      // 涨 - 填充色
        borderColor: '#ef5350', // 跌 - 边框
        borderColor0: '#26a69a',// 涨 - 边框
      },
    },
  ];

  if (showMA) {
    const maLines: { name: string; data: (number | null)[]; color: string }[] = [
      { name: 'MA5', data: ma5, color: '#f0b90b' },
      { name: 'MA10', data: ma10, color: '#2196f3' },
      { name: 'MA20', data: ma20, color: '#9c27b0' },
      { name: 'MA60', data: ma60, color: '#9e9e9e' },
    ];
    maLines.forEach(({ name, data: lineData, color }) => {
      legendData.push(name);
      series.push({
        name,
        type: 'line',
        data: lineData,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 1, color },
        itemStyle: { color },
      });
    });
  }

  if (showBoll) {
    const bollLines: { name: string; data: (number | null)[]; color: string; dash?: boolean }[] = [
      { name: 'BOLL上轨', data: bollUpper, color: '#f44336', dash: true },
      { name: 'BOLL中轨', data: bollMid, color: '#ff9800' },
      { name: 'BOLL下轨', data: bollLower, color: '#4caf50', dash: true },
    ];
    bollLines.forEach(({ name, data: lineData, color, dash }) => {
      legendData.push(name);
      series.push({
        name,
        type: 'line',
        data: lineData,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 1, color, type: dash ? 'dashed' : 'solid' },
        itemStyle: { color },
      });
    });
  }

  // Volume bar series
  series.push({
    name: '成交量',
    type: 'bar',
    xAxisIndex: 1,
    yAxisIndex: 1,
    data: volumeData,
    barMaxWidth: 8,
  });

  const defaultStart = Math.max(0, Math.round((1 - 60 / dates.length) * 100));

  const option = {
    animation: false,
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'cross' as const },
      formatter: (params: any[]) => {
        if (!params || params.length === 0) return '';
        const idx = params[0].dataIndex;
        let html = `<strong>${dates[idx]}</strong><br/>`;
        html += `开盘: ${open[idx]}<br/>`;
        html += `收盘: ${close[idx]}<br/>`;
        html += `最高: ${high[idx]}<br/>`;
        html += `最低: ${low[idx]}<br/>`;
        html += `成交量: ${(volume[idx] / 1e6).toFixed(2)}M<br/>`;
        params.forEach((p) => {
          if (p.seriesType === 'line' && p.value != null) {
            html += `${p.seriesName}: ${typeof p.value === 'number' ? p.value.toFixed(2) : p.value}<br/>`;
          }
        });
        return html;
      },
    },
    legend: {
      data: legendData,
      top: 0,
      textStyle: { fontSize: 11 },
    },
    grid: [
      { left: '10%', right: '8%', top: '5%', height: '55%' },
      { left: '10%', right: '8%', top: '68%', height: '18%' },
    ],
    xAxis: [
      {
        type: 'category' as const,
        data: dates,
        gridIndex: 0,
        axisLine: { lineStyle: { color: '#ccc' } },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'category' as const,
        data: dates,
        gridIndex: 1,
        axisLine: { lineStyle: { color: '#ccc' } },
        axisLabel: { fontSize: 10 },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    yAxis: [
      {
        gridIndex: 0,
        scale: true,
        splitLine: { lineStyle: { color: '#eee' } },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      {
        gridIndex: 1,
        scale: true,
        splitLine: { lineStyle: { color: '#eee' } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          formatter: (val: number) => (val >= 1e6 ? `${(val / 1e6).toFixed(0)}M` : val),
        },
      },
    ],
    dataZoom: [
      { type: 'inside', xAxisIndex: [0, 1], start: defaultStart, end: 100 },
      {
        type: 'slider',
        xAxisIndex: [0, 1],
        start: defaultStart,
        end: 100,
        top: '92%',
        height: 20,
      },
    ],
    series,
  };

  return <ReactECharts option={option} style={{ height: 500, width: '100%' }} notMerge lazyUpdate />;
}
