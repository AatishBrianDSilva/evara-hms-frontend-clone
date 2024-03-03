import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.tsx';
// import BottomTabNavigator from '../BottomTabNavigator/BottomTabNavigator.tsx';
import { Box } from '@mui/material';

const Layout: React.FC = () => {

	return (
		<>
			<Header />
			<Box component={"main"} p={2} pt={"64px"}>
				<Outlet />
			</Box>
			{/* <BottomTabNavigator /> */}
		</>
	);
};

export default Layout;

