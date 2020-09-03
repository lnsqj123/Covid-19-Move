import * as AuthSession from 'expo-auth-session';
import { Alert, Platform, Button, AsyncStorage } from 'react-native';
import React, { useState } from 'react';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import '@firebase/firestore';
import {AuthContext} from './GlobalVar';

const createUser = async(credential) => {
  const db = firebase.firestore();
  const user = credential.user;
  if (user) {
    const prevDoc = await db.collection('users').doc(user.uid).get();
    console.log(user);
    const newUser = {
      uid: user.uid,
      email: JSON.stringify(user.email),
      displayName: user.displayName,
      photoURL: user.photoURL,
      signInMethod: credential.credential.signInMethod,
      point: 0,
    };
    if (!prevDoc.exists) {
      await db.collection('users')
        .doc(user.uid)
        .set(newUser, { merge: true });
    }
    await firebase.firestore().collection("currentUser").doc("123")
      .set(newUser);
    return newUser;
  }
  else return null;
};

function SocialSignInButton({
  clientId,
  clientSecret,
  socialProvider,
}) {
  const { signIn } = React.useContext(AuthContext);
  const { makeRedirectUri, useAuthRequest, ResponseType, Prompt, useAutoDiscovery } = AuthSession;
  const [signingIn, setSigningIn] = useState(false);

  const discovery = socialProvider === "google"
    ? useAutoDiscovery('https://accounts.google.com')
    : {
      authorizationEndpoint: 'https://www.facebook.com/v6.0/dialog/oauth',
      tokenEndpoint: 'https://graph.facebook.com/v6.0/oauth/access_token',
    };

  const useProxy = Platform.select({ web: false, default: true });
  const redirectUri = makeRedirectUri(
    socialProvider === "google"
      ? { useProxy }
      : { useProxy },
  );

  const [request, response, promptAsync] = useAuthRequest(
    socialProvider === "google"
      ? {
        clientId,
        redirectUri,
        prompt: Prompt.SelectAccount,
        scopes: ['openid', 'profile'],
        responseType: ResponseType.Token,
        usePKCE: false,
      }
      : {
        clientId,
        clientSecret,
        scopes: ['public_profile, email'],
        redirectUri,
        prompt: Prompt.SelectAccount,
        extraParams: {
          display: JSON.stringify(Platform.select({ web: 'popup' })),
          // eslint-disable-next-line
          auth_type: 'rerequest',
        },
        responseType: ResponseType.Token,
      }
    ,
    discovery,
  );

  const SignIn = async () => {
    setSigningIn(true);

    try {
      const result = await promptAsync({ useProxy });
      if (result.type !== 'success') {
        if (Platform.OS === 'web') {
          // @ts-ignore
          alert('ERROR_UNKNOWN');
          return;
        }
        Alert.alert('ERROR', 'ERROR_UNKNOWN');
        return;
      }

      if (socialProvider === "google") {
        const accessToken = result.params.access_token;
        const credential = await firebase.auth.GoogleAuthProvider.credential(null, accessToken);
        const authResult = await firebase.auth().signInWithCredential(credential);

        const user = await createUser(authResult);

        if (user) {
          await AsyncStorage.setItem("userToken", "google"),
          signIn("auth"),
          Alert.alert("로그인 되었습니다.")
        }
        return;
      }

      const accessToken = result.params.access_token;
      const credential = await firebase.auth.FacebookAuthProvider.credential(accessToken);
      const authResult = await firebase.auth().signInWithCredential(credential);

      const user = await createUser(authResult);
      
      if (user) {
        await AsyncStorage.setItem("userToken", "facebook"),
        signIn("auth"),
        Alert.alert("로그인 되었습니다.")
      }
    } catch (err) {
      if (Platform.OS === 'web') {
        // @ts-ignore
        alert(`Login Error`, `${err.message}`);
        return;
      }
      Alert.alert(`Login Error`, `${err.message}`);
    }
  };

  if (socialProvider === "google") {
    return <Button
      title="google"
      testID="btn-google"
      style={{
        borderWidth: 1,
        width: '100%',
        height: 48,
        marginBottom: 12,
        borderRadius: 100,
      }}
      isLoading={signingIn}
      onPress={SignIn}
      text={'SIGN_IN_WITH_GOOGLE'}
      textStyle={{ fontWeight: '700' }}
    />;
  }
  return <Button
    title="facebook"
    testID="btn-facebook"
    style={{
      borderWidth: 1,
      width: '100%',
      height: 48,
      marginBottom: 12,
      borderRadius: 100,
    }}
    isLoading={signingIn}
    onPress={SignIn}
    text={'SIGN_IN_WITH_FACEBOOK'}
    textStyle={{ fontWeight: '700' }}
  />;
};

export default SocialSignInButton;

SocialSignInButton.propTypes = {
    clientId: PropTypes.string,
    clientSecret: PropTypes.string,
    socialProvider: PropTypes.oneOf([
        'google',
        'facebook',
        'apple',
    ]).isRequired,
  }