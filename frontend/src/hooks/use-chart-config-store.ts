
'use client';

import { create } from 'zustand';

type ChartConfig = {
  xAxis: string;
  yAxis: string;
};

type PieChartConfig = {
  labelKey: string;
  valueKey: string;
};

interface ChartConfigState {
  areaChartConfig: ChartConfig;
  pieChartConfig: PieChartConfig;
  setAreaChartConfig: (config: ChartConfig) => void;
  setPieChartConfig: (config: PieChartConfig) => void;
}

export const useChartConfigStore = create<ChartConfigState>((set) => ({
  areaChartConfig: {
    xAxis: 'month',
    yAxis: 'ingresos',
  },
  pieChartConfig: {
    labelKey: 'categoria',
    valueKey: 'unidades_vendidas',
  },
  setAreaChartConfig: (config) => set({ areaChartConfig: config }),
  setPieChartConfig: (config) => set({ pieChartConfig: config }),
}));
