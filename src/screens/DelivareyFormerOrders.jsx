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
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import barakocta from "../../Styles/barakocta";
import axios from "axios";
import { BaseUrl } from "../config";
import { AuthContext } from "../context/AuthContext";
import NoNetwork from "../modals/noNetwork";
import IsErrorModal from "../modals/IsErrorModal";

export default function DelivareyFormerOrders({ navigation }) {
    const { Dimention, Colors, userToken, logout } = useContext(AuthContext);
    const [orders, setorders] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFetchDataError, setIsFetchDataError] = useState(false);
    const renderOrders = orders?.map((item, index) => {
        let date = new Date(item.created_at);
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let publish = `${year}-${month}-${day}`;
        return (
            <Order Colors={Colors} key={index}
                status={item.delivary_status}
                paid={item.paid}
                neighbourhoodSent={item.address_sent?.neighbourhood}
                citySent={item.address_sent?.city?.name}
                nameSent={item.address_sent?.name}
                phoneSent={item.address_sent?.phone}
                neighbourhoodGet={item.address_get?.neighbourhood}
                nameGet={item.address_get?.name}
                phoneGet={item.address_get?.phone}
                cityGet={item.address_get?.city?.name}
                captin={item.captin?.name}
                date={publish}
                title={item.package}
            />

        );
    });

    const fetchData = () => {
        setIsFetchDataError(false);
        setIsLoaded(false);
        console.log("DelivaryFormerOrders FETCHDATA");
        const config = {
            headers: { Authorization: `Bearer ${userToken}` },
        };
        axios
            .get(`${BaseUrl}cart/formersDelivarycaptin`, config)
            .then((response) => {
                setorders(response.data.delivaries);
                setIsLoaded(true);
            })
            .catch(async (e) => {
                setIsFetchDataError(true);
                console.log("DelivaryFormerOrders", e.response.data.message);
                console.log("DelivaryFormerOrders", e.response.status);
                if (e.response.status == 401) {
                    await logout();
                    return
                }
            });
    };
    useEffect(() => {
        console.log("DelivaryFormerOrders");
        fetchData();
    }, []);
    const networkback = () => {
        if (!isLoaded)
            fetchData();
    }
    return (
        <SafeAreaView
            style={[barakocta.fFill]}
        >
            <IsErrorModal isModalVisible={isFetchDataError} CallBack={fetchData} />
            <NoNetwork networkback={networkback} />
            {isLoaded ? (
                <>
                    <ScrollView>
                        <View style={[barakocta.jcCenter, { height: Dimention.height * 0.4, borderBottomEndRadius: Dimention.height * 0.1, borderBottomStartRadius: Dimention.height * 0.1, width: '100%', backgroundColor: Colors.primary }]}>

                            <Image
                                source={require('../../assets/icons8-package-64.png')}
                                resizeMode={"contain"}
                                style={[barakocta.mxAuto, { width: Dimention.height * 0.3, height: Dimention.height * 0.3 }, barakocta.mx0, barakocta.p0]} />
                        </View>
                        <View style={[{ backgroundColor: Colors.fourth, borderRadius: 20, }, barakocta.pt3, barakocta.px2, barakocta.positionRelative, barakocta.m4, { top: -100 }]} >
                            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 20 },]}>الطلبات السابقة:</Text>
                            {renderOrders}
                        </View>
                    </ScrollView>
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
                    }} >
                    <ActivityIndicator size={"large"} color={Colors.primary} />
                </View>
            )}
        </SafeAreaView >
    );
}
const Order = ({ Colors, paid, status, neighbourhoodSent, citySent, neighbourhoodGet, cityGet, nameGet, nameSent, phoneSent, phoneGet, date, title }) => {
    console.log(paid);
    return (
        <View style={[barakocta.w100, barakocta.my2, { borderWidth: 1, borderColor: Colors.tertiary, borderStyle: 'dotted', borderRadius: 15 }, barakocta.p2]}>
            <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 16 },]}>{title}</Text>
            <View style={[barakocta.fRow, barakocta.my2, barakocta.jcCenter]}>
                <View style={[barakocta.col6]}>
                    <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>الي</Text>
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 16 },]}>{neighbourhoodSent}</Text>
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{citySent}</Text>
                </View>
                <View style={[barakocta.col6]}>
                    <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>من</Text>
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 16 },]}>{neighbourhoodGet}</Text>
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{cityGet}</Text>
                </View>
            </View>
            <View>
                <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>المسلم</Text>
                <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 16 },]}>{nameGet}</Text>
                <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{phoneGet}</Text>

                <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>المستلم</Text>
                <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 16 },]}>{nameSent}</Text>
                <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{phoneSent}</Text>

            </View>
            <View style={[barakocta.fRow, barakocta.jcBetween, barakocta.p2]}>
                <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{status}</Text>
                <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{date}</Text>
            </View>
            {paid == 1 ?
                <Text style={[barakocta.colorSuccess]}>مدفوع</Text>
                :
                <Text style={[barakocta.colorDanger]}>لم يتم الدفع</Text>
            }
        </View>
    )
}