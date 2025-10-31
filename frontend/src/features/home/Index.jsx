import { Link } from 'react-router-dom';
import {useStarfield} from "../../hooks/useStarfield.jsx";
import { useTranslation } from 'react-i18next';
import {useEffect, useState} from "react";

const Index = () => {
    const { t } = useTranslation();

    // bg animation
    const canvasRef = useStarfield();

    // check if we user have already read some verses to show different content
    const [content, setContent] = useState(t('home.start_reading'));
    useEffect(() => {
        if (localStorage.getItem('app-state')) {
            setContent(t('home.continue_reading'))
        }
    }, []);

    return (
        <>
            <div className='relative bg-[var(--second-bg)] h-[calc(100vh-72px)] flex flex-col items-center justify-center space-y-4 overflow-hidden'>
                {/* Animated canvas background */}
                <canvas
                    ref={canvasRef}
                    className='absolute inset-0 w-full h-full pointer-events-none'
                    style={{ zIndex: 0 }}
                />

                {/* Content */}
                <div className='relative z-10 flex flex-col items-center -mt-6 justify-center space-y-8'>
                    <h1 className='animation-delay-250 animate-fade-in-up max-w-[60%] font-bold text-[clamp(1.25rem,4vw,2.25rem)] text-center'>
                        {t('home.description')}
                    </h1>
                    <Link to={`/quran`} className='btn'>{content}</Link>
                </div>
            </div>
        </>
    );
}

export default Index;