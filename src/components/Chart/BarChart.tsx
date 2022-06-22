import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const data: any = [
  {
    name: 'Proposals Executed',
    data: [4, 2, 1, 1, 3, 2, 3],
  },
];

const options: any = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
      fontFamily: undefined,
    },
    onDatasetHover: {
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
    },
    theme: 'dark',
  },
  xaxis: {
    categories: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
    show: false,
    labels: {
      show: true,
      style: {
        colors: '#A3AED0',
        fontSize: '14px',
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
    color: 'black',
    labels: {
      show: true,
      style: {
        colors: '#CBD5E0',
        fontSize: '14px',
      },
    },
  },
  grid: {
    show: false,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        [
          {
            offset: 0,
            color: '#50DDC3',
            opacity: 1,
          },
          {
            offset: 100,
            color: '#624AF2',
            opacity: 0.28,
          },
        ],
      ],
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: '40px',
    },
  },
};

export const BarChart = () => {
  return (
    <Box minH='195px' mt='auto'>
      <Chart
        options={options}
        series={data}
        type='bar'
        width='100%'
        height='100%'
      />
    </Box>
  );
};
