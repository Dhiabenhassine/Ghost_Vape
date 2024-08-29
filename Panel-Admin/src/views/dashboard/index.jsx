import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Box from '@mui/material/Box';

// project imports
import EarningCard from './VenteParJour';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [totalEmptyFlacon, setTotalEmptyFlacon] = useState(0);
  const [totalUsedFlacon, setTotalUsedFlacon] = useState(0);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalEmptyFlacon = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:4000/Dashboard/selectFlaconEmpty');
        const total = response.data[0]['SUM(nbrFlaconEmpty)'] || 0;
        setTotalEmptyFlacon(total);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching total empty flacon:', error);
        setLoading(false);
      }
    };

    const fetchTotalUsedFlacon = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:4000/Dashboard/selectFlaconUsed');
        const total = response.data.totalFlaconUsed || 0;
        setTotalUsedFlacon(total);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching total used flacon:', error);
        setLoading(false);
      }
    };

    fetchTotalEmptyFlacon();
    fetchTotalUsedFlacon();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    total: totalEmptyFlacon,
                    label: 'Total Flacon disponible',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />
                  }}
                />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    total: totalUsedFlacon,
                    label: 'Total Flacon Utiliser/mois',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={8}>
            <Box mt={-13}>
              <TotalGrowthBarChart isLoading={isLoading} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
