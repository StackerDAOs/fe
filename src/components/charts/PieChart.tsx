import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const Chart: any = dynamic(() => import('react-apexcharts'), { ssr: false });

const data: any = {
  series: [987, 2500, 600],
  options: {
    chart: {
      width: 380,
      type: 'pie',
      foreColor: 'white',
    },
    fill: {
      colors: undefined,
    },
    stroke: {
      show: false,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 2,
      dashArray: 2,
    },
    colors: ['#7301FA', '#EB00FF', '#624AF2'],
    labels: ['Stacks', 'Coins', 'Collectibles'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  },
};

export const PieChart = () => {
  return (
    <Box minH='260px' mt='auto'>
      <Chart
        options={data.options}
        series={data.series}
        type='pie'
        width='100%'
        height='100%'
      />
    </Box>
  );
};
