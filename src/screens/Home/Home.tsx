import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  SafeAreaView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Header} from 'components';
import useTypedSelector from 'hooks/useTypedSelector';
import {AUTH_STACK_NAVIGATOR} from 'navigators/routes';
import {useDispatch} from 'react-redux';
import useViewModel from './Home.viewmodel';
import {useTheme} from '../../contexts/ThemeContext';
import {AppDispatch} from '../../redux/app/store';
import {getMoviesData, Movie} from '../../redux/reducer/DashboardSlice';
import {getTypographyStyle, TypographyStyleEnum} from '../../utils/Typography';
type AuthStackParamList = {
  HOME: undefined;
  HOME_DETAILS: {data: object}; // Expecting data to be an object
};

const Home = () => {
  const {styles, t, isEnabled, toggleSwitch} = useViewModel();
  const {movieData} = useTypedSelector((state) => state.dashboard);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const {themeColors} = useTheme();

  useEffect(() => {
    dispatch(getMoviesData());
  }, []);

  const onPressItem = (item: object) => {
    navigation.navigate(AUTH_STACK_NAVIGATOR.HOME_DETAILS, {data: item});
  };

  const renderItem: ListRenderItem<Movie> = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.listView}
        onPress={() => onPressItem(item)}
      >
        <Image
          source={{uri: item?.imageurl}}
          style={styles.image}
          resizeMode="cover"
        />
        <View>
          <Text style={{...styles.subText, ...getTypographyStyle(TypographyStyleEnum.LABEL)}}>{item.name}</Text>
          <Text style={{...styles.subText, ...getTypographyStyle(TypographyStyleEnum.LABEL)}}>{item.publisher}</Text>
          <Text style={{...styles.subText, ...getTypographyStyle(TypographyStyleEnum.LABEL)}}>
            {item.firstappearance}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const flatListItemSeparator = () => {
    return <View style={styles.dashboardFlatListSeparator} />;
  };

  const RenderRightComp = () => {
    return (
      <Switch
        value={isEnabled}
        onValueChange={(newVal) => toggleSwitch(newVal)}
        trackColor={{false: themeColors.primary[50], true: themeColors.primary[10]}}
        thumbColor={isEnabled ? themeColors.primary[90] : themeColors.primary[50]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeView}>
        <Header
          title={t('dashboard.list.title')}
          rightComponent={<RenderRightComp />}
        />
        <StatusBar />
        <FlatList
          data={movieData ?? []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={flatListItemSeparator}
          style={styles.listMain}
        />
      </SafeAreaView>
    </View>
  );
};

export default Home;
