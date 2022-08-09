import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const Chart: any = dynamic(() => import('react-apexcharts'), { ssr: false });

const data: any = [
  {
    name: 'Balance',
    data: [10, 39, 80, 50, 10],
  },
  {
    name: 'Profit',
    data: [20, 60, 30, 40, 20],
  },
];

const options: any = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  markers: {
    size: 0,
    colors: '#868CFF',
    strokeColors: 'white',
    strokeWidth: 2,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    shape: 'circle',
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
  },
  tooltip: {
    theme: 'dark',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    type: 'gradient',
  },
  xaxis: {
    categories: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
    labels: {
      style: {
        colors: 'white',
        fontSize: '12px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    column: {
      colors: ['transparent'], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 0.1,
      opacityFrom: 0.3,
      opacityTo: 0.9,
      colorStops: [
        [
          {
            offset: 0,
            color: 'white',
            opacity: 1,
          },
          {
            offset: 100,
            color: 'white',
            opacity: 0,
          },
        ],
        [
          {
            offset: 0,
            color: '#6AD2FF',
            opacity: 1,
          },
          {
            offset: 100,
            color: '#6AD2FF',
            opacity: 0.2,
          },
        ],
      ],
    },
  },
};

export const LineChart = () => {
  return (
    <Box minH='260px' mt='auto'>
      <Chart
        options={options}
        series={data}
        type='line'
        width='100%'
        height='100%'
      />
    </Box>
  );
};
