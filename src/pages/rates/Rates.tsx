import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import rateItem from "./components/rateItem";
import NbuRate from "./types/NbuRate";
import RatesModel from "./models/ratesModel";


export default function Rates() {
    const [rates, setRates] = useState([] as Array<NbuRate>);
    useEffect(() => {
        if(RatesModel.instance.rates.length == 0) {
            console.log("Loading data...");
            fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
            .then(r => r.json())
            .then(j => {
                console.log("Data Loaded.");
                RatesModel.instance.rates = j;
                setRates(j);
                //console.log(j);
            });
        }
        else {
            console.log("Used cache data.");
            setRates(RatesModel.instance.rates);
        }
    }, []);


    return <View style={styles.container}>
        <FlatList
        data={rates}
        renderItem={rateItem}
        keyExtractor={rate => rate.cc}      
      />
    </View>;
};


const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});