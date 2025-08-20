




function displayDate(moment: string|Date): string {
    const date = typeof moment === "string" ? new Date(moment) : moment;

    const dateIso = date.toISOString();
    const today = new Date();

    // 2025-08-19T19:14:58.731Zн

    // Today -> HH:MM:SS
    if(dateIso.substring(0,10) === today.toISOString().substring(0,10)) {
        return dateIso.substring(11,19)
    }

    // Yesterday -> Yesterday,  HH:MM
    const yesterdayIso  = new Date(new Date(today).setDate(today.getDate() -1)).toISOString();
    if(dateIso.substring(0,10) === yesterdayIso.substring(0,10)){
        return `Yesterday,  ${dateIso.substring(11,16)}`
    }

    // 2 days ago → 2 days ago,  HH:MM
    const twoDaysAgoIso = new Date(new Date(today).setDate(today.getDate() - 2)).toISOString();
    if(dateIso.substring(0,10) === twoDaysAgoIso.substring(0,10)) {
        return `2 days ago,  ${dateIso.substring(11,16)}`
    }
    
    // 3 days ago → 3 days ago,  HH:MM
    const threeDaysAgoIso = new Date(new Date(today).setDate(today.getDate() - 3)).toISOString();
    if(dateIso.substring(0,10) === threeDaysAgoIso.substring(0,10)) {
        return `3 days ago,  ${dateIso.substring(11,16)}`
    }

    // Same year -> "10 July,  HH:MM"
    const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    const day = +dateIso.substring(8,10);               // + убирает ведущий ноль? (приведение строки к числу)
    const monthIndex = +dateIso.substring(5,7) - 1;     // "-1" тк индекс массива
    const time = dateIso.substring(11,16);
    const year = dateIso.substring(0,4);

    if(dateIso.substring(0, 4) === today.toISOString().substring(0,4)) {    
        return `${day} ${months[monthIndex]}, ${time}`
    }

    // Different year -> "10 July, 2024"
    return `${day} ${months[monthIndex]} ${year}`


    
    //return moment.toString();
};

export {displayDate}