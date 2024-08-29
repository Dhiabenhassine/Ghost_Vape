// material-ui
import { useTheme } from '@mui/material/styles';
import ghost from '../assets/images/ghost.png'
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    <a style={{ marginLeft: '40px' }}>
    Ghost Vape
    <img
      src={ghost}
      alt="Ghost Vape Logo"
      width="70"
      style={{ marginLeft: '-70px' }} // Adjust margin or other styles as needed
    />
  </a>
  );
};

export default Logo;
