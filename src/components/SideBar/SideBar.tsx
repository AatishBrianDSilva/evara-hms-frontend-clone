import React from 'react';
import './sidebarStyle.css';
import clinicLogo from '../../assets/clinic-logo.png';
import ArticleIcon from '@mui/icons-material/Article';
import SideBarNavTab from '../SideBarNavTab/SideBarNavTab';
import { useNavigate } from 'react-router-dom';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

type navListType = {
    id: number;
    title: string;
    path: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    onSelect: () => void;
}


const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const navList: navListType[] = [
        {
            id: 0,
            title: "Console",
            path: '/',
            icon: ArticleIcon,
            onSelect: () => {
                navigate('/');
            }
        },
        {
            id: 1,
            title: "IVF Registration",
            path: '/ivf-registration',
            icon: ArticleIcon,
            onSelect: () => {
                navigate('/ivf-registration');
            }
        },
        {
            id: 2,
            title: "Patients",
            path: '/patients',
            icon: ArticleIcon,
            onSelect: () => {
                navigate('/patients');
            }
        },
        {
            id: 3,
            title: "Appointments",
            path: '/appointments',
            icon: ArticleIcon,
            onSelect: () => {
                navigate('/appointments');
            }
        }
    ];

    return (
        <aside className="sidebar">
            {/* Sidebar content */}
            <div className='clinic-logo'>
                <img src={clinicLogo} alt="logo" />
            </div>
            <div className='sidebar-nav-list'>
                {navList.map((navItem, index) => (
                    <SideBarNavTab
                        key={index}
                        logoSrc={navItem.icon}
                        title={navItem.title}
                        path={navItem.path}
                        onSelect={navItem.onSelect}
                    />
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;

