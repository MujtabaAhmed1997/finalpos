// // // import axios from 'axios';

// // // const API_URL = 'http://localhost:3001/api/conversion';

// // // const sellLooseQuantity = async (variationId, requestedQuantity, unitType) => {
// // //     try {
// // //         const response = await axios.post(`${API_URL}/sell-loose-quantity`, {
// // //             variationId,
// // //             requestedQuantity,
// // //             unitType,
// // //         });
// // //         return response.data;
// // //     } catch (error) {
// // //         throw new Error('Error selling quantity: ' + error.message);
// // //     }
// // // };

// // // export default {sellLooseQuantity};

// // import axios from 'axios';

// // const API_URL = 'http://localhost:3001/api/conversion';

// // const sellLooseQuantity = async (variationId, requestedQuantity, unitType) => {
// //     try {
// //         const response = await axios.post(`${API_URL}/sell-loose-quantity`, {
// //             variationId,
// //             requestedQuantity,
// //             unitType,
// //         });
// //         return response.data;
// //     } catch (error) {
// //         throw new Error('Error selling quantity: ' + error.message);
// //     }
// // };

// // export default {
// //     sellLooseQuantity
// // };

// import axios from 'axios';

// const API_URL = 'http://localhost:3001/api/conversion';

// const sellLooseQuantity = async (variationId, requestedQuantity, unitType) => {
//     try {
//         const response = await axios.post(`${API_URL}/sell-loose-quantity`, {
//             variationId,
//             requestedQuantity,
//             unitType,
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error('Error selling quantity: ' + error.message);
//     }
// };

// export default {
//     sellLooseQuantity
// };







import axios from 'axios';

const API_URL = 'http://localhost:3001/api/conversion';

const sellQuantity = async (VariationID, containerQuantity, looseQuantity, unitType) => {
    try {
        const response = await axios.post(`${API_URL}/sell-quantity`, {
            VariationID,
            containerQuantity,
            looseQuantity,
            unitType,
        });
        return response.data;
    } catch (error) {
        throw new Error('Error selling quantity: ' + error.message);
    }
};

export default {
    sellQuantity
};
