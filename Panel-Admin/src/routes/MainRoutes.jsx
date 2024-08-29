import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// utilities routing
const UtilsVente = Loadable(lazy(() => import('views/utilities/Vente')));
const UtilsFlacon = Loadable(lazy(() => import('views/utilities/Flacon')));
const UtilsVenteVape = Loadable(lazy(() => import('views/utilities/SalesVape')));
const UtilsCredit = Loadable(lazy(() => import('views/utilities/Credit')));
const UtilsCaisse = Loadable(lazy(() => import('views/utilities/Caisse')));

const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/StockVape')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Divers')));
const UtilsShadows = Loadable(lazy(() => import('views/utilities/DiversSales')));

// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'vente',
          element: <UtilsVente />
        },
        {
          path: 'typography',
          element: <UtilsTypography />
        },
        {
          path: 'StockVape',
          element: <UtilsColor />
        },
        {
          path: 'Divers',
          element: <UtilsShadow />
        },
        {
          path: 'DiversSales',
          element: <UtilsShadows />
        }
        ,
        {
          path: 'Flacon',
          element: <UtilsFlacon />
        }
        ,
        {
          path: 'SalesVapes',
          element: <UtilsVenteVape />
        }
        ,
        {
          path: 'Credit',
          element: <UtilsCredit />
        }
        ,
        {
          path: 'Caisse',
          element: <UtilsCaisse />
        }
      ]
    },
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'tabler-icons',
    //       element: <UtilsTablerIcons />
    //     }
    //   ]
    // },
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'material-icons',
    //       element: <UtilsMaterialIcons />
    //     }
    //   ]
    // },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
