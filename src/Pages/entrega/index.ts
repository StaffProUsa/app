import { SPage } from 'servisofts-component';
import root from './root';

import otro from "./otro";



export default SPage.combinePages("entrega", {
    "": root,
    otro,

});