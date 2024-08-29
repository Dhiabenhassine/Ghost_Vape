import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'; // Import Typography here
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const status = [
  { value: 'today', label: 'Today' },
  { value: 'month', label: 'This Month' },
];

const TotalGrowthBarChart = ({ isLoading }) => {
  const [value, setValue] = useState('today');
  const [salesData, setSalesData] = useState(null);
  const theme = useTheme();

  const fetchSalesData = async () => {
    try {
      const endpoint = value === 'today' ? 'http://127.0.0.1:4000/Dashboard/selectVenteParJour2' : 'http://127.0.0.1:4000/Dashboard/selectVenteParMois';
      const response = await axios.get(endpoint);
      setSalesData(response.data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [value]);

  const pieData = {
    labels: ['Liquides', 'Vapes', 'Divers'],
    datasets: [
      {
        label: 'Sales',
        data: salesData
          ? [salesData.totalLiquideSales, salesData.totalVapeSales, salesData.totalDiversSales]
          : [0, 0, 0],
        backgroundColor: ['#FF6384', '#FF9F40', '#4BC0C0'],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: value === 'today' ? 'Sales Today' : 'Sales This Month' },
    },
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h4">Sales Overview</Typography>
                </Grid>
                <Grid item>
                  <TextField
                    select
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  >
                    {status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%', 
      height: '480px'
    }}
  >
    <div style={{ width: '480px', height: '480px' }}>
      <Pie data={pieData} options={pieOptions} />
    </div>
  </div>
</Grid>

          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool,
};

export default TotalGrowthBarChart;
