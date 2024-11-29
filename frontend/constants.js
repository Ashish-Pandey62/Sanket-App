import infant from "./assets/icons/infant.png"
import avatar_male from "./assets/icons/avatar_male.png"
import doorbell from "./assets/icons/doorbell.png"
import ear from "./assets/icons/ear.png"
import emergency from "./assets/icons/emergency.png"
import man from "./assets/icons/man.png"
import pet from "./assets/icons/pet.png"
import avatar_female from "./assets/icons/avatar_female.png"
import undisclosed from "./assets/icons/undisclosed.png"

export const icons =  { infant, avatar_male, doorbell, ear, emergency, man, pet, avatar_female, undisclosed };

export const alerts = [
    {
        id: 1,
        title: "Name Alert",
        description: "When someone calls your name.",
        totalAlerts: 0,
        active: true,
        icon: avatar_male,
        alertKey: "",
        alertDescription: "Someone is trying to reach out to you! Look around!",
        alertTitle: "Someone called you"
    },
    {
        id: 2,
        title: "Emergency Sounds",
        description: "Fire alarms, smoke detectors, or sirens.",
        totalAlerts: 0,
        active: true,
        icon: emergency,
        alertKey: "fireAlarm",
        alertDescription: "There is an alarm ringing!",
        alertTitle: "Fire alarm!"
    },
    {
        id: 3,
        title: "Infant Crying",
        description: "Detecting and alerting baby cries.",
        totalAlerts: 0,
        active: true,
        icon: infant,
        alertKey: "infantCrying",
        alertDescription: "An infant might be crying around you",
        alertTitle: "Infant Crying"
    },
    {
        id: 4,
        title: "Doorbell/Knocking",
        description: "For recognizing doorbell sounds or knocks.",
        totalAlerts: 0,
        active: true,
        icon: doorbell,
        alertKey: "doorBell",
        alertDescription: "Some one is at you door!",
        alertTitle: "Doorbell Alert!"
    },
    {
        id: 5,
        title: "Pet Sounds",
        description: "For barking, mewing, or other pet sounds.",
        totalAlerts: 0,
        active: true,
        icon: pet,
        alertKey: "petSound",
        alertDescription: "Your pet might be calling for you.",
        alertTitle: "Pet Sound"
    }
];