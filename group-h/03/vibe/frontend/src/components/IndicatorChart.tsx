import ReactECharts from 'echarts-for-react';
import type { TechnicalIndicators } from '../types';

interface IndicatorChartProps {
  data: TechnicalIndicators;
  indicator: 'macd' | 'kdj' | 'rsi';
}

export default function IndicatorChart({ data, indicator }: IndicatorChartProps) {
  const { dates } = data;

  const defaultStart = Math.max(0, Math.round((1 - 60 / dates.length) * 100));

  const baseOption = {
    animation: false,
    grid: { left: '10%', right: '8%', top: 30, bottom: 50 },
    xAxis: {
      type: 'category' as const,
      data: dates,
      axisLine: { lineStyle: { color: '#ccc' } },
      axisLabel: { fontSize: 10 },
      axisTick: { show: false },
    },
    dataZoom: [
      { type: 'inside', start: defaultStart, end: 100 },
      { type: 'slider', start: defaultStart, end: 100, bottom: 5, height: 16 },
    ],
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'cross' as const },
    },
  };

  if (indicator === 'macd') {
    const histData = data.macdHist.map((v) => ({
      value: v,
      itemStyle: { color: v != null && v >= 0 ? '#ef5350' : '#26a69a' },
    }));

    return (
      <ReactECharts
        option={{
          ...baseOption,
          legend: { data: ['DIF', 'DEA', 'MACD'], top: 0, textStyle: { fontSize: 11 } },
          yAxis: {
            scale: true,
            splitLine: { lineStyle: { color: '#eee' } },
            axisLine: { show: false },
            axisTick: { show: false },
          },
          series: [
            {
              name: 'DIF',
              type: 'line',
              data: data.macd,
              symbol: 'none',
              lineStyle: { width: 1, color: '#2196f3' },
              itemStyle: { color: '#2196f3' },
            },
            {
              name: 'DEA',
              type: 'line',
              data: data.macdSignal,
              symbol: 'none',
              lineStyle: { width: 1, color: '#ff9800' },
              itemStyle: { color: '#ff9800' },
            },
            {
              name: 'MACD',
              type: 'bar',
              data: histData,
              barMaxWidth: 6,
            },
          ],
        }}
        style={{ height: 200, width: '100%' }}
        notMerge
        lazyUpdate
      />
    );
  }

  if (indicator === 'kdj') {
    return (
      <ReactECharts
        option={{
          ...baseOption,
          legend: { data: ['K', 'D', 'J'], top: 0, textStyle: { fontSize: 11 } },
          yAxis: {
            scale: true,
            splitLine: { lineStyle: { color: '#eee' } },
            axisLine: { show: false },
            axisTick: { show: false },
          },
          series: [
            {
              name: 'K',
              type: 'line',
              data: data.kdjK,
              symbol: 'none',
              lineStyle: { width: 1, color: '#2196f3' },
              itemStyle: { color: '#2196f3' },
              markLine: {
                silent: true,
                symbol: 'none',
                label: { show: true, position: 'end' },
                lineStyle: { type: 'dashed', color: '#999' },
                data: [{ yAxis: 80, name: '超买' }, { yAxis: 20, name: '超卖' }],
              },
            },
            {
              name: 'D',
              type: 'line',
              data: data.kdjD,
              symbol: 'none',
              lineStyle: { width: 1, color: '#ff9800' },
              itemStyle: { color: '#ff9800' },
            },
            {
              name: 'J',
              type: 'line',
              data: data.kdjJ,
              symbol: 'none',
              lineStyle: { width: 1, color: '#9c27b0' },
              itemStyle: { color: '#9c27b0' },
            },
          ],
        }}
        style={{ height: 200, width: '100%' }}
        notMerge
        lazyUpdate
      />
    );
  }

  // RSI
  return (
    <ReactECharts
      option={{
        ...baseOption,
        legend: { data: ['RSI'], top: 0, textStyle: { fontSize: 11 } },
        yAxis: {
          min: 0,
          max: 100,
          splitLine: { lineStyle: { color: '#eee' } },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        series: [
          {
            name: 'RSI',
            type: 'line',
            data: data.rsi,
            symbol: 'none',
            lineStyle: { width: 1.5, color: '#9c27b0' },
            itemStyle: { color: '#9c27b0' },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(156,39,176,0.15)' },
                  { offset: 1, color: 'rgba(156,39,176,0.01)' },
                ],
              },
            },
            markLine: {
              silent: true,
              symbol: 'none',
              label: { show: true, position: 'end' },
              lineStyle: { type: 'dashed', color: '#999' },
              data: [{ yAxis: 70, name: '超买' }, { yAxis: 30, name: '超卖' }],
            },
          },
        ],
      }}
      style={{ height: 200, width: '100%' }}
      notMerge
      lazyUpdate
    />
  );
}
