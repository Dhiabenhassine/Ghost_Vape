// assets
import { IconTypography, IconPalette, IconBottle , IconWindmill,IconBrandCashapp ,IconFlask ,IconMoodUnamused  ,IconBinaryTree ,IconBuildingBank  ,IconBrandCodesandbox  } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconBottle ,
  IconWindmill,
  IconBrandCashapp ,
  IconFlask  ,
  IconMoodUnamused  ,
  IconBinaryTree ,
  IconBuildingBank ,
  IconBrandCodesandbox 
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'Vente',
      title: 'Vente Liquide',
      type: 'item',
      url: '/utils/Vente',
      icon: icons.IconBrandCashapp ,
      breadcrumbs: false
    },
    {
      id: 'Stock Liquide',
      title: 'Stock Liquide',
      type: 'item',
      url: '/utils/typography',
      icon: icons.IconFlask  ,
      breadcrumbs: false
    },
    {
      id: 'SalesVape',
      title: ' Vente Vapes',
      type: 'item',
      url: '/utils/SalesVapes',
      icon: icons.IconBrandCodesandbox   ,
      breadcrumbs: false
    }
    ,
    {
      id: 'Stock Vapes',
      title: 'Stock Vapes',
      type: 'item',
      url: '/utils/StockVape',
      icon: icons.IconPalette,
      breadcrumbs: false
    },
   
    {
      id: 'Stock Flacon',
      title: 'StockFlacon',
      type: 'item',
      url: '/utils/Flacon',
      icon: icons.IconBottle ,
      breadcrumbs: false
    }
    ,
    {
      id: 'Divers',
      title: 'Vente Accessoires',
      type: 'item',
      url: '/utils/DiversSales',
      icon: icons.IconBinaryTree  ,
      breadcrumbs: false
    }
    ,
    {
      id: 'Divers',
      title: 'Stock Accessoires',
      type: 'item',
      url: '/utils/Divers',
      icon: icons.IconBinaryTree  ,
      breadcrumbs: false
    }
    ,
    {
      id: 'Credit',
      title: 'Credit',
      type: 'item',
      url: '/utils/Credit',
      icon: icons.IconBuildingBank   ,
      breadcrumbs: false
    }
    ,
    {
      id: 'Caisse',
      title: 'Caisse',
      type: 'item',
      url: '/utils/Caisse',
      icon: icons.IconBrandCodesandbox   ,
      breadcrumbs: false
    }
  ]
};

export default utilities;
