import { VodafoneLogoIcon, OrangeLogoIcon, EtisalatLogoIcon, WeLogoIcon } from '../components/icons/logo/index.js';

export const MOBILE_OPERATOR_CONFIG = {
  '010': { name: 'Vodafone', arabicName: 'فودافون', multiplier: 1.2, logo: VodafoneLogoIcon, logoUrl: '/assets/logos/vodafone.png' },
  '012': { name: 'Orange', arabicName: 'أورانج', multiplier: 1.5, logo: OrangeLogoIcon, logoUrl: '/assets/logos/Orange.png' },
  '011': { name: 'Etisalat', arabicName: 'اتصالات', multiplier: 1.5, logo: EtisalatLogoIcon, logoUrl: '/assets/logos/etisalat.png' },
  '015': { name: 'WE', arabicName: 'WE (المصرية للاتصالات)', multiplier: 1.5, logo: WeLogoIcon, logoUrl: '/assets/logos/we.png' },
};
