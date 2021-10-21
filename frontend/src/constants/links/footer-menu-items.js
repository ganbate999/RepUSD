
import MediumIcon from '../../components/Icons/MediumIcon'
import TelegramIcon from '../../components/Icons/TelegramIcon'
import BlogIcon from '../../components/Icons/BlogIcon'
import EmailIcon from '../../components/Icons/EmailIcon'
import DiscordIcon from '../../components/Icons/DiscordIcon'

const FOOTER_MENUS = [
    {
        id: 'blog',
        icon: <BlogIcon />,
        url: 'https://repusd.com'
    },
    {
        id: 'discord',
        icon: <DiscordIcon />,
        url: 'https://discord.gg/Jfr3KYhSQV'
    },
    {
        id: 'telegram',
        icon: <TelegramIcon />,
        url: 'https://repusd.com'
    },
    {
        id: 'medium',
        icon: <MediumIcon />,
        url: 'https://repusd.medium.com',
    },
    {
        id: 'email',
        icon: <EmailIcon />,
        url: 'admin@repusd.finance',
    }    
];

export {
    FOOTER_MENUS
}