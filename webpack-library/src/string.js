// export const join = (a, b) => {
//     return `${a} ${b}`;
// }

import _ from 'lodash';
export const join = (a, b) => {
    return _.join([a, b], ' ');
}
