import { SPage, SPageListProps } from 'servisofts-component';

import root from './root';

export const Parent = {
    name: "users",
    path: `/company/users`,
}
export default SPage.combinePages(Parent.name, {
    "": root,
});