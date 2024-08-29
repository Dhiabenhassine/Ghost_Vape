import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const PopularCard = ({ isLoading }) => {
    const [top5, setTop5] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:4000/Dashboard/top5liquide');
                setTop5(response.data);
            } catch (err) {
                console.error('Error fetching top 5 liquides:', err);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">Top 5 Liquides /mois</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ pt: '16px !important' }}>
                                {/* Empty space */}
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container direction="column">
                                    {top5.length > 0 ? (
                                        top5.map((liquid, index) => (
                                            <React.Fragment key={index}>
                                                <Grid item>
                                                    <Grid container alignItems="center" justifyContent="space-between">
                                                        <Grid item>
                                                            <Typography variant="subtitle1" color="inherit">
                                                                {liquid.NomLiquide}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Grid container alignItems="center" justifyContent="space-between">
                                                                <Grid item>
                                                                    <Typography variant="subtitle1" color="inherit">
                                                                       Nbr: {liquid.TotalSales}
                                                                    </Typography>
                                                                </Grid>
                                                               
                                                            </Grid>
                                                            <Grid container alignItems="center" justifyContent="space-between">
                                                                <Grid item>
                                                                    <Typography variant="subtitle1" color="inherit">
                                                                        {liquid.SalesMonth}
                                                                    </Typography>
                                                                </Grid>
                                                               
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                              
                                                {index < top5.length - 1 && <Divider sx={{ my: 1.5 }} />}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <Typography variant="body2">No data available</Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                  
                </MainCard>
            )}
        </>
    );
};

PopularCard.propTypes = {
    isLoading: PropTypes.bool
};

export default PopularCard;
