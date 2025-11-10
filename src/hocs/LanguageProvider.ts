import {ReactElement} from 'react';
import '../language/i18n';

type Props = {
  children: ReactElement;
};

const LanguageProvider = (props: Props) => {
  //FIXME: Not required, but can keep for future use.
  // i18n;
  return props.children;
};

export default LanguageProvider;
