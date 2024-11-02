import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface UseTabNavigationReturn {
  activeTab: number;
  handleTabChange: (_event: React.SyntheticEvent, newValue: number) => void;
}

/**
 * Custom hook for synchronizing tab navigation with the URL.
 * @param {string[]} basePath - The base path.
 * @param {string[]} tabPaths - An array of tab paths that follow the base path.
 * @returns {UseTabNavigationReturn} - The current tab index and a function to change the tab.
 */
const useTabNavigation = (
  basePath: string,
  tabPaths: string[],
): UseTabNavigationReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Find the active tab based on the current URL
    const currentPath = location.pathname.replace(basePath, '');
    const currentTab = tabPaths.findIndex(path => currentPath.includes(path));
    setActiveTab(currentTab >= 0 ? currentTab : 0);
  }, [location.pathname, tabPaths, basePath]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    // Construct the new path including the dynamic segment
    const newPath = `${basePath}/${tabPaths[newValue]}`;
    console.log(newPath);

    navigate(newPath);
  };

  return { activeTab, handleTabChange };
};

export default useTabNavigation;
