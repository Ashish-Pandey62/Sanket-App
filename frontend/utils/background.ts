import BackgroundActions from "react-native-background-actions"

const options = {
    taskName: "Sanket",
    taskTitle: "Sanket is listenning...",
    taskDesc: "This task is running in the background",
    taskIcon: {
        name: "ic_launcher",
        type: "mipmap",
    },
    color: "#ff00ff",
    linkingURI: "frontend://index",
    progressBar: {
        indeterminate: true,
        max: 4,
        value: 1,
    },
    parameters: {
        delay: 1000, // To control after how much time each background task reactivates/re-fires
    },
};

const backgroundTask = async (taskDataArguments: any) => {
    const { delay } = taskDataArguments;

    console.log("Background action started"); //to remove

    let count = 0; //to remove

    const sleep = (time: any) =>
        new Promise((resolve) => setTimeout(resolve, time));

    while (BackgroundActions.isRunning()) {
        if (count % 5 == 0) {  //to remove
            await BackgroundActions.updateNotification({
                // taskTitle: `5 seconds have passed, Count -> ${count}`,
                taskDesc: "Sanket is running in the background",
            });
        }

        console.log("The pc is listening...", (count % 3) + 1);

        count += 1;  //to remove

        await sleep(delay);
    }
};

//await this
export const startBackgroundJob = async () => {
    await BackgroundActions.start(backgroundTask, options);
}

//await this
export const stopBackgroundJob = async () => {
    if (BackgroundActions.isRunning()) {
        await BackgroundActions.stop();
    }
}