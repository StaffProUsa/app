import { SPage, SPageListProps } from 'servisofts-component';

import root from './root';
import add from "./add"

export const Parent = {
    name: "roles",
    path: `/company/roles`,
}
export default SPage.combinePages(Parent.name, {
    "": root,
    add

});