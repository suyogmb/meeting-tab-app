import {useSelector} from 'react-redux';
import {ReduxStateType} from '../redux/store';

const useTypedSelector = useSelector.withTypes<ReduxStateType>();

export default useTypedSelector;
