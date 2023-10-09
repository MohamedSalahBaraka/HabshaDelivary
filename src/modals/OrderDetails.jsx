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
    Pressable,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import barakocta from "../../Styles/barakocta";
import { AuthContext } from "../context/AuthContext";
import NoNetwork from "./noNetwork";
import { ImageUrl } from "../config";
import * as Clipboard from 'expo-clipboard';
import { ToastAndroid } from "react-native";


export default function OrderDetails({ navigation, route }) {

    const { Colors, Dimention } = useContext(AuthContext);
    const { delivary } = route.params ? route.params : {};
    const [dishes, setdishes] = useState(delivary.order?.dish_order);
    const [total, settotal] = useState(delivary.order?.total);
    const renderdishes = dishes?.map((item, index) => {
        return (
            <Dish Colors={Colors} key={index} photo={ImageUrl + item.dish?.photo} Dimention={Dimention} title={item.dish?.name} category={item.dish?.category?.name} price={item.price} sizename={item.size?.name} count={item.count} />
        );
    }); const networkback = () => { }
    return (
        <SafeAreaView
            style={[barakocta.fFill]}
        >
            <NoNetwork networkback={networkback} />
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: 'transparent', }}>
                <Pressable onPress={() => {
                    navigation.goBack()
                }} style={[{ height: "60%", width: '100%', position: 'relative', top: 27, backgroundColor: Colors.tertiary, opacity: 0.15 }]}></Pressable>
                <View style={[{ height: "50%", width: '100%', overflow: 'hidden', backgroundColor: Colors.fourth, borderTopEndRadius: 50, borderTopStartRadius: 50 }]}>
                    <ScrollView style={[barakocta.p4]}>
                        <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 18 },]}>{delivary.package}</Text>
                        <View style={[barakocta.jcEnd]}>

                            <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>الي</Text>
                            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 16 },]}>{delivary.address_sent?.neighbourhood}</Text>
                            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{delivary.address_sent?.city?.name}</Text>

                            <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>من</Text>
                            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 16 },]}>{delivary.address_get?.neighbourhood}</Text>
                            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{delivary.address_get?.city?.name}</Text>

                            <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>المسلم</Text>
                            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 16 },]}>{delivary.address_get?.name}</Text>
                            <TouchableOpacity onPress={() => {
                                Clipboard.setStringAsync(delivary.address_get?.phone);
                                ToastAndroid.show('تم النسخ', ToastAndroid.SHORT);
                            }}>

                                <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{delivary.address_get?.phone}</Text>
                            </TouchableOpacity>

                            <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>المستلم</Text>
                            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 16 },]}>{delivary.address_sent?.name}</Text>
                            <TouchableOpacity onPress={() => {
                                Clipboard.setStringAsync(delivary.address_sent?.phone);
                                ToastAndroid.show('تم النسخ', ToastAndroid.SHORT);
                            }}>
                                <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{delivary.address_sent?.phone}</Text>
                            </TouchableOpacity>


                        </View>
                        <View style={[barakocta.fRow, barakocta.mt4, barakocta.jcBetween, barakocta.w100, barakocta.px2]}>
                            <View style={[barakocta.fRow]}>
                                <Text style={[{ color: Colors.secondary, fontFamily: 'Alexandria', fontSize: 8, },]}>جنيه</Text>
                                <Text style={[{ color: Colors.tertiary, fontFamily: 'Alexandria', fontSize: 12, },]}>{total} + {delivary.price}</Text>
                            </View>
                            <View style={[barakocta.fRow]}>
                                <Text style={[{ color: Colors.tertiary, fontFamily: 'Alexandria', fontSize: 12, },]}>المبلغ الكلي:</Text>
                            </View>
                        </View>
                        {dishes ? (<>{renderdishes}

                            <View style={{ height: 50 }}></View></>) : null}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView >
    );
}

const Dish = ({ Colors, Dimention, count, photo, price, title, category, sizename }) => {
    return (
        <View style={[{ borderBottomWidth: 1, borderBottomColor: Colors.tertiary, borderStyle: "dashed" }, barakocta.w100, barakocta.jcEnd, barakocta.aiCenter]}>
            <View style={[barakocta.fRow]}>
                <View style={[{ width: Dimention.width * 0.55 }]} >
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 16 },]}>{title}</Text>
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 12, opacity: 0.8 },]}>{category}-{sizename}</Text>
                </View>
                <View style={[barakocta.px3]}>
                    <Image
                        source={{ uri: photo }}
                        resizeMode={"contain"}
                        style={[barakocta.mxAuto, { width: Dimention.width * 0.17, height: Dimention.width * 0.17 }, barakocta.my0, barakocta.p0]} />
                </View>
            </View>
            <View style={[barakocta.fRow, barakocta.mb0, barakocta.jcBetween, barakocta.w100, barakocta.px2]}>
                <View style={[barakocta.fRow]}>
                    <Text style={[{ color: Colors.secondary, fontFamily: 'Alexandria', fontSize: 8, },]}>جنيه</Text>
                    <Text style={[{ color: Colors.tertiary, fontFamily: 'Alexandria', fontSize: 12, },]}>{price}</Text>
                </View>
                <View style={[barakocta.fRow]}>
                    <Text style={[{ color: Colors.tertiary, fontFamily: 'Alexandria', fontSize: 12, },]}>{count}</Text>
                    <Text style={[{ color: Colors.tertiary, fontFamily: 'Alexandria', fontSize: 12, },]}>العدد:</Text>
                </View>
            </View>
        </View>
    )
}