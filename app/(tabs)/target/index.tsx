import { getBiweekKPIByGroup, getKPIByDateAndGroup } from "@/service/ShiftService";
import { getRate, updateRate } from "@/service/RateService";
import { Button, Card, HStack, Heading, Input, ScrollView, Text, View } from "@gluestack-ui/themed";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TextInput } from "react-native";

export default function Target() {
    const [TVNumber, setTVNumber] = useState(0);
    const [rate, setRate] = useState(0); 
    const [newRate, setNewRate] = useState(""); 
    const [showRate, setShowRate] = useState(false); 

    const [biweekData, setBiweekData] = useState({
        target: 0,
        startDateTime: "",
        endDateTime: "",
    }); 

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") as string);
        if (user && user.roles === "Manager") {
            setShowRate(true); 
        } else {
            setShowRate(false);
        }

        getKPIByDateAndGroup("surrey", dayjs())
            .then((data) => {
                setTVNumber(data.target ?? 0);
            })
            .catch((error) => {
                console.log((error as Error).message);
            });

        getRate()
            .then((rateValue) => {
                setRate(rateValue);
            })
            .catch((error) => {
                console.log("Get Rate Error:", (error as Error).message);
            });

        getBiweekKPIByGroup("surrey")
            .then((data) => {
                setBiweekData({
                    target: data.target ?? 0,
                    startDateTime: data.startDateTime ? new Date(data.startDateTime).toISOString()
                        : "",
                    endDateTime: data.endDateTime ? new Date(data.endDateTime).toISOString()
                        : "",
                });
            })
            .catch((error) => {
                console.log("Get Biweek KPI Error:", (error as Error).message);
            });
    // Runs once on mount to prevent unnecessary re-renders
    },[]);

    const handleRateUpdate = () => {
        const parsedRate = parseFloat(newRate);
        if (isNaN(parsedRate)) {
            console.log("Invalid rate value");
            return;
        }
    
        updateRate(parsedRate)
            .then(() => {
                console.log("Rate updated successfully");
                setNewRate(""); 

                getRate()
                    .then((rateValue) => {
                        setRate(rateValue); 
                        console.log("Rate refreshed:", rateValue);
                    })
                    .catch((error) => {
                        console.log("Get Rate Error:", (error as Error).message);
                    });
    
                getKPIByDateAndGroup("surrey", dayjs())
                    .then((data) => {
                        setTVNumber(data.target ?? 0); 
                        console.log("KPI refreshed:", data.target);
                    })
                    .catch((error) => {
                        console.log("Get KPI Error:", (error as Error).message);
                    });

                getBiweekKPIByGroup("surrey")
                    .then((data) => {
                        setBiweekData({
                            target: data.target ?? 0,
                            startDateTime: data.startDateTime ? new Date(data.startDateTime).toISOString()
                                : "",
                            endDateTime: data.endDateTime ? new Date(data.endDateTime).toISOString()
                                : "",
                        });
                    })
                    .catch((error) => {
                        console.log("Get Biweek KPI Error:", (error as Error).message);
                    });
            })
            .catch((error) => {
                console.log("Update Rate Error:", (error as Error).message);
            });
    };
    

    return (
        <ScrollView>
             {/* Biweek KPI Card */}
             <Card mr={3} mt={5}>
                <Heading>Biweek KPI</Heading>
                <HStack>
                    <Text>
                        {dayjs(biweekData.startDateTime.split("T")[0]).format("MMM DD")} -{" "}
                        {dayjs(biweekData.endDateTime.split("T")[0]).format("MMM DD")}
                    </Text>
                </HStack>
                <HStack w="20%">
                    <Text size="6xl">{biweekData.target}</Text>
                    <View style={{ position: "absolute", right: 0, bottom: 0 }}>
                        <Text>units</Text>
                    </View>
                </HStack>
            </Card>


            {/* TV Target Card */}
            <Card mr={3} mt={5}>
                <Heading>TV Target today</Heading>
                <HStack w="20%">
                    <Text size="6xl">{TVNumber}</Text>
                    <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                        <Text>units</Text>
                    </View>
                </HStack>
            </Card>

            {showRate && (
                <Card mr={3} mt={5}>
                    <Heading>Rate</Heading>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                        <Text style={{ fontSize: 48, fontWeight: "bold" }}>{rate}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
                        <TextInput
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 5,
                                padding: 10,
                                marginRight: 10,
                                fontSize: 16,
                            }}
                            placeholder="Enter new rate"
                            value={newRate}
                            onChangeText={(text) => setNewRate(text)}
                            keyboardType="numeric"
                        />
                        <Button onPress={handleRateUpdate}>
                            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                                Update Rate
                            </Text>
                        </Button>
                    </View>
                </Card>
            )}
        </ScrollView>
    );
}
