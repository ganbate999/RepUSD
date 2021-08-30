
import MediumIcon from '../../components/Icons/MediumIcon'
import TelegramIcon from '../../components/Icons/TelegramIcon'
import TwitterIcon from '../../components/Icons/TwitterIcon'
import EmailIcon from '../../components/Icons/EmailIcon'
import DiscordIcon from '../../components/Icons/DiscordIcon'

const FOOTER_MENUS = [
    {
        id: 'twitter',
        icon: <TwitterIcon />,
        url: 'https://twitter.com/k-9'
    },
    {
        id: 'discord',
        icon: <DiscordIcon />,
        url: 'https://t.me/k-9'
    },
    {
        id: 'telegram',
        icon: <TelegramIcon />,
        url: 'https://telegram.io/'
    },
    {
        id: 'medium',
        icon: <MediumIcon />,
        url: 'https://k-9.medium.com/',
    },
    {
        id: 'email',
        icon: <EmailIcon />,
        url: 'mailto:info@k-9',
    }    
];

export {
    FOOTER_MENUS
}