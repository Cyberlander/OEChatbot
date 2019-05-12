import geolib from 'geolib';

export async function replaceSpecialStrings(msg: string): Promise<string> {
    if (msg == '${mensa}') {
        try {
            const position = await getCurrentUserPosition();
            return getNearestMensen({latitude: position.latitude, longitude: position.longitude});
        } catch {
            return "Ich brauche deine Position."
        }
    }

    return msg;
}

function getNearestMensen(position: Position): string {
    const sortedMensen = mensen.map(mensa => {
        return {
            name: mensa.name,
            nickname: mensa.nickname,
            distance: geolib.getDistance(position, {latitude: mensa.lat, longitude: mensa.long})}
    }).sort((first, second) => {
        return first.distance - second.distance;
    });

    return "Die drei nächsten Mensen sind:\n" +
           "1. " + sortedMensen[0].name + " aka " + sortedMensen[0].nickname + " (" + sortedMensen[0].distance + "m)\n" +
           "2. " + sortedMensen[1].name + " aka " + sortedMensen[1].nickname + " (" + sortedMensen[1].distance + "m)\n" +
           "3. " + sortedMensen[2].name + " aka " + sortedMensen[2].nickname + " (" + sortedMensen[2].distance + "m)\n";
}

async function getCurrentUserPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve(position.coords),
                reject,
            {
                enableHighAccuracy: true
            }
        );
    });
}

interface Position {
    latitude: number,
    longitude: number
}

const mensen: {name: string, nickname: string, lat: number, long: number}[] = [
    {
        "name": "Studierendenwerk Hamburg",
        "nickname": "Schweinemensa",
        "lat": 53.568891,
        "long": 10.033559
    },
    {
        "name": "Mensa Bucerius Law School",
        "nickname": "Mensa Bucerius Law School",
        "lat": 53.559987,
        "long": 9.984106
    },
    {
        "name": "Mensa Campus",
        "nickname": "Campusmensa",
        "lat": 53.565545,
        "long": 9.984979
    },
    {
        "name": "Mensa Stellingen",
        "nickname": "Restemensa",
        "lat": 53.59987,
        "long": 9.932856
    },
    {
        "name": "Mensa Geomatikum",
        "nickname": "Geomensa",
        "lat": 53.568304,
        "long": 9.974188
    },
    {
        "name": "Mensa Philosophenturm",
        "nickname": "Philomensa",
        "lat": 53.567078,
        "long": 9.985204
    },
    {
        "name": "Mensa HAW Berliner Tor",
        "nickname": "Mensa HAW Berliner Tor",
        "lat": 53.557151,
        "long": 10.023191
    },
    {
        "name": "Mensa HafenCity Universität",
        "nickname": "Hafenmensa",
        "lat": 53.540215,
        "long": 10.005411
    },
    {
        "name": "Mensa HAW Bergedorf",
        "nickname": "Mensa HAW Bergedorf",
        "lat": 53.494289,
        "long": 10.199587
    }
];