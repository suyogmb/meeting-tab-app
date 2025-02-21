import {StatusBar, View, SafeAreaView, Text, Image, ScrollView} from 'react-native';
import React from 'react';
import useViewModel from './Details.viewmodel';
import {getTypographyStyle, TypographyStyleEnum} from '../../utils/Typography';
import {Header, ReusableButton} from 'components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

interface MovieDetails {
  name?: string;
  imageurl?: string;
  team?: string;
  firstappearance?: string;
  publisher?: string;
  bio?: string;
}

type AuthStackParamList = {
  HOME: undefined;
  HOME_DETAILS: {data?: MovieDetails}; // expecting 'data' to be an object
};

type DetailsScreenProps = NativeStackScreenProps<AuthStackParamList, 'HOME_DETAILS'>;

const DetailsScreen = ({route}: DetailsScreenProps) => {
  const {styles, t, onBack} = useViewModel();
  //props
  const {data} = route?.params;

  return (
    <View style={styles.mainView}>
      <SafeAreaView style={styles.safeView}>
        <StatusBar />
        <Header title={t('dashboard.detail.title')} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.mainSubView}>
            <Image
              source={{uri: data?.imageurl}}
              style={styles.detailsPageImage}
              resizeMode="cover"
              accessibilityRole="image"
              accessibilityLabel="Character Image"
            />
            <View style={styles.detailTextView}>
              <Text style={{...styles.subText, ...getTypographyStyle(TypographyStyleEnum.LABEL)}}>
                {t('dashboard.detail.name')}:- {data?.name}
              </Text>
              <Text style={{...styles.subText, ...getTypographyStyle(TypographyStyleEnum.LABEL)}}>
                {t('dashboard.detail.team')}:- {data?.team}
              </Text>
              <Text style={{...styles.subText, ...getTypographyStyle(TypographyStyleEnum.LABEL)}}>
                {t('dashboard.detail.firstAppearance')}:- {data?.firstappearance}
              </Text>
              <Text style={{...styles.subText, ...getTypographyStyle(TypographyStyleEnum.LABEL)}}>
                {t('dashboard.detail.publisher')}:- {data?.publisher}
              </Text>
              <Text style={{...styles.subText, ...getTypographyStyle(TypographyStyleEnum.LABEL)}}>
                {t('dashboard.detail.bio')}:- {data?.bio?.replace(/[\r\n\t]/g, '')}
              </Text>
              <ReusableButton
                title={t('dashboard.button.title')}
                onPress={onBack}
                style={styles.btnStyle}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default DetailsScreen;
