import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import rateItem from "./components/rateItem";
import RatesModel from "./models/ratesModel";
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
 
 


// npm install react-native-ui-datepicker


export default function Rates() {
    const [rates, setRates] = useState(RatesModel.instance.rates);
    const [shownRates, setShownRates] = useState(RatesModel.instance.shownRates);
    const [searchText, setSearchText] = useState(RatesModel.instance.searchText);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [selected, setSelected] = useState<DateType>(RatesModel.instance.date);   // selected date from DatePicker
    const [isLoading, setIsLoading] = useState(false);

    const defaultStyles = useDefaultStyles();   // DatePicker defaultStyles.

    const formatDateForAPI = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}${month}${day}`;
    };

    // форматирование даты для отображения
    const formatDateForDisplay = (date: Date): string => {
        return date.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };


    useEffect(() => {
        const date= formatDateForAPI(selected as Date);
        const cachedRatesForDate = RatesModel.instance.ratesByDate?.[date];

        if(!cachedRatesForDate) {
            setIsLoading(true);
            console.log(`Loading data for ${date}`);
            fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=" + date + "&json")   
            .then(r => r.json())
            .then(j => {
                console.log(`Loaded rates for ${date}`);        
                setRates(j);
                RatesModel.instance.rates = j;
                RatesModel.instance.ratesByDate[date] = j;
                RatesModel.instance.date = selected as Date;   
                setIsLoading(false);      
            });
        }
        else {
            console.log(`Used cache rates for ${date}.`);
            setRates(cachedRatesForDate);
        }
    }, [selected]);

    useEffect(() => {
        if(searchText.length > 0) {
            setShownRates(rates.filter(rate =>
                rate.cc.includes(searchText.toLocaleUpperCase()) ||
                rate.txt.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
            ));         
        }
        else {
            setShownRates(rates);
        }
        RatesModel.instance.searchText = searchText;
    }, [searchText, rates]);


    const changeDate = () => {
        setIsCalendarVisible(true);
    };

    const getTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    };
    const getYearAgo = () => {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return yearAgo;
    };
    const tomorrow = getTomorrow();
    const yearAgo = getYearAgo();


    return <View style={styles.container}>
        <View style={styles.searchBar}>
            <TouchableOpacity style={styles.searchButton}>
                <Image source={require("../../shared/assets/images/Search_Icon.png")}
                style={styles.searchButtonImg} />
            </TouchableOpacity>
            <TextInput style={styles.searchInput}           
                value={searchText}
                placeholder="Currency search..."
                placeholderTextColor="#9CA3AF"
                onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.searchButton} 
                onPress={() => setSearchText("")}>
                <Image source={require("../../shared/assets/images/delete.png")}
                style={styles.searchButtonImg} 
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={changeDate} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>
                    {selected ? formatDateForDisplay(selected as Date) : formatDateForDisplay(new Date)}
                </Text>
            </TouchableOpacity>
        </View>


        {isLoading && (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading currency rates...</Text>
            </View>
        )}

        <View style={[styles.calendarContainer, {display: isCalendarVisible ? "flex" : "none" }]}>
            <DateTimePicker
                mode="single"
                date={selected}
                maxDate={tomorrow}
                minDate={yearAgo}
                onChange={({ date }) => {
                    setSelected(date);
                    setIsCalendarVisible(false);               
                }}
                styles={defaultStyles}
            />

            <TouchableOpacity onPress={() => setIsCalendarVisible(false)} style={styles.closeDatePicker}>
                <Text style={styles.closeDatePickerText}>Close</Text>
            </TouchableOpacity>

        </View>

        <FlatList
            data={shownRates}
            renderItem={rateItem}
            keyExtractor={rate => rate.cc}      
            style={styles.ratesList}
        />
    </View>;
};


const styles = StyleSheet.create({
    container: {
        padding: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        
    },
    ratesList: {
        flex: 1,
    },
    searchBar: {
        width: "100%",
        height: 60,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "#656565ff",
        borderRadius: 10,
        paddingHorizontal: 5
    },
    searchInput: {
        flex: 1,      
        borderColor: "#CBD5E1",
        borderWidth: 2,
        borderRadius: 6,
        color: "#f2f2f2",
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginHorizontal: 6,  
    },
    searchButton: {
        backgroundColor: "#505050",
        borderRadius: 8,
        width: 50,
        height: 50,  
        marginHorizontal: 5,   
        alignItems: "center",  
        justifyContent: "center",
    },
    searchButtonImg: {
        width: 32,
        height: 32,
        tintColor: "#f2f2f2",
    },
    loadingContainer: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 10,
        marginVertical: 10,
    },
    loadingText: {
        color: "#888",
        fontSize: 16,
        marginTop: 10,
        textAlign: "center",
    },
    calendarContainer:{
        backgroundColor: "#d9d8d8ff",
        borderRadius: 12,
        marginVertical: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dateButtonText:{
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    dateButton: {
        backgroundColor: "#505050",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginLeft: 5,
    },
    closeDatePicker: {
        backgroundColor: "#5baf88ff",
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 10,
    },
    closeDatePickerText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },


});