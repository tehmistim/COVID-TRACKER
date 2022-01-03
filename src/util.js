export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a, b) => {
        //loops through the data gets the first one and compares the two and sorts them
        if (a.cases > b.cases) {
            return -1;
            // stands for false
        } else {
            return 1;
            // stands for true
        }
    });

    return sortedData;
}
