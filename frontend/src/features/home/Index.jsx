import { Link } from 'react-router-dom';
import {useStarfield} from "../../hooks/useStarfield.jsx";
import { useTranslation } from 'react-i18next';

const Index = () => {

    const { t } = useTranslation();

    // bg animation
    const canvasRef = useStarfield()

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
                    <Link to={`/quran`} className='btn'>{t('home.start_reading')}</Link>
                </div>
            </div>
        </>
    );
}

export default Index;