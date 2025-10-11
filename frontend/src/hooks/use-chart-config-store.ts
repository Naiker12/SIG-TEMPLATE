
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
  numericalColumns: string[];
  categoricalColumns: string[];
  allCategories: string[];
  selectedCategories: string[];
  setAreaChartConfig: (config: ChartConfig) => void;
  setPieChartConfig: (config: PieChartConfig) => void;
  setAvailableColumns: (numerical: string[], categorical: string[]) => void;
  setAllCategories: (categories: string[]) => void;
  setSelectedCategories: (categories: string[]) => void;
}

export const useChartConfigStore = create<ChartConfigState>((set) => ({
  areaChartConfig: {
    xAxis: '',
    yAxis: '',
  },
  pieChartConfig: {
    labelKey: '',
    valueKey: '',
  },
  numericalColumns: [],
  categoricalColumns: [],
  allCategories: [],
  selectedCategories: [],
  setAreaChartConfig: (config) => set({ areaChartConfig: config }),
  setPieChartConfig: (config) => set({ pieChartConfig: config }),
  setAvailableColumns: (numerical, categorical) => set(state => ({
      numericalColumns: numerical,
      categoricalColumns: categorical,
      // Reset to first available option if current is not valid anymore or not set
      areaChartConfig: {
        xAxis: categorical.includes(state.areaChartConfig.xAxis) ? state.areaChartConfig.xAxis : categorical[0] || '',
        yAxis: numerical.includes(state.areaChartConfig.yAxis) ? state.areaChartConfig.yAxis : numerical[0] || '',
      },
      pieChartConfig: {
        labelKey: categorical.includes(state.pieChartConfig.labelKey) ? state.pieChartConfig.labelKey : categorical[0] || '',
        valueKey: numerical.includes(state.pieChartConfig.valueKey) ? state.pieChartConfig.valueKey : numerical[0] || '',
      }
  })),
  setAllCategories: (categories) => set({ allCategories: categories, selectedCategories: categories }),
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
}));
