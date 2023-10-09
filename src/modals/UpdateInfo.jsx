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
    Alert,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import barakocta from "../../Styles/barakocta";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BaseUrl } from "../config";
import NoNetwork from "./noNetwork";
import IsErrorModal from "./IsErrorModal";


export default function UpdateInfo({ navigation }) {

    const { Dimention, Colors, userToken, logout, user, setUser, save } = useContext(AuthContext);
    const [phone, setphone] = useState(user?.phone);
    const [name, setname] = useState(user?.name);
    const [PhoneError, setPhoneError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const networkback = () => {

    }
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
    const sendForm = () => {
        if (typeof name == "undefined" || name == "") {
            Alert.alert("خطأ", "عليك اضافة الاسم");
            return;
        }
        if (typeof phone == "undefined" || phone == "") {
            Alert.alert("خطأ", "عليك اضافة رقم الهاتف");
            return;
        }
        setIsLoading(true);
        setIsError(false);
        console.log("CheakOut sendForm");
        const config = {
            timeout: 10000,
            headers: { Authorization: `Bearer ${userToken}` },
        };
        const bodyParameters = {
            name,
            phone,
        };
        axios
            .post(`${BaseUrl}profile/updateInfo`, bodyParameters, config)
            .then((response) => {
                // navigation.navigate("SuccessOrder");
                let usera = user;
                usera.phone = phone;
                usera.name = name;
                setUser(usera);
                save("user", usera);
                Alert.alert('تم', "تم تحديث البيانات بنجاح");
                navigation.goBack();
                setIsLoading(false);
            })
            .catch(async (e) => {
                setIsLoading(false);
                setIsError(true);
                console.log("CheakOut", e?.response?.data.message);
                console.log("CheakOut", e?.response?.status);
                setPhoneError(e?.response?.data.message);
                if (e?.response?.status == 401) {
                    await logout();
                    return
                }
                // navigation.navigate("Faild");
            });
    };
    return (
        <SafeAreaView
            style={[barakocta.fFill]}
        >
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: 'transparent', }}>
                <Pressable onPress={() => {
                    navigation.goBack()
                }} style={[{ height: "60%", width: '100%', position: 'relative', top: 27, backgroundColor: Colors.tertiary, opacity: 0.15 }]}></Pressable>
                <View style={[{ height: "50%", width: '100%', overflow: 'hidden', backgroundColor: Colors.fourth, borderTopEndRadius: 50, borderTopStartRadius: 50 }]}>
                    <NoNetwork networkback={networkback} />
                    <IsErrorModal isModalVisible={isError} CallBack={sendForm} />


                    <ScrollView style={[barakocta.p3, barakocta.pt4]}>
                        <Text style={[barakocta.tRight, barakocta.mb3, { color: Colors.tertiary, fontFamily: 'Cairo', fontSize: 20 },]}>معلومات المستخدم</Text>
                        <Text style={[{ fontFamily: 'Cairo' }]}>الاسم</Text>
                        <TextInput

                            value={name}
                            onChangeText={setname}
                            style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: '#999' }, barakocta.w75, barakocta.mb3,]} />
                        <Text style={[{ fontFamily: 'Cairo' }]}>رقم الهاتف</Text>
                        <TextInput
                            value={phone}
                            keyboardType="numeric"
                            onChangeText={setphone}
                            style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: '#999' }, barakocta.w75, barakocta.mb3,]} />
                        <Text style={[barakocta.colorDanger]}>{PhoneError}</Text>
                        <TouchableOpacity
                            style={[barakocta.p3, { backgroundColor: Colors.secondary, width: Dimention.height * 0.17, borderRadius: 30 }, barakocta.mxAuto]}
                            onPress={() => {
                                sendForm();
                            }}
                        >
                            <Text style={[barakocta.tCenter, { color: Colors.fourth, fontFamily: 'Cairo', fontSize: 16 },]}>حفظ</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <Loading />
                </View>
            </View>
        </SafeAreaView >
    );
}
