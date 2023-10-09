import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    Text,
    TextInput,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Alert,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import barakocta from "../../Styles/barakocta";
import axios from "axios";
import { BaseUrl, ImageUrl } from "../config";
import { AuthContext } from "../context/AuthContext";
import NoNetwork from "../modals/noNetwork";
import IsErrorModal from "../modals/IsErrorModal";

export default function Home({ navigation }) {
    const { Dimention, Colors, userToken, setColors, user, setUser, logout } = useContext(AuthContext);
    const [isLoaded, setIsLoaded] = useState(false);
    const [delivaries, setdelivaries] = useState();
    const [sitename, setsitename] = useState();
    const [price, setprice] = useState();
    const [logo, setlogo] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchDataError, setIsFetchDataError] = useState(false);
    const [isOrderprogressError, setIsOrderprogressError] = useState(false);
    const [orderid, setorderid] = useState(false);
    const Loading = () => {
        if (isLoading)
            return (
                <>
                    <View style={[barakocta.positionAbsolute, barakocta.w100, barakocta.h100, barakocta.bgMuted, barakocta.opacity75]}></View>
                    <View style={[barakocta.positionAbsolute, barakocta.w100, barakocta.h100, barakocta.jcCenter, barakocta.aiCenter]}>
                        <Text style={[barakocta.colorLight, barakocta.t6, { fontFamily: 'Cairo' }]}>جاري التحميل... </Text>
                    </View>
                </>
            )
    }
    const orderProgress = (id) => {
        setorderid(id)
        setIsLoading(true)
        setIsOrderprogressError(false);
        console.log("HOME orderProgress");
        const config = {
            headers: { Authorization: `Bearer ${userToken}` },
        };
        axios
            .get(`${BaseUrl}cart/delivaryProgress?id=${id}`, config)
            .then((response) => {
                console.log("HOME orderProgressTHEN");
                fetchData();
            })
            .catch(async (e) => {
                setIsLoading(false)
                setIsOrderprogressError(true);
                console.log("HOME", e.response.data.message);
                console.log("HOME", e.response.status);
                if (e.response.status == 401) {
                    await logout();
                    return
                }
            });
    };
    const fetchData = () => {
        console.log("HOME FETCHDATA");
        setIsFetchDataError(false);
        setIsLoaded(false);
        const config = {
            timeout: 10000,
            headers: { Authorization: `Bearer ${userToken}` },
        };
        axios
            .get(`${BaseUrl}show/homeCaptin`, config)
            .then((response) => {
                let pcolor = '#FFCA3A';
                let scolor = '#F97068';
                if (response.data.setting.primaryColor)
                    pcolor = response.data.setting.primaryColor;
                if (response.data.setting.secondaryColor)
                    scolor = response.data.setting.secondaryColor;
                setColors({
                    primary: pcolor,
                    secondary: scolor,
                    tertiary: '#010400',
                    fourth: '#FFFBFC',
                })
                setUser(response.data.user);
                setdelivaries(response.data.delivaries);
                setprice(response.data.price);
                setsitename(response.data.setting.sitename);
                setlogo(ImageUrl + response.data.setting.logo);
                setIsLoaded(true);
                setIsLoading(false)
            })
            .catch(async (e) => {
                setIsFetchDataError(true);
                setIsLoading(false)
                console.log("HOME", e.response.data.message);
                console.log("HOME", e.response.status);
                if (e.response.status == 401) {
                    await logout();
                    return
                }
            });
    };
    const showConfirmDialog = (id) => {
        return Alert.alert(
            "هل انت متأكد؟",
            "هل انت متاكد تسجيل التقدم في الطلب",
            [
                // The "Yes" button
                {
                    text: "تقدم",
                    onPress: () => {
                        orderProgress(id);
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "تراجع",
                },
            ]
        );
    };
    useEffect(() => {
        console.log("home");
        fetchData();
    }, []);
    const renderdelivaries = delivaries?.map((cb, index) => {
        return (
            <Order Colors={Colors} key={index} Dimention={Dimention} city={cb.address_sent?.city?.name} status={cb.delivary_status} neighbourhood={cb.address_sent?.neighbourhood} navigation={navigation} onPress={() => {
                showConfirmDialog(cb.id);
            }} delivary={cb} />
        );
    });
    const networkback = () => {
        if (!isLoaded)
            fetchData();
    }
    return (
        <SafeAreaView
            style={[barakocta.fFill]}
        >

            <NoNetwork networkback={networkback} />
            <IsErrorModal isModalVisible={isFetchDataError} CallBack={fetchData} />
            <IsErrorModal isModalVisible={isOrderprogressError} CallBack={() => {
                orderProgress(orderid);
            }} />
            {isLoaded ? (
                <>
                    <ScrollView>
                        <View style={[{ height: Dimention.height * 0.2, borderBottomEndRadius: Dimention.height * 0.1, borderBottomStartRadius: Dimention.height * 0.1, width: '100%', backgroundColor: Colors.primary }]}></View>
                        <View style={[{ backgroundColor: Colors.fourth, borderRadius: 20, }, barakocta.positionRelative, barakocta.m4, { top: -100 }]} >
                            <Image
                                source={{ uri: logo }}
                                resizeMode={"contain"}
                                style={[barakocta.mxAuto, { width: Dimention.height * 0.17, height: Dimention.height * 0.17 }, barakocta.my0, barakocta.p0]} />
                            <Text style={[barakocta.tCenter, { color: Colors.tertiary, fontFamily: 'ElMessiri', fontSize: 24 },]}>{sitename}</Text>
                        </View>
                        <View style={[barakocta.positionRelative, barakocta.p2, { top: -80 }]}>
                            <View style={[barakocta.fRow, barakocta.mb3, barakocta.jcAround, barakocta.aiCenter]}>
                                {price > 0 ? (<View style={[barakocta.fRow, barakocta.p2, { borderWidth: 1, borderRadius: 10, borderColor: Colors.secondary }]}>
                                    <Text style={[{ color: Colors.secondary, fontFamily: 'Alexandria', fontSize: 10, },]}>جنيه</Text>
                                    <Text style={[{ color: Colors.tertiary, fontFamily: 'Alexandria', fontSize: 14, },]}>{price}</Text>
                                </View>) : null}
                                <Text style={[{ color: Colors.tertiary, fontFamily: 'Alexandria', fontSize: 14, },]}>اهلا {user?.name}</Text>
                            </View>
                            <TouchableOpacity style={[barakocta.btnInfo, barakocta.p3, barakocta.m2, barakocta.br3, { alignSelf: 'center' }]}
                                onPress={() => {
                                    fetchData()
                                }}>
                                <Text style={[{ color: Colors.tertiary, fontFamily: 'Alexandria', fontSize: 14, },]}>تحديث</Text>
                            </TouchableOpacity>
                            <View style={[{ backgroundColor: Colors.fourth, borderRadius: 20, }]} >
                                {renderdelivaries}
                            </View>
                        </View>
                    </ScrollView>
                    <Loading />
                    <TouchableOpacity
                        style={[barakocta.positionAbsolute, { right: 20, top: 30, }]}
                        onPress={() => {
                            navigation.toggleDrawer();
                            // navigation.navigate('MyModal');
                        }}>
                        <Image
                            source={require('../../assets/icons8-bars-96.png')}
                            resizeMode={"contain"}
                            style={[barakocta.mxAuto, { width: 50, height: 50 }, barakocta.my0, barakocta.p0]} />
                    </TouchableOpacity>
                </>) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <ActivityIndicator size={"large"} color={Colors.primary} />
                </View>
            )}
        </SafeAreaView >
    );
}
const Order = ({ Colors, Dimention, status, city, neighbourhood, navigation, onPress, delivary }) => {
    return (
        <View style={[{ borderBottomWidth: 1, borderBottomColor: Colors.tertiary, borderStyle: "dashed" }, barakocta.w100, barakocta.jcEnd, barakocta.aiCenter]}>
            <View style={[barakocta.fRow, barakocta.my2]}>

                <TouchableOpacity onPress={onPress} style={[barakocta.jcCenter, barakocta.aiCenter, { width: Dimention.width * 0.2, }]}>
                    <AntDesign name="left" size={24} color={Colors.tertiary} />
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{status}</Text>
                </TouchableOpacity>
                <View style={[{ width: Dimention.width * 0.55 }]} >
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 16 },]}>ا{neighbourhood}</Text>
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{city}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('OrderDetails', { delivary });
                    }}
                    style={[barakocta.px3]}>
                    <FontAwesome name="map-marker" size={60} color={Colors.secondary} />
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>التفاصيل</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}