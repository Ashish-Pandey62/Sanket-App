import Card from "./Card"
import {alerts, icons} from "../constants"
import { View, Image, Text, StyleSheet } from "react-native"

const AlertItems = () => {
    return (
        <View>
            {
            alerts.map((alert, index) => (
            <Card className="flex flex-row items-center justify-between bg-white rounded-2xl self-stretch ml-5 mr-5 p-5 gap-4">
                <View>
                    <Image source={alert.icon} style={styles.image}/>
                </View>
                <View className="flex flex-col w-60">
                    <Text className="text-lg font-semibold">{alert.title}</Text>
                    <Text className="text-gray-500 text-sm">{alert.description}</Text>
                    <View>
                        <Text className="text-sm text-gray-600 rounded-2xl bg-gray-100 w-fit pl-2 pr-2">{`${alert.totalAlerts} Alerts today`}</Text>
                    </View>
                </View>
                <View className="flex flex-col items-center gap-1">
                    <Image source={icons.green_tick} />
                    <View className="rounded-lg bg-gray-100 pl-2 pr-2">
                        <Text className="text-xs">{alert.active ? 'Active':'Inactive'}</Text>
                    </View>
                </View>
            </Card>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
    }
})

export default AlertItems