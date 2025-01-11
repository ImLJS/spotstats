import { CircleUserRound, House, LifeBuoy, Music, Send } from 'lucide-react';
import { ROUTES } from './routes';

export const data = {
  support: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'Home',
      url: ROUTES.HOME,
      icon: House,
    },
    {
      name: 'Tracks',
      url: ROUTES.TRACKS,
      icon: Music,
    },
    {
      name: 'Artists',
      url: ROUTES.ARTISTS,
      icon: CircleUserRound,
    },
  ],
};
