import { Settings } from "../ui/Settings.jsx";
import { Languages } from "../ui/Languages.jsx";
import {Github} from "lucide-react";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t } = useTranslation();
    return (
        <nav className="p-4 flex justify-between items-center shadow-xs relative z-90">
            <div className="navbar-container font-bold text-[22px] md:text-2xl">
                <a href="/" className="navbar-logo">{t('navbar.title')}</a>
            </div>
            <div className="navbar-links flex items-center gap-1 md:gap-4">
                <Languages />
                <Settings />
                <a className={"p-2"} href="https://github.com/noctis8">
                    <Github size={24} />
                </a>
            </div>
        </nav>
    )
}

export default Navbar;