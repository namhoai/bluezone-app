/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/26/2020, 16:36
 *
 * This file is part of Bluezone (https://bluezone.ai)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

import React from 'react';
import {View, SafeAreaView} from 'react-native';
import Share from 'react-native-share';
import * as PropTypes from 'prop-types'

// Components
import {MediumText} from '../../../base/components/Text';
import Header from '../../../base/components/Header';
import ButtonIconText from '../../../base/components/ButtonIconText';
import IconBluezone from './styles/images/IconBluezone';

// Language
import message from '../../../msg/invite';
import {injectIntl, intlShape} from 'react-intl';

// Configs
import configuration from '../../../Configuration';

// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../utils/fontSize';

class InviteScreen extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onShareApp = this.onShareApp.bind(this);
  }

  onBack() {
    this.props.navigation.goBack();
    return true;
  }

  async onShareApp() {
    const {LinkShareAndroid, LinkShareIOS, ShareMessageText} = configuration;
    // const messText = `Bluezone:\n\nPhiên bản IOS: ${LinkShareIOS}\n\nPhiên bản Android:${LinkShareAndroid}`;
    const messText = ShareMessageText.replace(
      '{LinkShareIOS}',
      LinkShareIOS,
    ).replace('{LinkShareAndroid}', LinkShareAndroid);
    const title = 'Chia sẻ ứng dụng';
    const options = {
      title,
      subject: title,
      message: messText,
    };
    try {
      await Share.open(options);
    } catch (error) {
      console.log('Huỷ chia sẻ');
    }
  }

  render() {
    const {route, intl} = this.props;
    const header =
      route.params && route.params.header ? route.params.header : false;
    const {ShareAppText} = configuration;
    const {formatMessage} = intl;
    return (
      <SafeAreaView style={styles.container}>
        {header ? (
          <Header
            onBack={this.onBack}
            colorIcon={'#015cd0'}
            styleTitle={styles.textHeader}
            showBack
            title={formatMessage(message.title)}
          />
        ) : (
          <View style={styles.header}>
            <MediumText style={styles.textHeader}>{formatMessage(message.title)}</MediumText>
          </View>
        )}
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{flex: 1, justifyContent: 'space-between'}}>
            <View style={styles.banner}>
              <MediumText style={styles.textBanner}>
                {formatMessage(message.productLabel1)}
              </MediumText>
              <MediumText style={styles.textBanner}>
                {formatMessage(message.productLabel2)}
              </MediumText>
              <MediumText style={styles.textBanner}>{formatMessage(message.productLabel3)}</MediumText>
            </View>
            <View style={styles.imageQR}>
              <View style={styles.containerQR}>
                <IconBluezone />
              </View>
            </View>
          </View>
          <View style={styles.share}>
            <ButtonIconText
              onPress={this.onShareApp}
              text={ShareAppText}
              source={require('./styles/images/icon_share.png')}
              styleBtn={styles.btnShare}
              styleText={styles.textBtnShare}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

InviteScreen.propTypes = {
  intl: intlShape.isRequired,
  router: PropTypes.object,
};

InviteScreen.defaultProps = {};

export default injectIntl(InviteScreen);
